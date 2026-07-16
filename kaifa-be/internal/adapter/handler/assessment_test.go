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
	assessmentusecase "github.com/dev-keuber/kaifa-be/internal/usecase/assessment"
)

func useAssessmentTestUser(app *fiber.App) {
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0001")
		return c.Next()
	})
}

func TestAssessmentHandlerStart_ReturnsFirstQuestion(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil, userRepo, syllabusRepo)

	app := fiber.New()
	useAssessmentTestUser(app)
	app.Post("/api/assessment/start", assessmentHandler.Start)

	ai.On("StartAssessment", mock.Anything, mock.MatchedBy(func(session *entity.AssessmentSession) bool {
		return session.ModuleID == "mod-eng-vii-01" &&
			session.Class == "VII" &&
			session.TopicScope != "" &&
			len(session.Messages) == 0
	})).Return("Hi! What is your name, and how do you greet someone new?", nil)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/start", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var payload struct {
		Success bool `json:"success"`
		Data    struct {
			Reply  string `json:"reply"`
			Result struct {
				CefrLevel string `json:"cefr_level"`
				Level     string `json:"level"`
				Score     int    `json:"score"`
			} `json:"result"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	assert.Contains(t, payload.Data.Reply, "greet")
	ai.AssertExpectations(t)
}

func TestAssessmentHandlerStart_DeletesPreviousAssessmentState(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	sessionRepo := memory.NewAssessmentSessionRepository()
	resultRepo := memory.NewAssessmentResultRepository()
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil, userRepo, syllabusRepo, sessionRepo, resultRepo)

	require.NoError(t, sessionRepo.Save(context.Background(), "stdnt0001", entity.AssessmentSession{
		Language:   "english",
		ModuleID:   "mod-eng-vii-01",
		TopicScope: "old topic",
		Class:      "VII",
		Messages: []entity.Message{
			{Role: "assistant", Content: "Old question"},
			{Role: "user", Content: "Old answer"},
		},
		Completed: true,
	}))
	require.NoError(t, resultRepo.Save(context.Background(), "stdnt0001", "mod-eng-vii-01", entity.AssessmentResult{
		Level:   entity.LevelB1,
		Score:   70,
		Summary: "Old summary",
	}))

	app := fiber.New()
	useAssessmentTestUser(app)
	app.Post("/api/assessment/start", assessmentHandler.Start)

	ai.On("StartAssessment", mock.Anything, mock.MatchedBy(func(session *entity.AssessmentSession) bool {
		return session.ModuleID == "mod-eng-vii-01" &&
			session.Class == "VII" &&
			session.TopicScope != "" &&
			len(session.Messages) == 0
	})).Return("Hi! Let's begin again.", nil)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/start", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	oldSession, err := sessionRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
	require.NoError(t, err)
	require.NotNil(t, oldSession)
	assert.False(t, oldSession.Completed)
	require.Len(t, oldSession.Messages, 1)
	assert.Equal(t, "assistant", oldSession.Messages[0].Role)
	assert.Equal(t, "Hi! Let's begin again.", oldSession.Messages[0].Content)

	oldResult, err := resultRepo.Get(context.Background(), "stdnt0001", "mod-eng-vii-01")
	require.NoError(t, err)
	assert.Nil(t, oldResult)

	ai.AssertExpectations(t)
}

func TestAssessmentHandlerStart_ReturnsNotFoundForUnknownModule(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil)

	app := fiber.New()
	useAssessmentTestUser(app)
	app.Post("/api/assessment/start", assessmentHandler.Start)

	body := bytes.NewBufferString(`{"module_id":"mod-999"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/start", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusNotFound, resp.StatusCode)
	ai.AssertNotCalled(t, "StartAssessment", mock.Anything, mock.Anything)
}

func TestAssessmentHandlerStart_ReturnsForbiddenForDifferentStudentClass(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil, userRepo, syllabusRepo)

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0002")
		return c.Next()
	})
	app.Post("/api/assessment/start", assessmentHandler.Start)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-03"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/start", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusForbidden, resp.StatusCode)
	ai.AssertNotCalled(t, "StartAssessment", mock.Anything, mock.Anything)
}

func TestAssessmentHandlerChat_UsesServerSideMessagesAndReturnsResultWithoutReply(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil, userRepo, syllabusRepo)

	app := fiber.New()
	useAssessmentTestUser(app)
	app.Post("/api/assessment/start", assessmentHandler.Start)
	app.Post("/api/assessment/chat", assessmentHandler.Chat)

	expected := &entity.AssessmentResult{
		CefrLevel: entity.LevelA2,
		Level:     entity.LevelB2,
		Score:     82,
		Summary:   "Kemampuan bahasa Inggris sudah cukup kuat.",
		Strengths: []string{"Clear answers"},
		Areas:     []string{"Minor grammar accuracy"},
		Title:     "MasyaAllah, You Are Awesome",
		Translations: []entity.AssessmentTranslation{
			{
				Language:  "bahasa indonesia",
				Title:     "Masya Allah, Kamu Hebat",
				Summary:   "Kemampuan bahasa Inggris sudah cukup kuat.",
				Strengths: []string{"Jawaban jelas"},
				Areas:     []string{"Ketepatan tata bahasa minor"},
			},
		},
	}

	ai.On("StartAssessment", mock.Anything, mock.MatchedBy(func(session *entity.AssessmentSession) bool {
		return session.ModuleID == "mod-eng-vii-01" &&
			session.Class == "VII" &&
			len(session.Messages) == 0
	})).Return("Tell me about yourself.", nil)

	ai.On("ChatAssessment", mock.Anything, mock.MatchedBy(func(session *entity.AssessmentSession) bool {
		return session.ModuleID == "mod-eng-vii-01" &&
			session.Class == "VII" &&
			len(session.Messages) == 1 &&
			session.Messages[0].Role == "assistant" &&
			session.Messages[0].Content == "Tell me about yourself."
	}), "I can explain my daily routine clearly.").
		Return("This reply should not be returned.", expected, nil)

	startBody := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01"}`)
	startReq := httptest.NewRequest(fiber.MethodPost, "/api/assessment/start", startBody)
	startReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	startResp, err := app.Test(startReq)
	require.NoError(t, err)
	defer startResp.Body.Close()
	require.Equal(t, fiber.StatusOK, startResp.StatusCode)

	body := bytes.NewBufferString(`{
		"module_id":"mod-eng-vii-01",
		"messages":[
			{"role":"user","content":"Hello"},
			{"role":"assistant","content":"Hi"},
			{"role":"user","content":"I am a student"},
			{"role":"assistant","content":"Tell me more"}
		],
		"user_text":"I can explain my daily routine clearly."
	}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/chat", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)

	var payload struct {
		Success bool `json:"success"`
		Data    struct {
			Reply  string                   `json:"reply"`
			Result *entity.AssessmentResult `json:"result"`
		} `json:"data"`
	}
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&payload))
	assert.True(t, payload.Success)
	assert.Empty(t, payload.Data.Reply)
	require.NotNil(t, payload.Data.Result)
	assert.Equal(t, entity.LevelA2, payload.Data.Result.CefrLevel)
	assert.Equal(t, entity.LevelB2, payload.Data.Result.Level)
	assert.Equal(t, 82, payload.Data.Result.Score)
	require.Len(t, payload.Data.Result.Translations, 1)
	assert.Equal(t, "bahasa indonesia", payload.Data.Result.Translations[0].Language)
	assert.Equal(t, "Masya Allah, Kamu Hebat", payload.Data.Result.Translations[0].Title)
	assert.Equal(t, "Kemampuan bahasa Inggris sudah cukup kuat.", payload.Data.Result.Translations[0].Summary)
	assert.Equal(t, []string{"Jawaban jelas"}, payload.Data.Result.Translations[0].Strengths)
	assert.Equal(t, []string{"Ketepatan tata bahasa minor"}, payload.Data.Result.Translations[0].Areas)
	ai.AssertExpectations(t)
}

func TestAssessmentHandlerChat_ReturnsBadRequestBeforeStart(t *testing.T) {
	ai := new(mocks.AIService)
	uc := assessmentusecase.New(ai)
	userRepo := memory.NewUserRepository()
	syllabusRepo := memory.NewSyllabusRepository()
	assessmentHandler := handler.NewAssessmentHandler(uc, nil, nil, userRepo, syllabusRepo)

	app := fiber.New()
	useAssessmentTestUser(app)
	app.Post("/api/assessment/chat", assessmentHandler.Chat)

	body := bytes.NewBufferString(`{"module_id":"mod-eng-vii-01","user_text":"Hello"}`)
	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/chat", body)
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
	ai.AssertNotCalled(t, "ChatAssessment", mock.Anything, mock.Anything, mock.Anything)
}
