package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"strings"
	"unicode"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

type SyllabusRepository struct {
	db *sql.DB
}

func NewSyllabusRepository(db *sql.DB) *SyllabusRepository {
	return &SyllabusRepository{db: db}
}

func (r *SyllabusRepository) ListSyllabi(ctx context.Context) ([]entity.Syllabus, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, language, title, description, title_romanized, description_romanized, class, array_to_json(level), icon
		FROM syllabi
		ORDER BY language, id
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var syllabi []entity.Syllabus
	for rows.Next() {
		var syllabus entity.Syllabus
		var level []byte
		if err := rows.Scan(&syllabus.ID, &syllabus.Language, &syllabus.Title, &syllabus.Description, &syllabus.TitleRomanized, &syllabus.DescriptionRomanized, &syllabus.Class, &level, &syllabus.Icon); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(level, &syllabus.Level); err != nil {
			return nil, err
		}
		translations, err := r.loadSyllabusTranslations(ctx, syllabus.ID)
		if err != nil {
			return nil, err
		}
		syllabus.Translations = translations
		syllabi = append(syllabi, syllabus)
	}
	return syllabi, rows.Err()
}

func (r *SyllabusRepository) ListSyllabiByLanguage(ctx context.Context, language string) ([]entity.Syllabus, error) {
	language = strings.ToLower(strings.TrimSpace(language))
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, language, title, description, title_romanized, description_romanized, class, array_to_json(level), icon
		FROM syllabi
		WHERE language = $1
		ORDER BY id
	`, language)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var syllabi []entity.Syllabus
	for rows.Next() {
		var syllabus entity.Syllabus
		var level []byte
		if err := rows.Scan(&syllabus.ID, &syllabus.Language, &syllabus.Title, &syllabus.Description, &syllabus.TitleRomanized, &syllabus.DescriptionRomanized, &syllabus.Class, &level, &syllabus.Icon); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(level, &syllabus.Level); err != nil {
			return nil, err
		}
		translations, err := r.loadSyllabusTranslations(ctx, syllabus.ID)
		if err != nil {
			return nil, err
		}
		syllabus.Translations = translations
		syllabi = append(syllabi, syllabus)
	}
	return syllabi, rows.Err()
}

func (r *SyllabusRepository) GetSyllabusByID(ctx context.Context, id string) (*entity.Syllabus, error) {
	syllabus, err := r.scanSyllabus(r.db.QueryRowContext(ctx, `
		SELECT id, language, title, description, title_romanized, description_romanized, class, array_to_json(level), icon
		FROM syllabi
		WHERE id = $1
	`, id))
	if err != nil || syllabus == nil {
		return syllabus, err
	}
	translations, err := r.loadSyllabusTranslations(ctx, id)
	if err != nil {
		return nil, err
	}
	syllabus.Translations = translations

	modules, err := r.ListModulesBySyllabusID(ctx, id)
	if err != nil {
		return nil, err
	}
	syllabus.Modules = modules
	return syllabus, nil
}

func (r *SyllabusRepository) ListModulesBySyllabusID(ctx context.Context, syllabusID string) ([]entity.Module, error) {
	exists, err := r.syllabusExists(ctx, syllabusID)
	if err != nil || !exists {
		return nil, err
	}

	rows, err := r.db.QueryContext(ctx, `
		SELECT id, syllabus_id, language, title, description, title_romanized, description_romanized,
			topic_scope, topic_scope_romanized, array_to_json(activities), array_to_json(activities_romanized),
			vocabulary_load, array_to_json(grammar_focus), array_to_json(grammar_focus_romanized),
			array_to_json(topic_scope_terms), estimation_duration_minutes, mastery_threshold,
			status, module_order
		FROM modules
		WHERE syllabus_id = $1
		ORDER BY module_order, id
	`, syllabusID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var modules []entity.Module
	for rows.Next() {
		module, err := scanModule(rows)
		if err != nil {
			return nil, err
		}
		translations, err := r.loadModuleTranslations(ctx, module.ID)
		if err != nil {
			return nil, err
		}
		module.Translations = translations
		modules = append(modules, module)
	}
	return modules, rows.Err()
}

func (r *SyllabusRepository) GetModuleByID(ctx context.Context, moduleID string) (*entity.Module, error) {
	row := r.db.QueryRowContext(ctx, `
		SELECT id, syllabus_id, language, title, description, title_romanized, description_romanized,
			topic_scope, topic_scope_romanized, array_to_json(activities), array_to_json(activities_romanized),
			vocabulary_load, array_to_json(grammar_focus), array_to_json(grammar_focus_romanized),
			array_to_json(topic_scope_terms), estimation_duration_minutes, mastery_threshold,
			status, module_order
		FROM modules
		WHERE id = $1
	`, moduleID)

	module, err := scanModule(row)
	if module.ID != "" && err == nil {
		translations, trErr := r.loadModuleTranslations(ctx, module.ID)
		if trErr != nil {
			return nil, trErr
		}
		module.Translations = translations
	}
	return nilIfNoRows(&module, err)
}

func (r *SyllabusRepository) SaveSyllabus(ctx context.Context, syllabus entity.Syllabus) error {
	syllabus = normalizeSyllabusMetadata(syllabus)
	syllabus.Translations = normalizeSyllabusTranslations(syllabus)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err := tx.ExecContext(ctx, `
		INSERT INTO syllabi (id, language, title, description, title_romanized, description_romanized, class, level, icon)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		ON CONFLICT (id) DO UPDATE SET
			language = EXCLUDED.language,
			title = EXCLUDED.title,
			description = EXCLUDED.description,
			title_romanized = EXCLUDED.title_romanized,
			description_romanized = EXCLUDED.description_romanized,
			class = EXCLUDED.class,
			level = EXCLUDED.level,
			icon = EXCLUDED.icon,
			updated_at = now()
	`, syllabus.ID, syllabus.Language, syllabus.Title, syllabus.Description, syllabus.TitleRomanized, syllabus.DescriptionRomanized, syllabus.Class, syllabus.Level, syllabus.Icon); err != nil {
		return err
	}
	for _, translation := range syllabus.Translations {
		translation = normalizeSyllabusTranslation(translation, syllabus.ID)
		if strings.TrimSpace(translation.Language) == "" {
			continue
		}
		if _, err := tx.ExecContext(ctx, `
			INSERT INTO syllabi_translation (id, syllabi_id, language, title, description)
			VALUES ($1, $2, $3, $4, $5)
			ON CONFLICT (syllabi_id, language) DO UPDATE SET
				title = EXCLUDED.title,
				description = EXCLUDED.description
		`, translation.ID, translation.SyllabiID, translation.Language, translation.Title, translation.Description); err != nil {
			return err
		}
	}

	for _, module := range syllabus.Modules {
		module = normalizeModuleMetadata(module)
		if _, err := tx.ExecContext(ctx, saveModuleSQL,
			module.ID, module.SyllabusID, module.Language, module.Title, module.Description,
			module.TitleRomanized, module.DescriptionRomanized, module.TopicScope, module.TopicScopeRomanized,
			module.Activities, module.ActivitiesRomanized, module.VocabularyLoad, module.GrammarFocus,
			module.GrammarFocusRomanized, module.TopicScopeTerms, module.EstimationDurationMinutes,
			module.MasteryThreshold, module.Status, module.Order,
		); err != nil {
			return err
		}
		if err := r.saveModuleTranslations(ctx, tx, module); err != nil {
			return err
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *SyllabusRepository) SaveModule(ctx context.Context, module entity.Module) error {
	module = normalizeModuleMetadata(module)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if tx != nil {
			_ = tx.Rollback()
		}
	}()

	if _, err := tx.ExecContext(ctx, saveModuleSQL,
		module.ID, module.SyllabusID, module.Language, module.Title, module.Description,
		module.TitleRomanized, module.DescriptionRomanized, module.TopicScope, module.TopicScopeRomanized,
		module.Activities, module.ActivitiesRomanized, module.VocabularyLoad, module.GrammarFocus,
		module.GrammarFocusRomanized, module.TopicScopeTerms, module.EstimationDurationMinutes,
		module.MasteryThreshold, module.Status, module.Order,
	); err != nil {
		return err
	}
	if err := r.saveModuleTranslations(ctx, tx, module); err != nil {
		return err
	}
	if err := tx.Commit(); err != nil {
		return err
	}
	tx = nil
	return nil
}

func (r *SyllabusRepository) scanSyllabus(row *sql.Row) (*entity.Syllabus, error) {
	var syllabus entity.Syllabus
	var level []byte
	err := row.Scan(&syllabus.ID, &syllabus.Language, &syllabus.Title, &syllabus.Description, &syllabus.TitleRomanized, &syllabus.DescriptionRomanized, &syllabus.Class, &level, &syllabus.Icon)
	if err != nil {
		return nilIfNoRows(&syllabus, err)
	}
	if err := json.Unmarshal(level, &syllabus.Level); err != nil {
		return nil, err
	}
	return nilIfNoRows(&syllabus, err)
}

func (r *SyllabusRepository) loadSyllabusTranslations(ctx context.Context, syllabiID string) ([]entity.SyllabusTranslation, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, syllabi_id, language, title, description
		FROM syllabi_translation
		WHERE syllabi_id = $1
		ORDER BY language, id
	`, syllabiID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var translations []entity.SyllabusTranslation
	for rows.Next() {
		var translation entity.SyllabusTranslation
		if err := rows.Scan(&translation.ID, &translation.SyllabiID, &translation.Language, &translation.Title, &translation.Description); err != nil {
			return nil, err
		}
		translations = append(translations, translation)
	}
	return translations, rows.Err()
}

func normalizeSyllabusTranslations(syllabus entity.Syllabus) []entity.SyllabusTranslation {
	translations := make([]entity.SyllabusTranslation, 0, len(syllabus.Translations))
	for _, translation := range syllabus.Translations {
		translations = append(translations, normalizeSyllabusTranslation(translation, syllabus.ID))
	}
	return translations
}

func normalizeSyllabusTranslation(translation entity.SyllabusTranslation, defaultSyllabusID string) entity.SyllabusTranslation {
	translation.SyllabiID = strings.TrimSpace(translation.SyllabiID)
	if translation.SyllabiID == "" {
		translation.SyllabiID = defaultSyllabusID
	}
	translation.Language = strings.TrimSpace(translation.Language)
	translation.Title = strings.TrimSpace(translation.Title)
	translation.Description = strings.TrimSpace(translation.Description)
	if strings.TrimSpace(translation.ID) == "" {
		lang := strings.NewReplacer(" ", "-", "/", "-", "_", "-").Replace(strings.ToLower(translation.Language))
		translation.ID = strings.TrimSpace(translation.SyllabiID) + "-" + lang
	}
	return translation
}

func (r *SyllabusRepository) syllabusExists(ctx context.Context, id string) (bool, error) {
	var exists bool
	err := r.db.QueryRowContext(ctx, `SELECT EXISTS(SELECT 1 FROM syllabi WHERE id = $1)`, id).Scan(&exists)
	return exists, err
}

func normalizeSyllabusMetadata(syllabus entity.Syllabus) entity.Syllabus {
	if !strings.EqualFold(strings.TrimSpace(syllabus.Language), "arabic") {
		return syllabus
	}
	if strings.TrimSpace(syllabus.TitleRomanized) == "" {
		syllabus.TitleRomanized = romanizeArabicText(syllabus.Title)
	}
	if strings.TrimSpace(syllabus.DescriptionRomanized) == "" {
		syllabus.DescriptionRomanized = romanizeArabicText(syllabus.Description)
	}
	return syllabus
}

func normalizeModuleMetadata(module entity.Module) entity.Module {
	if module.Activities == nil {
		module.Activities = []string{}
	}
	if module.ActivitiesRomanized == nil {
		module.ActivitiesRomanized = []string{}
	}
	if module.GrammarFocus == nil {
		module.GrammarFocus = []string{}
	}
	if module.GrammarFocusRomanized == nil {
		module.GrammarFocusRomanized = []string{}
	}
	if module.TopicScopeTerms == nil {
		module.TopicScopeTerms = []string{}
	}
	if !strings.EqualFold(strings.TrimSpace(module.Language), "arabic") {
		return module
	}
	if strings.TrimSpace(module.TitleRomanized) == "" {
		module.TitleRomanized = romanizeArabicModuleText(module.ID, module.Title)
	}
	if strings.TrimSpace(module.DescriptionRomanized) == "" {
		module.DescriptionRomanized = romanizeArabicModuleText(module.ID, module.Description)
	}
	if strings.TrimSpace(module.TopicScopeRomanized) == "" {
		module.TopicScopeRomanized = romanizeArabicModuleText(module.ID, module.TopicScope)
	}
	if len(module.ActivitiesRomanized) == 0 {
		module.ActivitiesRomanized = romanizeArabicModuleTexts(module.ID, module.Activities)
	}
	if len(module.GrammarFocusRomanized) == 0 {
		module.GrammarFocusRomanized = romanizeArabicModuleTexts(module.ID, module.GrammarFocus)
	}
	return module
}

type moduleScanner interface {
	Scan(dest ...any) error
}

func scanModule(scanner moduleScanner) (entity.Module, error) {
	var module entity.Module
	var activities, activitiesRomanized, grammarFocus, grammarFocusRomanized, topicScopeTerms []byte
	err := scanner.Scan(
		&module.ID, &module.SyllabusID, &module.Language, &module.Title, &module.Description,
		&module.TitleRomanized, &module.DescriptionRomanized, &module.TopicScope, &module.TopicScopeRomanized,
		&activities, &activitiesRomanized, &module.VocabularyLoad, &grammarFocus, &grammarFocusRomanized,
		&topicScopeTerms, &module.EstimationDurationMinutes, &module.MasteryThreshold,
		&module.Status, &module.Order,
	)
	if err != nil {
		return module, err
	}
	if err := json.Unmarshal(activities, &module.Activities); err != nil {
		return module, err
	}
	if err := json.Unmarshal(activitiesRomanized, &module.ActivitiesRomanized); err != nil {
		return module, err
	}
	if err := json.Unmarshal(grammarFocus, &module.GrammarFocus); err != nil {
		return module, err
	}
	if err := json.Unmarshal(grammarFocusRomanized, &module.GrammarFocusRomanized); err != nil {
		return module, err
	}
	if err := json.Unmarshal(topicScopeTerms, &module.TopicScopeTerms); err != nil {
		return module, err
	}
	return module, err
}

func (r *SyllabusRepository) loadModuleTranslations(ctx context.Context, moduleID string) ([]entity.ModuleTranslation, error) {
	rows, err := r.db.QueryContext(ctx, `
		SELECT id, module_id, language, title, description, topic_scope, array_to_json(activities), array_to_json(grammar_focus), array_to_json(topic_scope_terms)
		FROM modules_translation
		WHERE module_id = $1
		ORDER BY language, id
	`, moduleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var translations []entity.ModuleTranslation
	for rows.Next() {
		var translation entity.ModuleTranslation
		var activities, grammarFocus, topicScopeTerms []byte
		if err := rows.Scan(&translation.ID, &translation.ModuleID, &translation.Language, &translation.Title, &translation.Description, &translation.TopicScope, &activities, &grammarFocus, &topicScopeTerms); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(activities, &translation.Activities); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(grammarFocus, &translation.GrammarFocus); err != nil {
			return nil, err
		}
		if err := json.Unmarshal(topicScopeTerms, &translation.TopicScopeTerms); err != nil {
			return nil, err
		}
		translations = append(translations, translation)
	}
	return translations, rows.Err()
}

func (r *SyllabusRepository) saveModuleTranslations(ctx context.Context, tx *sql.Tx, module entity.Module) error {
	if len(module.Translations) == 0 {
		return nil
	}
	exec := func(query string, args ...any) error {
		if tx != nil {
			_, err := tx.ExecContext(ctx, query, args...)
			return err
		}
		_, err := r.db.ExecContext(ctx, query, args...)
		return err
	}
	for _, translation := range module.Translations {
		translation = normalizeModuleTranslation(translation, module.ID)
		if strings.TrimSpace(translation.Language) == "" {
			continue
		}
		if err := exec(saveModuleTranslationSQL,
			translation.ID, translation.ModuleID, translation.Language, translation.Title, translation.Description,
			translation.TopicScope, translation.Activities, translation.GrammarFocus, translation.TopicScopeTerms,
		); err != nil {
			return err
		}
	}
	return nil
}

func normalizeModuleTranslation(translation entity.ModuleTranslation, defaultModuleID string) entity.ModuleTranslation {
	translation.ModuleID = strings.TrimSpace(translation.ModuleID)
	if translation.ModuleID == "" {
		translation.ModuleID = defaultModuleID
	}
	translation.Language = strings.TrimSpace(translation.Language)
	translation.Title = strings.TrimSpace(translation.Title)
	translation.Description = strings.TrimSpace(translation.Description)
	translation.TopicScope = strings.TrimSpace(translation.TopicScope)
	translation.Activities = append([]string(nil), translation.Activities...)
	translation.GrammarFocus = append([]string(nil), translation.GrammarFocus...)
	translation.TopicScopeTerms = append([]string(nil), translation.TopicScopeTerms...)
	if strings.TrimSpace(translation.ID) == "" {
		lang := strings.NewReplacer(" ", "-", "/", "-", "_", "-").Replace(strings.ToLower(translation.Language))
		translation.ID = strings.TrimSpace(translation.ModuleID) + "-" + lang
	}
	return translation
}

func romanizeArabicModuleText(moduleID string, text string) string {
	switch moduleID {
	case "mod-arab-vii-01":
		switch strings.TrimSpace(text) {
		case "صباح الخير، كيف حالك؟":
			return "Sabah al-khayr, kayfa haluk?"
		case "تدرّب على التحية بعبارات مهذبة":
			return "Tadarrab 'ala al-tahiyya bi-'ibarat muhadhaaba"
		case "التحيات, الرد على التحية, العبارات المهذبة, المعلومات الشخصية, الضمائر":
			return "at-tahiyyat, al-radd 'ala al-tahiyya, al-'ibarat al-muhadhdaba, al-ma'lumat al-shakhsiya, al-dama'ir"
		}
	case "mod-arab-vii-02":
		switch strings.TrimSpace(text) {
		case "هذا أنا":
			return "Hatha ana"
		case "عرّف بنفسك وبعائلتك ومعلوماتك الشخصية":
			return "A'rif binafsik wa bi-'a'ilatik wa ma'lumatik al-shakhsiya"
		case "الفصل الدراسي, الهوية الشخصية, أفراد العائلة, المعلومات الشخصية":
			return "al-fasl al-dirasi, al-huwiya al-shakhsiya, afrad al-'a'ila, al-ma'lumat al-shakhsiya"
		}
	case "mod-arab-vii-03":
		switch strings.TrimSpace(text) {
		case "كم الساعة؟":
			return "Kam al-sa'aa?"
		case "تدرب على قول الوقت":
			return "Tadarrab 'ala qawl al-waqt"
		case "الفصل الدراسي, قول الوقت, السؤال عن الوقت, تعبيرات الوقت, الأنشطة اليومية, الأرقام":
			return "al-fasl al-dirasi, qawl al-waqt, al-su'al 'an al-waqt, ta'birat al-waqt, al-anshita al-yawmiyya, al-arqam"
		}
	case "mod-arab-vii-04":
		switch strings.TrimSpace(text) {
		case "هذا عالمي":
			return "Hatha 'alami"
		case "يصف الطلاب بيئة المدرسة والفصل الدراسي والمكتبة والمقصف باستخدام المضارع البسيط واللغة الوصفية.":
			return "Yasif al-tullab bi'at al-madrasa wa al-fasl al-dirasi wa al-maktaba wa al-maqsaf bi-istikhdam al-mudari' al-basit wa al-lugha al-wasfiya."
		case "المدرسة, الفصل الدراسي, المكتبة, المقصف, المعلم, الطالب, الكتاب, الطعام, المرافق, الحياة المدرسية اليومية":
			return "al-madrasa, al-fasl al-dirasi, al-maktaba, al-maqsaf, al-mu'allim, al-talib, al-kitab, al-ta'am, al-maraafiq, al-hayat al-madrasiyya al-yawmiyya"
		}
	case "mod-arab-vii-05":
		switch strings.TrimSpace(text) {
		case "إنه يوم جميل":
			return "Innahu yawm jamil"
		case "يتحدث الطلاب عن تجاربهم اليومية في المدرسة والمكتبة والمقصف مع التعبير عن المشاعر والآراء والروتين.":
			return "Yatahaddath al-tullab 'an tajaribihim al-yawmiyya fi al-madrasa wa al-maktaba wa al-maqsaf ma'a al-ta'bir 'an al-mashaa'ir wa al-ara' wa al-rutin."
		case "بيئة المدرسة, أنشطة المكتبة, أنشطة المقصف, الروتين اليومي, المشاعر, الطقس, يوم جميل, الأصدقاء, القراءة, الدراسة":
			return "bi'at al-madrasa, anshita al-maktaba, anshita al-maqsaf, al-rutin al-yawmi, al-mashaa'ir, al-taqs, yawm jamil, al-ashdiqa', al-qira'a, al-dirasa"
		}
	case "mod-arab-vii-06":
		switch strings.TrimSpace(text) {
		case "نحن نحب ما نفعله":
			return "Nahnu nuhibbu ma naf'alu"
		case "يشرح الطلاب الأنشطة التي يستمتعون بها في المدرسة والمكتبة والمقصف، ويصفون سبب أهمية هذه الأنشطة.":
			return "Yashrah al-tullab al-anshita allati yastamti'una biha fi al-madrasa wa al-maktaba wa al-maqsaf, wa yasifun sabab ahmiyyat hadhihi al-anshita."
		case "الأنشطة المدرسية, المكتبة, المقصف, الهوايات, الاهتمامات, التعلّم, القراءة, الأنشطة الجماعية, المواد المفضلة, التفضيلات الشخصية":
			return "al-anshita al-madrasiyya, al-maktaba, al-maqsaf, al-hawaayat, al-ihtimamat, al-ta'allum, al-qira'a, al-anshita al-jama'iyya, al-mawad al-mufaddala, al-tafdilat al-shakhsiya"
		}
	case "mod-arab-vii-07":
		switch strings.TrimSpace(text) {
		case "أنا فخور بإندونيسيا":
			return "Ana fakhuur bi-Indunisiya"
		case "يصف الطلاب إندونيسيا وشعبها وثقافتها وإنجازاتها مع التعبير عن الفخر بوطنهم.":
			return "Yasif al-tullab Indunisiya wa sha'baha wa thaqafatiha wa injazatiha ma'a al-ta'bir 'an al-fakhr bi-watanihim."
		case "إندونيسيا, الهوية الوطنية, الثقافة, اللغة, المدرسة, المجتمع, الرياضة, الإنجاز, العلم, الفخر الوطني":
			return "Indunisiya, al-huwiya al-wataniyya, al-thaqafa, al-lugha, al-madrasa, al-mujtama', al-riyada, al-injaz, al-'ilm, al-fakhr al-watani"
		}
	case "mod-arab-vii-08":
		switch strings.TrimSpace(text) {
		case "هذا ما ينبغي على الأصدقاء فعله":
			return "Hatha ma yanbaghi 'ala al-ashdiqa' fi'luhu"
		case "يناقش الطلاب الصداقة والعمل الجماعي والروح الرياضية في بيئات المدرسة والرياضة.":
			return "Yunaqish al-tullab al-sadaqa wa al-'amal al-jama'i wa al-ruh al-riyadiya fi bi'at al-madrasa wa al-riyada."
		case "الصداقة, مساعدة الآخرين, العمل الجماعي, المدرسة, كرة القدم, الريشة الطائرة, كرة السلة, الروح الرياضية, الاحترام, اللعب النزيه":
			return "al-sadaqa, musa'adat al-akharin, al-'amal al-jama'i, al-madrasa, kurat al-qadam, al-risha al-ta'ira, kurat al-salla, al-ruh al-riyadiya, al-ihtiram, al-la'ib al-nazih"
		}
	}
	return strings.TrimSpace(text)
}

func romanizeArabicModuleTexts(moduleID string, values []string) []string {
	result := make([]string, 0, len(values))
	for _, value := range values {
		if strings.TrimSpace(value) == "" {
			continue
		}
		result = append(result, romanizeArabicModuleText(moduleID, value))
	}
	return result
}

func romanizeArabicText(text string) string {
	switch strings.TrimSpace(text) {
	case "السلام عليكم":
		return "As-salamu alaykum"
	case "التحيات والتعارف":
		return "At-tahiyyat wa at-taaruf"
	case "عالمي ويومي وأنشطتي":
		return "Alami wa yawmi wa anshitati"
	case "يتحدث الطلاب عن تجاربهم اليومية في المدرسة والمكتبة والمقصف مع التعبير عن المشاعر والآراء والروتين اليومي.":
		return "Yatahaddath al-tullab 'an tajaribihim al-yawmiyyah fi al-madrasa wa al-maktaba wa al-maqsaf ma'a al-ta'bir 'an al-mashaa'ir wa al-ara' wa al-rutin al-yawmi."
	case "متحدون بالفخر ومرتبطون بالصداقة":
		return "Mutahidun bil-fakhr wa murtabitun bis-sadaqa"
	case "يصف الطلاب إندونيسيا وشعبها وثقافتها وإنجازاتها مع التعبير عن الفخر بوطنهم.":
		return "Yasif al-tullab Indunisiya wa sha'baha wa thaqafatiha wa injazatiha ma'a al-ta'bir 'an al-fakhr bi-watanihim."
	}

	var b strings.Builder
	lastSpace := false
	for _, r := range text {
		switch {
		case unicode.IsSpace(r):
			if b.Len() > 0 && !lastSpace {
				b.WriteByte(' ')
				lastSpace = true
			}
		case isArabicDiacritic(r):
			continue
		default:
			if roman, ok := arabicRuneRomanization[r]; ok {
				b.WriteString(roman)
				lastSpace = false
			}
		}
	}
	return strings.TrimSpace(b.String())
}

func isArabicDiacritic(r rune) bool {
	return r >= 0x064B && r <= 0x065F
}

var arabicRuneRomanization = map[rune]string{
	'ء': "'",
	'آ': "aa",
	'أ': "a",
	'ؤ': "u",
	'إ': "i",
	'ئ': "i",
	'ا': "a",
	'ب': "b",
	'ت': "t",
	'ث': "th",
	'ج': "j",
	'ح': "h",
	'خ': "kh",
	'د': "d",
	'ذ': "dh",
	'ر': "r",
	'ز': "z",
	'س': "s",
	'ش': "sh",
	'ص': "s",
	'ض': "d",
	'ط': "t",
	'ظ': "z",
	'ع': "a",
	'غ': "gh",
	'ف': "f",
	'ق': "q",
	'ك': "k",
	'ل': "l",
	'م': "m",
	'ن': "n",
	'ه': "h",
	'و': "w",
	'ى': "a",
	'ي': "y",
	'ة': "a",
	'ﻻ': "la",
}

const saveModuleSQL = `
	INSERT INTO modules (
		id, syllabus_id, language, title, description, title_romanized, description_romanized,
		topic_scope, topic_scope_romanized, activities, activities_romanized, vocabulary_load,
		grammar_focus, grammar_focus_romanized, topic_scope_terms,
		estimation_duration_minutes, mastery_threshold, status, module_order
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
	ON CONFLICT (id) DO UPDATE SET
		syllabus_id = EXCLUDED.syllabus_id,
		language = EXCLUDED.language,
		title = EXCLUDED.title,
		description = EXCLUDED.description,
		title_romanized = EXCLUDED.title_romanized,
		description_romanized = EXCLUDED.description_romanized,
		topic_scope = EXCLUDED.topic_scope,
		topic_scope_romanized = EXCLUDED.topic_scope_romanized,
		activities = EXCLUDED.activities,
		activities_romanized = EXCLUDED.activities_romanized,
		vocabulary_load = EXCLUDED.vocabulary_load,
		grammar_focus = EXCLUDED.grammar_focus,
		grammar_focus_romanized = EXCLUDED.grammar_focus_romanized,
		topic_scope_terms = EXCLUDED.topic_scope_terms,
		estimation_duration_minutes = EXCLUDED.estimation_duration_minutes,
		mastery_threshold = EXCLUDED.mastery_threshold,
		status = EXCLUDED.status,
		module_order = EXCLUDED.module_order,
		updated_at = now()
`

const saveModuleTranslationSQL = `
	INSERT INTO modules_translation (
		id, module_id, language, title, description, topic_scope, activities, grammar_focus, topic_scope_terms
	)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	ON CONFLICT (module_id, language) DO UPDATE SET
		title = EXCLUDED.title,
		description = EXCLUDED.description,
		topic_scope = EXCLUDED.topic_scope,
		activities = EXCLUDED.activities,
		grammar_focus = EXCLUDED.grammar_focus,
		topic_scope_terms = EXCLUDED.topic_scope_terms
`
