package memory_test

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
)

func TestAuthenticateUser_ReturnsUserForValidCredentials(t *testing.T) {
	user := memory.AuthenticateUser("umar@kaifa.com", "Pass123")

	require.NotNil(t, user)
	assert.Equal(t, "stdnt0001", user.ID)
	assert.Equal(t, "umar", user.FullName)
	assert.Equal(t, "2018-12-31", user.DOB)
	assert.Equal(t, "male", user.Gender)
	assert.Equal(t, "student", user.Role)
	assert.Equal(t, "VII", user.Class)
	assert.Equal(t, "A2", user.CurrentProficiencyLevel)
}

func TestAuthenticateUser_ReturnsAishaExampleUser(t *testing.T) {
	user := memory.AuthenticateUser("aisha@kaifa.com", "Pass123")

	require.NotNil(t, user)
	assert.Equal(t, "stdnt0004", user.ID)
	assert.Equal(t, "aisha", user.FullName)
	assert.Equal(t, "female", user.Gender)
	assert.Equal(t, "student", user.Role)
	assert.Equal(t, "VII", user.Class)
	assert.Equal(t, "A1", user.CurrentProficiencyLevel)
}

func TestAuthenticateUser_ReturnsNilForInvalidCredentials(t *testing.T) {
	assert.Nil(t, memory.AuthenticateUser("umar@kaifa.com", "wrong-password"))
	assert.Nil(t, memory.AuthenticateUser("unknown@example.com", "Pass123"))
}
