package middleware_test

import (
	"net/http/httptest"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestRequireAuth_ReturnsUnauthorizedWithoutToken(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)

	app := fiber.New()
	app.Use(middleware.RequireAuth(tokens))
	app.Get("/protected", func(c *fiber.Ctx) error {
		return c.SendStatus(fiber.StatusNoContent)
	})

	req := httptest.NewRequest(fiber.MethodGet, "/protected", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusUnauthorized, resp.StatusCode)
}

func TestRequireAuth_AllowsValidBearerToken(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)

	tokenPair, err := tokens.IssueTokenPair(entity.User{
		ID:       "stdnt0001",
		FullName: "umar",
		Role:     "student",
		Class:    "IX",
	})
	require.NoError(t, err)

	app := fiber.New()
	app.Use(middleware.RequireAuth(tokens))
	app.Get("/protected", func(c *fiber.Ctx) error {
		assert.Equal(t, "stdnt0001", c.Locals(middleware.UserIDLocal))
		assert.Equal(t, "umar", c.Locals(middleware.FullNameLocal))
		assert.Equal(t, "student", c.Locals(middleware.RoleLocal))
		assert.Equal(t, "IX", c.Locals(middleware.ClassLocal))
		return c.SendStatus(fiber.StatusNoContent)
	})

	req := httptest.NewRequest(fiber.MethodGet, "/protected", nil)
	req.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusNoContent, resp.StatusCode)
}
