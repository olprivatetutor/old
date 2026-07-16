package memory

import (
	"context"
	"sync"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
)

type userCredential struct {
	User         entity.User
	PasswordHash string
}

type UserRepository struct {
	mu    sync.RWMutex
	users []userCredential
}

var defaultUserRepository = NewUserRepository()

func NewUserRepository() *UserRepository {
	return &UserRepository{
		users: []userCredential{
			{
				User: entity.User{
					ID:                      "stdnt0001",
					Email:                   "umar@kaifa.com",
					FullName:                "umar",
					DOB:                     "2018-12-31",
					Gender:                  "male",
					Role:                    "student",
					Class:                   "VII",
					CurrentProficiencyLevel: "A2",
				},
				PasswordHash: "$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC",
			},
			{
				User: entity.User{
					ID:                      "stdnt0002",
					Email:                   "sasuke@konoha.com",
					FullName:                "Uchiha Sasuke",
					DOB:                     "2018-04-01",
					Gender:                  "male",
					Role:                    "student",
					Class:                   "XII",
					CurrentProficiencyLevel: "B1",
				},
				PasswordHash: "$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC",
			},
			{
				User: entity.User{
					ID:                      "stdnt0003",
					Email:                   "nobita@konoha.com",
					FullName:                "Nobita Nobi",
					DOB:                     "2018-09-28",
					Role:                    "student",
					Class:                   "IX",
					CurrentProficiencyLevel: "A1",
				},
				PasswordHash: "$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC",
			},
			{
				User: entity.User{
					ID:                      "stdnt0004",
					Email:                   "aisha@kaifa.com",
					FullName:                "aisha",
					DOB:                     "2018-03-28",
					Gender:                  "female",
					Role:                    "student",
					Class:                   "VII",
					CurrentProficiencyLevel: "A1",
				},
				PasswordHash: "$2a$10$GrUJpYn9NA9XzwfU05qmY.DeTAGApS9jB9ko1.H0v.y2MXQhp86BC",
			},
		},
	}
}

func (r *UserRepository) Authenticate(_ context.Context, email string, password string) (*entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, credential := range r.users {
		if credential.User.Email == email && authinfra.VerifyPassword(credential.PasswordHash, password) {
			user := credential.User
			return &user, nil
		}
	}
	return nil, nil
}

func (r *UserRepository) GetByID(_ context.Context, id string) (*entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, credential := range r.users {
		if credential.User.ID == id {
			user := credential.User
			return &user, nil
		}
	}
	return nil, nil
}

func (r *UserRepository) GetByEmail(_ context.Context, email string) (*entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, credential := range r.users {
		if credential.User.Email == email {
			user := credential.User
			return &user, nil
		}
	}
	return nil, nil
}

func (r *UserRepository) List(_ context.Context) ([]entity.User, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]entity.User, len(r.users))
	for i, credential := range r.users {
		result[i] = credential.User
	}
	return result, nil
}

func (r *UserRepository) Save(_ context.Context, user entity.User, password string) error {
	passwordHash, err := authinfra.HashPassword(password)
	if err != nil {
		return err
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	for i, credential := range r.users {
		if credential.User.ID == user.ID {
			r.users[i] = userCredential{User: user, PasswordHash: passwordHash}
			return nil
		}
	}

	r.users = append(r.users, userCredential{User: user, PasswordHash: passwordHash})
	return nil
}

func AuthenticateUser(email string, password string) *entity.User {
	user, _ := defaultUserRepository.Authenticate(context.Background(), email, password)
	return user
}
