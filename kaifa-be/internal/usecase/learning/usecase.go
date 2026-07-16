package learning

import (
	"context"
	"strings"
	"unicode"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
)

var offTopicHints = []string{
	"python", "javascript", "java", "golang", "programming", "coding", "code",
	"stock", "crypto", "bitcoin", "weather", "recipe", "movie", "football",
	"math", "physics", "history", "politics", "game",
}

type UseCase struct {
	ai port.AIService
}

func New(ai port.AIService) *UseCase {
	return &UseCase{ai: ai}
}

func (uc *UseCase) GeneratePath(
	ctx context.Context,
	module *entity.Module,
	level string,
	assessment *entity.AssessmentResult,
) (*entity.LearningPath, error) {
	return uc.ai.GenerateLearningPath(ctx, module, level, assessment)
}

func (uc *UseCase) StartChat(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
) (*entity.LearningChatResult, error) {
	session.TopicScope = effectiveTopicScope(module, session)
	reply, err := uc.ai.StartLearningChat(ctx, module, session)
	if err != nil {
		return nil, err
	}
	return &entity.LearningChatResult{Type: "chat", Reply: reply}, nil
}

func (uc *UseCase) StartMaterialQuestions(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	material string,
	materialType string,
) (*entity.LearningChatResult, error) {
	session.TopicScope = effectiveTopicScope(module, session)
	material = strings.TrimSpace(material)
	if material == "" && session.ListeningState != nil {
		material = strings.TrimSpace(session.ListeningState.Paragraph)
	}
	if material == "" {
		return &entity.LearningChatResult{
			Type:  "material_required",
			Reply: "Please provide the listening or reading material before starting questions.",
		}, nil
	}
	materialType = strings.ToLower(strings.TrimSpace(materialType))
	if materialType == "" && session.ListeningState != nil {
		materialType = session.ListeningState.MaterialType
	}
	if materialType == "" {
		materialType = "listening"
	}

	session.ListeningState = &entity.LearningListeningState{
		Phase:          "asking",
		MaterialType:   materialType,
		Paragraph:      material,
		QuestionsAsked: 1,
		Answers:        []string{},
	}

	question, err := uc.ai.GenerateListeningQuestion(ctx, module, session, material, 1)
	if err != nil {
		return nil, err
	}
	return &entity.LearningChatResult{
		Type:           "listening_question",
		Reply:          question,
		QuestionNumber: 1,
	}, nil
}

func (uc *UseCase) Chat(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	userMessage string,
) (*entity.LearningChatResult, error) {
	session.TopicScope = effectiveTopicScope(module, session)
	if isOffTopic(session.TopicScope, userMessage) {
		return &entity.LearningChatResult{
			Type:  "guardrail",
			Reply: guardrailReply(session.TopicScope),
		}, nil
	}

	reply, err := uc.ai.ChatLearning(ctx, module, session, userMessage)
	if err != nil {
		return nil, err
	}
	return &entity.LearningChatResult{Type: "chat", Reply: reply}, nil
}

func effectiveTopicScope(module *entity.Module, session *entity.LearningSession) string {
	if session != nil && session.LearningPath != nil {
		for _, step := range session.LearningPath.Steps {
			if step.Order == session.CurrentStep && strings.TrimSpace(step.TopicScope) != "" {
				return step.TopicScope
			}
		}
		if strings.TrimSpace(session.LearningPath.TopicScope) != "" {
			return session.LearningPath.TopicScope
		}
	}
	if session != nil && strings.TrimSpace(session.TopicScope) != "" {
		return session.TopicScope
	}
	return module.TopicScope
}

func isOffTopic(topicScope string, userMessage string) bool {
	topicTokens := meaningfulTokens(topicScope)
	messageTokens := meaningfulTokens(userMessage)
	if len(topicTokens) == 0 || len(messageTokens) == 0 {
		return false
	}

	for _, hint := range offTopicHints {
		if messageTokens[hint] && !topicTokens[hint] {
			return true
		}
	}

	for token := range messageTokens {
		if topicTokens[token] {
			return false
		}
	}

	return false
}

func guardrailReply(topicScope string) string {
	topic := primaryTopic(topicScope)
	if topic == "" {
		topic = "this lesson"
	}
	return "Interesting topic, but for now let's focus on " + topic + ". Let's continue the lesson."
}

func primaryTopic(topicScope string) string {
	for _, part := range strings.Split(topicScope, ",") {
		part = strings.TrimSpace(part)
		if part != "" {
			return part
		}
	}
	return strings.TrimSpace(topicScope)
}

func hasActivity(module *entity.Module, activity string) bool {
	for _, candidate := range module.Activities {
		if strings.EqualFold(strings.TrimSpace(candidate), activity) {
			return true
		}
	}
	return false
}

func userMessageCount(messages []entity.Message) int {
	count := 0
	for _, message := range messages {
		if message.Role == "user" {
			count++
		}
	}
	return count
}

func meaningfulTokens(value string) map[string]bool {
	fields := strings.FieldsFunc(strings.ToLower(value), func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsNumber(r)
	})

	tokens := make(map[string]bool)
	for _, field := range fields {
		if len(field) < 3 || isStopword(field) {
			continue
		}
		tokens[field] = true
	}
	return tokens
}

func isStopword(token string) bool {
	switch token {
	case "the", "and", "for", "you", "your", "how", "what", "why", "can", "could", "would", "should", "about", "with", "from", "this", "that", "please", "teach", "tell", "explain", "learn", "learning", "saya", "aku", "kamu", "yang", "dan", "atau", "untuk", "dengan", "tentang", "tolong", "jelaskan", "belajar", "materi":
		return true
	default:
		return false
	}
}
