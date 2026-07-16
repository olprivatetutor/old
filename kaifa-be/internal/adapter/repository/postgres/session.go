package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	textutil "github.com/dev-keuber/kaifa-be/internal/infrastructure/text"
)

type AssessmentSessionRepository struct {
	db *sql.DB
}

func NewAssessmentSessionRepository(db *sql.DB) *AssessmentSessionRepository {
	return &AssessmentSessionRepository{db: db}
}

func (r *AssessmentSessionRepository) Save(ctx context.Context, userID string, session entity.AssessmentSession) error {
	messages, err := json.Marshal(session.Messages)
	if err != nil {
		return err
	}
	result, err := json.Marshal(session.Result)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO assessment_sessions (user_id, language, class, module_id, topic_scope, messages, result, completed)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (user_id, language) DO UPDATE SET
			class = EXCLUDED.class,
			module_id = EXCLUDED.module_id,
			topic_scope = EXCLUDED.topic_scope,
			messages = EXCLUDED.messages,
			result = EXCLUDED.result,
			completed = EXCLUDED.completed,
			updated_at = now()
	`, userID, session.Language, session.Class, session.ModuleID, session.TopicScope, messages, result, session.Completed)
	return err
}

func (r *AssessmentSessionRepository) Get(ctx context.Context, userID string, moduleID string) (*entity.AssessmentSession, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT language, class, module_id, topic_scope, messages, result, completed
		FROM assessment_sessions
		WHERE user_id = $1 AND module_id = $2
	`, userID, moduleID)

	var session entity.AssessmentSession
	var messages []byte
	var result []byte
	err := row.Scan(&session.Language, &session.Class, &session.ModuleID, &session.TopicScope, &messages, &result, &session.Completed)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if err := json.Unmarshal(messages, &session.Messages); err != nil {
		return nil, err
	}
	if len(result) > 0 && string(result) != "null" {
		var assessmentResult entity.AssessmentResult
		if err := json.Unmarshal(result, &assessmentResult); err != nil {
			return nil, err
		}
		session.Result = &assessmentResult
	}
	return &session, nil
}

func (r *AssessmentSessionRepository) Delete(ctx context.Context, userID string, moduleID string) error {
	_, err := r.db.ExecContext(ctx, `
		DELETE FROM assessment_sessions
		WHERE user_id = $1 AND module_id = $2
	`, userID, moduleID)
	return err
}

type AssessmentResultRepository struct {
	db *sql.DB
}

func NewAssessmentResultRepository(db *sql.DB) *AssessmentResultRepository {
	return &AssessmentResultRepository{db: db}
}

func (r *AssessmentResultRepository) Save(ctx context.Context, userID string, moduleID string, result entity.AssessmentResult) error {
	strengths, err := json.Marshal(result.Strengths)
	if err != nil {
		return err
	}
	areas, err := json.Marshal(result.Areas)
	if err != nil {
		return err
	}
	translations, err := json.Marshal(result.Translations)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO assessment_results (user_id, module_id, cefr_level, level, score, title, summary, strengths, areas, translations)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (user_id, module_id) DO UPDATE SET
			cefr_level = EXCLUDED.cefr_level,
			level = EXCLUDED.level,
			score = EXCLUDED.score,
			title = EXCLUDED.title,
			summary = EXCLUDED.summary,
			strengths = EXCLUDED.strengths,
			areas = EXCLUDED.areas,
			translations = EXCLUDED.translations,
			updated_at = now()
	`, userID, moduleID, string(result.CefrLevel), string(result.Level), result.Score, result.Title, result.Summary, strengths, areas, translations)
	return err
}

func (r *AssessmentResultRepository) Get(ctx context.Context, userID string, moduleID string) (*entity.AssessmentResult, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT cefr_level, level, score, title, summary, strengths, areas, translations
		FROM assessment_results
		WHERE user_id = $1 AND module_id = $2
	`, userID, moduleID)

	var result entity.AssessmentResult
	var cefrLevel string
	var level string
	var title string
	var strengths []byte
	var areas []byte
	var translations []byte
	err := row.Scan(&cefrLevel, &level, &result.Score, &title, &result.Summary, &strengths, &areas, &translations)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	result.CefrLevel = entity.AssessmentLevel(cefrLevel)
	result.Level = entity.RelativeAssessmentLevel(result.Score)
	result.Title = title
	if err := json.Unmarshal(strengths, &result.Strengths); err != nil {
		return nil, err
	}
	if err := json.Unmarshal(areas, &result.Areas); err != nil {
		return nil, err
	}
	if len(translations) > 0 && string(translations) != "null" {
		if err := json.Unmarshal(translations, &result.Translations); err != nil {
			return nil, err
		}
	}
	for i := range result.Translations {
		result.Translations[i].Strengths = append([]string(nil), result.Translations[i].Strengths...)
		result.Translations[i].Areas = append([]string(nil), result.Translations[i].Areas...)
		if strings.TrimSpace(result.Translations[i].Language) == "" {
			result.Translations[i].Language = "bahasa indonesia"
		}
	}
	return &result, nil
}

func (r *AssessmentResultRepository) Delete(ctx context.Context, userID string, moduleID string) error {
	_, err := r.db.ExecContext(ctx, `
		DELETE FROM assessment_results
		WHERE user_id = $1 AND module_id = $2
	`, userID, moduleID)
	return err
}

type LearningSessionRepository struct {
	db *sql.DB
}

func NewLearningSessionRepository(db *sql.DB) *LearningSessionRepository {
	return &LearningSessionRepository{db: db}
}

func (r *LearningSessionRepository) Save(ctx context.Context, userID string, session entity.LearningSession) error {
	session = ensureLearningSessionPathID(session)
	messages, err := json.Marshal(session.Messages)
	if err != nil {
		return err
	}
	listeningState, err := json.Marshal(session.ListeningState)
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, `
		INSERT INTO learning_sessions (user_id, path_id, language, module_id, level, topic_scope, current_step, listening_state, messages)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (user_id, path_id) DO UPDATE SET
			language = EXCLUDED.language,
			module_id = EXCLUDED.module_id,
			level = EXCLUDED.level,
			topic_scope = EXCLUDED.topic_scope,
			current_step = EXCLUDED.current_step,
			listening_state = EXCLUDED.listening_state,
			messages = EXCLUDED.messages,
			updated_at = now()
	`, userID, session.LearningPathID, session.Language, session.ModuleID, session.Level, session.TopicScope, session.CurrentStep, listeningState, messages)
	return err
}

func (r *LearningSessionRepository) Get(ctx context.Context, userID string, moduleID string) (*entity.LearningSession, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT path_id, language, module_id, level, topic_scope, current_step, listening_state, messages
		FROM learning_sessions
		WHERE user_id = $1 AND module_id = $2
		ORDER BY updated_at DESC
		LIMIT 1
	`, userID, moduleID)

	return scanLearningSession(row)
}

func (r *LearningSessionRepository) GetByPathID(ctx context.Context, userID string, pathID string) (*entity.LearningSession, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT path_id, language, module_id, level, topic_scope, current_step, listening_state, messages
		FROM learning_sessions
		WHERE user_id = $1 AND path_id = $2
	`, userID, pathID)

	return scanLearningSession(row)
}

func scanLearningSession(row *sql.Row) (*entity.LearningSession, error) {
	var session entity.LearningSession
	var listeningState []byte
	var messages []byte
	err := row.Scan(&session.LearningPathID, &session.Language, &session.ModuleID, &session.Level, &session.TopicScope, &session.CurrentStep, &listeningState, &messages)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	if len(listeningState) > 0 && string(listeningState) != "null" {
		var state entity.LearningListeningState
		if err := json.Unmarshal(listeningState, &state); err != nil {
			return nil, err
		}
		session.ListeningState = &state
	}
	if err := json.Unmarshal(messages, &session.Messages); err != nil {
		return nil, err
	}

	return &session, nil
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

type LearningPathRepository struct {
	db                  *sql.DB
	romanizationEnabled bool
}

func NewLearningPathRepository(db *sql.DB, romanizationEnabled bool) *LearningPathRepository {
	return &LearningPathRepository{db: db, romanizationEnabled: romanizationEnabled}
}

func (r *LearningPathRepository) Save(ctx context.Context, userID string, path entity.LearningPath) error {
	if r.romanizationEnabled {
		normalizeLearningPathRomanized(&path)
	} else {
		stripLearningPathRomanized(&path)
	}

	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err = tx.ExecContext(ctx, `
		INSERT INTO learning_paths (id, user_id, language, module_id, level, topic_scope, topic_scope_romanized, total_steps)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (id) DO UPDATE SET
			language = EXCLUDED.language,
			module_id = EXCLUDED.module_id,
			level = EXCLUDED.level,
			topic_scope = EXCLUDED.topic_scope,
			topic_scope_romanized = EXCLUDED.topic_scope_romanized,
			total_steps = EXCLUDED.total_steps,
			updated_at = now()
	`, path.ID, userID, path.Language, path.ModuleID, path.Level, path.TopicScope, path.TopicScopeRomanized, path.TotalSteps); err != nil {
		return err
	}
	if _, err = tx.ExecContext(ctx, `DELETE FROM learning_paths_translation WHERE learning_path_id = $1`, path.ID); err != nil {
		return err
	}
	if err := r.saveLearningPathTranslations(ctx, tx, path); err != nil {
		return err
	}

	if _, err = tx.ExecContext(ctx, `DELETE FROM learning_path_steps WHERE path_id = $1`, path.ID); err != nil {
		return err
	}
	for _, step := range path.Steps {
		target, err := json.Marshal(step.Target)
		if err != nil {
			return err
		}
		if _, err = tx.ExecContext(ctx, `
			INSERT INTO learning_path_steps (id, path_id, step_order, activity, activity_romanized, title, title_romanized, description, description_romanized, required_time, topic_scope, topic_scope_romanized, target, progress)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		`, step.ID, path.ID, step.Order, step.Activity, step.ActivityRomanized, step.Title, step.TitleRomanized, step.Description, step.DescriptionRomanized, step.RequiredTime, step.TopicScope, step.TopicScopeRomanized, target, step.Progress); err != nil {
			return err
		}
		if err := r.saveLearningStepTranslations(ctx, tx, step); err != nil {
			return err
		}
	}
	if err = tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *LearningPathRepository) Get(ctx context.Context, userID string, pathID string) (*entity.LearningPath, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, language, module_id, level, topic_scope, topic_scope_romanized, total_steps
		FROM learning_paths
		WHERE user_id = $1 AND id = $2
	`, userID, pathID)
	return r.scanLearningPath(ctx, row)
}

func (r *LearningPathRepository) GetByModuleID(ctx context.Context, userID string, moduleID string) (*entity.LearningPath, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, language, module_id, level, topic_scope, topic_scope_romanized, total_steps
		FROM learning_paths
		WHERE user_id = $1 AND module_id = $2
		ORDER BY updated_at DESC
		LIMIT 1
	`, userID, moduleID)
	return r.scanLearningPath(ctx, row)
}

func (r *LearningPathRepository) GetByStepID(ctx context.Context, userID string, stepID string) (*entity.LearningPath, *entity.LearningStep, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT lp.id, lp.language, lp.module_id, lp.level, lp.topic_scope, lp.topic_scope_romanized, lp.total_steps,
			lps.id, lps.step_order, lps.activity, lps.activity_romanized, lps.title, lps.title_romanized, lps.description, lps.description_romanized, lps.required_time, lps.topic_scope, lps.topic_scope_romanized, lps.target, lps.progress
		FROM learning_path_steps lps
		JOIN learning_paths lp ON lp.id = lps.path_id
		WHERE lp.user_id = $1 AND lps.id = $2
	`, userID, stepID)

	var path entity.LearningPath
	var step entity.LearningStep
	var target []byte
	err := row.Scan(
		&path.ID, &path.Language, &path.ModuleID, &path.Level, &path.TopicScope, &path.TopicScopeRomanized, &path.TotalSteps,
		&step.ID, &step.Order, &step.Activity, &step.ActivityRomanized, &step.Title, &step.TitleRomanized, &step.Description, &step.DescriptionRomanized, &step.RequiredTime, &step.TopicScope, &step.TopicScopeRomanized, &target, &step.Progress,
	)
	if err == sql.ErrNoRows {
		return nil, nil, nil
	}
	if err != nil {
		return nil, nil, err
	}
	if err := json.Unmarshal(target, &step.Target); err != nil {
		return nil, nil, err
	}
	step.Translations, err = r.loadLearningStepTranslations(ctx, step.ID)
	if err != nil {
		return nil, nil, err
	}
	if !r.romanizationEnabled {
		stripLearningPathRomanized(&path)
		stripLearningStepRomanized(&step)
	}
	loadedPath, err := r.Get(ctx, userID, path.ID)
	if err != nil {
		return nil, nil, err
	}
	if loadedPath != nil {
		path = *loadedPath
	}
	return &path, &step, nil
}

func (r *LearningPathRepository) scanLearningPath(ctx context.Context, row *sql.Row) (*entity.LearningPath, error) {
	var path entity.LearningPath
	err := row.Scan(&path.ID, &path.Language, &path.ModuleID, &path.Level, &path.TopicScope, &path.TopicScopeRomanized, &path.TotalSteps)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, step_order, activity, activity_romanized, title, title_romanized, description, description_romanized, required_time, topic_scope, topic_scope_romanized, target, progress
		FROM learning_path_steps
		WHERE path_id = $1
		ORDER BY step_order
	`, path.ID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var step entity.LearningStep
		var target []byte
		if err := rows.Scan(&step.ID, &step.Order, &step.Activity, &step.ActivityRomanized, &step.Title, &step.TitleRomanized, &step.Description, &step.DescriptionRomanized, &step.RequiredTime, &step.TopicScope, &step.TopicScopeRomanized, &target, &step.Progress); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(target, &step.Target); err != nil {
			return nil, err
		}
		translations, err := r.loadLearningStepTranslations(ctx, step.ID)
		if err != nil {
			return nil, err
		}
		step.Translations = translations
		path.Steps = append(path.Steps, step)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	translations, err := r.loadLearningPathTranslations(ctx, path.ID)
	if err != nil {
		return nil, err
	}
	path.Translations = translations
	if r.romanizationEnabled {
		normalizeLearningPathRomanized(&path)
	} else {
		stripLearningPathRomanized(&path)
	}
	return &path, nil
}

func (r *LearningPathRepository) loadLearningPathTranslations(ctx context.Context, pathID string) ([]entity.LearningPathTranslation, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, learning_path_id, language, topic_scope
		FROM learning_paths_translation
		WHERE learning_path_id = $1
		ORDER BY language, id
	`, pathID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var translations []entity.LearningPathTranslation
	for rows.Next() {
		var translation entity.LearningPathTranslation
		if err := rows.Scan(&translation.ID, &translation.LearningPathID, &translation.Language, &translation.TopicScope); err != nil {
			return nil, err
		}
		translations = append(translations, translation)
	}
	return translations, rows.Err()
}

func (r *LearningPathRepository) loadLearningStepTranslations(ctx context.Context, stepID string) ([]entity.LearningStepTranslation, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, learning_path_step_id, language, activity, title, description, topic_scope
		FROM learning_path_steps_translation
		WHERE learning_path_step_id = $1
		ORDER BY language, id
	`, stepID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var translations []entity.LearningStepTranslation
	for rows.Next() {
		var translation entity.LearningStepTranslation
		if err := rows.Scan(&translation.ID, &translation.LearningPathStepID, &translation.Language, &translation.Activity, &translation.Title, &translation.Description, &translation.TopicScope); err != nil {
			return nil, err
		}
		translations = append(translations, translation)
	}
	return translations, rows.Err()
}

func (r *LearningPathRepository) saveLearningPathTranslations(ctx context.Context, tx *sql.Tx, path entity.LearningPath) error {
	if len(path.Translations) == 0 {
		return nil
	}
	for _, translation := range path.Translations {
		translation = normalizeLearningPathTranslation(translation, path.ID)
		if strings.TrimSpace(translation.Language) == "" {
			continue
		}
		if _, err := tx.ExecContext(ctx, `
			INSERT INTO learning_paths_translation (id, learning_path_id, language, topic_scope)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (learning_path_id, language) DO UPDATE SET
				topic_scope = EXCLUDED.topic_scope
		`, translation.ID, translation.LearningPathID, translation.Language, translation.TopicScope); err != nil {
			return err
		}
	}
	return nil
}

func (r *LearningPathRepository) saveLearningStepTranslations(ctx context.Context, tx *sql.Tx, step entity.LearningStep) error {
	if len(step.Translations) == 0 {
		return nil
	}
	for _, translation := range step.Translations {
		translation = normalizeLearningStepTranslation(translation, step.ID)
		if strings.TrimSpace(translation.Language) == "" {
			continue
		}
		if _, err := tx.ExecContext(ctx, `
			INSERT INTO learning_path_steps_translation (id, learning_path_step_id, language, activity, title, description, topic_scope)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			ON CONFLICT (learning_path_step_id, language) DO UPDATE SET
				activity = EXCLUDED.activity,
				title = EXCLUDED.title,
				description = EXCLUDED.description,
				topic_scope = EXCLUDED.topic_scope
		`, translation.ID, translation.LearningPathStepID, translation.Language, translation.Activity, translation.Title, translation.Description, translation.TopicScope); err != nil {
			return err
		}
	}
	return nil
}

func normalizeLearningPathTranslation(translation entity.LearningPathTranslation, defaultPathID string) entity.LearningPathTranslation {
	translation.LearningPathID = strings.TrimSpace(translation.LearningPathID)
	if translation.LearningPathID == "" {
		translation.LearningPathID = defaultPathID
	}
	translation.Language = strings.TrimSpace(translation.Language)
	translation.TopicScope = strings.TrimSpace(translation.TopicScope)
	translation.ID = translationRowID(translation.LearningPathID, translation.Language)
	return translation
}

func normalizeLearningStepTranslation(translation entity.LearningStepTranslation, defaultStepID string) entity.LearningStepTranslation {
	translation.LearningPathStepID = strings.TrimSpace(translation.LearningPathStepID)
	if translation.LearningPathStepID == "" {
		translation.LearningPathStepID = defaultStepID
	}
	translation.Language = strings.TrimSpace(translation.Language)
	translation.Activity = strings.TrimSpace(translation.Activity)
	translation.Title = strings.TrimSpace(translation.Title)
	translation.Description = strings.TrimSpace(translation.Description)
	translation.TopicScope = strings.TrimSpace(translation.TopicScope)
	translation.ID = translationRowID(translation.LearningPathStepID, translation.Language)
	return translation
}

func translationRowID(parentID string, language string) string {
	lang := strings.NewReplacer(" ", "-", "/", "-", "_", "-").Replace(strings.ToLower(strings.TrimSpace(language)))
	return strings.TrimSpace(parentID) + "-" + lang
}

func normalizeLearningPathRomanized(path *entity.LearningPath) {
	if path == nil || !strings.EqualFold(strings.TrimSpace(path.Language), "arabic") {
		return
	}
	if strings.TrimSpace(path.TopicScopeRomanized) == "" {
		path.TopicScopeRomanized = textutil.RomanizeArabicText(path.TopicScope)
	}
	for i := range path.Steps {
		step := &path.Steps[i]
		if strings.TrimSpace(step.ActivityRomanized) == "" {
			step.ActivityRomanized = textutil.RomanizeArabicText(step.Activity)
		}
		if strings.TrimSpace(step.TitleRomanized) == "" {
			step.TitleRomanized = textutil.RomanizeArabicText(step.Title)
		}
		if strings.TrimSpace(step.DescriptionRomanized) == "" {
			step.DescriptionRomanized = textutil.RomanizeArabicText(step.Description)
		}
		if strings.TrimSpace(step.TopicScopeRomanized) == "" {
			step.TopicScopeRomanized = textutil.RomanizeArabicText(step.TopicScope)
		}
	}
}

func stripLearningPathRomanized(path *entity.LearningPath) {
	if path == nil {
		return
	}
	path.TopicScopeRomanized = ""
	for i := range path.Steps {
		stripLearningStepRomanized(&path.Steps[i])
	}
}

func stripLearningStepRomanized(step *entity.LearningStep) {
	if step == nil {
		return
	}
	step.ActivityRomanized = ""
	step.TitleRomanized = ""
	step.DescriptionRomanized = ""
	step.TopicScopeRomanized = ""
}
