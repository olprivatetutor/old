package middleware

import (
	"strings"

	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/fiber/v2"
)

const (
	UserIDLocal   = "user_id"
	FullNameLocal = "full_name"
	RoleLocal     = "role"
	ClassLocal    = "class"
)

func RequireAuth(tokens *authinfra.TokenService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		token := bearerToken(c.Get(fiber.HeaderAuthorization))
		if token == "" {
			token = strings.TrimSpace(c.Query("access_token"))
		}
		if token == "" {
			return response.Unauthorized(c, "missing authorization token")
		}

		claims, err := tokens.ValidateAccessToken(token)
		if err != nil {
			return response.Unauthorized(c, "invalid or expired token")
		}

		c.Locals(UserIDLocal, claims.Subject)
		c.Locals(FullNameLocal, claims.FullName)
		c.Locals(RoleLocal, claims.Role)
		c.Locals(ClassLocal, claims.Class)
		return c.Next()
	}
}

func bearerToken(header string) string {
	const prefix = "Bearer "
	if !strings.HasPrefix(header, prefix) {
		return ""
	}
	return strings.TrimSpace(strings.TrimPrefix(header, prefix))
}
