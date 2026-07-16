package handler_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port/mocks"
	learningusecase "github.com/dev-keuber/kaifa-be/internal/usecase/learning"
)

func useLearningTestUser(app *fiber.App) {
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0001")
		return c.Next()
	})
}

func TestLearningHandlerGeneratePath_ReturnsForbiddenForDifferentStudentClass(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo)

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0002")
		return c.Next()
	})
	app.Post("/api/learning/generate", learningHandler.GeneratePath)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01","level":"B1"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/generate", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusForbidden, resp.StatusCode)
	ai.AssertNotCalled(t, "GenerateLearningPath", mock.Anything, mock.Anything, mock.Anything, mock.Anything)
}

func TestLearningHandlerGeneratePath_UsesCompletedAssessment(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentRepo := memory.NewAssessmentResultRepository()
	sessionRepo := memory.NewLearningSessionRepository()
	pathRepo := memory.NewLearningPathRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo, assessmentRepo, sessionRepo, pathRepo)

	assessmentResult := entity.AssessmentResult{
		Level:     entity.LevelA2,
		Score:     72,
		Summary:   "Understands simple greetings but needs more grammar control.",
		Strengths: []string{"friendly responses"},
		Areas:     []string{"subject pronouns"},
	}
	require.NoError(t, assessmentRepo.Save(context.Background(), "stdnt0001", "mod-eng-vii-01", assessmentResult))
	expected := &entity.LearningPath{
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		Level:      "A1",
		TopicScope: "greetings",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{Order: 1, Activity: "speaking", Title: "Greeting practice", Description: "Practice simple greetings.", RequiredTime: 10, TopicScope: "greetings", Progress: 0},
		},
	}
	ai.On("GenerateLearningPath", mock.Anything, mock.MatchedBy(func(module *entity.Module) bool {
		return module.ID == "mod-eng-vii-01"
	}), "A1", mock.Anything).Return(expected, nil)

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/generate", learningHandler.GeneratePath)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/generate", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	session, err := sessionRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
	require.NoError(t, err)
	require.NotNil(t, session)
	assert.Equal(t, "A1", session.Level)
	savedAssessment, err := assessmentRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
	require.NoError(t, err)
	require.NotNil(t, savedAssessment)
	assert.Equal(t, entity.LevelA1, savedAssessment.Level)
	path, err := pathRepo.Get(context.Background(), "stdnt0001", session.LearningPathID)
	require.NoError(t, err)
	require.NotNil(t, path)
	assert.Equal(t, session.LearningPathID, path.ID)
	require.Len(t, path.Steps, 1)
	assert.NotEmpty(t, path.Steps[0].ID)
	assert.Equal(t, "Greeting practice", path.Steps[0].Title)
	assert.Equal(t, []string{"greeting experience", "subject pronouns", "simple present tense", "simple question"}, path.Steps[0].Target)
	ai.AssertExpectations(t)
}

func TestLearningHandlerGeneratePath_ReturnsExistingPathOnSecondCall(t *testing.T) {
	t.Setenv("env", "prod")

	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentRepo := memory.NewAssessmentResultRepository()
	sessionRepo := memory.NewLearningSessionRepository()
	pathRepo := memory.NewLearningPathRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo, assessmentRepo, sessionRepo, pathRepo)

	assessmentResult := entity.AssessmentResult{
		Level:   entity.LevelA2,
		Score:   75,
		Summary: "Ready for guided greetings practice.",
	}
	require.NoError(t, assessmentRepo.Save(context.Background(), "stdnt0001", "mod-eng-vii-01", assessmentResult))
	expected := &entity.LearningPath{
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		Level:      "A2",
		TopicScope: "greetings",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{Order: 1, Activity: "speaking", Title: "Greeting practice", Description: "Practice simple greetings.", RequiredTime: 10, TopicScope: "greetings", Progress: 0},
		},
	}
	ai.On("GenerateLearningPath", mock.Anything, mock.MatchedBy(func(module *entity.Module) bool {
		return module.ID == "mod-eng-vii-01"
	}), "A2", mock.Anything).Return(expected, nil).Once()

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/generate", learningHandler.GeneratePath)

	for i := 0; i < 2; i++ {
		body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
		req := httptest.NewRequest(fiber.MethodPost, "/api/learning/generate", body)
		req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

		resp, err := app.Test(req)
		require.NoError(t, err)
		defer resp.Body.Close()

		assert.Equal(t, fiber.StatusOK, resp.StatusCode)
		var payload struct {
			Data entity.LearningPath `json:"data"`
		}
		require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
		assert.Equal(t, "Greeting practice", payload.Data.Steps[0].Title)
		assert.NotEmpty(t, payload.Data.Steps[0].ID)
		assert.Equal(t, []string{"greeting experience", "subject pronouns", "simple present tense", "simple question"}, payload.Data.Steps[0].Target)
	}
	ai.AssertExpectations(t)
}

func TestLearningHandlerGeneratePath_RegeneratesInDevEvenWhenPathExists(t *testing.T) {
	t.Setenv("env", "dev")

	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentRepo := memory.NewAssessmentResultRepository()
	sessionRepo := memory.NewLearningSessionRepository()
	pathRepo := memory.NewLearningPathRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo, assessmentRepo, sessionRepo, pathRepo)

	assessmentResult := entity.AssessmentResult{
		Level:   entity.LevelA2,
		Score:   75,
		Summary: "Ready for guided greetings practice.",
	}
	require.NoError(t, assessmentRepo.Save(context.Background(), "stdnt0001", "mod-eng-vii-01", assessmentResult))

	expected := &entity.LearningPath{
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		Level:      "A2",
		TopicScope: "greetings",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{Order: 1, Activity: "speaking", Title: "Greeting practice", Description: "Practice simple greetings.", RequiredTime: 10, TopicScope: "greetings", Progress: 0},
		},
	}
	ai.On("GenerateLearningPath", mock.Anything, mock.MatchedBy(func(module *entity.Module) bool {
		return module.ID == "mod-eng-vii-01"
	}), "A2", mock.Anything).Return(expected, nil).Twice()

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/generate", learningHandler.GeneratePath)

	var firstID, secondID string
	for i := 0; i < 2; i++ {
		body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
		req := httptest.NewRequest(fiber.MethodPost, "/api/learning/generate", body)
		req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

		resp, err := app.Test(req)
		require.NoError(t, err)
		defer resp.Body.Close()

		assert.Equal(t, fiber.StatusOK, resp.StatusCode)
		var payload struct {
			Data entity.LearningPath `json:"data"`
		}
		require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
		assert.NotEmpty(t, payload.Data.ID)
		savedAssessment, err := assessmentRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
		require.NoError(t, err)
		require.NotNil(t, savedAssessment)
		assert.Equal(t, entity.LevelA2, savedAssessment.Level)
		if i == 0 {
			firstID = payload.Data.ID
		} else {
			secondID = payload.Data.ID
		}
	}

	assert.NotEqual(t, firstID, secondID)
	ai.AssertExpectations(t)
}

func TestLearningHandlerStartChat_RequiresLearningPathStepID(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	learningHandler := handler.NewLearningHandler(uc, nil, nil)

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/start-chat", learningHandler.StartChat)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01","level":"A1"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/start-chat", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
	ai.AssertNotCalled(t, "StartLearningChat", mock.Anything, mock.Anything, mock.Anything)
}

func TestLearningHandlerStartChat_UsesLearningPathStepIDWhenMultiplePathsExist(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	sessionRepo := memory.NewLearningSessionRepository()
	pathRepo := memory.NewLearningPathRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo, sessionRepo, pathRepo)

	require.NoError(t, pathRepo.Save(context.Background(), "stdnt0001", entity.LearningPath{
		ID:         "lp-intro",
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		Level:      "A1",
		TopicScope: "introducing yourself",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{ID: "lp-intro-step-1", Order: 1, Activity: "speaking", Title: "Intro", Description: "Introduce yourself.", RequiredTime: 10, TopicScope: "introducing yourself", Progress: 0},
		},
	}))
	require.NoError(t, sessionRepo.Save(context.Background(), "stdnt0001", entity.LearningSession{
		LearningPathID: "lp-intro",
		Language:       "english",
		ModuleID:       "mod-eng-vii-01",
		Level:          "A1",
		CurrentStep:    1,
	}))
	require.NoError(t, pathRepo.Save(context.Background(), "stdnt0001", entity.LearningPath{
		ID:         "lp-family",
		Language:   "english",
		ModuleID:   "mod-eng-vii-02",
		Level:      "A1",
		TopicScope: "family members",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{ID: "lp-family-step-1", Order: 1, Activity: "speaking", Title: "Family", Description: "Talk about family.", RequiredTime: 10, TopicScope: "family members", Progress: 0},
		},
	}))
	require.NoError(t, sessionRepo.Save(context.Background(), "stdnt0001", entity.LearningSession{
		LearningPathID: "lp-family",
		Language:       "english",
		ModuleID:       "mod-eng-vii-02",
		Level:          "A1",
		CurrentStep:    1,
	}))

	ai.On("StartLearningChat", mock.Anything, mock.MatchedBy(func(module *entity.Module) bool {
		return module.ID == "mod-eng-vii-02"
	}), mock.MatchedBy(func(session *entity.LearningSession) bool {
		return session.LearningPathID == "lp-family" && session.TopicScope == "family members"
	})).Return("Assalamualaikum, let's talk about family.", nil)

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/start-chat", learningHandler.StartChat)

	body := bytes.NewBufferString(`{"learning_path_step_id":"lp-family-step-1"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/start-chat", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	ai.AssertExpectations(t)
}

func TestLearningHandlerStartChat_ResetsExistingListeningState(t *testing.T) {
	ai := new(mocks.AIService)
	uc := learningusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	sessionRepo := memory.NewLearningSessionRepository()
	pathRepo := memory.NewLearningPathRepository()
	learningHandler := handler.NewLearningHandler(uc, nil, nil, userRepo, syllabusRepo, sessionRepo, pathRepo)

	require.NoError(t, pathRepo.Save(context.Background(), "stdnt0001", entity.LearningPath{
		ID:         "lp-greetings",
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		Level:      "A1",
		TopicScope: "greetings",
		TotalSteps: 1,
		Steps: []entity.LearningStep{
			{
				Order:        1,
				ID:           "lp-greetings-step-1",
				Activity:     "speaking",
				Title:        "Practice greetings",
				Description:  "Use greetings in a short conversation.",
				RequiredTime: 10,
				TopicScope:   "greetings",
				Progress:     0,
			},
		},
	}))
	require.NoError(t, sessionRepo.Save(context.Background(), "stdnt0001", entity.LearningSession{
		Language:       "english",
		LearningPathID: "lp-greetings",
		ModuleID:       "mod-eng-vii-01",
		Level:          "A1",
		TopicScope:     "greetings",
		CurrentStep:    1,
		Messages: []entity.Message{
			{Role: "user", Content: "one"},
			{Role: "user", Content: "two"},
			{Role: "user", Content: "three"},
			{Role: "user", Content: "four"},
			{Role: "user", Content: "five"},
		},
		ListeningState: &entity.LearningListeningState{
			Phase:          "asking",
			MaterialType:   "listening",
			Paragraph:      "Old paragraph",
			QuestionsAsked: 3,
			Answers:        []string{"a", "b"},
		},
	}))

	ai.On("StartLearningChat", mock.Anything, mock.MatchedBy(func(module *entity.Module) bool {
		return module.ID == "mod-eng-vii-01"
	}), mock.MatchedBy(func(session *entity.LearningSession) bool {
		return len(session.Messages) == 0 && session.ListeningState == nil
	})).Return("Assalamualaikum, let's begin.", nil)

	app := fiber.New()
	useLearningTestUser(app)
	app.Post("/api/learning/start-chat", learningHandler.StartChat)

	body := bytes.NewBufferString(`{"learning_path_step_id":"lp-greetings-step-1"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/start-chat", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	var payload struct {
		Data struct {
			Type string `json:"type"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.Equal(t, "chat", payload.Data.Type)

	session, err := sessionRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
	require.NoError(t, err)
	require.NotNil(t, session)
	assert.Nil(t, session.ListeningState)
	require.Len(t, session.Messages, 1)
	assert.Equal(t, "assistant", session.Messages[0].Role)
	ai.AssertExpectations(t)
}
