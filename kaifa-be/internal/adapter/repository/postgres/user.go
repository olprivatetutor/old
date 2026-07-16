package postgres

import (
	"context"
	"database/sql"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Authenticate(ctx context.Context, email string, password string) (*entity.User, error) {
	var user entity.User
	var passwordHash string
	err := r.db.QueryRowContext(ctx, `
		SELECT id, email, full_name, dob::text, gender, role, class, current_proficiency_level, password_hash
		FROM users
		WHERE email = $1
	`, email).Scan(&user.ID, &user.Email, &user.FullName, &user.DOB, &user.Gender, &user.Role, &user.Class, &user.CurrentProficiencyLevel, &passwordHash)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	if !authinfra.VerifyPassword(passwordHash, password) {
		return nil, nil
	}
	return &user, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id string) (*entity.User, error) {
	return r.scanUser(r.db.QueryRowContext(ctx, `
		SELECT id, email, full_name, dob::text, gender, role, class, current_proficiency_level
		FROM users
		WHERE id = $1
	`, id))
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*entity.User, error) {
	return r.scanUser(r.db.QueryRowContext(ctx, `
		SELECT id, email, full_name, dob::text, gender, role, class, current_proficiency_level
		FROM users
		WHERE email = $1
	`, email))
}

func (r *UserRepository) List(ctx context.Context) ([]entity.User, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, email, full_name, dob::text, gender, role, class, current_proficiency_level
		FROM users
		ORDER BY id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []entity.User
	for rows.Next() {
		var user entity.User
		if err := rows.Scan(&user.ID, &user.Email, &user.FullName, &user.DOB, &user.Gender, &user.Role, &user.Class, &user.CurrentProficiencyLevel); err != nil {
			return nil, err
		}
		users = append(users, user)
	}
	return users, rows.Err()
}

func (r *UserRepository) Save(ctx context.Context, user entity.User, password string) error {
	passwordHash, err := authinfra.HashPassword(password)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO users (id, email, full_name, dob, gender, role, class, current_proficiency_level, password_hash)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (id) DO UPDATE SET
			email = EXCLUDED.email,
			full_name = EXCLUDED.full_name,
			dob = EXCLUDED.dob,
			gender = EXCLUDED.gender,
			role = EXCLUDED.role,
			class = EXCLUDED.class,
			current_proficiency_level = EXCLUDED.current_proficiency_level,
			password_hash = EXCLUDED.password_hash,
			updated_at = now()
	`, user.ID, user.Email, user.FullName, user.DOB, user.Gender, user.Role, user.Class, user.CurrentProficiencyLevel, passwordHash)
	return err
}

func (r *UserRepository) scanUser(row *sql.Row) (*entity.User, error) {
	var user entity.User
	err := row.Scan(&user.ID, &user.Email, &user.FullName, &user.DOB, &user.Gender, &user.Role, &user.Class, &user.CurrentProficiencyLevel)
	return nilIfNoRows(&user, err)
}
