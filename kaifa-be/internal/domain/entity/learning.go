package entity

type LearningStep struct {
	ID                   string                    `json:"id"`
	Order                int                       `json:"order"`
	Activity             string                    `json:"activity"`
	ActivityRomanized    string                    `json:"activity_romanized,omitempty"`
	Title                string                    `json:"title"`
	TitleRomanized       string                    `json:"title_romanized,omitempty"`
	Description          string                    `json:"description"`
	DescriptionRomanized string                    `json:"description_romanized,omitempty"`
	RequiredTime         int                       `json:"required_time"`
	TopicScope           string                    `json:"topic_scope"`
	TopicScopeRomanized  string                    `json:"topic_scope_romanized,omitempty"`
	Target               []string                  `json:"target"`
	Progress             int                       `json:"progress"`
	Translations         []LearningStepTranslation `json:"translations,omitempty"`
}

type LearningPath struct {
	ID                  string                    `json:"id"`
	Language            string                    `json:"language"`
	ModuleID            string                    `json:"module_id"`
	Level               string                    `json:"level"`
	TopicScope          string                    `json:"topic_scope"`
	TopicScopeRomanized string                    `json:"topic_scope_romanized,omitempty"`
	Steps               []LearningStep            `json:"steps"`
	TotalSteps          int                       `json:"total_steps"`
	Translations        []LearningPathTranslation `json:"translations,omitempty"`
}

type LearningPathTranslation struct {
	ID             string `json:"id"`
	LearningPathID string `json:"learning_path_id"`
	Language       string `json:"language"`
	TopicScope     string `json:"topic_scope"`
}

type LearningStepTranslation struct {
	ID                 string `json:"id"`
	LearningPathStepID string `json:"learning_path_step_id"`
	Language           string `json:"language"`
	Activity           string `json:"activity"`
	Title              string `json:"title"`
	Description        string `json:"description"`
	TopicScope         string `json:"topic_scope"`
}

type LearningSession struct {
	LearningPathID string                  `json:"learning_path_id"`
	Language       string                  `json:"language"`
	ModuleID       string                  `json:"module_id"`
	Level          string                  `json:"level"`
	TopicScope     string                  `json:"topic_scope"`
	CurrentStep    int                     `json:"current_step"`
	LearningPath   *LearningPath           `json:"learning_path,omitempty"`
	Messages       []Message               `json:"messages"`
	ListeningState *LearningListeningState `json:"listening_state,omitempty"`
}

type LearningListeningState struct {
	Phase          string   `json:"phase"`
	MaterialType   string   `json:"material_type,omitempty"`
	Paragraph      string   `json:"paragraph,omitempty"`
	QuestionsAsked int      `json:"questions_asked"`
	Answers        []string `json:"answers,omitempty"`
}

type LearningChatResult struct {
	Type           string               `json:"type"`
	Reply          string               `json:"reply"`
	Paragraph      string               `json:"paragraph,omitempty"`
	QuestionNumber int                  `json:"question_number,omitempty"`
	Assessment     *ListeningAssessment `json:"assessment,omitempty"`
}

type ListeningAssessment struct {
	Score     int      `json:"score"`
	Summary   string   `json:"summary"`
	Strengths []string `json:"strengths"`
	Areas     []string `json:"areas"`
}
