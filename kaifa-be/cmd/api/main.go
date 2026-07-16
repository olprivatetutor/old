package main

import (
	"context"
	"fmt"
	"log"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	fiberlogger "github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"

	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	postgresrepo "github.com/dev-keuber/kaifa-be/internal/adapter/repository/postgres"
	"github.com/dev-keuber/kaifa-be/internal/adapter/router"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/dev-keuber/kaifa-be/internal/infrastructure/deepgram"
	"github.com/dev-keuber/kaifa-be/internal/infrastructure/elevenlabs"
	"github.com/dev-keuber/kaifa-be/internal/infrastructure/openai"
	assessmentusecase "github.com/dev-keuber/kaifa-be/internal/usecase/assessment"
	learningusecase "github.com/dev-keuber/kaifa-be/internal/usecase/learning"
	"github.com/dev-keuber/kaifa-be/pkg/config"
	_ "github.com/dev-keuber/kaifa-be/pkg/logger" // init logger
)

func main() {
	cfg := config.Load()

	// Infrastructure (outermost layer â€” concrete implementations)
	openaiClient := openai.NewClient(cfg.OpenAIKey, openai.Config{
		LearningPathCacheEnabled:           cfg.LearningPathCacheEnabled,
		LearningPathTransliterationEnabled: cfg.LearningPathTransliterationEnabled,
	})
	deepgramClient := deepgram.NewClient(cfg.DeepgramKey)
	elevenLabsClient := elevenlabs.NewClient(cfg.ElevenLabsKey, cfg.ElevenLabsVoiceID)
	tokenService, err := authinfra.NewTokenService(cfg.JWTSecret)
	if err != nil {
		log.Fatalf("failed to initialize token service: %v", err)
	}

	userRepository, syllabusRepository, assessmentSessionRepository, assessmentResultRepository, learningSessionRepository, learningPathRepository, cleanup := repositories(cfg)
	defer cleanup()

	// Use cases (depend only on ports, not concrete infra)
	assessmentUC := assessmentusecase.New(openaiClient)
	learningUC := learningusecase.New(openaiClient)

	// Handlers (interface adapters)
	authHandler := handler.NewAuthHandler(tokenService, userRepository)
	syllabusHandler := handler.NewSyllabusHandler(syllabusRepository)
	assessmentHandler := handler.NewAssessmentHandler(assessmentUC, deepgramClient, elevenLabsClient, userRepository, syllabusRepository, assessmentSessionRepository, assessmentResultRepository)
	learningHandler := handler.NewLearningHandler(learningUC, deepgramClient, elevenLabsClient, userRepository, syllabusRepository, assessmentResultRepository, learningSessionRepository, learningPathRepository)

	// Fiber app
	app := fiber.New(fiber.Config{
		AppName:      "Kaifa API v1",
		ErrorHandler: errorHandler,
	})

	app.Use(recover.New())
	app.Use(fiberlogger.New(fiberlogger.Config{
		Format: "[${time}] ${status} ${method} ${path} ${latency}\n",
	}))
	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOriginsWithLocalTools(cfg.AllowedOrigins),
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	swaggerHTML := mustProjectFile("docs/swagger.html")
	swaggerYAML := mustProjectFile("docs/openapi.yaml")

	app.Get("/swagger", func(c *fiber.Ctx) error {
		return c.SendFile(swaggerHTML)
	})
	app.Get("/swagger/", func(c *fiber.Ctx) error {
		return c.SendFile(swaggerHTML)
	})
	app.Get("/swagger/openapi.yaml", func(c *fiber.Ctx) error {
		c.Set(fiber.HeaderContentType, "application/yaml")
		return c.SendFile(swaggerYAML)
	})

	app.Get("/voice-test", func(c *fiber.Ctx) error {
		return c.SendFile("tools/voice-test.html")
	})

	router.Register(app, authHandler, syllabusHandler, assessmentHandler, learningHandler, tokenService)

	log.Printf("🚀 Kaifa API running on :%s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatalf("server failed to start: %v", err)
	}
}

func allowedOriginsWithLocalTools(configured string) string {
	if strings.TrimSpace(configured) == "*" {
		return "*"
	}

	origins := splitOrigins(configured)
	for _, localOrigin := range []string{
		"http://localhost:5173",
		"http://127.0.0.1:5173",
		"http://localhost:8080",
		"http://127.0.0.1:8080",
		"http://localhost:3000",
		"http://127.0.0.1:3000",
	} {
		origins = appendOrigin(origins, localOrigin)
	}
	return strings.Join(origins, ",")
}

func splitOrigins(configured string) []string {
	parts := strings.Split(configured, ",")
	origins := make([]string, 0, len(parts))
	for _, part := range parts {
		origin := strings.TrimSpace(part)
		if origin != "" {
			origins = appendOrigin(origins, origin)
		}
	}
	return origins
}

func appendOrigin(origins []string, origin string) []string {
	for _, existing := range origins {
		if existing == origin {
			return origins
		}
	}
	return append(origins, origin)
}

func mustProjectFile(rel string) string {
	root, err := projectRoot()
	if err != nil {
		log.Fatalf("failed to resolve project root: %v", err)
	}
	return filepath.Join(root, rel)
}

func projectRoot() (string, error) {
	_, file, _, ok := runtime.Caller(0)
	if !ok {
		return "", fmt.Errorf("runtime caller unavailable")
	}
	return filepath.Clean(filepath.Join(filepath.Dir(file), "..", "..")), nil
}

func repositories(cfg *config.Config) (
	port.UserRepository,
	port.SyllabusRepository,
	port.AssessmentSessionRepository,
	port.AssessmentResultRepository,
	port.LearningSessionRepository,
	port.LearningPathRepository,
	func(),
) {
	if cfg.DatabaseURL == "" {
		return memory.NewUserRepository(),
			memory.NewSyllabusRepository(),
			memory.NewAssessmentSessionRepository(),
			memory.NewAssessmentResultRepository(),
			memory.NewLearningSessionRepository(),
			memory.NewLearningPathRepository(),
			func() {}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	db, err := postgresrepo.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	if err := postgresrepo.Migrate(ctx, db); err != nil {
		_ = db.Close()
		log.Fatalf("failed to migrate database: %v", err)
	}

	return postgresrepo.NewUserRepository(db),
		postgresrepo.NewSyllabusRepository(db),
		postgresrepo.NewAssessmentSessionRepository(db),
		postgresrepo.NewAssessmentResultRepository(db),
		postgresrepo.NewLearningSessionRepository(db),
		postgresrepo.NewLearningPathRepository(db, cfg.LearningPathTransliterationEnabled),
		func() { _ = db.Close() }
}

func errorHandler(c *fiber.Ctx, err error) error {
	code := fiber.StatusInternalServerError
	if e, ok := err.(*fiber.Error); ok {
		code = e.Code
	}
	return c.Status(code).JSON(fiber.Map{
		"success": false,
		"message": err.Error(),
	})
}
