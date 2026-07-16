package router

import (
	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

func Register(
	app *fiber.App,
	auth *handler.AuthHandler,
	syllabus *handler.SyllabusHandler,
	assessment *handler.AssessmentHandler,
	learning *handler.LearningHandler,
	tokens *authinfra.TokenService,
) {
	api := app.Group("/api")

	// Health
	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok"})
	})

	// Auth
	authRoutes := api.Group("/auth")
	authRoutes.Post("/login", auth.Login)
	authRoutes.Post("/refresh-token", auth.RefreshToken)

	// Users
	api.Post("/users", auth.CreateUser)

	// Syllabi
	syllabi := api.Group("/syllabi")
	syllabi.Use(middleware.RequireAuth(tokens))
	syllabi.Get("/", syllabus.ListSyllabi)
	syllabi.Get("/:id", syllabus.GetSyllabus)
	syllabi.Get("/:id/modules", syllabus.ListModules)
	syllabi.Get("/:id/modules/:moduleId", syllabus.GetModule)

	// Assessment
	assess := api.Group("/assessment")
	assess.Use(middleware.RequireAuth(tokens))
	assess.Post("/start", assessment.Start)
	assess.Post("/chat", assessment.Chat)
	assess.Post("/speech/tts", assessment.Speech)
	assess.Post("/speech/stt", assessment.SpeechToText)
	// WebSocket upgrade guard — must be placed before the WS handler
	assess.Use("/voice", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	assess.Get("/voice", websocket.New(assessment.VoiceWS))

	// Learning
	learn := api.Group("/learning")
	learn.Use(middleware.RequireAuth(tokens))
	learn.Post("/generate", learning.GeneratePath)
	learn.Post("/start", learning.StartChat)
	learn.Post("/start-chat", learning.StartChat)
	learn.Post("/chat", learning.Chat)
	learn.Post("/start-questions", learning.StartQuestions)
	learn.Post("/speech/tts", learning.Speech)
	learn.Post("/speech/stt", learning.SpeechToText)
	learn.Use("/voice", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	learn.Get("/voice", websocket.New(learning.VoiceWS))
}
