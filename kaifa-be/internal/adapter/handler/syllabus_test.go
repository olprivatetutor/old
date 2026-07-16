package handler_test

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
)

func TestSyllabusRoutes_RequireJWT(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi", syllabusHandler.ListSyllabi)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusUnauthorized, resp.StatusCode)
}

func TestSyllabusHandlerListSyllabi_FiltersByAuthenticatedClass(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "VII",
	})
	require.NoError(t, err)

	syllabusRepo := memory.NewSyllabusRepository()
	syllabusHandler := handler.NewSyllabusHandler(syllabusRepo)

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi", syllabusHandler.ListSyllabi)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi?language=arabic", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	all, err := syllabusRepo.ListSyllabi(context.Background())
	require.NoError(t, err)
	expected := make([]entity.Syllabus, 0, len(all))
	for _, syllabus := range all {
		if syllabus.Language == "arabic" && syllabus.Class == "VII" {
			expected = append(expected, syllabus)
		}
	}

	var payload struct {
		Success bool              `json:"success"`
		Data    []entity.Syllabus `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	require.Len(t, payload.Data, len(expected))
	for _, syllabus := range payload.Data {
		assert.Equal(t, "arabic", syllabus.Language)
		assert.Equal(t, "VII", syllabus.Class)
	}
}

func TestSyllabusHandlerGetSyllabus_ReturnsNotFoundForDifferentClass(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "XII",
	})
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi/:id", syllabusHandler.GetSyllabus)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi/syl-eng-vii-01", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusNotFound, resp.StatusCode)
}

func TestSyllabusHandlerListModules_ReturnsNotFoundForDifferentClass(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "XII",
	})
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi/:id/modules", syllabusHandler.ListModules)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi/syl-eng-vii-01/modules", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusNotFound, resp.StatusCode)
}

func TestSyllabusHandlerListModules_IncludesTranslations(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "VII",
	})
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi/:id/modules", syllabusHandler.ListModules)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi/syl-eng-vii-01/modules", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var payload struct {
		Success bool `json:"success"`
		Data    []struct {
			ID           string                     `json:"id"`
			Language     string                     `json:"language"`
			Translations []entity.ModuleTranslation `json:"translations"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	require.NotEmpty(t, payload.Data)
	assert.NotEmpty(t, payload.Data[0].Translations)
	assert.Equal(t, "bahasa indonesia", payload.Data[0].Translations[0].Language)
}

func TestSyllabusHandlerGetModule_ReturnsNotFoundForDifferentSyllabus(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "XII",
	})
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi/:id/modules/:moduleId", syllabusHandler.GetModule)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi/syl-eng-vii-02/modules/mod-eng-vii-04", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusNotFound, resp.StatusCode)
}

func TestSyllabusHandlerGetModule_ReturnsModuleForMatchingClass(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "student-1",
		FullName: "Student One",
		Role:     "student",
		Class:    "VII",
	})
	require.NoError(t, err)

	syllabusHandler := handler.NewSyllabusHandler(memory.NewSyllabusRepository())

	app := fiber.New()
	app.Use("/api/syllabi", middleware.RequireAuth(tokens))
	app.Get("/api/syllabi/:id/modules/:moduleId", syllabusHandler.GetModule)

	req := httptest.NewRequest(fiber.MethodGet, "/api/syllabi/syl-eng-vii-01/modules/mod-eng-vii-01", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var payload struct {
		Success bool `json:"success"`
		Data    struct {
			ID          string `json:"id"`
			SyllabusID  string `json:"syllabus_id"`
			Language    string `json:"language"`
			Title       string `json:"title"`
			Description string `json:"description"`
			TopicScope  string `json:"topic_scope"`
			Status      string `json:"status"`
			Order       int    `json:"order"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	assert.Equal(t, "mod-eng-vii-01", payload.Data.ID)
	assert.Equal(t, "syl-eng-vii-01", payload.Data.SyllabusID)
}
