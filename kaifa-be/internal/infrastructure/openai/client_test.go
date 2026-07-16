package openai

import (
	"fmt"
	"strings"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

func TestMuslimFriendlyLanguageRules_EnglishUsesEnglishAlphabet(t *testing.T) {
	rules := muslimFriendlyLanguageRules("english")

	for _, want := range []string{"Alhamdulillah", "Subhanallah", "Masya Allah"} {
		if !strings.Contains(rules, want) {
			t.Fatalf("expected English rules to contain %q, got %q", want, rules)
		}
	}
	for _, unwanted := range []string{"Assalaamu'alaykum", "السلام عليكم", "الحمد لله", "سبحان الله", "ما شاء الله"} {
		if strings.Contains(rules, unwanted) {
			t.Fatalf("expected English rules not to contain Arabic-script phrase %q", unwanted)
		}
	}
}

func TestMuslimFriendlyLanguageRules_ArabicUsesArabicScript(t *testing.T) {
	rules := muslimFriendlyLanguageRules("arabic")

	for _, want := range []string{"الحمد لله", "سبحان الله", "ما شاء الله"} {
		if !strings.Contains(rules, want) {
			t.Fatalf("expected Arabic rules to contain %q, got %q", want, rules)
		}
	}
	for _, unwanted := range []string{"السلام عليكم", "Assalaamu'alaykum", "Alhamdulillah", "Subhanallah", "Masya Allah"} {
		if strings.Contains(rules, unwanted) {
			t.Fatalf("expected Arabic rules not to contain English transliteration %q", unwanted)
		}
	}
}

func TestOpeningGreetingRule_UsesLanguageSpecificSalam(t *testing.T) {
	if got := openingGreetingRule("english"); got != `- If this is the first message in the student's conversation, begin with "Assalaamu'alaykum".` {
		t.Fatalf("unexpected English opening greeting rule: %q", got)
	}
	if got := openingGreetingRule("arabic"); got != `- If this is the first message in the student's conversation, begin with "السلام عليكم".` {
		t.Fatalf("unexpected Arabic opening greeting rule: %q", got)
	}
}

func TestBuildLearningPathPrompt_ArabicRequiresArabicUserFacingFields(t *testing.T) {
	prompt := buildLearningPathPrompt(&entity.Module{
		Language:       "arabic",
		Title:          "Arabic Greetings",
		TopicScope:     "greetings and introductions",
		Activities:     []string{"speaking", "vocabulary"},
		VocabularyLoad: 20,
		GrammarFocus:   []string{"nominal sentences"},
	}, "A1", nil)

	for _, want := range []string{
		"Write every user-facing learning path field in Arabic.",
		"The step title, description, and topic_scope must all be in Arabic.",
		"translate/adapt it into Arabic instead of copying it",
		"For Arabic modules, use Arabic script throughout user-facing text",
		"Keep JSON property names and activity enum values exactly as specified below.",
		"Return the Bahasa Indonesia translation inside a translations array with one object.",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected Arabic learning path prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestBuildLearningPathBahasaIndonesiaTranslationPrompt_UsesSourceLearningFields(t *testing.T) {
	prompt := buildLearningPathBahasaIndonesiaTranslationPrompt(&entity.Module{
		Language: "english",
		Title:    "Daily life communication",
	}, &entity.LearningPath{
		ID:         "lp-001",
		Language:   "english",
		TopicScope: "greetings and introductions",
		Steps: []entity.LearningStep{
			{
				Order:       1,
				Activity:    "speaking",
				Title:       "Greeting practice",
				Description: "Practice simple greetings.",
				TopicScope:  "greetings",
			},
		},
	})

	for _, want := range []string{
		"Translate the following learning path into Bahasa Indonesia.",
		"greetings and introductions",
		"Greeting practice",
		"Practice simple greetings.",
		"Do not translate IDs, language, level, required_time, progress, target, or total_steps.",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestContainsArabicRune_DetectsArabicText(t *testing.T) {
	if !containsArabicRune("السلام عليكم") {
		t.Fatal("expected Arabic text to be detected")
	}
	if containsArabicRune("hello world") {
		t.Fatal("expected Latin text not to be detected as Arabic")
	}
}

func TestExtractJSONObject_StripsMarkdownCodeFences(t *testing.T) {
	raw := "```json\n{\"topic_scope\":\"halo\",\"steps\":[{\"order\":1} ]}\n```"

	got := extractJSONObject(raw)

	if got != "{\"topic_scope\":\"halo\",\"steps\":[{\"order\":1} ]}" {
		t.Fatalf("unexpected extracted json: %q", got)
	}
}

func TestBuildAssessmentSystemPrompt_ArabicRequiresArabicGuardrailReplies(t *testing.T) {
	prompt := buildAssessmentSystemPrompt(&entity.AssessmentSession{
		Language:   "arabic",
		TopicScope: "greetings and introductions",
	}, 0)

	for _, want := range []string{
		"Off-topic replies are user-facing guardrail messages, so they must be written in Arabic.",
		"translated/adapted into Arabic",
		"Opening rule:",
		"begin with \"السلام عليكم\"",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected Arabic assessment prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestBuildAssessmentSystemPrompt_UsesSevenMessageHandoff(t *testing.T) {
	prompt := buildAssessmentSystemPrompt(&entity.AssessmentSession{
		Language:   "english",
		TopicScope: "greetings and introductions",
	}, 6)

	for _, want := range []string{
		"If the student has sent fewer than 7 messages, do not conclude the assessment.",
		"Once the student has sent 7 or more messages, conclude the assessment now instead of returning another chat reply.",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected seven-message assessment prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestAssessmentClassGuidance_ClassVIIUsesElementaryStandards(t *testing.T) {
	guidance := assessmentClassGuidance("VII")

	for _, want := range []string{
		"expected level is early A1 to strong A",
	} {
		if !strings.Contains(guidance, want) {
			t.Fatalf("expected class VII guidance to contain %q, got %q", want, guidance)
		}
	}
}

func TestAssessmentClassGuidance_ClassVIIIRaisesStandardsWithoutAdultLens(t *testing.T) {
	guidance := assessmentClassGuidance("VIII")

	for _, want := range []string{
		"expected level is strong A1 to early A2",
	} {
		if !strings.Contains(guidance, want) {
			t.Fatalf("expected class VIII guidance to contain %q, got %q", want, guidance)
		}
	}
}

func TestBuildAssessmentSystemPrompt_IncludesClassGuidance(t *testing.T) {
	prompt := buildAssessmentSystemPrompt(&entity.AssessmentSession{
		Language:   "english",
		TopicScope: "greetings and introductions",
		Class:      "VIII",
	}, 0)

	for _, want := range []string{
		"CEFR level expectation:",
		"expected level is strong A1 to early A2",
		"Assessment criteria:",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected assessment prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestBuildAssessmentResultSystemPrompt_IncludesClassGuidance(t *testing.T) {
	classGuidance := assessmentClassGuidance("VII")
	prompt := fmt.Sprintf(assessmentResultSystemPrompt,
		"English",
		"English",
		"greetings and introductions",
		"Muslim-friendly rules",
		classGuidance,
		classGuidance,
		"English",
	)

	for _, want := range []string{
		"CEFR level expectation:",
		"expected level is early A1 to strong A",
		"Important assessment principle:",
		"translations array",
		"language \"bahasa indonesia\"",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected assessment result prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestBuildAssessmentResultSystemPrompt_IncludesSummaryOpeningRules(t *testing.T) {
	classGuidance := assessmentClassGuidance("VIII")
	prompt := fmt.Sprintf(assessmentResultSystemPrompt,
		"English",
		"English",
		"greetings and introductions",
		"Muslim-friendly rules",
		classGuidance,
		classGuidance,
		"English",
	)

	for _, want := range []string{
		"Summary opening rules:",
		`If the result is strong or excellent, begin with "Subhanallah" or "Masya Allah"`,
		`If the result is not strong, begin with "Alhamdulillah"`,
		"tell them you will help them improve",
		"Short paragraph translated into natural Bahasa Indonesia.",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected assessment result prompt to contain %q, got %q", want, prompt)
		}
	}
}

func TestNormalizeAssessmentTitle_UsesScoreBandsAndLanguage(t *testing.T) {
	tests := []struct {
		name     string
		score    int
		language string
		want     string
	}{
		{name: "english strong", score: 95, language: "english", want: "MasyaAllah, You Are Awesome"},
		{name: "english good", score: 82, language: "english", want: "SubhanAllah, Great Work"},
		{name: "english needs encouragement", score: 55, language: "english", want: "Alhamdulillah, Keep Going"},
		{name: "arabic strong", score: 90, language: "arabic", want: "ما شاء الله، أنت رائع"},
		{name: "arabic good", score: 80, language: "arabic", want: "سبحان الله، عمل رائع"},
		{name: "arabic needs encouragement", score: 54, language: "arabic", want: "الحمد لله، واصل التقدم"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := normalizeAssessmentTitle(tt.score, tt.language)
			if got != tt.want {
				t.Fatalf("expected %q, got %q", tt.want, got)
			}
		})
	}
}

func TestNormalizeAssessmentSummary_StrongEnglishUsesPraise(t *testing.T) {
	got := normalizeAssessmentSummary("The student can communicate clearly.", 91, "english")

	if !strings.HasPrefix(got, "Masya Allah.") {
		t.Fatalf("expected strong English summary to start with Masya Allah, got %q", got)
	}
	if !strings.Contains(got, "Excellent work.") {
		t.Fatalf("expected strong English summary to include encouragement, got %q", got)
	}
}

func TestNormalizeAssessmentSummary_WeakEnglishUsesAlhamdulillah(t *testing.T) {
	got := normalizeAssessmentSummary("The student still needs practice.", 54, "english")

	if !strings.HasPrefix(got, "Alhamdulillah.") {
		t.Fatalf("expected weak English summary to start with Alhamdulillah, got %q", got)
	}
	if !strings.Contains(got, "Keep studying, and I will help you improve.") {
		t.Fatalf("expected weak English summary to include support, got %q", got)
	}
}

func TestNormalizeAssessmentSummary_ArabicUsesArabicOpenings(t *testing.T) {
	got := normalizeAssessmentSummary("الطالب يحتاج إلى مزيد من التدريب.", 52, "arabic")

	if !strings.HasPrefix(got, "الحمد لله.") {
		t.Fatalf("expected weak Arabic summary to start with الحمد لله, got %q", got)
	}
	if !strings.Contains(got, "واصل الدراسة وسأساعدك على التحسن.") {
		t.Fatalf("expected weak Arabic summary to include support, got %q", got)
	}
}

func TestParseAssessmentResult_IncludesCefrLevel(t *testing.T) {
	got := parseAssessmentResult(`{"cefr_level":"A2","level":"B1","score":78,"title":"SubhanAllah, Great Work","summary":"Good work.","strengths":["Clear answers"],"areas":["Grammar"],"translations":[{"language":"bahasa indonesia","title":"Subhanallah, Kerja Bagus","summary":"Kerja bagus.","strengths":["Jawaban jelas"],"areas":["Tata bahasa"]}]}`)

	if got == nil {
		t.Fatal("expected parsed assessment result")
	}
	if got.CefrLevel != entity.LevelA2 {
		t.Fatalf("expected cefr level A2, got %q", got.CefrLevel)
	}
	if got.Level != entity.LevelB1 {
		t.Fatalf("expected level B1, got %q", got.Level)
	}
	if got.Title != "SubhanAllah, Great Work" {
		t.Fatalf("expected title to be parsed, got %q", got.Title)
	}
	if len(got.Translations) != 1 {
		t.Fatalf("expected one translation, got %#v", got.Translations)
	}
	if got.Translations[0].Language != "bahasa indonesia" {
		t.Fatalf("expected Indonesian translation language, got %q", got.Translations[0].Language)
	}
	if got.Translations[0].Title != "Subhanallah, Kerja Bagus" {
		t.Fatalf("expected Indonesian title to be parsed, got %q", got.Translations[0].Title)
	}
	if got.Translations[0].Summary != "Kerja bagus." {
		t.Fatalf("expected Indonesian summary to be parsed, got %q", got.Translations[0].Summary)
	}
	if len(got.Translations[0].Strengths) != 1 || got.Translations[0].Strengths[0] != "Jawaban jelas" {
		t.Fatalf("expected Indonesian strengths to be parsed, got %#v", got.Translations[0].Strengths)
	}
	if len(got.Translations[0].Areas) != 1 || got.Translations[0].Areas[0] != "Tata bahasa" {
		t.Fatalf("expected Indonesian areas to be parsed, got %#v", got.Translations[0].Areas)
	}
}

func TestNormalizeAssessmentResult_OverridesRelativeLevelFromScore(t *testing.T) {
	got := normalizeAssessmentResult(&entity.AssessmentResult{
		CefrLevel: entity.LevelC2,
		Level:     entity.LevelC2,
		Score:     55,
		Summary:   "The student needs more practice.",
		Translations: []entity.AssessmentTranslation{
			{
				Language:  "bahasa indonesia",
				Title:     "Tetap Semangat",
				Summary:   "Kerja bagus, lanjutkan belajar.",
				Strengths: []string{"Jawaban jelas"},
				Areas:     []string{"Tata bahasa"},
			},
		},
	}, "english")

	if got == nil {
		t.Fatal("expected normalized assessment result")
	}
	if got.Level != entity.LevelA1 {
		t.Fatalf("expected relative level A1, got %q", got.Level)
	}
	if got.CefrLevel != entity.LevelC2 {
		t.Fatalf("expected cefr level to remain C2, got %q", got.CefrLevel)
	}
	if got.Title != "Alhamdulillah, Keep Going" {
		t.Fatalf("expected title to be normalized, got %q", got.Title)
	}
	if len(got.Translations) != 1 || got.Translations[0].Language != "bahasa indonesia" {
		t.Fatalf("expected Indonesian translation to be preserved, got %#v", got.Translations)
	}
	if len(got.Translations[0].Strengths) != 1 || got.Translations[0].Strengths[0] != "Jawaban jelas" {
		t.Fatalf("expected Indonesian strengths to be preserved, got %#v", got.Translations[0].Strengths)
	}
	if len(got.Translations[0].Areas) != 1 || got.Translations[0].Areas[0] != "Tata bahasa" {
		t.Fatalf("expected Indonesian areas to be preserved, got %#v", got.Translations[0].Areas)
	}
}

func TestBuildLearningSystemPrompt_ArabicRequiresArabicGuardrailReplies(t *testing.T) {
	prompt := buildLearningSystemPrompt(&entity.Module{
		Title:          "Arabic Greetings",
		VocabularyLoad: 20,
		GrammarFocus:   []string{"nominal sentences"},
	}, &entity.LearningSession{
		Language:    "arabic",
		Level:       "A1",
		TopicScope:  "greetings and introductions",
		CurrentStep: 1,
	}, "Introduction", 4)

	for _, want := range []string{
		"redirect in Arabic",
		"Translate/adapt this redirect into Arabic",
		"Keep every user-facing reply, correction, example, follow-up question, and guardrail redirect in Arabic.",
	} {
		if !strings.Contains(prompt, want) {
			t.Fatalf("expected Arabic learning prompt to contain %q, got %q", want, prompt)
		}
	}
}
