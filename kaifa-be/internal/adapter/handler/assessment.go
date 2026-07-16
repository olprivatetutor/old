package handler

import (
	"context"
	"encoding/json"
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	assessmentusecase "github.com/dev-keuber/kaifa-be/internal/usecase/assessment"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type AssessmentHandler struct {
	uc       *assessmentusecase.UseCase
	stt      port.STTService
	tts      port.TTSService
	users    port.UserRepository
	syllabi  port.SyllabusRepository
	sessions port.AssessmentSessionRepository
	results  port.AssessmentResultRepository
}

func NewAssessmentHandler(uc *assessmentusecase.UseCase, stt port.STTService, tts port.TTSService, repositories ...any) *AssessmentHandler {
	users := port.UserRepository(memory.NewUserRepository())
	syllabi := port.SyllabusRepository(memory.NewSyllabusRepository())
	sessions := port.AssessmentSessionRepository(memory.NewAssessmentSessionRepository())
	results := port.AssessmentResultRepository(memory.NewAssessmentResultRepository())
	for _, repository := range repositories {
		switch r := repository.(type) {
		case port.UserRepository:
			if r != nil {
				users = r
			}
		case port.SyllabusRepository:
			if r != nil {
				syllabi = r
			}
		case port.AssessmentSessionRepository:
			if r != nil {
				sessions = r
			}
		case port.AssessmentResultRepository:
			if r != nil {
				results = r
			}
		}
	}
	return &AssessmentHandler{
		uc:       uc,
		stt:      stt,
		tts:      tts,
		users:    users,
		syllabi:  syllabi,
		sessions: sessions,
		results:  results,
	}
}

// --- Start Assessment ---

type startAssessmentRequest struct {
	ModuleID string `json:"module_id"`
}

func (h *AssessmentHandler) Start(c *fiber.Ctx) error {
	userID, ok := assessmentUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}

	var req startAssessmentRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	module, err := h.syllabi.GetModuleByID(c.Context(), req.ModuleID)
	if err != nil {
		logger.Error("assessment module repository error", "err", err)
		return response.InternalError(c, "failed to get module")
	}
	if module == nil {
		return response.NotFound(c, "module not found")
	}
	access, err := canAccessModule(c.Context(), h.users, h.syllabi, userID, module)
	if err != nil {
		logger.Error("assessment access check error", "err", err)
		return response.InternalError(c, "failed to check syllabus access")
	}
	if access == accessNotFound {
		return response.NotFound(c, "user or syllabus not found")
	}
	if access == accessDenied {
		return response.Forbidden(c, "student class does not match syllabus class")
	}

	user, err := h.users.GetByID(c.Context(), userID)
	if err != nil {
		logger.Error("assessment user repository error", "err", err)
		return response.InternalError(c, "failed to get user")
	}
	if user == nil {
		return response.NotFound(c, "user not found")
	}

	if err := h.sessions.Delete(c.Context(), userID, module.ID); err != nil {
		logger.Error("assessment session delete error", "err", err)
		return response.InternalError(c, "failed to clear previous assessment session")
	}
	if err := h.results.Delete(c.Context(), userID, module.ID); err != nil {
		logger.Error("assessment result delete error", "err", err)
		return response.InternalError(c, "failed to clear previous assessment result")
	}

	session := &entity.AssessmentSession{
		Language:   module.Language,
		ModuleID:   module.ID,
		TopicScope: module.TopicScope,
		Class:      user.Class,
		Messages:   []entity.Message{},
	}

	reply, err := h.uc.Start(c.Context(), session)
	if err != nil {
		logger.Error("assessment start error", "err", err)
		return response.InternalError(c, "failed to start assessment")
	}

	session.Messages = append(session.Messages, entity.Message{Role: "assistant", Content: reply})
	if err := h.sessions.Save(c.Context(), userID, *session); err != nil {
		logger.Error("assessment session save error", "err", err)
		return response.InternalError(c, "failed to save assessment session")
	}

	return response.OK(c, chatResponse{Reply: reply})
}

// --- Text Chat ---

type chatRequest struct {
	ModuleID string `json:"module_id"`
	UserText string `json:"user_text"`
}

type chatResponse struct {
	Reply  string                   `json:"reply,omitempty"`
	Result *entity.AssessmentResult `json:"result,omitempty"`
}

func (h *AssessmentHandler) Chat(c *fiber.Ctx) error {
	userID, ok := assessmentUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}

	var req chatRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}
	req.UserText = strings.TrimSpace(req.UserText)
	if req.UserText == "" {
		return response.BadRequest(c, "user_text is required")
	}

	module, err := h.syllabi.GetModuleByID(c.Context(), req.ModuleID)
	if err != nil {
		logger.Error("assessment module repository error", "err", err)
		return response.InternalError(c, "failed to get module")
	}
	if module == nil {
		return response.NotFound(c, "module not found")
	}
	access, err := canAccessModule(c.Context(), h.users, h.syllabi, userID, module)
	if err != nil {
		logger.Error("assessment access check error", "err", err)
		return response.InternalError(c, "failed to check syllabus access")
	}
	if access == accessNotFound {
		return response.NotFound(c, "user or syllabus not found")
	}
	if access == accessDenied {
		return response.Forbidden(c, "student class does not match syllabus class")
	}

	session, err := h.sessions.Get(c.Context(), userID, module.ID)
	if err != nil {
		logger.Error("assessment session get error", "err", err)
		return response.InternalError(c, "failed to get assessment session")
	}
	if session == nil {
		return response.BadRequest(c, "assessment session not started")
	}
	user, err := h.users.GetByID(c.Context(), userID)
	if err != nil {
		logger.Error("assessment user repository error", "err", err)
		return response.InternalError(c, "failed to get user")
	}
	if user == nil {
		return response.NotFound(c, "user not found")
	}
	session.Class = user.Class
	if session.Completed {
		return response.OK(c, chatResponse{Result: session.Result})
	}

	reply, result, err := h.uc.Chat(c.Context(), session, req.UserText)
	if err != nil {
		logger.Error("assessment chat error", "err", err)
		return response.InternalError(c, "failed to process message")
	}

	session.Messages = append(session.Messages, entity.Message{Role: "user", Content: req.UserText})
	if result != nil {
		session.Result = result
		session.Completed = true
		if err := h.results.Save(c.Context(), userID, module.ID, *result); err != nil {
			logger.Error("assessment result save error", "err", err)
			return response.InternalError(c, "failed to save assessment result")
		}
	} else if strings.TrimSpace(reply) != "" {
		session.Messages = append(session.Messages, entity.Message{Role: "assistant", Content: reply})
	}
	if err := h.sessions.Save(c.Context(), userID, *session); err != nil {
		logger.Error("assessment session save error", "err", err)
		return response.InternalError(c, "failed to save assessment session")
	}

	return response.OK(c, chatResponse{Reply: reply, Result: result})
}

func (h *AssessmentHandler) Speech(c *fiber.Ctx) error {
	return synthesizeSpeech(c, h.tts, h.users)
}

func (h *AssessmentHandler) SpeechToText(c *fiber.Ctx) error {
	return transcribeSpeech(c, h.stt, h.syllabi)
}

func assessmentUserID(c *fiber.Ctx) (string, bool) {
	userID, ok := c.Locals(middleware.UserIDLocal).(string)
	userID = strings.TrimSpace(userID)
	return userID, ok && userID != ""
}

// --- Voice WebSocket ---
// Protocol (server → client JSON messages):
//   {"type":"transcript","text":"..."}         — STT result
//   {"type":"reply","text":"..."}              — AI text reply
//   {"type":"result","data":{...}}             — assessment complete
//   {"type":"error","message":"..."}           — error
// Protocol (server → client binary):           — TTS audio chunks (MP3)
// Protocol (client → server binary):           — raw audio chunks from browser

type wsMessage struct {
	Type    string                   `json:"type"`
	Text    string                   `json:"text,omitempty"`
	Message string                   `json:"message,omitempty"`
	Data    *entity.AssessmentResult `json:"data,omitempty"`
}

func (h *AssessmentHandler) VoiceWS(c *websocket.Conn) {
	userID, ok := c.Locals(middleware.UserIDLocal).(string)
	userID = strings.TrimSpace(userID)
	if !ok || userID == "" {
		sendWSJSON(c, wsMessage{Type: "error", Message: "missing authenticated user"})
		return
	}

	moduleID := c.Query("module_id")
	module, err := h.syllabi.GetModuleByID(context.Background(), moduleID)
	if err != nil {
		logger.Error("assessment module repository error", "err", err)
		sendWSJSON(c, wsMessage{Type: "error", Message: "failed to get module"})
		return
	}
	if module == nil {
		sendWSJSON(c, wsMessage{Type: "error", Message: "module not found"})
		return
	}
	access, err := canAccessModule(context.Background(), h.users, h.syllabi, userID, module)
	if err != nil {
		logger.Error("assessment access check error", "err", err)
		sendWSJSON(c, wsMessage{Type: "error", Message: "failed to check syllabus access"})
		return
	}
	if access == accessNotFound {
		sendWSJSON(c, wsMessage{Type: "error", Message: "user or syllabus not found"})
		return
	}
	if access == accessDenied {
		sendWSJSON(c, wsMessage{Type: "error", Message: "student class does not match syllabus class"})
		return
	}

	user, err := h.users.GetByID(context.Background(), userID)
	if err != nil {
		logger.Error("assessment user repository error", "err", err)
		sendWSJSON(c, wsMessage{Type: "error", Message: "failed to get user"})
		return
	}
	if user == nil {
		sendWSJSON(c, wsMessage{Type: "error", Message: "user not found"})
		return
	}

	session := &entity.AssessmentSession{
		Language:   module.Language,
		ModuleID:   module.ID,
		TopicScope: module.TopicScope,
		Class:      user.Class,
		Messages:   []entity.Message{},
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if voiceID := ttsVoiceIDForUser(user); voiceID != "" {
		ctx = port.WithTTSVoiceID(ctx, voiceID)
	}
	ctx = port.WithSTTLanguage(ctx, module.Language)

	startReply, err := h.uc.Start(ctx, session)
	if err != nil {
		sendWSJSON(c, wsMessage{Type: "error", Message: "failed to start assessment"})
		return
	}
	session.Messages = append(session.Messages, entity.Message{Role: "assistant", Content: startReply})
	sendWSJSON(c, wsMessage{Type: "reply", Text: startReply})

	audioChan, err := h.tts.SynthesizeStream(ctx, startReply)
	if err != nil {
		logger.Error("TTS error", "err", err)
	} else {
		for chunk := range audioChan {
			if writeErr := c.WriteMessage(websocket.BinaryMessage, chunk); writeErr != nil {
				return
			}
		}
	}

	audioCh := make(chan []byte, 32)
	defer close(audioCh)

	transcriptCh, err := h.stt.TranscribeStream(ctx, audioCh)
	if err != nil {
		sendWSJSON(c, wsMessage{Type: "error", Message: "failed to start STT"})
		return
	}

	// Read browser audio in background and forward to STT
	go func() {
		for {
			msgType, data, err := c.ReadMessage()
			if err != nil {
				cancel()
				return
			}
			if msgType == websocket.BinaryMessage {
				audioCh <- data
			}
		}
	}()

	// Process transcripts → AI → TTS → send back
	for transcript := range transcriptCh {
		sendWSJSON(c, wsMessage{Type: "transcript", Text: transcript})

		reply, result, err := h.uc.Chat(ctx, session, transcript)
		if err != nil {
			sendWSJSON(c, wsMessage{Type: "error", Message: "AI error"})
			continue
		}

		// Append to session history
		session.Messages = append(session.Messages,
			entity.Message{Role: "user", Content: transcript},
			entity.Message{Role: "assistant", Content: reply},
		)

		sendWSJSON(c, wsMessage{Type: "reply", Text: reply})

		if result != nil {
			session.Result = result
			session.Completed = true
			if err := h.results.Save(ctx, userID, module.ID, *result); err != nil {
				logger.Error("assessment result save error", "err", err)
				sendWSJSON(c, wsMessage{Type: "error", Message: "failed to save assessment result"})
				continue
			}
			if err := h.sessions.Save(ctx, userID, *session); err != nil {
				logger.Error("assessment session save error", "err", err)
				sendWSJSON(c, wsMessage{Type: "error", Message: "failed to save assessment session"})
				continue
			}
			sendWSJSON(c, wsMessage{Type: "result", Data: result})
		}

		// Stream TTS audio back to browser
		audioChan, err := h.tts.SynthesizeStream(ctx, reply)
		if err != nil {
			logger.Error("TTS error", "err", err)
			continue
		}
		for chunk := range audioChan {
			if writeErr := c.WriteMessage(websocket.BinaryMessage, chunk); writeErr != nil {
				return
			}
		}
	}
}

func sendWSJSON(c *websocket.Conn, msg wsMessage) {
	data, _ := json.Marshal(msg)
	_ = c.WriteMessage(websocket.TextMessage, data)
}
