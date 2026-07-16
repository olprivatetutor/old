package entity

type AssessmentLevel string

const (
	LevelA1 AssessmentLevel = "A1"
	LevelA2 AssessmentLevel = "A2"
	LevelB1 AssessmentLevel = "B1"
	LevelB2 AssessmentLevel = "B2"
	LevelC1 AssessmentLevel = "C1"
	LevelC2 AssessmentLevel = "C2"
)

type Message struct {
	Role    string `json:"role"` // user | assistant
	Content string `json:"content"`
}

type AssessmentTranslation struct {
	Language  string   `json:"language"`
	Title     string   `json:"title"`
	Summary   string   `json:"summary"`
	Strengths []string `json:"strengths"`
	Areas     []string `json:"areas"`
}

type AssessmentResult struct {
	CefrLevel    AssessmentLevel         `json:"cefr_level"`
	Level        AssessmentLevel         `json:"level"`
	Score        int                     `json:"score"` // 0–100
	Title        string                  `json:"title"`
	Summary      string                  `json:"summary"`
	Strengths    []string                `json:"strengths"`
	Areas        []string                `json:"areas"` // areas for improvement
	Translations []AssessmentTranslation `json:"translations,omitempty"`
}

func RelativeAssessmentLevel(score int) AssessmentLevel {
	switch {
	case score >= 90:
		return LevelC1
	case score >= 85:
		return LevelB2
	case score >= 80:
		return LevelB1
	case score >= 75:
		return LevelA2
	default:
		return LevelA1
	}
}

type AssessmentSession struct {
	Language   string            `json:"language"`
	ModuleID   string            `json:"module_id"`
	TopicScope string            `json:"topic_scope"`
	Class      string            `json:"class"`
	Messages   []Message         `json:"messages"`
	Result     *AssessmentResult `json:"result,omitempty"`
	Completed  bool              `json:"completed"`
}
