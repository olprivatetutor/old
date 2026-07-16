package assessment_test

import (
	"context"
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port/mocks"
	assessmentusecase "github.com/dev-keuber/kaifa-be/internal/usecase/assessment"
)

func newSession() *entity.AssessmentSession {
	return &entity.AssessmentSession{
		ModuleID:   "mod-001",
		TopicScope: "greetings, self-introduction",
		Messages:   []entity.Message{},
	}
}

func TestStart_ReturnsFirstQuestion(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	session := newSession()

	ai.On("StartAssessment", mock.Anything, session).
		Return("Hi! What is your name, and how do you usually greet new people?", nil)

	reply, err := uc.Start(context.Background(), session)

	assert.NoError(t, err)
	assert.Contains(t, reply, "greet")
	ai.AssertExpectations(t)
}

func TestChat_ReturnsReply(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	session := newSession()

	ai.On("ChatAssessment", mock.Anything, session, "Hello!").
		Return("Hi there! Nice to meet you.", (*entity.AssessmentResult)(nil), nil)

	reply, result, err := uc.Chat(context.Background(), session, "Hello!")

	assert.NoError(t, err)
	assert.Equal(t, "Hi there! Nice to meet you.", reply)
	assert.Nil(t, result)
	ai.AssertExpectations(t)
}

func TestChat_ReturnsAssessmentResultWhenComplete(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	session := newSession()

	expected := &entity.AssessmentResult{
		Level:     entity.LevelB1,
		Score:     68,
		Summary:   "Good overall proficiency.",
		Strengths: []string{"Vocabulary range"},
		Areas:     []string{"Tense usage"},
	}

	ai.On("ChatAssessment", mock.Anything, session, "I have been learning for two years.").
		Return("Great! I now have a good picture of your level.", expected, nil)

	reply, result, err := uc.Chat(context.Background(), session, "I have been learning for two years.")

	assert.NoError(t, err)
	assert.Empty(t, reply)
	assert.NotNil(t, result)
	assert.Equal(t, entity.LevelB1, result.Level)
	assert.Equal(t, 68, result.Score)
	ai.AssertExpectations(t)
}

func TestChat_PropagatesAIError(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	session := newSession()

	ai.On("ChatAssessment", mock.Anything, session, "Hi").
		Return("", (*entity.AssessmentResult)(nil), errors.New("openai: rate limit"))

	_, _, err := uc.Chat(context.Background(), session, "Hi")

	assert.Error(t, err)
	assert.Contains(t, err.Error(), "rate limit")
	ai.AssertExpectations(t)
}

func TestChat_AllLevels(t *testing.T) {
	levels := []entity.AssessmentLevel{
		entity.LevelA1,
		entity.LevelA2,
		entity.LevelB1,
		entity.LevelB2,
		entity.LevelC1,
		entity.LevelC2,
	}
	for _, level := range levels {
		t.Run(string(level), func(t *testing.T) {
			ai := new(mocks.AIService)
			uc := assessmentusecase.New(ai)
			session := newSession()

			result := &entity.AssessmentResult{Level: level, Score: 50}
			ai.On("ChatAssessment", mock.Anything, session, "test").
				Return("reply", result, nil)

			_, got, err := uc.Chat(context.Background(), session, "test")

			assert.NoError(t, err)
			assert.Equal(t, level, got.Level)
		})
	}
}
