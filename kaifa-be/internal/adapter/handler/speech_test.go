package handler_test

import (
	"bytes"
	"context"
	"io"
	"net/http/httptest"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/adapter/handler"
	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	authinfra "github.com/dev-keuber/kaifa-be/internal/infrastructure/auth"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

type fakeTTSService struct {
	text    string
	voiceID string
	audio   []byte
}

func (s *fakeTTSService) Synthesize(ctx context.Context, text string) (io.ReadCloser, error) {
	s.text = text
	s.voiceID, _ = port.TTSVoiceIDFromContext(ctx)
	return io.NopCloser(bytes.NewReader(s.audio)), nil
}

func (s *fakeTTSService) SynthesizeStream(ctx context.Context, _ string) (<-chan []byte, error) {
	s.voiceID, _ = port.TTSVoiceIDFromContext(ctx)
	ch := make(chan []byte)
	close(ch)
	return ch, nil
}

type fakeSTTService struct {
	audio       []byte
	contentType string
	transcript  string
	language    string
}

func (s *fakeSTTService) Transcribe(ctx context.Context, audio []byte, contentType string) (string, error) {
	s.audio = append([]byte(nil), audio...)
	s.contentType = contentType
	s.language, _ = port.STTLanguageFromContext(ctx)
	return s.transcript, nil
}

func (s *fakeSTTService) TranscribeStream(ctx context.Context, audioIn <-chan []byte) (<-chan string, error) {
	s.language, _ = port.STTLanguageFromContext(ctx)
	transcriptCh := make(chan string, 1)
	go func() {
		defer close(transcriptCh)
		for chunk := range audioIn {
			s.audio = append(s.audio, chunk...)
		}
		if s.transcript != "" {
			transcriptCh <- s.transcript
		}
	}()
	return transcriptCh, nil
}

func TestAssessmentSpeech_ReturnsGeneratedAudioFromJSONUserText(t *testing.T) {
	tts := &fakeTTSService{audio: []byte("mp3-bytes")}
	assessmentHandler := handler.NewAssessmentHandler(nil, nil, tts)

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0001")
		return c.Next()
	})
	app.Post("/api/assessment/speech/tts", assessmentHandler.Speech)

	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/speech/tts", bytes.NewBufferString(`{"user_text":"  hello world  "}`))
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	assert.Equal(t, "audio/mpeg", resp.Header.Get(fiber.HeaderContentType))
	assert.Equal(t, "hello world", tts.text)
	assert.Equal(t, "JBFqnCBsd6RMkjVDRZzb", tts.voiceID)
	assert.Equal(t, []byte("mp3-bytes"), body)
}

func TestAssessmentSpeech_UsesFemaleVoiceForFemaleUser(t *testing.T) {
	tts := &fakeTTSService{audio: []byte("mp3-bytes")}
	assessmentHandler := handler.NewAssessmentHandler(nil, nil, tts)

	app := fiber.New()
	app.Use(func(c *fiber.Ctx) error {
		c.Locals(middleware.UserIDLocal, "stdnt0004")
		return c.Next()
	})
	app.Post("/api/assessment/speech/tts", assessmentHandler.Speech)

	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/speech/tts", bytes.NewBufferString(`{"user_text":"hello"}`))
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	assert.Equal(t, "21m00Tcm4TlvDq8ikWAM", tts.voiceID)
}

func TestLearningSpeech_ReturnsBadRequestForBlankText(t *testing.T) {
	learningHandler := handler.NewLearningHandler(nil, nil, &fakeTTSService{})

	app := fiber.New()
	app.Post("/api/learning/speech/tts", learningHandler.Speech)

	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/speech/tts", bytes.NewBufferString(`{"user_text":"   "}`))
	req.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}

func TestLearningSpeechToText_ReturnsTranscriptFromRawAudio(t *testing.T) {
	stt := &fakeSTTService{transcript: "hello there"}
	learningHandler := handler.NewLearningHandler(nil, stt, nil)

	app := fiber.New()
	app.Post("/api/learning/speech/stt", learningHandler.SpeechToText)

	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/speech/stt", bytes.NewBufferString("audio-bytes"))
	req.Header.Set(fiber.HeaderContentType, "audio/webm")

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	require.NoError(t, err)

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	assert.Equal(t, []byte("audio-bytes"), stt.audio)
	assert.Equal(t, "audio/webm", stt.contentType)
	assert.Contains(t, string(body), `"text":"hello there"`)
}

func TestLearningSpeechToText_UsesModuleLanguage(t *testing.T) {
	stt := &fakeSTTService{transcript: "مرحبا"}
	learningHandler := handler.NewLearningHandler(nil, stt, nil)

	app := fiber.New()
	app.Post("/api/learning/speech/stt", learningHandler.SpeechToText)

	req := httptest.NewRequest(fiber.MethodPost, "/api/learning/speech/stt?module_id=mod-arab-vii-01", bytes.NewBufferString("audio-bytes"))
	req.Header.Set(fiber.HeaderContentType, "audio/webm")

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusOK, resp.StatusCode)
	assert.Equal(t, "arabic", stt.language)
}

func TestAssessmentSpeechToText_ReturnsBadRequestForMissingAudio(t *testing.T) {
	assessmentHandler := handler.NewAssessmentHandler(nil, &fakeSTTService{}, nil)

	app := fiber.New()
	app.Post("/api/assessment/speech/stt", assessmentHandler.SpeechToText)

	req := httptest.NewRequest(fiber.MethodPost, "/api/assessment/speech/stt", nil)

	resp, err := app.Test(req)
	require.NoError(t, err)
	defer resp.Body.Close()

	assert.Equal(t, fiber.StatusBadRequest, resp.StatusCode)
}

func TestSpeechRoutesRequireJWT(t *testing.T) {
	tokens, err := authinfra.NewTokenService("test-jwt-secret")
	require.NoError(t, err)
	tokenPair, err := tokens.IssueTokenPair(entity.User{ID: "stdnt0001"})
	require.NoError(t, err)

	tts := &fakeTTSService{audio: []byte("mp3-bytes")}
	assessmentHandler := handler.NewAssessmentHandler(nil, nil, tts)

	app := fiber.New()
	assessment := app.Group("/api/assessment")
	assessment.Use(middleware.RequireAuth(tokens))
	assessment.Post("/speech/tts", assessmentHandler.Speech)

	unauthorizedReq := httptest.NewRequest(fiber.MethodPost, "/api/assessment/speech/tts", bytes.NewBufferString(`{"user_text":"hello"}`))
	unauthorizedReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	unauthorizedResp, err := app.Test(unauthorizedReq)
	require.NoError(t, err)
	defer unauthorizedResp.Body.Close()
	assert.Equal(t, fiber.StatusUnauthorized, unauthorizedResp.StatusCode)

	authorizedReq := httptest.NewRequest(fiber.MethodPost, "/api/assessment/speech/tts", bytes.NewBufferString(`{"user_text":"hello"}`))
	authorizedReq.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
	authorizedReq.Header.Set(fiber.HeaderAuthorization, "Bearer "+tokenPair.AccessToken)
	authorizedResp, err := app.Test(authorizedReq)
	require.NoError(t, err)
	defer authorizedResp.Body.Close()
	assert.Equal(t, fiber.StatusOK, authorizedResp.StatusCode)
}
