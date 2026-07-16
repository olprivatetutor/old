package memory

import (
	"context"
	"sync"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

type assessmentSessionKey struct {
	UserID   string
	Language string
}

type AssessmentSessionRepository struct {
	mu       sync.RWMutex
	sessions map[assessmentSessionKey]entity.AssessmentSession
}

func NewAssessmentSessionRepository() *AssessmentSessionRepository {
	return &AssessmentSessionRepository{
		sessions: make(map[assessmentSessionKey]entity.AssessmentSession),
	}
}

func (r *AssessmentSessionRepository) Save(_ context.Context, userID string, session entity.AssessmentSession) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.sessions[assessmentSessionKey{UserID: userID, Language: session.Language}] = cloneAssessmentSession(session)
	return nil
}

func (r *AssessmentSessionRepository) Get(_ context.Context, userID string, moduleID string) (*entity.AssessmentSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for key, session := range r.sessions {
		if key.UserID == userID && session.ModuleID == moduleID {
			clone := cloneAssessmentSession(session)
			return &clone, nil
		}
	}
	return nil, nil
}

func (r *AssessmentSessionRepository) Delete(_ context.Context, userID string, moduleID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for key, session := range r.sessions {
		if key.UserID == userID && session.ModuleID == moduleID {
			delete(r.sessions, key)
		}
	}
	return nil
}

type assessmentResultKey struct {
	UserID   string
	ModuleID string
}

type AssessmentResultRepository struct {
	mu      sync.RWMutex
	results map[assessmentResultKey]entity.AssessmentResult
}

func NewAssessmentResultRepository() *AssessmentResultRepository {
	return &AssessmentResultRepository{
		results: make(map[assessmentResultKey]entity.AssessmentResult),
	}
}

func (r *AssessmentResultRepository) Save(_ context.Context, userID string, moduleID string, result entity.AssessmentResult) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	r.results[assessmentResultKey{UserID: userID, ModuleID: moduleID}] = cloneAssessmentResult(result)
	return nil
}

func (r *AssessmentResultRepository) Get(_ context.Context, userID string, moduleID string) (*entity.AssessmentResult, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result, ok := r.results[assessmentResultKey{UserID: userID, ModuleID: moduleID}]
	if !ok {
		return nil, nil
	}
	clone := cloneAssessmentResult(result)
	return &clone, nil
}

func (r *AssessmentResultRepository) Delete(_ context.Context, userID string, moduleID string) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	delete(r.results, assessmentResultKey{UserID: userID, ModuleID: moduleID})
	return nil
}

type learningSessionKey struct {
	UserID string
	PathID string
}

type LearningSessionRepository struct {
	mu       sync.RWMutex
	sessions map[learningSessionKey]entity.LearningSession
}

func NewLearningSessionRepository() *LearningSessionRepository {
	return &LearningSessionRepository{
		sessions: make(map[learningSessionKey]entity.LearningSession),
	}
}

func (r *LearningSessionRepository) Save(_ context.Context, userID string, session entity.LearningSession) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	session = ensureLearningSessionPathID(session)
	r.sessions[learningSessionKey{UserID: userID, PathID: session.LearningPathID}] = cloneLearningSession(session)
	return nil
}

func (r *LearningSessionRepository) Get(_ context.Context, userID string, moduleID string) (*entity.LearningSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for key, session := range r.sessions {
		if key.UserID == userID && session.ModuleID == moduleID {
			clone := cloneLearningSession(session)
			return &clone, nil
		}
	}
	return nil, nil
}

func (r *LearningSessionRepository) GetByPathID(_ context.Context, userID string, pathID string) (*entity.LearningSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	session, ok := r.sessions[learningSessionKey{UserID: userID, PathID: pathID}]
	if !ok {
		return nil, nil
	}
	clone := cloneLearningSession(session)
	return &clone, nil
}

type learningPathKey struct {
	UserID string
	PathID string
}

type LearningPathRepository struct {
	mu    sync.RWMutex
	paths map[learningPathKey]entity.LearningPath
	steps map[learningPathKey][]entity.LearningStep
}

func NewLearningPathRepository() *LearningPathRepository {
	return &LearningPathRepository{
		paths: make(map[learningPathKey]entity.LearningPath),
		steps: make(map[learningPathKey][]entity.LearningStep),
	}
}

func (r *LearningPathRepository) Save(_ context.Context, userID string, path entity.LearningPath) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	key := learningPathKey{UserID: userID, PathID: path.ID}
	pathRow := cloneLearningPath(path)
	pathRow.Steps = nil
	r.paths[key] = pathRow
	r.steps[key] = cloneLearningSteps(path.Steps)
	return nil
}

func (r *LearningPathRepository) Get(_ context.Context, userID string, pathID string) (*entity.LearningPath, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	path, ok := r.paths[learningPathKey{UserID: userID, PathID: pathID}]
	if !ok {
		return nil, nil
	}
	clone := cloneLearningPath(path)
	clone.Steps = cloneLearningSteps(r.steps[learningPathKey{UserID: userID, PathID: pathID}])
	return &clone, nil
}

func (r *LearningPathRepository) GetByModuleID(_ context.Context, userID string, moduleID string) (*entity.LearningPath, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for key, path := range r.paths {
		if key.UserID == userID && path.ModuleID == moduleID {
			clone := cloneLearningPath(path)
			clone.Steps = cloneLearningSteps(r.steps[key])
			return &clone, nil
		}
	}
	return nil, nil
}

func (r *LearningPathRepository) GetByStepID(_ context.Context, userID string, stepID string) (*entity.LearningPath, *entity.LearningStep, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for key, steps := range r.steps {
		if key.UserID != userID {
			continue
		}
		for _, step := range steps {
			if step.ID != stepID {
				continue
			}
			path, ok := r.paths[key]
			if !ok {
				return nil, nil, nil
			}
			pathClone := cloneLearningPath(path)
			pathClone.Steps = cloneLearningSteps(steps)
			stepClone := step
			return &pathClone, &stepClone, nil
		}
	}
	return nil, nil, nil
}

func ensureLearningSessionPathID(session entity.LearningSession) entity.LearningSession {
	if session.LearningPath != nil && session.LearningPath.ID != "" {
		session.LearningPathID = session.LearningPath.ID
	}
	if session.LearningPathID == "" {
		session.LearningPathID = "legacy-" + session.ModuleID
	}
	if session.LearningPath != nil && session.LearningPath.ID == "" {
		session.LearningPath.ID = session.LearningPathID
	}
	return session
}

func cloneAssessmentSession(session entity.AssessmentSession) entity.AssessmentSession {
	clone := session
	clone.Messages = append([]entity.Message(nil), session.Messages...)
	if session.Result != nil {
		result := cloneAssessmentResult(*session.Result)
		clone.Result = &result
	}
	return clone
}

func cloneAssessmentResult(result entity.AssessmentResult) entity.AssessmentResult {
	clone := result
	clone.Level = entity.RelativeAssessmentLevel(clone.Score)
	clone.Strengths = append([]string(nil), result.Strengths...)
	clone.Areas = append([]string(nil), result.Areas...)
	clone.Translations = append([]entity.AssessmentTranslation(nil), result.Translations...)
	for i := range clone.Translations {
		clone.Translations[i].Strengths = append([]string(nil), result.Translations[i].Strengths...)
		clone.Translations[i].Areas = append([]string(nil), result.Translations[i].Areas...)
	}
	return clone
}

func cloneLearningSession(session entity.LearningSession) entity.LearningSession {
	clone := session
	clone.Messages = append([]entity.Message(nil), session.Messages...)
	clone.LearningPath = nil
	if session.ListeningState != nil {
		state := *session.ListeningState
		state.Answers = append([]string(nil), session.ListeningState.Answers...)
		clone.ListeningState = &state
	}
	return clone
}

func cloneLearningPath(path entity.LearningPath) entity.LearningPath {
	clone := path
	clone.Translations = append([]entity.LearningPathTranslation(nil), path.Translations...)
	clone.Steps = append([]entity.LearningStep(nil), path.Steps...)
	for i := range clone.Steps {
		clone.Steps[i].Target = append([]string(nil), path.Steps[i].Target...)
		clone.Steps[i].Translations = append([]entity.LearningStepTranslation(nil), path.Steps[i].Translations...)
	}
	return clone
}

func cloneLearningSteps(steps []entity.LearningStep) []entity.LearningStep {
	clone := append([]entity.LearningStep(nil), steps...)
	for i := range clone {
		clone[i].Target = append([]string(nil), steps[i].Target...)
		clone[i].Translations = append([]entity.LearningStepTranslation(nil), steps[i].Translations...)
	}
	return clone
}
