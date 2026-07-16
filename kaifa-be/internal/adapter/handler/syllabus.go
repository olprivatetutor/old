package handler

import (
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/adapter/middleware"
	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/dev-keuber/kaifa-be/pkg/response"
	"github.com/gofiber/fiber/v2"
)

type SyllabusHandler struct {
	syllabi port.SyllabusRepository
}

func NewSyllabusHandler(repositories ...port.SyllabusRepository) *SyllabusHandler {
	syllabi := port.SyllabusRepository(memory.NewSyllabusRepository())
	if len(repositories) > 0 && repositories[0] != nil {
		syllabi = repositories[0]
	}
	return &SyllabusHandler{syllabi: syllabi}
}

func (h *SyllabusHandler) ListSyllabi(c *fiber.Ctx) error {
	class, ok := authenticatedClass(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated class")
	}

	language := strings.ToLower(strings.TrimSpace(c.Query("language")))
	if language != "" && language != "english" && language != "arabic" {
		return response.BadRequest(c, "language must be english or arabic")
	}

	var (
		syllabi []entity.Syllabus
		err     error
	)
	if language == "" {
		syllabi, err = h.syllabi.ListSyllabi(c.Context())
	} else {
		syllabi, err = h.syllabi.ListSyllabiByLanguage(c.Context(), language)
	}
	if err != nil {
		logger.Error("list syllabi repository error", "err", err)
		return response.InternalError(c, "failed to list syllabi")
	}
	syllabi = filterSyllabiByClass(syllabi, class)
	return response.OK(c, syllabi)
}

func authenticatedClass(c *fiber.Ctx) (string, bool) {
	class, _ := c.Locals(middleware.ClassLocal).(string)
	class = strings.TrimSpace(class)
	return class, class != ""
}

func filterSyllabiByClass(syllabi []entity.Syllabus, class string) []entity.Syllabus {
	class = strings.TrimSpace(class)
	if class == "" {
		return []entity.Syllabus{}
	}

	filtered := make([]entity.Syllabus, 0, len(syllabi))
	for _, syllabus := range syllabi {
		if strings.EqualFold(strings.TrimSpace(syllabus.Class), class) {
			filtered = append(filtered, syllabus)
		}
	}
	return filtered
}

func (h *SyllabusHandler) GetSyllabus(c *fiber.Ctx) error {
	id := c.Params("id")
	s, err := h.syllabi.GetSyllabusByID(c.Context(), id)
	if err != nil {
		logger.Error("get syllabus repository error", "err", err)
		return response.InternalError(c, "failed to get syllabus")
	}
	if s == nil {
		return response.NotFound(c, "syllabus not found")
	}
	class, ok := authenticatedClass(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated class")
	}
	if !strings.EqualFold(strings.TrimSpace(s.Class), class) {
		return response.NotFound(c, "syllabus not found")
	}
	return response.OK(c, s)
}

func (h *SyllabusHandler) ListModules(c *fiber.Ctx) error {
	syllabusID := c.Params("id")
	syllabus, err := h.syllabi.GetSyllabusByID(c.Context(), syllabusID)
	if err != nil {
		logger.Error("get syllabus repository error", "err", err)
		return response.InternalError(c, "failed to get syllabus")
	}
	if syllabus == nil {
		return response.NotFound(c, "syllabus not found")
	}
	class, ok := authenticatedClass(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated class")
	}
	if !strings.EqualFold(strings.TrimSpace(syllabus.Class), class) {
		return response.NotFound(c, "syllabus not found")
	}
	modules := syllabus.Modules
	return response.OK(c, modules)
}

func (h *SyllabusHandler) GetModule(c *fiber.Ctx) error {
	syllabusID := c.Params("id")
	moduleID := c.Params("moduleId")
	syllabus, err := h.syllabi.GetSyllabusByID(c.Context(), syllabusID)
	if err != nil {
		logger.Error("get syllabus repository error", "err", err)
		return response.InternalError(c, "failed to get syllabus")
	}
	if syllabus == nil {
		return response.NotFound(c, "syllabus not found")
	}
	class, ok := authenticatedClass(c)
	if !ok {
		return response.Unauthorized(c, "missing authenticated class")
	}
	if !strings.EqualFold(strings.TrimSpace(syllabus.Class), class) {
		return response.NotFound(c, "syllabus not found")
	}

	for _, module := range syllabus.Modules {
		if module.ID == moduleID {
			return response.OK(c, module)
		}
	}
	return response.NotFound(c, "module not found")
}
