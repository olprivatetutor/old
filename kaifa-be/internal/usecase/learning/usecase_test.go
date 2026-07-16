package learning_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port/mocks"
	learningusecase "github.com/dev-keuber/kaifa-be/internal/usecase/learning"
)

var testModule = &entity.Module{
	ID:             "mod-001",
	Title:          "Greetings & Introductions",
	TopicScope:     "greetings, self-introduction",
	GrammarFocus:   []string{"subject pronouns"},
	VocabularyLoad: 40,
}

func TestGeneratePath_ReturnsPath(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	expected := &entity.LearningPath{
		ModuleID:   "mod-001",
		Level:      "Beginner",
		TotalSteps: 4,
		Steps: []entity.LearningStep{
			{Order: 1, Activity: "vocabulary", Title: "Hello & Goodbye", Description: "Practice greeting words.", RequiredTime: 10, TopicScope: "greetings", Progress: 0},
			{Order: 2, Activity: "grammar", Title: "Introducing Yourself", Description: "Use subject pronouns.", RequiredTime: 12, TopicScope: "self-introduction", Progress: 0},
			{Order: 3, Activity: "speaking", Title: "Asking Names", Description: "Ask and answer name questions.", RequiredTime: 10, TopicScope: "greetings", Progress: 0},
			{Order: 4, Activity: "speaking", Title: "Role Play", Description: "Apply greetings in a short role play.", RequiredTime: 15, TopicScope: "self-introduction", Progress: 0},
		},
	}
	assessment := &entity.AssessmentResult{Level: entity.LevelA1, Score: 70}

	ai.On("GenerateLearningPath", mock.Anything, testModule, "Beginner", assessment).
		Return(expected, nil)

	path, err := uc.GeneratePath(context.Background(), testModule, "Beginner", assessment)

	assert.NoError(t, err)
	assert.Equal(t, 4, path.TotalSteps)
	assert.Equal(t, "Beginner", path.Level)
	assert.Len(t, path.Steps, 4)
	ai.AssertExpectations(t)
}

func TestGeneratePath_PropagatesError(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	ai.On("GenerateLearningPath", mock.Anything, testModule, "Advanced", (*entity.AssessmentResult)(nil)).
		Return((*entity.LearningPath)(nil), errors.New("openai: timeout"))

	_, err := uc.GeneratePath(context.Background(), testModule, "Advanced", nil)

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "timeout")
}

func TestChat_ReturnsReply(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	session := &entity.LearningSession{
		ModuleID:    "mod-001",
		Level:       "Beginner",
		TopicScope:  "greetings, self-introduction",
		CurrentStep: 1,
		Messages:    []entity.Message{},
	}

	ai.On("ChatLearning", mock.Anything, testModule, session, "How do I say hello?").
		Return("In English you say 'Hello' or 'Hi' for informal greetings!", nil)

	result, err := uc.Chat(context.Background(), testModule, session, "How do I say hello?")

	assert.NoError(t, err)
	assert.Equal(t, "chat", result.Type)
	assert.Contains(t, result.Reply, "Hello")
	ai.AssertExpectations(t)
}

func TestStartChat_ReturnsOpeningReply(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	session := &entity.LearningSession{
		ModuleID:   "mod-001",
		Level:      "A1",
		TopicScope: testModule.TopicScope,
	}
	ai.On("StartLearningChat", mock.Anything, testModule, session).
		Return("Hello! Let's practice greetings. What do you say in the morning?", nil)

	result, err := uc.StartChat(context.Background(), testModule, session)

	assert.NoError(t, err)
	assert.Equal(t, "chat", result.Type)
	assert.Contains(t, result.Reply, "greetings")
	ai.AssertExpectations(t)
}

func TestStartMaterialQuestions_UsesProvidedMaterial(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	session := &entity.LearningSession{
		ModuleID: "mod-001",
		Level:    "A1",
	}
	material := "Ana greets her teacher before class."
	ai.On("GenerateListeningQuestion", mock.Anything, testModule, session, material, 1).
		Return("Who does Ana greet?", nil)

	result, err := uc.StartMaterialQuestions(context.Background(), testModule, session, material, "reading")

	assert.NoError(t, err)
	assert.Equal(t, "listening_question", result.Type)
	assert.Equal(t, 1, result.QuestionNumber)
	assert.Equal(t, "reading", session.ListeningState.MaterialType)
	assert.Equal(t, material, session.ListeningState.Paragraph)
	ai.AssertExpectations(t)
}

func TestChat_ReturnsGuardrailReplyForOffTopicMessage(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	session := &entity.LearningSession{
		ModuleID:   "mod-001",
		Level:      "Beginner",
		TopicScope: "greetings, self-introduction",
		Messages:   []entity.Message{},
	}

	result, err := uc.Chat(context.Background(), testModule, session, "Teach me Python programming")

	assert.NoError(t, err)
	assert.Equal(t, "guardrail", result.Type)
	assert.Equal(t, "Interesting topic, but for now let's focus on greetings. Let's continue the lesson.", result.Reply)
	ai.AssertNotCalled(t, "ChatLearning", mock.Anything, mock.Anything, mock.Anything)
}

func TestChat_ReturnsGuardrailEvenWhenOffTopicMessageContainsTopicWord(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	session := &entity.LearningSession{
		ModuleID:   "mod-001",
		Level:      "Beginner",
		TopicScope: "greetings, self-introduction",
		Messages:   []entity.Message{},
	}

	result, err := uc.Chat(context.Background(), testModule, session, "Teach me Python for greetings")

	assert.NoError(t, err)
	assert.Equal(t, "guardrail", result.Type)
	ai.AssertNotCalled(t, "ChatLearning", mock.Anything, mock.Anything, mock.Anything)
}

func TestChat_GuardrailUsesGeneratedPathStepTopic(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	session := &entity.LearningSession{
		ModuleID:    "mod-001",
		Level:       "Beginner",
		CurrentStep: 1,
		TopicScope:  "greetings, self-introduction",
		LearningPath: &entity.LearningPath{
			ID:         "lp-001",
			ModuleID:   "mod-001",
			TopicScope: "greetings, self-introduction",
			TotalSteps: 1,
			Steps: []entity.LearningStep{
				{Order: 1, Activity: "speaking", Title: "Family", TopicScope: "family members"},
			},
		},
		Messages: []entity.Message{},
	}

	result, err := uc.Chat(context.Background(), testModule, session, "Teach me Python for greetings")

	assert.NoError(t, err)
	assert.Equal(t, "guardrail", result.Type)
	assert.Equal(t, "Interesting topic, but for now let's focus on family members. Let's continue the lesson.", result.Reply)
	ai.AssertNotCalled(t, "ChatLearning", mock.Anything, mock.Anything, mock.Anything)
}

func TestChat_PropagatesError(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)

	session := &entity.LearningSession{ModuleID: "mod-001", Messages: []entity.Message{}}
	ai.On("ChatLearning", mock.Anything, testModule, session, "Hi").
		Return("", errors.New("openai: context deadline exceeded"))

	_, err := uc.Chat(context.Background(), testModule, session, "Hi")

	assert.Error(t, err)
}

func TestChat_DoesNotRecordListeningAnswerWhenGuardrailTriggers(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	module := *testModule
	module.Activities = []string{"listening"}
	session := &entity.LearningSession{
		ModuleID: "mod-001",
		Level:    "A1",
		ListeningState: &entity.LearningListeningState{
			Phase:          "asking",
			Paragraph:      "Ana greets her teacher and friends before class.",
			QuestionsAsked: 2,
			Answers:        []string{"Ana"},
		},
	}

	result, err := uc.Chat(context.Background(), &module, session, "Teach me Python for greetings")

	assert.NoError(t, err)
	assert.Equal(t, "guardrail", result.Type)
	assert.Equal(t, []string{"Ana"}, session.ListeningState.Answers)
	ai.AssertNotCalled(t, "GenerateListeningQuestion", mock.Anything, mock.Anything, mock.Anything, mock.Anything, mock.Anything)
}

func TestChat_ReturnsChatEvenForListeningModules(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	module := *testModule
	module.Activities = []string{"listening"}
	session := &entity.LearningSession{
		ModuleID:   "mod-001",
		Level:      "A1",
		TopicScope: module.TopicScope,
		Messages: []entity.Message{
			{Role: "user", Content: "Hi"},
			{Role: "assistant", Content: "Hello"},
			{Role: "user", Content: "My name is Ana"},
			{Role: "assistant", Content: "Nice to meet you"},
			{Role: "user", Content: "I am a student"},
			{Role: "assistant", Content: "Good"},
			{Role: "user", Content: "This is my friend"},
			{Role: "assistant", Content: "Great"},
		},
	}
	ai.On("ChatLearning", mock.Anything, &module, session, "Good morning").
		Return("Let's keep practicing greetings in class.", nil)

	result, err := uc.Chat(context.Background(), &module, session, "Good morning")

	assert.NoError(t, err)
	assert.Equal(t, "chat", result.Type)
	assert.Equal(t, "Let's keep practicing greetings in class.", result.Reply)
	ai.AssertExpectations(t)
}

func TestChat_ReturnsChatEvenWhenListeningStateExists(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	module := *testModule
	module.Activities = []string{"listening"}
	session := &entity.LearningSession{
		ModuleID: "mod-001",
		Level:    "A1",
		ListeningState: &entity.LearningListeningState{
			Phase:          "asking",
			Paragraph:      "Ana greets her teacher and friends before class.",
			QuestionsAsked: 5,
			Answers:        []string{"Ana", "teacher", "friends", "before class"},
		},
	}
	ai.On("ChatLearning", mock.Anything, &module, session, "She greets them").
		Return("Sure, here is a simple practice sentence.", nil)

	result, err := uc.Chat(context.Background(), &module, session, "She greets them")

	assert.NoError(t, err)
	assert.Equal(t, "chat", result.Type)
	assert.Equal(t, "Sure, here is a simple practice sentence.", result.Reply)
	ai.AssertExpectations(t)
}
