package port

import (
	"context"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

// AIService is the port (interface) for the AI text generation backend.
// The OpenAI adapter implements this.
type AIService interface {
	// StartAssessment begins an assessment session by asking the first question
	// within the module topic scope.
	StartAssessment(ctx context.Context, session *entity.AssessmentSession) (reply string, err error)

	// ChatAssessment sends a user message in an ongoing assessment session and returns
	// either the assistant reply or a non-nil AssessmentResult when the assessment is complete.
	ChatAssessment(ctx context.Context, session *entity.AssessmentSession, userMessage string) (reply string, result *entity.AssessmentResult, err error)

	// GenerateLearningPath creates a structured learning path for the given module,
	// assessment result, and assessed level in a single GPT call.
	GenerateLearningPath(ctx context.Context, module *entity.Module, level string, assessment *entity.AssessmentResult) (*entity.LearningPath, error)

	// StartLearningChat greets the student and starts the module conversation.
	StartLearningChat(ctx context.Context, module *entity.Module, session *entity.LearningSession) (reply string, err error)

	// ChatLearning sends a user message in an ongoing learning session and returns
	// the AI tutor reply. The tutor respects the module topic_scope guardrail.
	ChatLearning(ctx context.Context, module *entity.Module, session *entity.LearningSession, userMessage string) (reply string, err error)

	// GenerateListeningParagraph creates the listening passage for modules with a listening activity.
	GenerateListeningParagraph(ctx context.Context, module *entity.Module, session *entity.LearningSession) (paragraph string, err error)

	// GenerateListeningQuestion asks one comprehension question about the listening paragraph.
	GenerateListeningQuestion(ctx context.Context, module *entity.Module, session *entity.LearningSession, paragraph string, questionNumber int) (question string, err error)

	// AssessListening evaluates the student's answers to the listening questions.
	AssessListening(ctx context.Context, module *entity.Module, session *entity.LearningSession, paragraph string, answers []string) (*entity.ListeningAssessment, error)
}
