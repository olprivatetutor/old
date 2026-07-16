package handler

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	learningusecase "github.com/dev-keuber/kaifa-be/internal/usecase/learning"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
)

type LearningHandler struct {
	uc          *learningusecase.UseCase
	stt         port.STTService
	tts         port.TTSService
	users       port.UserRepository
	syllabi     port.SyllabusRepository
	assessments port.AssessmentResultRepository
	sessions    port.LearningSessionRepository
	paths       port.LearningPathRepository
}

func NewLearningHandler(uc *learningusecase.UseCase, stt port.STTService, tts port.TTSService, repositories ...any) *LearningHandler {
	users := port.UserRepository(memory.NewUserRepository())
	syllabi := port.SyllabusRepository(memory.NewSyllabusRepository())
	assessments := port.AssessmentResultRepository(memory.NewAssessmentResultRepository())
	sessions := port.LearningSessionRepository(memory.NewLearningSessionRepository())
	paths := port.LearningPathRepository(memory.NewLearningPathRepository())
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
		case port.AssessmentResultRepository:
			if r != nil {
				assessments = r
			}
		case port.LearningSessionRepository:
			if r != nil {
				sessions = r
			}
		case port.LearningPathRepository:
			if r != nil {
				paths = r
			}
		}
	}
	return &LearningHandler{uc: uc, stt: stt, tts: tts, users: users, syllabi: syllabi, assessments: assessments, sessions: sessions, paths: paths}
}

// --- Generate Learning Path ---

type generateRequest struct {
	ModuleID string `json:"module_id"`
}

func (h *LearningHandler) GeneratePath(c *fiber.Ctx) error {
	var req generateRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	module, err := h.syllabi.GetModuleByID(c.Context(), req.ModuleID)
	if err != nil {
		logger.Error("learning module repository error", "err", err)
		return response.InternalError(c, "failed to get module")
	}
	if module == nil {
		return response.NotFound(c, "module not found")
	}
	userID, ok := learningUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}
	access, err := canAccessModule(c.Context(), h.users, h.syllabi, userID, module)
	if err != nil {
		logger.Error("learning access check error", "err", err)
		return response.InternalError(c, "failed to check syllabus access")
	}
	if access == accessNotFound {
		return response.NotFound(c, "user or syllabus not found")
	}
	if access == accessDenied {
		return response.Forbidden(c, "student class does not match syllabus class")
	}

	existingPath, err := h.paths.GetByModuleID(c.Context(), userID, module.ID)
	if err != nil {
		logger.Error("learning path repository error", "err", err)
		return response.InternalError(c, "failed to get learning path")
	}
	if shouldReuseExistingLearningPath() && existingPath != nil && existingPath.TotalSteps > 0 {
		if err := h.ensureLearningSessionForPath(c.Context(), userID, *existingPath); err != nil {
			logger.Error("learning session save error", "err", err)
			return response.InternalError(c, "failed to save learning session")
		}
		return response.OK(c, existingPath)
	}

	assessment, err := h.assessments.Get(c.Context(), userID, module.ID)
	if err != nil {
		logger.Error("assessment result repository error", "err", err)
		return response.InternalError(c, "failed to get assessment result")
	}
	if assessment == nil {
		return response.BadRequest(c, "complete assessment before generating learning path")
	}

	level := string(assessment.Level)
	if level == "" {
		return response.BadRequest(c, "assessment level is required")
	}

	path, err := h.uc.GeneratePath(c.Context(), module, level, assessment)
	if err != nil {
		logger.Error("generate learning path error", "err", err)
		return response.InternalError(c, "failed to generate learning path")
	}
	path.ID = newLearningPathID()
	assignLearningStepIDs(path)
	assignLearningPathTranslationIDs(path)
	assignLearningStepTargets(path, module.GrammarFocus)
	if err := h.paths.Save(c.Context(), userID, *path); err != nil {
		logger.Error("learning path save error", "err", err)
		return response.InternalError(c, "failed to save learning path")
	}

	session := entity.LearningSession{
		LearningPathID: path.ID,
		Language:       module.Language,
		ModuleID:       module.ID,
		Level:          level,
		TopicScope:     module.TopicScope,
		CurrentStep:    1,
		Messages:       []entity.Message{},
	}
	if err := h.sessions.Save(c.Context(), userID, session); err != nil {
		logger.Error("learning session save error", "err", err)
		return response.InternalError(c, "failed to save learning session")
	}

	return response.OK(c, path)
}

func shouldReuseExistingLearningPath() bool {
	env := strings.ToLower(strings.TrimSpace(os.Getenv("env")))
	if env == "" {
		env = "dev"
	}
	return env == "prod"
}

func (h *LearningHandler) ensureLearningSessionForPath(ctx context.Context, userID string, path entity.LearningPath) error {
	session, err := h.sessions.GetByPathID(ctx, userID, path.ID)
	if err != nil {
		return err
	}
	if session != nil {
		return nil
	}
	return h.sessions.Save(ctx, userID, entity.LearningSession{
		LearningPathID: path.ID,
		Language:       path.Language,
		ModuleID:       path.ModuleID,
		Level:          path.Level,
		TopicScope:     path.TopicScope,
		CurrentStep:    1,
		Messages:       []entity.Message{},
	})
}

func assignLearningStepIDs(path *entity.LearningPath) {
	for i := range path.Steps {
		if strings.TrimSpace(path.Steps[i].ID) == "" {
			path.Steps[i].ID = learningPathStepID(path.ID, path.Steps[i].Order)
		}
	}
}

func assignLearningPathTranslationIDs(path *entity.LearningPath) {
	if path == nil {
		return
	}
	for i := range path.Translations {
		if strings.TrimSpace(path.Translations[i].ID) == "" {
			path.Translations[i].ID = fmt.Sprintf("%s-%s", path.ID, strings.ReplaceAll(strings.ToLower(strings.TrimSpace(path.Translations[i].Language)), " ", "-"))
		}
		if strings.TrimSpace(path.Translations[i].LearningPathID) == "" {
			path.Translations[i].LearningPathID = path.ID
		}
	}
	for i := range path.Steps {
		for j := range path.Steps[i].Translations {
			if strings.TrimSpace(path.Steps[i].Translations[j].ID) == "" {
				path.Steps[i].Translations[j].ID = fmt.Sprintf("%s-%s", path.Steps[i].ID, strings.ReplaceAll(strings.ToLower(strings.TrimSpace(path.Steps[i].Translations[j].Language)), " ", "-"))
			}
			if strings.TrimSpace(path.Steps[i].Translations[j].LearningPathStepID) == "" {
				path.Steps[i].Translations[j].LearningPathStepID = path.Steps[i].ID
			}
		}
	}
}

func assignLearningStepTargets(path *entity.LearningPath, targets []string) {
	cleanTargets := make([]string, 0, len(targets))
	for _, target := range targets {
		target = strings.TrimSpace(target)
		if target != "" {
			cleanTargets = append(cleanTargets, target)
		}
	}
	for i := range path.Steps {
		path.Steps[i].Target = append([]string(nil), cleanTargets...)
	}
}

func learningPathStepID(pathID string, order int) string {
	return fmt.Sprintf("%s-step-%d", pathID, order)
}

func newLearningPathID() string {
	var b [8]byte
	if _, err := rand.Read(b[:]); err != nil {
		return "lp-" + strings.NewReplacer(":", "-", " ", "-").Replace(fmt.Sprint(randFallbackID()))
	}
	return "lp-" + hex.EncodeToString(b[:])
}

func randFallbackID() int64 {
	return time.Now().UnixNano()
}

// --- Text Chat ---

type learningChatRequest struct {
	LearningPathStepID string `json:"learning_path_step_id"`
	UserText           string `json:"user_text"`
}

type learningChatResponse struct {
	Type           string                         `json:"type"`
	Reply          string                         `json:"reply"`
	Paragraph      string                         `json:"paragraph,omitempty"`
	QuestionNumber int                            `json:"question_number,omitempty"`
	Assessment     *entity.ListeningAssessment    `json:"assessment,omitempty"`
	ListeningState *entity.LearningListeningState `json:"listening_state,omitempty"`
}

type startLearningChatRequest struct {
	LearningPathStepID string `json:"learning_path_step_id"`
}

type startQuestionsRequest struct {
	LearningPathStepID string `json:"learning_path_step_id"`
	Material           string `json:"material"`
	MaterialType       string `json:"material_type"`
}

func (h *LearningHandler) StartChat(c *fiber.Ctx) error {
	var req startLearningChatRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	userID, ok := learningUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}
	module, session, errResp, err := h.learningPathStepSessionAndModule(c, userID, req.LearningPathStepID)
	if errResp != nil || err != nil {
		if err != nil {
			logger.Error("learning start chat setup error", "err", err)
		}
		return errResp(c)
	}
	normalizeLearningSession(module, session)
	session.Messages = []entity.Message{}
	session.ListeningState = nil

	result, err := h.uc.StartChat(c.Context(), module, session)
	if err != nil {
		logger.Error("learning start chat error", "err", err)
		return response.InternalError(c, "failed to start learning chat")
	}

	session.Messages = append(session.Messages, entity.Message{Role: "assistant", Content: result.Reply})
	if err := h.sessions.Save(c.Context(), userID, *session); err != nil {
		logger.Error("learning session save error", "err", err)
		return response.InternalError(c, "failed to save learning session")
	}

	return response.OK(c, learningChatResponse{
		Type:           result.Type,
		Reply:          result.Reply,
		ListeningState: session.ListeningState,
	})
}

func (h *LearningHandler) StartQuestions(c *fiber.Ctx) error {
	var req startQuestionsRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	userID, ok := learningUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}
	module, session, errResp, err := h.learningPathStepSessionAndModule(c, userID, req.LearningPathStepID)
	if errResp != nil || err != nil {
		if err != nil {
			logger.Error("learning start questions setup error", "err", err)
		}
		return errResp(c)
	}
	normalizeLearningSession(module, session)

	result, err := h.uc.StartMaterialQuestions(c.Context(), module, session, req.Material, req.MaterialType)
	if err != nil {
		logger.Error("learning start questions error", "err", err)
		return response.InternalError(c, "failed to start questions")
	}

	session.Messages = append(session.Messages, entity.Message{Role: "assistant", Content: result.Reply})
	if err := h.sessions.Save(c.Context(), userID, *session); err != nil {
		logger.Error("learning session save error", "err", err)
		return response.InternalError(c, "failed to save learning session")
	}

	return response.OK(c, learningChatResponse{
		Type:           result.Type,
		Reply:          result.Reply,
		QuestionNumber: result.QuestionNumber,
		ListeningState: session.ListeningState,
	})
}

func (h *LearningHandler) Chat(c *fiber.Ctx) error {
	var req learningChatRequest
	if err := c.BodyParser(&req); err != nil {
		return response.BadRequest(c, "invalid request body")
	}

	userID, ok := learningUserID(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated user")
	}
	module, session, errResp, err := h.learningPathStepSessionAndModule(c, userID, req.LearningPathStepID)
	if errResp != nil || err != nil {
		if err != nil {
			logger.Error("learning chat setup error", "err", err)
		}
		return errResp(c)
	}
	normalizeLearningSession(module, session)

	result, err := h.uc.Chat(c.Context(), module, session, req.UserText)
	if err != nil {
		logger.Error("learning chat error", "err", err)
		return response.InternalError(c, "failed to process message")
	}

	session.Messages = append(session.Messages,
		entity.Message{Role: "user", Content: req.UserText},
		entity.Message{Role: "assistant", Content: result.Reply},
	)
	if err := h.sessions.Save(c.Context(), userID, *session); err != nil {
		logger.Error("learning session save error", "err", err)
		return response.InternalError(c, "failed to save learning session")
	}

	return response.OK(c, learningChatResponse{
		Type:           result.Type,
		Reply:          result.Reply,
		Paragraph:      result.Paragraph,
		QuestionNumber: result.QuestionNumber,
		Assessment:     result.Assessment,
		ListeningState: session.ListeningState,
	})
}

func (h *LearningHandler) learningPathStepSessionAndModule(
	c *fiber.Ctx,
	userID string,
	stepID string,
) (*entity.Module, *entity.LearningSession, learningErrorResponse, error) {
	stepID = strings.TrimSpace(stepID)
	if stepID == "" {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.BadRequest(c, "learning_path_step_id is required")
		}, nil
	}

	path, step, err := h.paths.GetByStepID(c.Context(), userID, stepID)
	if err != nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to get learning path step")
		}, err
	}
	if path == nil || step == nil || path.TotalSteps == 0 {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.NotFound(c, "learning path step not found")
		}, nil
	}

	pathID := path.ID
	session, err := h.sessions.GetByPathID(c.Context(), userID, pathID)
	if err != nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to get learning session")
		}, err
	}
	if session == nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.NotFound(c, "learning path session not found")
		}, nil
	}
	if session.LearningPathID != pathID {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.NotFound(c, "learning path session not found")
		}, nil
	}

	session.LearningPath = path
	session.ModuleID = path.ModuleID
	session.CurrentStep = step.Order

	module, err := h.syllabi.GetModuleByID(c.Context(), session.ModuleID)
	if err != nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to get module")
		}, err
	}
	if module == nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.NotFound(c, "module not found")
		}, nil
	}
	access, err := canAccessModule(c.Context(), h.users, h.syllabi, userID, module)
	if err != nil {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to check syllabus access")
		}, err
	}
	if access == accessNotFound {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.NotFound(c, "user or syllabus not found")
		}, nil
	}
	if access == accessDenied {
		return nil, nil, func(c *fiber.Ctx) error {
			return response.Forbidden(c, "student class does not match syllabus class")
		}, nil
	}
	return module, session, nil, nil
}

func normalizeLearningSession(module *entity.Module, session *entity.LearningSession) {
	session.Language = module.Language
	session.ModuleID = module.ID
	if session.CurrentStep <= 0 {
		session.CurrentStep = 1
	}
	if session.LearningPath != nil {
		if session.LearningPath.ID == "" {
			session.LearningPath.ID = session.LearningPathID
		}
		if session.LearningPath.ID != "" {
			session.LearningPathID = session.LearningPath.ID
		}
		if session.Level == "" {
			session.Level = session.LearningPath.Level
		}
	}
	session.TopicScope = effectiveLearningTopicScope(module, session)
}

func effectiveLearningTopicScope(module *entity.Module, session *entity.LearningSession) string {
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
	if module != nil {
		return module.TopicScope
	}
	return ""
}

type learningErrorResponse func(*fiber.Ctx) error

func (h *LearningHandler) learningModuleAndUser(c *fiber.Ctx, moduleID string) (*entity.Module, string, learningErrorResponse, error) {
	module, err := h.syllabi.GetModuleByID(c.Context(), moduleID)
	if err != nil {
		return nil, "", func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to get module")
		}, err
	}
	if module == nil {
		return nil, "", func(c *fiber.Ctx) error {
			return response.NotFound(c, "module not found")
		}, nil
	}
	userID, ok := learningUserID(c)
	if !ok {
		return nil, "", func(c *fiber.Ctx) error {
			return response.Unauthorized(c, "missing authenticated user")
		}, nil
	}
	access, err := canAccessModule(c.Context(), h.users, h.syllabi, userID, module)
	if err != nil {
		return nil, "", func(c *fiber.Ctx) error {
			return response.InternalError(c, "failed to check syllabus access")
		}, err
	}
	if access == accessNotFound {
		return nil, "", func(c *fiber.Ctx) error {
			return response.NotFound(c, "user or syllabus not found")
		}, nil
	}
	if access == accessDenied {
		return nil, "", func(c *fiber.Ctx) error {
			return response.Forbidden(c, "student class does not match syllabus class")
		}, nil
	}
	return module, userID, nil, nil
}

func (h *LearningHandler) Speech(c *fiber.Ctx) error {
	return synthesizeSpeech(c, h.tts, h.users)
}

func (h *LearningHandler) SpeechToText(c *fiber.Ctx) error {
	return transcribeSpeech(c, h.stt, h.syllabi)
}

func learningUserID(c *fiber.Ctx) (string, bool) {
	userID, ok := c.Locals(middleware.UserIDLocal).(string)
	userID = strings.TrimSpace(userID)
	return userID, ok && userID != ""
}

// --- Voice WebSocket ---
// Same binary/JSON protocol as assessment voice WS.

type learningWSMessage struct {
	Type    string `json:"type"`
	Text    string `json:"text,omitempty"`
	Message string `json:"message,omitempty"`
}

func (h *LearningHandler) VoiceWS(c *websocket.Conn) {
	userID, ok := c.Locals(middleware.UserIDLocal).(string)
	userID = strings.TrimSpace(userID)
	if !ok || userID == "" {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "missing authenticated user"})
		return
	}

	stepID := strings.TrimSpace(c.Query("learning_path_step_id"))
	if stepID == "" {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "learning_path_step_id is required"})
		return
	}

	path, step, err := h.paths.GetByStepID(context.Background(), userID, stepID)
	if err != nil {
		logger.Error("learning path repository error", "err", err)
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to get learning path step"})
		return
	}
	if path == nil || step == nil || path.TotalSteps == 0 {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "learning path step not found"})
		return
	}

	pathID := path.ID
	session, err := h.sessions.GetByPathID(context.Background(), userID, pathID)
	if err != nil {
		logger.Error("learning session repository error", "err", err)
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to get learning session"})
		return
	}
	if session == nil || session.LearningPathID != pathID {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "learning path session not found"})
		return
	}
	session.LearningPath = path
	session.ModuleID = path.ModuleID
	session.CurrentStep = step.Order

	module, err := h.syllabi.GetModuleByID(context.Background(), session.ModuleID)
	if err != nil {
		logger.Error("learning module repository error", "err", err)
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to get module"})
		return
	}
	if module == nil {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "module not found"})
		return
	}
	access, err := canAccessModule(context.Background(), h.users, h.syllabi, userID, module)
	if err != nil {
		logger.Error("learning access check error", "err", err)
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to check syllabus access"})
		return
	}
	if access == accessNotFound {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "user or syllabus not found"})
		return
	}
	if access == accessDenied {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "student class does not match syllabus class"})
		return
	}

	normalizeLearningSession(module, session)

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	ctx, ok, err = ttsContextForUser(ctx, h.users, userID)
	if err != nil {
		logger.Error("learning voice user lookup error", "err", err)
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to get user"})
		return
	}
	if !ok {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "user not found"})
		return
	}
	ctx = port.WithSTTLanguage(ctx, module.Language)

	audioCh := make(chan []byte, 32)
	defer close(audioCh)

	transcriptCh, err := h.stt.TranscribeStream(ctx, audioCh)
	if err != nil {
		sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "failed to start STT"})
		return
	}

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

	for transcript := range transcriptCh {
		sendLearningWSJSON(c, learningWSMessage{Type: "transcript", Text: transcript})

		result, err := h.uc.Chat(ctx, module, session, transcript)
		if err != nil {
			sendLearningWSJSON(c, learningWSMessage{Type: "error", Message: "AI error"})
			continue
		}

		session.Messages = append(session.Messages,
			entity.Message{Role: "user", Content: transcript},
			entity.Message{Role: "assistant", Content: result.Reply},
		)

		sendLearningWSJSON(c, learningWSMessage{Type: "reply", Text: result.Reply})

		audioChan, err := h.tts.SynthesizeStream(ctx, result.Reply)
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

func sendLearningWSJSON(c *websocket.Conn, msg learningWSMessage) {
	data, _ := json.Marshal(msg)
	_ = c.WriteMessage(websocket.TextMessage, data)
}
