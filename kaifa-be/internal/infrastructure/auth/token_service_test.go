package auth

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

func TestIssueTokenPair_IncludesUserInfoInAccessClaims(t *testing.T) {
	tokens, err := NewTokenService("test-jwt-secret")
	require.NoError(t, err)

	user := entity.User{
		ID:       "stdnt0001",
		FullName: "umar",
		Role:     "student",
		Class:    "IX",
	}

	tokenPair, err := tokens.IssueTokenPair(user)
	require.NoError(t, err)

	claims, err := tokens.ValidateAccessToken(tokenPair.AccessToken)
	require.NoError(t, err)
	assert.Equal(t, user.ID, claims.Subject)
	assert.Equal(t, user.FullName, claims.FullName)
	assert.Equal(t, user.Role, claims.Role)
	assert.Equal(t, user.Class, claims.Class)
}

func TestRefresh_PreservesUserInfoInAccessClaims(t *testing.T) {
	tokens, err := NewTokenService("test-jwt-secret")
	require.NoError(t, err)

	user := entity.User{
		ID:       "stdnt0002",
		FullName: "Uchiha Sasuke",
		Role:     "student",
		Class:    "XII",
	}

	tokenPair, err := tokens.IssueTokenPair(user)
	require.NoError(t, err)

	refreshed, err := tokens.Refresh(tokenPair.RefreshToken)
	require.NoError(t, err)

	claims, err := tokens.ValidateAccessToken(refreshed.AccessToken)
	require.NoError(t, err)
	assert.Equal(t, user.ID, claims.Subject)
	assert.Equal(t, user.FullName, claims.FullName)
	assert.Equal(t, user.Role, claims.Role)
	assert.Equal(t, user.Class, claims.Class)
}
