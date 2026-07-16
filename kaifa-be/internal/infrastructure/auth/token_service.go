package auth

import (
	"crypto/hmac"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

const (
	AccessTokenTTL  = 15 * time.Minute
	RefreshTokenTTL = 7 * 24 * time.Hour
)

var (
	ErrInvalidToken  = errors.New("invalid token")
	ErrExpiredToken  = errors.New("expired token")
	ErrInvalidSecret = errors.New("jwt secret is required")
)

type TokenPair struct {
	AccessToken           string
	RefreshToken          string
	AccessTokenExpiresIn  int64
	RefreshTokenExpiresIn int64
}

type AccessClaims struct {
	Subject   string `json:"sub"`
	FullName  string `json:"full_name"`
	Role      string `json:"role"`
	Class     string `json:"class"`
	TokenType string `json:"typ"`
	IssuedAt  int64  `json:"iat"`
	ExpiresAt int64  `json:"exp"`
}

type refreshSession struct {
	User      entity.User
	ExpiresAt time.Time
}

type TokenService struct {
	secret          []byte
	refreshSessions map[string]refreshSession
	mu              sync.Mutex
}

func NewTokenService(secret string) (*TokenService, error) {
	secret = strings.TrimSpace(secret)
	if secret == "" {
		return nil, ErrInvalidSecret
	}
	return &TokenService{
		secret:          []byte(secret),
		refreshSessions: make(map[string]refreshSession),
	}, nil
}

func (s *TokenService) IssueTokenPair(user entity.User) (*TokenPair, error) {
	return s.issueTokenPairForUser(user)
}

func (s *TokenService) Refresh(refreshToken string) (*TokenPair, error) {
	refreshToken = strings.TrimSpace(refreshToken)
	if refreshToken == "" {
		return nil, ErrInvalidToken
	}

	s.mu.Lock()
	session, ok := s.refreshSessions[refreshToken]
	if ok {
		delete(s.refreshSessions, refreshToken)
	}
	s.mu.Unlock()

	if !ok {
		return nil, ErrInvalidToken
	}
	if time.Now().After(session.ExpiresAt) {
		return nil, ErrExpiredToken
	}

	return s.issueTokenPairForUser(session.User)
}

func (s *TokenService) ValidateAccessToken(token string) (*AccessClaims, error) {
	token = strings.TrimSpace(token)
	if token == "" {
		return nil, ErrInvalidToken
	}

	parts := strings.Split(token, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}

	signedPart := parts[0] + "." + parts[1]
	expectedSig := s.sign(signedPart)
	if !hmac.Equal([]byte(expectedSig), []byte(parts[2])) {
		return nil, ErrInvalidToken
	}

	payload, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var claims AccessClaims
	if err := json.Unmarshal(payload, &claims); err != nil {
		return nil, ErrInvalidToken
	}
	if claims.TokenType != "access" || claims.Subject == "" {
		return nil, ErrInvalidToken
	}
	if time.Now().Unix() >= claims.ExpiresAt {
		return nil, ErrExpiredToken
	}

	return &claims, nil
}

func (s *TokenService) issueTokenPairForUser(user entity.User) (*TokenPair, error) {
	now := time.Now()
	accessToken, err := s.generateAccessToken(user, now)
	if err != nil {
		return nil, err
	}

	refreshToken, err := randomToken()
	if err != nil {
		return nil, err
	}
	refreshExpiresAt := now.Add(RefreshTokenTTL)

	s.mu.Lock()
	s.refreshSessions[refreshToken] = refreshSession{
		User:      user,
		ExpiresAt: refreshExpiresAt,
	}
	s.mu.Unlock()

	return &TokenPair{
		AccessToken:           accessToken,
		RefreshToken:          refreshToken,
		AccessTokenExpiresIn:  int64(AccessTokenTTL.Seconds()),
		RefreshTokenExpiresIn: int64(RefreshTokenTTL.Seconds()),
	}, nil
}

func (s *TokenService) generateAccessToken(user entity.User, now time.Time) (string, error) {
	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}
	claims := AccessClaims{
		Subject:   user.ID,
		FullName:  user.FullName,
		Role:      user.Role,
		Class:     user.Class,
		TokenType: "access",
		IssuedAt:  now.Unix(),
		ExpiresAt: now.Add(AccessTokenTTL).Unix(),
	}

	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", err
	}
	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", err
	}

	unsigned := base64.RawURLEncoding.EncodeToString(headerJSON) + "." +
		base64.RawURLEncoding.EncodeToString(claimsJSON)
	return unsigned + "." + s.sign(unsigned), nil
}

func (s *TokenService) sign(unsigned string) string {
	mac := hmac.New(sha256.New, s.secret)
	_, _ = mac.Write([]byte(unsigned))
	return base64.RawURLEncoding.EncodeToString(mac.Sum(nil))
}

func randomToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("generate refresh token: %w", err)
	}
	return hex.EncodeToString(b), nil
}
