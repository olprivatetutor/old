package port

import (
	"context"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

type UserRepository interface {
	Authenticate(ctx context.Context, email string, password string) (*entity.User, error)
	GetByID(ctx context.Context, id string) (*entity.User, error)
	GetByEmail(ctx context.Context, email string) (*entity.User, error)
	List(ctx context.Context) ([]entity.User, error)
	Save(ctx context.Context, user entity.User, password string) error
}

type SyllabusRepository interface {
	ListSyllabi(ctx context.Context) ([]entity.Syllabus, error)
	ListSyllabiByLanguage(ctx context.Context, language string) ([]entity.Syllabus, error)
	GetSyllabusByID(ctx context.Context, id string) (*entity.Syllabus, error)
	ListModulesBySyllabusID(ctx context.Context, syllabusID string) ([]entity.Module, error)
	GetModuleByID(ctx context.Context, moduleID string) (*entity.Module, error)
	SaveSyllabus(ctx context.Context, syllabus entity.Syllabus) error
	SaveModule(ctx context.Context, module entity.Module) error
}

type AssessmentSessionRepository interface {
	Save(ctx context.Context, userID string, session entity.AssessmentSession) error
	Get(ctx context.Context, userID string, moduleID string) (*entity.AssessmentSession, error)
	Delete(ctx context.Context, userID string, moduleID string) error
}

type AssessmentResultRepository interface {
	Save(ctx context.Context, userID string, moduleID string, result entity.AssessmentResult) error
	Get(ctx context.Context, userID string, moduleID string) (*entity.AssessmentResult, error)
	Delete(ctx context.Context, userID string, moduleID string) error
}

type LearningSessionRepository interface {
	Save(ctx context.Context, userID string, session entity.LearningSession) error
	Get(ctx context.Context, userID string, moduleID string) (*entity.LearningSession, error)
	GetByPathID(ctx context.Context, userID string, pathID string) (*entity.LearningSession, error)
}

type LearningPathRepository interface {
	Save(ctx context.Context, userID string, path entity.LearningPath) error
	Get(ctx context.Context, userID string, pathID string) (*entity.LearningPath, error)
	GetByModuleID(ctx context.Context, userID string, moduleID string) (*entity.LearningPath, error)
	GetByStepID(ctx context.Context, userID string, stepID string) (*entity.LearningPath, *entity.LearningStep, error)
}
