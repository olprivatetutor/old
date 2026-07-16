package handler_test

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
)

func newAuthHandlerForTest(t *testing.T) *handler.AuthHandler {
	t.Helper()
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	return handler.NewAuthHandler(tokens)
}

func TestAuthHandlerLogin_ReturnsTokensForValidCredentials(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/auth/login", authHandler.Login)

	body := bytes.NewBufferString(`{"email":"umar@kaifa.com","password":"Pass123"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/auth/login", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var payload struct {
		Success bool `json:"success"`
		Data    struct {
			AccessToken           string `json:"access_token"`
			RefreshToken          string `json:"refresh_token"`
			TokenType             string `json:"token_type"`
			AccessTokenExpiresIn  int64  `json:"access_token_expires_in"`
			RefreshTokenExpiresIn int64  `json:"refresh_token_expires_in"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	assert.NotEmpty(t, payload.Data.AccessToken)
	assert.NotEmpty(t, payload.Data.RefreshToken)
	assert.Equal(t, "Bearer", payload.Data.TokenType)
	assert.Positive(t, payload.Data.AccessTokenExpiresIn)
	assert.Positive(t, payload.Data.RefreshTokenExpiresIn)
}

func TestAuthHandlerLogin_ReturnsUnauthorizedForInvalidCredentials(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/auth/login", authHandler.Login)

	body := bytes.NewBufferString(`{"email":"umar@kaifa.com","password":"wrong-password"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/auth/login", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusUnauthorized, resp.StatusCode)
}

func TestAuthHandlerLogin_ReturnsBadRequestForMissingCredentials(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/auth/login", authHandler.Login)

	body := bytes.NewBufferString(`{"email":"umar@kaifa.com"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/auth/login", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}

func TestAuthHandlerCreateUser_HashesPasswordAndAllowsLogin(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/users", authHandler.CreateUser)
	app.Post("/api/auth/login", authHandler.Login)

	body := bytes.NewBufferString(`{
		"email":"hinata@konoha.com",
		"full_name":"Hyuga Hinata",
		"dob":"2018-12-27",
		"class":"IX",
		"current_proficiency_level":"A1",
		"password":"Secret123"
	}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/users", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusCreated, resp.StatusCode)

	var payload struct {
		Success bool            `json:"success"`
		Data    json.RawMessage `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	assert.NotContains(t, string(payload.Data), "Secret123")
	assert.NotContains(t, string(payload.Data), "password")

	loginBody := bytes.NewBufferString(`{"email":"hinata@konoha.com","password":"Secret123"}`)
	loginReq := httptest.NewRequest(fiber.MethodPost, "/api/auth/login", loginBody)
	loginReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	loginResp, err := app.Test(loginReq)
	require.NoError(t, err)
	defer loginResp.Body.Close()

	assert.Equal(t, fiber.StatusOK, loginResp.StatusCode)
}

func TestAuthHandlerCreateUser_ReturnsBadRequestForDuplicateEmail(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/users", authHandler.CreateUser)

	body := bytes.NewBufferString(`{
		"email":"umar@kaifa.com",
		"full_name":"umar",
		"dob":"2018-12-31",
		"current_proficiency_level":"A2",
		"password":"Secret123"
	}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/users", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}

func TestAuthHandlerRefreshToken_RotatesRefreshToken(t *testing.T) {
	app := fiber.New()
	authHandler := newAuthHandlerForTest(t)
	app.Post("/api/auth/login", authHandler.Login)
	app.Post("/api/auth/refresh-token", authHandler.RefreshToken)

	loginBody := bytes.NewBufferString(`{"email":"umar@kaifa.com","password":"Pass123"}`)
	loginReq := httptest.NewRequest(fiber.MethodPost, "/api/auth/login", loginBody)
	loginReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	loginResp, err := app.Test(loginReq)
	require.NoError(t, err)
	defer loginResp.Body.Close()

	var loginPayload struct {
		Data struct {
			RefreshToken string `json:"refresh_token"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(loginResp.Body).Decode(&loginPayload))
	require.NotEmpty(t, loginPayload.Data.RefreshToken)

	refreshBody := bytes.NewBufferString(`{"refresh_token":"` + loginPayload.Data.RefreshToken + `"}`)
	refreshReq := httptest.NewRequest(fiber.MethodPost, "/api/auth/refresh-token", refreshBody)
	refreshReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	refreshResp, err := app.Test(refreshReq)
	require.NoError(t, err)
	defer refreshResp.Body.Close()

	assert.Equal(t, fiber.StatusOK, refreshResp.StatusCode)

	var refreshPayload struct {
		Success bool `json:"success"`
		Data    struct {
			AccessToken  string `json:"access_token"`
			RefreshToken string `json:"refresh_token"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(refreshResp.Body).Decode(&refreshPayload))
	assert.True(t, refreshPayload.Success)
	assert.NotEmpty(t, refreshPayload.Data.AccessToken)
	assert.NotEmpty(t, refreshPayload.Data.RefreshToken)
	assert.NotEqual(t, loginPayload.Data.RefreshToken, refreshPayload.Data.RefreshToken)

	reuseBody := bytes.NewBufferString(`{"refresh_token":"` + loginPayload.Data.RefreshToken + `"}`)
	reuseReq := httptest.NewRequest(fiber.MethodPost, "/api/auth/refresh-token", reuseBody)
	reuseReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	reuseResp, err := app.Test(reuseReq)
	require.NoError(t, err)
	defer reuseResp.Body.Close()

	assert.Equal(t, fiber.StatusUnauthorized, reuseResp.StatusCode)
}
