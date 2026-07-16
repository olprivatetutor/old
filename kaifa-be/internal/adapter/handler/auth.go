package handler

import (
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

type AuthHandler struct {
	tokens *authinfra.TokenService
	users  port.UserRepository
}

func NewAuthHandler(tokens *authinfra.TokenService, repositories ...port.UserRepository) *AuthHandler {
	users := port.UserRepository(memory.NewUserRepository())
	if len(repositories) > 0 && repositories[0] != nil {
		users = repositories[0]
	}
	return &AuthHandler{tokens: tokens, users: users}
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponse struct {
	AccessToken           string `json:"access_token"`
	RefreshToken          string `json:"refresh_token"`
	TokenType             string `json:"token_type"`
	AccessTokenExpiresIn  int64  `json:"access_token_expires_in"`
	RefreshTokenExpiresIn int64  `json:"refresh_token_expires_in"`
}

type refreshTokenRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type createUserRequest struct {
	ID                      string `json:"id"`
	Email                   string `json:"email"`
	FullName                string `json:"full_name"`
	DOB                     string `json:"dob"`
	Gender                  string `json:"gender"`
	Role                    string `json:"role"`
	Class                   string `json:"class"`
	CurrentProficiencyLevel string `json:"current_proficiency_level"`
	Password                string `json:"password"`
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var req loginRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	req.Email = strings.TrimSpace(req.Email)
	if req.Email == "" || req.Password == "" {
		return response.BadRequest(c, "email and password are required")
	}

	user, err := h.users.Authenticate(c.Context(), req.Email, req.Password)
	if err != nil {
		logger.Error("login repository error", "err", err)
		return response.InternalError(c, "failed to authenticate user")
	}
	if user == nil {
		return response.Unauthorized(c, "invalid email or password")
	}

	tokenPair, err := h.tokens.IssueTokenPair(*user)
	if err != nil {
		logger.Error("login token generation error", "err", err)
		return response.InternalError(c, "failed to generate token")
	}

	return response.OK(c, loginResponse{
		AccessToken:           tokenPair.AccessToken,
		RefreshToken:          tokenPair.RefreshToken,
		TokenType:             "Bearer",
		AccessTokenExpiresIn:  tokenPair.AccessTokenExpiresIn,
		RefreshTokenExpiresIn: tokenPair.RefreshTokenExpiresIn,
	})
}

func (h *AuthHandler) CreateUser(c *fiber.Ctx) error {
	var req createUserRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	req.ID = strings.TrimSpace(req.ID)
	req.Email = strings.TrimSpace(req.Email)
	req.FullName = strings.TrimSpace(req.FullName)
	req.DOB = strings.TrimSpace(req.DOB)
	req.Gender = strings.ToLower(strings.TrimSpace(req.Gender))
	req.Role = strings.ToLower(strings.TrimSpace(req.Role))
	req.Class = strings.ToUpper(strings.TrimSpace(req.Class))
	req.CurrentProficiencyLevel = strings.TrimSpace(req.CurrentProficiencyLevel)
	if req.ID == "" {
		req.ID = "usr-" + uuid.NewString()
	}
	if req.Role == "" {
		req.Role = "student"
	}

	if req.Email == "" || req.FullName == "" || req.DOB == "" || req.CurrentProficiencyLevel == "" || req.Password == "" {
		return response.BadRequest(c, "email, full_name, dob, current_proficiency_level, and password are required")
	}
	if !isValidUserRole(req.Role) {
		return response.BadRequest(c, "role must be student, admin, or tutor")
	}
	if req.Role == "student" && req.Class == "" {
		return response.BadRequest(c, "class is required for student users")
	}

	existing, err := h.users.GetByEmail(c.Context(), req.Email)
	if err != nil {
		logger.Error("get user by email repository error", "err", err)
		return response.InternalError(c, "failed to check user")
	}
	if existing != nil {
		return response.BadRequest(c, "email already exists")
	}

	user := entity.User{
		ID:                      req.ID,
		Email:                   req.Email,
		FullName:                req.FullName,
		DOB:                     req.DOB,
		Gender:                  req.Gender,
		Role:                    req.Role,
		Class:                   req.Class,
		CurrentProficiencyLevel: req.CurrentProficiencyLevel,
	}
	if err := h.users.Save(c.Context(), user, req.Password); err != nil {
		logger.Error("create user repository error", "err", err)
		return response.InternalError(c, "failed to create user")
	}

	return response.Created(c, user)
}

func isValidUserRole(role string) bool {
	switch role {
	case "student", "admin", "tutor":
		return true
	default:
		return false
	}
}

func (h *AuthHandler) RefreshToken(c *fiber.Ctx) error {
	var req refreshTokenRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	tokenPair, err := h.tokens.Refresh(req.RefreshToken)
	if err != nil {
		return response.Unauthorized(c, "invalid or expired refresh token")
	}

	return response.OK(c, loginResponse{
		AccessToken:           tokenPair.AccessToken,
		RefreshToken:          tokenPair.RefreshToken,
		TokenType:             "Bearer",
		AccessTokenExpiresIn:  tokenPair.AccessTokenExpiresIn,
		RefreshTokenExpiresIn: tokenPair.RefreshTokenExpiresIn,
	})
}
