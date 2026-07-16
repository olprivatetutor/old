package handler

import (
	"context"
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
)

type accessDecision int

const (
	accessAllowed accessDecision = iota
	accessDenied
	accessNotFound
)

func canAccessModule(ctx context.Context, users port.UserRepository, syllabi port.SyllabusRepository, userID string, module *entity.Module) (accessDecision, error) {
	user, err := users.GetByID(ctx, userID)
	if err != nil || user == nil {
		if err != nil {
			return accessDenied, err
		}
		return accessNotFound, nil
	}

	role := strings.TrimSpace(user.Role)
	if role == "" || strings.EqualFold(role, "student") {
		if strings.TrimSpace(user.Class) == "" {
			return accessDenied, nil
		}

		syllabus, err := syllabi.GetSyllabusByID(ctx, module.SyllabusID)
		if err != nil || syllabus == nil {
			if err != nil {
				return accessDenied, err
			}
			return accessNotFound, nil
		}
		if !strings.EqualFold(strings.TrimSpace(user.Class), strings.TrimSpace(syllabus.Class)) {
			return accessDenied, nil
		}
	}

	return accessAllowed, nil
}
