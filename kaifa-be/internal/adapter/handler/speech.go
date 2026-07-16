package handler

import (
	"context"
	"fmt"
	"io"
	"strings"
	"time"

	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/fiber/v2"
)

type speechRequest struct {
	UserText string `json:"user_text"`
}

type transcriptResponse struct {
	Text string `json:"text"`
}

const (
	femaleElevenLabsVoiceID = "21m00Tcm4TlvDq8ikWAM"
	maleElevenLabsVoiceID   = "JBFqnCBsd6RMkjVDRZzb"
)

func synthesizeSpeech(c *fiber.Ctx, tts port.TTSService, users port.UserRepository) error {
	if tts == nil {
		return response.InternalError(c, "speech service is not configured")
	}
	if users == nil {
		return response.InternalError(c, "user repository is not configured")
	}

	var req speechRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	req.UserText = strings.TrimSpace(req.UserText)
	if req.UserText == "" {
		return response.BadRequest(c, "user_text is required")
	}

	ctx, ok, err := ttsContextForFiber(c, users)
	if err != nil {
		logger.Error("speech user lookup error", "err", err)
		return response.InternalError(c, "failed to get user")
	}
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}

	audio, err := tts.Synthesize(ctx, req.UserText)
	if err != nil {
		logger.Error("speech synthesis error", "err", err)
		return response.InternalError(c, "failed to generate speech")
	}
	defer audio.Close()

	c.Set(fiber.HeaderContentType, "audio/mpeg")
	return c.SendStream(audio)
}

func ttsContextForFiber(c *fiber.Ctx, users port.UserRepository) (context.Context, bool, error) {
	userID, ok := c.Locals(middleware.UserIDLocal).(string)
	userID = strings.TrimSpace(userID)
	if !ok || userID == "" {
		return c.Context(), false, nil
	}
	return ttsContextForUser(c.Context(), users, userID)
}

func ttsContextForUser(ctx context.Context, users port.UserRepository, userID string) (context.Context, bool, error) {
	user, err := users.GetByID(ctx, userID)
	if err != nil {
		return ctx, false, err
	}
	if user == nil {
		return ctx, false, nil
	}
	if voiceID := ttsVoiceIDForUser(user); voiceID != "" {
		ctx = port.WithTTSVoiceID(ctx, voiceID)
	}
	return ctx, true, nil
}

func ttsVoiceIDForUser(user *entity.User) string {
	switch strings.ToLower(strings.TrimSpace(user.Gender)) {
	case "female":
		return femaleElevenLabsVoiceID
	case "male":
		return maleElevenLabsVoiceID
	default:
		return ""
	}
}

func transcribeSpeech(c *fiber.Ctx, stt port.STTService, syllabi port.SyllabusRepository) error {
	if stt == nil {
		return response.InternalError(c, "transcription service is not configured")
	}

	audio, contentType, err := audioFromRequest(c)
	if err != nil {
		return response.BadRequest(c, err.Error())
	}

	ctx, cancel := context.WithTimeout(c.Context(), 30*time.Second)
	defer cancel()
	module, moduleRequested, err := moduleFromSTTRequest(ctx, c, syllabi)
	if err != nil {
		logger.Error("speech transcription module lookup error", "err", err)
		return response.InternalError(c, "failed to get module")
	}
	if moduleRequested && module == nil {
		return response.NotFound(c, "module not found")
	}
	if module != nil {
		ctx = port.WithSTTLanguage(ctx, module.Language)
	}

	logger.Info("speech transcription request", "audio_bytes", len(audio), "content_type", contentType, "module_id", moduleIDForLog(module), "language", languageForLog(module))
	text, err := stt.Transcribe(ctx, audio, contentType)
	if err != nil {
		logger.Error("speech transcription error", "err", err)
		return response.InternalError(c, "failed to transcribe speech")
	}

	text = strings.TrimSpace(text)
	logger.Info("speech transcription completed", "audio_bytes", len(audio), "content_type", contentType, "transcript_chars", len(text), "transcript", text)
	return response.OK(c, transcriptResponse{Text: text})
}

func moduleFromSTTRequest(ctx context.Context, c *fiber.Ctx, syllabi port.SyllabusRepository) (*entity.Module, bool, error) {
	moduleID := strings.TrimSpace(c.Query("module_id"))
	if moduleID == "" && strings.HasPrefix(strings.TrimSpace(c.Get(fiber.HeaderContentType)), fiber.MIMEMultipartForm) {
		moduleID = strings.TrimSpace(c.FormValue("module_id"))
	}
	if moduleID == "" {
		return nil, false, nil
	}
	if syllabi == nil {
		return nil, true, fmt.Errorf("syllabus repository is not configured")
	}
	module, err := syllabi.GetModuleByID(ctx, moduleID)
	return module, true, err
}

func moduleIDForLog(module *entity.Module) string {
	if module == nil {
		return ""
	}
	return module.ID
}

func languageForLog(module *entity.Module) string {
	if module == nil {
		return ""
	}
	return module.Language
}

func audioFromRequest(c *fiber.Ctx) ([]byte, string, error) {
	contentType := strings.TrimSpace(c.Get(fiber.HeaderContentType))
	if strings.HasPrefix(contentType, fiber.MIMEMultipartForm) {
		fileHeader, err := c.FormFile("audio")
		if err != nil {
			return nil, "", fmt.Errorf("audio is required")
		}
		file, err := fileHeader.Open()
		if err != nil {
			return nil, "", fmt.Errorf("invalid audio")
		}
		defer file.Close()

		audio, err := io.ReadAll(file)
		if err != nil {
			return nil, "", fmt.Errorf("invalid audio")
		}
		if len(audio) == 0 {
			return nil, "", fmt.Errorf("audio is required")
		}
		fileContentType := strings.TrimSpace(fileHeader.Header.Get("Content-Type"))
		if fileContentType == "" {
			fileContentType = "application/octet-stream"
		}
		return audio, fileContentType, nil
	}

	audio := c.BodyRaw()
	if len(audio) == 0 {
		return nil, "", fmt.Errorf("audio is required")
	}
	if contentType == "" {
		contentType = "application/octet-stream"
	}
	return audio, contentType, nil
}
