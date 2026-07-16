package assessment

import (
	"context"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
)

type UseCase struct {
	ai port.AIService
}

func New(ai port.AIService) *UseCase {
	return &UseCase{ai: ai}
}

func (uc *UseCase) Start(
	ctx context.Context,
	session *entity.AssessmentSession,
) (reply string, err error) {
	return uc.ai.StartAssessment(ctx, session)
}

func (uc *UseCase) Chat(
	ctx context.Context,
	session *entity.AssessmentSession,
	userMessage string,
) (reply string, result *entity.AssessmentResult, err error) {
	reply, result, err = uc.ai.ChatAssessment(ctx, session, userMessage)
	if err != nil {
		return "", nil, err
	}
	if result != nil {
		return "", result, nil
	}
	return reply, nil, nil
}
