package entity

type Syllabus struct {
	ID                   string                `json:"id"`
	Language             string                `json:"language"`
	Title                string                `json:"title"`
	Description          string                `json:"description"`
	TitleRomanized       string                `json:"title_romanized"`
	DescriptionRomanized string                `json:"description_romanized"`
	Class                string                `json:"class"`
	Level                []string              `json:"level"`
	Icon                 string                `json:"icon"`
	Translations         []SyllabusTranslation `json:"translations,omitempty"`
	Modules              []Module              `json:"modules,omitempty"`
}

type SyllabusTranslation struct {
	ID          string `json:"id"`
	SyllabiID   string `json:"syllabi_id"`
	Language    string `json:"language"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type Module struct {
	ID                   string `json:"id"`
	SyllabusID           string `json:"syllabus_id"`
	Language             string `json:"language"`
	Title                string `json:"title"`
	Description          string `json:"description"`
	TitleRomanized       string `json:"title_romanized,omitempty"`
	DescriptionRomanized string `json:"description_romanized,omitempty"`
	// TopicScope defines what subjects the AI is allowed to discuss — the guardrail boundary.
	TopicScope                string              `json:"topic_scope"`
	TopicScopeRomanized       string              `json:"topic_scope_romanized,omitempty"`
	Activities                []string            `json:"activities,omitempty"`
	ActivitiesRomanized       []string            `json:"activities_romanized,omitempty"`
	VocabularyLoad            int                 `json:"vocabulary_load,omitempty"`
	GrammarFocus              []string            `json:"grammar_focus,omitempty"`
	GrammarFocusRomanized     []string            `json:"grammar_focus_romanized,omitempty"`
	TopicScopeTerms           []string            `json:"topic_scope_terms,omitempty"`
	EstimationDurationMinutes int                 `json:"estimation_duration_minutes,omitempty"`
	MasteryThreshold          int                 `json:"mastery_threshold,omitempty"`
	Status                    string              `json:"status"` // available | locked | completed
	Order                     int                 `json:"order"`
	Translations              []ModuleTranslation `json:"translations,omitempty"`
}

type ModuleTranslation struct {
	ID              string   `json:"id"`
	ModuleID        string   `json:"module_id"`
	Language        string   `json:"language"`
	Title           string   `json:"title"`
	Description     string   `json:"description"`
	TopicScope      string   `json:"topic_scope"`
	Activities      []string `json:"activities,omitempty"`
	GrammarFocus    []string `json:"grammar_focus,omitempty"`
	TopicScopeTerms []string `json:"topic_scope_terms,omitempty"`
}
