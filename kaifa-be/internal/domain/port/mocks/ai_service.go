package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

// AIService is a testify mock for port.AIService.
type AIService struct {
	mock.Mock
}

func (m *AIService) StartAssessment(
	ctx context.Context,
	session *entity.AssessmentSession,
) (string, error) {
	args := m.Called(ctx, session)
	return args.String(0), args.Error(1)
}

func (m *AIService) ChatAssessment(
	ctx context.Context,
	session *entity.AssessmentSession,
	userMessage string,
) (string, *entity.AssessmentResult, error) {
	args := m.Called(ctx, session, userMessage)
	result, _ := args.Get(1).(*entity.AssessmentResult)
	return args.String(0), result, args.Error(2)
}

func (m *AIService) GenerateLearningPath(
	ctx context.Context,
	module *entity.Module,
	level string,
	assessment *entity.AssessmentResult,
) (*entity.LearningPath, error) {
	args := m.Called(ctx, module, level, assessment)
	path, _ := args.Get(0).(*entity.LearningPath)
	return path, args.Error(1)
}

func (m *AIService) StartLearningChat(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
) (string, error) {
	args := m.Called(ctx, module, session)
	return args.String(0), args.Error(1)
}

func (m *AIService) ChatLearning(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	userMessage string,
) (string, error) {
	args := m.Called(ctx, module, session, userMessage)
	return args.String(0), args.Error(1)
}

func (m *AIService) GenerateListeningParagraph(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
) (string, error) {
	args := m.Called(ctx, module, session)
	return args.String(0), args.Error(1)
}

func (m *AIService) GenerateListeningQuestion(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	paragraph string,
	questionNumber int,
) (string, error) {
	args := m.Called(ctx, module, session, paragraph, questionNumber)
	return args.String(0), args.Error(1)
}

func (m *AIService) AssessListening(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	paragraph string,
	answers []string,
) (*entity.ListeningAssessment, error) {
	args := m.Called(ctx, module, session, paragraph, answers)
	assessment, _ := args.Get(0).(*entity.ListeningAssessment)
	return assessment, args.Error(1)
}
