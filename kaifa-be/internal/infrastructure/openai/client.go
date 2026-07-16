package openai

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	goopenai "github.com/sashabaranov/go-openai"
)

const model = goopenai.GPT4oMini

type Client struct {
	c                                  *goopenai.Client
	apiKeySuffix                       string
	apiKeyHash8                        string
	learningPathCacheEnabled           bool
	learningPathTransliterationEnabled bool
	learningPathCacheMu                sync.RWMutex
	learningPathCache                  map[string]*entity.LearningPath
}

type Config struct {
	LearningPathCacheEnabled           bool
	LearningPathTransliterationEnabled bool
}

func NewClient(apiKey string, cfg Config) *Client {
	return &Client{
		c:                                  goopenai.NewClient(apiKey),
		apiKeySuffix:                       secretSuffix(apiKey),
		apiKeyHash8:                        secretHash8(apiKey),
		learningPathCacheEnabled:           cfg.LearningPathCacheEnabled,
		learningPathTransliterationEnabled: cfg.LearningPathTransliterationEnabled,
		learningPathCache:                  make(map[string]*entity.LearningPath),
	}
}

// ---- Assessment ----

const minAssessmentUserMessages = 7

const assessmentSystemPrompt = `You are Kaifa, a warm and encouraging Muslim teacher and %s language assessor.

Your job is to evaluate the student's %s proficiency level through natural, friendly conversation.
The module topic scope is: %s

Muslim-friendly language rules:
%s

Assessment flow:
- If this is the first assistant message in the conversation, start with the required salaam before saying hi, hello, or any other greeting, then ask one friendly, open-ended question related to the module topic scope.
- Conduct a natural conversation. Do not say you are "testing" or "assessing" them.
- Ask open-ended questions related to the module topic scope.
- The student has sent %d message(s) so far, including the latest message if present.
- If the student has sent fewer than 7 messages, do not conclude the assessment.
- Once the student has sent 7 or more messages, conclude the assessment now instead of returning another chat reply. The summary must include the required completion phrase.

Assessment criteria:
Consider:

1. Ability to understand the questions
2. Relevance of answers
3. Vocabulary appropriate to the topic
4. Sentence structure
5. Grammar accuracy
6. Fluency and confidence
7. Ability to maintain a simple conversation

Guardrail rules:
- For every student answer, check whether it stays within the module topic scope.
- If the answer is outside the topic scope, do not assess it and do not answer the unrelated topic. Politely remind the student and redirect them back to the module topic.
- Off-topic replies are user-facing guardrail messages, so they must be written in %s.
- Use this style for off-topic replies, translated/adapted into %s and adapted to the topic: "Interesting topic, but for now let's focus on [module topic]. Please answer the previous question."

CEFR level expectation:
%s

Opening rule:
%s

To conclude, output a JSON block (and ONLY the JSON block, no extra text) wrapped exactly like this:

<assessment_result>
{
	"cefr_level": "A1|A2|B1|B2|C1|C2",
  "level": "A1|A2|B1|B2|C1|C2",
  "score": <0-100>,
  "summary": "Short paragraph in the target language summarising the student's %s level. Include the required completion phrase.",
  "strengths": ["strength 1", "strength 2"],
  "areas": ["area 1", "area 2"]
}
</assessment_result>

Before the assessment is complete, respond naturally and helpfully as a respectful Muslim teacher. Keep responses concise (2-4 sentences).`

const assessmentResultSystemPrompt = `You are Kaifa, a warm and encouraging Muslim teacher and %s language assessor.

Your job is to evaluate the student's %s proficiency level from the conversation history.
The module topic scope is: %s

Muslim-friendly language rules:
%s

CEFR level expectation:
%s

Important assessment principle:
Do NOT judge all students using the same high standard.
Evaluate the student based on realistic expectations for stated CEFR level expecation.

Scoring rules:

- The "cefr_level" field must describe the student's actual CEFR level.
- The "level" field must describe the student's relative level to his exected level. %s
- The "score" field must describe how well the student performs compared to the expectation for their grade.
- A Grade 7 student can receive a high score even if their CEFR level is A1, as long as their performance is strong for Grade 7.
- Do not punish young or lower-grade students for not reaching B1 or B2.
- Be fair, encouraging, and age-appropriate.

Assessment criteria:
Consider:

1. Ability to understand the questions
2. Relevance of answers
3. Vocabulary appropriate to the topic
4. Sentence structure
5. Grammar accuracy
6. Fluency and confidence
7. Ability to maintain a simple conversation

Summary opening rules:
- Start the summary with an encouraging opening phrase or sentence.
- If the result is strong or excellent, begin with "Subhanallah" or "Masya Allah" before the rest of the summary.
- If the result is not strong, begin with "Alhamdulillah" and then encourage the student to study more and tell them you will help them improve.
- Keep the summary warm, specific, and age-appropriate for the student's class.
- Translate the title, summary, strengths, and areas into natural Bahasa Indonesia as well.
- Return the translation inside a translations array with one object using language "bahasa indonesia".

Return ONLY valid JSON. Do not return chat text, markdown, or XML tags.

Use this exact JSON shape:
{
	"cefr_level": "A1|A2|B1|B2|C1|C2",
  "level": "A1|A2|B1|B2|C1|C2",
  "score": <0-100>,
  "title": "Short encouraging title in the target language.",
  "summary": "Short paragraph in the target language summarising the student's %s level. Include the required completion phrase.",
  "strengths": ["strength 1", "strength 2"],
  "areas": ["area 1", "area 2"],
  "translations": [
    {
      "language": "bahasa indonesia",
      "title": "Short encouraging title translated into Bahasa Indonesia.",
      "summary": "Short paragraph translated into natural Bahasa Indonesia.",
      "strengths": ["strength 1 translated into Bahasa Indonesia", "strength 2 translated into Bahasa Indonesia"],
      "areas": ["area 1 translated into Bahasa Indonesia", "area 2 translated into Bahasa Indonesia"]
    }
  ]
}`

func (c *Client) StartAssessment(
	ctx context.Context,
	session *entity.AssessmentSession,
) (string, error) {
	reply, _, err := c.runAssessment(ctx, session, "")
	return reply, err
}

func (c *Client) ChatAssessment(
	ctx context.Context,
	session *entity.AssessmentSession,
	userMessage string,
) (string, *entity.AssessmentResult, error) {
	if c.assessmentUserMessageCount(session.Messages, userMessage) >= minAssessmentUserMessages {
		result, err := c.runAssessmentResult(ctx, session, userMessage)
		return "", result, err
	}
	return c.runAssessment(ctx, session, userMessage)
}

func (c *Client) runAssessment(
	ctx context.Context,
	session *entity.AssessmentSession,
	userMessage string,
) (string, *entity.AssessmentResult, error) {
	userMessageCount := c.assessmentUserMessageCount(session.Messages, userMessage)
	systemPrompt := buildAssessmentSystemPrompt(session, userMessageCount)

	msgs := []goopenai.ChatCompletionMessage{
		{Role: goopenai.ChatMessageRoleSystem, Content: systemPrompt},
	}
	for _, m := range session.Messages {
		msgs = append(msgs, goopenai.ChatCompletionMessage{Role: m.Role, Content: m.Content})
	}
	if strings.TrimSpace(userMessage) != "" {
		msgs = append(msgs, goopenai.ChatCompletionMessage{Role: goopenai.ChatMessageRoleUser, Content: userMessage})
	}

	logger.Info("thirdparty request", "service", "openai", "operation", "assessment_chat", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "message_count", len(msgs), "message_chars", messageContentChars(msgs), "max_tokens", 600, "temperature", 0.7, "module_id", session.ModuleID)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    msgs,
		Temperature: 0.7,
		MaxTokens:   600,
	})
	if err != nil {
		logger.Error("thirdparty request failed", "service", "openai", "operation", "assessment_chat", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "err", err)
		return "", nil, fmt.Errorf("openai assessment chat: %w", err)
	}
	logger.Info("thirdparty request completed", "service", "openai", "operation", "assessment_chat", "model", model, "prompt_tokens", resp.Usage.PromptTokens, "completion_tokens", resp.Usage.CompletionTokens, "total_tokens", resp.Usage.TotalTokens)

	reply := resp.Choices[0].Message.Content
	result := parseAssessmentResult(reply)
	if result != nil {
		result = normalizeAssessmentResult(result, session.Language)
	}

	// Completed assessments return only the structured result to the API caller.
	if result != nil {
		reply = ""
	}

	return reply, result, nil
}

func buildAssessmentSystemPrompt(session *entity.AssessmentSession, userMessageCount int) string {
	language := displayLanguage(session.Language)
	opening := ""
	if userMessageCount == 0 {
		opening = openingGreetingRule(session.Language)
	}
	prompt := fmt.Sprintf(
		assessmentSystemPrompt,
		language,
		language,
		session.TopicScope,
		muslimFriendlyLanguageRules(session.Language),
		userMessageCount,
		language,
		language,
		assessmentClassGuidance(session.Class),
		opening,
		language,
	)

	logger.Info("system prompt builder", "prompt", prompt)

	return prompt
}

func assessmentClassGuidance(class string) string {
	class = strings.ToUpper(strings.TrimSpace(class))
	switch class {
	case "VII":
		return "the student expected level is early A1 to strong A"
	case "VIII":
		return "the student expected level is strong A1 to early A2"
	case "IX":
		return "the student expected level is A2"
	case "X":
		return "the student expected level is strong A2 to early B1"
	case "XI":
		return "the student expected level is B1"
	case "XII":
		return "the student expected level is strong B1 to early B2"
	default:
		if class == "" {
			class = "not specified"
		}
		return fmt.Sprintf("- Student class: %s.\n- Use school-age, age-appropriate expectations.\n- Keep the assessment at elementary or low-intermediate standards based on the student's performance.\n- Do not judge this learner using adult learner standards.", class)
	}
}

func (c *Client) runAssessmentResult(
	ctx context.Context,
	session *entity.AssessmentSession,
	userMessage string,
) (*entity.AssessmentResult, error) {
	language := displayLanguage(session.Language)
	systemPrompt := fmt.Sprintf(assessmentResultSystemPrompt, language, language, session.TopicScope, muslimFriendlyLanguageRules(session.Language), assessmentClassGuidance(session.Class), assessmentClassGuidance(session.Class), language)

	logger.Info("asessment result", "systemPrompt", systemPrompt)

	msgs := []goopenai.ChatCompletionMessage{
		{Role: goopenai.ChatMessageRoleSystem, Content: systemPrompt},
	}
	for _, m := range session.Messages {
		msgs = append(msgs, goopenai.ChatCompletionMessage{Role: m.Role, Content: m.Content})
	}
	if strings.TrimSpace(userMessage) != "" {
		msgs = append(msgs, goopenai.ChatCompletionMessage{Role: goopenai.ChatMessageRoleUser, Content: userMessage})
	}

	logger.Info("thirdparty request", "service", "openai", "operation", "assessment_result", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "message_count", len(msgs), "message_chars", messageContentChars(msgs), "max_tokens", 500, "temperature", 0.2, "module_id", session.ModuleID)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    msgs,
		Temperature: 0.2,
		MaxTokens:   500,
		ResponseFormat: &goopenai.ChatCompletionResponseFormat{
			Type: goopenai.ChatCompletionResponseFormatTypeJSONObject,
		},
	})
	if err != nil {
		logger.Error("thirdparty request failed", "service", "openai", "operation", "assessment_result", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", "err", err)
		return nil, fmt.Errorf("openai assessment result: %w", err)
	}
	logger.Info("thirdparty request completed", "service", "openai", "operation", "assessment_result", "model", model, "prompt_tokens", resp.Usage.PromptTokens, "completion_tokens", resp.Usage.CompletionTokens, "total_tokens", resp.Usage.TotalTokens)

	result := parseAssessmentResult(resp.Choices[0].Message.Content)
	if result == nil {
		return nil, fmt.Errorf("openai assessment result: invalid result payload")
	}
	return normalizeAssessmentResult(result, session.Language), nil
}

func (c *Client) assessmentUserMessageCount(messages []entity.Message, userMessage string) int {
	count := 0
	for _, m := range messages {
		if m.Role == goopenai.ChatMessageRoleUser {
			count++
		}
	}
	if strings.TrimSpace(userMessage) != "" {
		count++
	}
	return count
}

func parseAssessmentResult(raw string) *entity.AssessmentResult {
	start := strings.Index(raw, "<assessment_result>")
	end := strings.Index(raw, "</assessment_result>")
	jsonStr := strings.TrimSpace(raw)
	if start != -1 && end != -1 {
		jsonStr = strings.TrimSpace(raw[start+len("<assessment_result>") : end])
	}
	jsonStr = extractJSONObject(jsonStr)

	var r struct {
		CefrLevel    string   `json:"cefr_level"`
		Level        string   `json:"level"`
		Score        int      `json:"score"`
		Title        string   `json:"title"`
		Summary      string   `json:"summary"`
		Strengths    []string `json:"strengths"`
		Areas        []string `json:"areas"`
		Translations []struct {
			Language  string   `json:"language"`
			Title     string   `json:"title"`
			Summary   string   `json:"summary"`
			Strengths []string `json:"strengths"`
			Areas     []string `json:"areas"`
		} `json:"translations"`
	}
	if err := json.Unmarshal([]byte(jsonStr), &r); err != nil {
		return nil
	}
	translations := make([]entity.AssessmentTranslation, 0, len(r.Translations))
	for _, translation := range r.Translations {
		translations = append(translations, entity.AssessmentTranslation{
			Language:  strings.TrimSpace(translation.Language),
			Title:     strings.TrimSpace(translation.Title),
			Summary:   strings.TrimSpace(translation.Summary),
			Strengths: append([]string(nil), translation.Strengths...),
			Areas:     append([]string(nil), translation.Areas...),
		})
	}
	return &entity.AssessmentResult{
		CefrLevel:    entity.AssessmentLevel(r.CefrLevel),
		Level:        entity.AssessmentLevel(r.Level),
		Score:        r.Score,
		Title:        r.Title,
		Summary:      r.Summary,
		Strengths:    r.Strengths,
		Areas:        r.Areas,
		Translations: translations,
	}
}

func extractJSONObject(raw string) string {
	s := strings.TrimSpace(raw)
	if !strings.HasPrefix(s, "```") {
		return s
	}

	s = strings.TrimSpace(strings.TrimPrefix(s, "```"))
	if idx := strings.IndexByte(s, '\n'); idx != -1 {
		firstLine := strings.TrimSpace(s[:idx])
		if strings.EqualFold(firstLine, "json") {
			s = strings.TrimSpace(s[idx+1:])
		}
	}
	if end := strings.LastIndex(s, "```"); end != -1 {
		s = strings.TrimSpace(s[:end])
	}
	return s
}

func normalizeAssessmentResult(result *entity.AssessmentResult, language string) *entity.AssessmentResult {
	if result == nil {
		return nil
	}
	clone := *result
	clone.Level = entity.RelativeAssessmentLevel(clone.Score)
	clone.Title = normalizeAssessmentTitle(clone.Score, language)
	clone.Summary = normalizeAssessmentSummary(clone.Summary, clone.Score, language)
	clone.Strengths = append([]string(nil), result.Strengths...)
	clone.Areas = append([]string(nil), result.Areas...)
	clone.Translations = cloneAssessmentTranslations(result.Translations)
	return &clone
}

func cloneAssessmentTranslations(translations []entity.AssessmentTranslation) []entity.AssessmentTranslation {
	clone := make([]entity.AssessmentTranslation, 0, len(translations))
	for _, translation := range translations {
		clone = append(clone, entity.AssessmentTranslation{
			Language:  strings.TrimSpace(translation.Language),
			Title:     strings.TrimSpace(translation.Title),
			Summary:   strings.TrimSpace(translation.Summary),
			Strengths: append([]string(nil), translation.Strengths...),
			Areas:     append([]string(nil), translation.Areas...),
		})
	}
	return clone
}

func normalizeAssessmentTitle(score int, language string) string {
	switch strings.ToLower(strings.TrimSpace(language)) {
	case "arabic":
		if score >= 90 {
			return "ما شاء الله، أنت رائع"
		}
		if score >= 80 {
			return "سبحان الله، عمل رائع"
		}
		return "الحمد لله، واصل التقدم"
	default:
		if score >= 90 {
			return "MasyaAllah, You Are Awesome"
		}
		if score >= 80 {
			return "SubhanAllah, Great Work"
		}
		return "Alhamdulillah, Keep Going"
	}
}

func normalizeAssessmentSummary(summary string, score int, language string) string {
	opening, encouragement := assessmentSummaryOpening(language, score)
	summary = stripAssessmentSummaryOpening(summary)
	summary = strings.TrimSpace(summary)
	if summary == "" {
		return strings.TrimSpace(opening + " " + encouragement)
	}
	return strings.TrimSpace(opening + " " + encouragement + " " + summary)
}

func assessmentSummaryOpening(language string, score int) (string, string) {
	switch strings.ToLower(strings.TrimSpace(language)) {
	case "arabic":
		if score >= 80 {
			return "ما شاء الله.", "عمل ممتاز."
		}
		return "الحمد لله.", "واصل الدراسة وسأساعدك على التحسن."
	default:
		if score >= 90 {
			return "Masya Allah.", "Excellent work."
		}
		if score >= 80 {
			return "Subhanallah.", "Excellent work."
		}
		return "Alhamdulillah.", "Keep studying, and I will help you improve."
	}
}

func stripAssessmentSummaryOpening(summary string) string {
	summary = strings.TrimSpace(summary)
	for _, prefix := range []string{
		"Masya Allah.",
		"Masya Allah",
		"Subhanallah.",
		"Subhanallah",
		"Alhamdulillah.",
		"Alhamdulillah",
		"ما شاء الله.",
		"ما شاء الله",
		"سبحان الله.",
		"سبحان الله",
		"الحمد لله.",
		"الحمد لله",
	} {
		if strings.HasPrefix(summary, prefix) {
			return strings.TrimSpace(strings.TrimPrefix(summary, prefix))
		}
	}
	return summary
}

// ---- Learning Path ----

const learningPathPrompt = `You are a curriculum designer for Kaifa, a %s learning platform.

Generate a structured learning path for a student with the following profile:
- Language: %s
- Module: %s
- Topic scope: %s
- Level: %s
- Module activities: %s
- Vocabulary load target: %d words
- Grammar focus: %s
- Assessment score: %d/100
- Assessment summary: %s
- Student strengths: %s
- Areas to improve: %s

Language output rules:
- Write every user-facing learning path field in %s.
- The step title, description, and topic_scope must all be in %s.
- If the module metadata is in another language, translate/adapt it into %s instead of copying it.
- For Arabic modules, use Arabic script throughout user-facing text and do not use English transliteration.
- Keep JSON property names and activity enum values exactly as specified below.
- Return the Bahasa Indonesia translation inside a translations array with one object.

Return ONLY valid JSON in this exact format (no markdown, no extra text):
{
  "steps": [
    {
      "order": 1,
      "activity": "speaking|listening|reading|writing|vocabulary|grammar",
      "title": "Step title",
      "description": "Clear 1-2 sentence description of what the student will do and why.",
      "required_time": 10,
      "topic_scope": "Specific topic scope for this step",
      "progress": 0
    }
  ],
  "translations": [
    {
      "language": "bahasa indonesia",
      "topic_scope": "translated topic scope for the path",
      "steps": [
        {
          "order": 1,
          "activity": "translated activity",
          "title": "translated title",
          "description": "translated description",
          "topic_scope": "translated topic scope for the step"
        }
      ]
    }
  ]
}

Generate 4-6 steps, progressively building from foundation to application.
Use the module activities as the main activity sequence.
Tailor the sequence to close the student's assessment gaps while helping them achieve the vocabulary load target and grammar mastery.
Each step must stay inside the module topic scope, recycle target vocabulary, and practice at least one grammar focus item where useful.
Set progress to 0 for every new step.`

type learningPathTranslationStepResponse struct {
	Order       int    `json:"order"`
	Activity    string `json:"activity"`
	Title       string `json:"title"`
	Description string `json:"description"`
	TopicScope  string `json:"topic_scope"`
}

type learningPathTranslationResponse struct {
	Language   string                                `json:"language"`
	TopicScope string                                `json:"topic_scope"`
	Steps      []learningPathTranslationStepResponse `json:"steps"`
}

type learningPathResponse struct {
	Steps        []entity.LearningStep             `json:"steps"`
	Translations []learningPathTranslationResponse `json:"translations"`
}

func buildLearningPathPrompt(module *entity.Module, level string, assessment *entity.AssessmentResult) string {
	language := displayLanguage(module.Language)
	score := 0
	summary := "No assessment summary available."
	strengths := "none"
	areas := "Use the assessed level and module focus."
	if assessment != nil {
		score = assessment.Score
		summary = assessment.Summary
		strengths = strings.Join(assessment.Strengths, ", ")
		areas = strings.Join(assessment.Areas, ", ")
		if strings.TrimSpace(strengths) == "" {
			strengths = "none"
		}
		if strings.TrimSpace(areas) == "" {
			areas = "No specific areas recorded; reinforce module vocabulary and grammar focus."
		}
	}
	activities := strings.Join(module.Activities, ", ")
	if strings.TrimSpace(activities) == "" {
		activities = "speaking, vocabulary, grammar"
	}
	grammarFocus := strings.Join(module.GrammarFocus, ", ")
	if strings.TrimSpace(grammarFocus) == "" {
		grammarFocus = "general accuracy for the assessed level"
	}
	return fmt.Sprintf(
		learningPathPrompt,
		language,
		language,
		module.Title,
		module.TopicScope,
		level,
		activities,
		module.VocabularyLoad,
		grammarFocus,
		score,
		summary,
		strengths,
		areas,
		language,
		language,
		language,
	)
}

func (c *Client) GenerateLearningPath(
	ctx context.Context,
	module *entity.Module,
	level string,
	assessment *entity.AssessmentResult,
) (*entity.LearningPath, error) {
	prompt := buildLearningPathPrompt(module, level, assessment)
	cacheKey := c.learningPathCacheKey(prompt)
	if c.learningPathCacheEnabled {
		if cached := c.getLearningPathCache(cacheKey); cached != nil {
			return cached, nil
		}
	}

	msgs := []goopenai.ChatCompletionMessage{
		{Role: goopenai.ChatMessageRoleUser, Content: prompt},
	}
	logger.Info("thirdparty request", "service", "openai", "operation", "generate_learning_path", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "message_count", len(msgs), "message_chars", messageContentChars(msgs), "max_tokens", 1800, "temperature", 0.5, "module_id", module.ID)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    msgs,
		Temperature: 0.5,
		MaxTokens:   1800,
		ResponseFormat: &goopenai.ChatCompletionResponseFormat{
			Type: goopenai.ChatCompletionResponseFormatTypeJSONObject,
		},
	})
	if err != nil {
		logger.Error("thirdparty request failed", "service", "openai", "operation", "generate_learning_path", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "err", err)
		return nil, fmt.Errorf("openai generate path: %w", err)
	}
	logger.Info("thirdparty request completed", "service", "openai", "operation", "generate_learning_path", "model", model, "prompt_tokens", resp.Usage.PromptTokens, "completion_tokens", resp.Usage.CompletionTokens, "total_tokens", resp.Usage.TotalTokens)

	var result learningPathResponse
	content := extractJSONObject(resp.Choices[0].Message.Content)
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		logger.Error("thirdparty response parse failed", "service", "openai", "operation", "generate_learning_path", "model", model, "response_chars", len(resp.Choices[0].Message.Content), "err", err)
		return nil, fmt.Errorf("parse learning path json: %w", err)
	}

	path := &entity.LearningPath{
		Language:   module.Language,
		ModuleID:   module.ID,
		Level:      level,
		TopicScope: module.TopicScope,
		Steps:      result.Steps,
		TotalSteps: len(result.Steps),
	}
	applyLearningPathTranslations(path, result.Translations)
	if c.learningPathTransliterationEnabled {
		if err := transliterateGeneratedLearningPath(ctx, c.c, path); err != nil {
			logger.Error("thirdparty transliteration failed", "service", "openai", "operation", "transliterate_learning_path", "model", model, "module_id", module.ID, "err", err)
			return nil, fmt.Errorf("transliterate learning path: %w", err)
		}
	}
	if c.learningPathCacheEnabled {
		c.putLearningPathCache(cacheKey, path)
	}
	return path, nil
}

func applyLearningPathTranslations(path *entity.LearningPath, translations []learningPathTranslationResponse) {
	if path == nil {
		return
	}
	path.Translations = nil
	stepByOrder := make(map[int]*entity.LearningStep, len(path.Steps))
	for i := range path.Steps {
		stepByOrder[path.Steps[i].Order] = &path.Steps[i]
	}
	for _, translation := range translations {
		pathTranslation := entity.LearningPathTranslation{
			Language:   strings.TrimSpace(translation.Language),
			TopicScope: strings.TrimSpace(translation.TopicScope),
		}
		path.Translations = append(path.Translations, pathTranslation)
		for _, translatedStep := range translation.Steps {
			step, ok := stepByOrder[translatedStep.Order]
			if !ok {
				continue
			}
			step.Translations = []entity.LearningStepTranslation{{
				Language:           pathTranslation.Language,
				Activity:           strings.TrimSpace(translatedStep.Activity),
				Title:              strings.TrimSpace(translatedStep.Title),
				Description:        strings.TrimSpace(translatedStep.Description),
				TopicScope:         strings.TrimSpace(translatedStep.TopicScope),
				LearningPathStepID: step.ID,
			}}
		}
	}
}

func (c *Client) learningPathCacheKey(prompt string) string {
	sum := sha256.Sum256([]byte(prompt))
	return fmt.Sprintf("learning-path:%x:translit:%t", sum, c.learningPathTransliterationEnabled)
}

func (c *Client) getLearningPathCache(key string) *entity.LearningPath {
	c.learningPathCacheMu.RLock()
	defer c.learningPathCacheMu.RUnlock()

	path, ok := c.learningPathCache[key]
	if !ok || path == nil {
		return nil
	}
	clone := cloneLearningPath(path)
	return &clone
}

func (c *Client) putLearningPathCache(key string, path *entity.LearningPath) {
	if path == nil {
		return
	}
	clone := cloneLearningPath(path)
	c.learningPathCacheMu.Lock()
	defer c.learningPathCacheMu.Unlock()
	c.learningPathCache[key] = &clone
}

func cloneLearningPath(path *entity.LearningPath) entity.LearningPath {
	if path == nil {
		return entity.LearningPath{}
	}
	clone := *path
	clone.Translations = append([]entity.LearningPathTranslation(nil), path.Translations...)
	clone.Steps = append([]entity.LearningStep(nil), path.Steps...)
	for i := range clone.Steps {
		clone.Steps[i].Target = append([]string(nil), path.Steps[i].Target...)
		clone.Steps[i].Translations = append([]entity.LearningStepTranslation(nil), path.Steps[i].Translations...)
	}
	return clone
}

func transliterateGeneratedLearningPath(ctx context.Context, client *goopenai.Client, path *entity.LearningPath) error {
	if path == nil || !strings.EqualFold(strings.TrimSpace(path.Language), "arabic") {
		return nil
	}
	var err error
	path.TopicScopeRomanized, err = transliterateArabicTextWithAI(ctx, client, path.ID, "learning path topic scope", path.TopicScope)
	if err != nil {
		return err
	}
	for i := range path.Steps {
		step := &path.Steps[i]
		step.ActivityRomanized = step.Activity
		step.TitleRomanized, err = transliterateArabicTextWithAI(ctx, client, step.ID, "learning step title", step.Title)
		if err != nil {
			return err
		}
		step.DescriptionRomanized, err = transliterateArabicTextWithAI(ctx, client, step.ID, "learning step description", step.Description)
		if err != nil {
			return err
		}
		step.TopicScopeRomanized, err = transliterateArabicTextWithAI(ctx, client, step.ID, "learning step topic scope", step.TopicScope)
		if err != nil {
			return err
		}
	}
	return nil
}

func buildLearningPathBahasaIndonesiaTranslationPrompt(module *entity.Module, path *entity.LearningPath) string {
	source := struct {
		ID         string `json:"id"`
		Language   string `json:"language"`
		TopicScope string `json:"topic_scope"`
		Steps      []struct {
			Order       int    `json:"order"`
			Activity    string `json:"activity"`
			Title       string `json:"title"`
			Description string `json:"description"`
			TopicScope  string `json:"topic_scope"`
		} `json:"steps"`
	}{
		ID:         path.ID,
		Language:   path.Language,
		TopicScope: path.TopicScope,
		Steps: make([]struct {
			Order       int    `json:"order"`
			Activity    string `json:"activity"`
			Title       string `json:"title"`
			Description string `json:"description"`
			TopicScope  string `json:"topic_scope"`
		}, len(path.Steps)),
	}
	for i, step := range path.Steps {
		source.Steps[i] = struct {
			Order       int    `json:"order"`
			Activity    string `json:"activity"`
			Title       string `json:"title"`
			Description string `json:"description"`
			TopicScope  string `json:"topic_scope"`
		}{
			Order:       step.Order,
			Activity:    step.Activity,
			Title:       step.Title,
			Description: step.Description,
			TopicScope:  step.TopicScope,
		}
	}
	pathJSON, _ := json.Marshal(source)
	return fmt.Sprintf(`Translate the following learning path into Bahasa Indonesia.

Source language: %s
Module: %s
Return only valid JSON in this exact format:
{
  "topic_scope": "translated topic scope for the path",
  "steps": [
    {
      "order": 1,
      "activity": "translated activity",
      "title": "translated title",
      "description": "translated description",
      "topic_scope": "translated topic scope for the step"
    }
  ]
}

Rules:
- Translate only the path topic_scope and each step's activity, title, description, and topic_scope.
- Preserve the step order values exactly.
- Do not translate IDs, language, level, required_time, progress, target, or total_steps.
- Keep the output concise and natural in Bahasa Indonesia.

Learning path JSON:
%s`, displayLanguage(module.Language), module.Title, string(pathJSON))
}

func transliterateArabicTextWithAI(ctx context.Context, client *goopenai.Client, subjectID string, fieldLabel string, text string) (string, error) {
	text = strings.TrimSpace(text)
	if text == "" || !containsArabicRune(text) {
		return text, nil
	}

	prompt := fmt.Sprintf(`Transliterate the following Arabic text into Latin script.

Return only valid JSON in this exact format:
{
  "romanized": "romanized text"
}

Rules:
- Do not translate meaning.
- Keep the output concise and natural.
- Return only JSON, with no markdown or code fences.

Field: %s
Text:
%s`, fieldLabel, text)

	msgs := []goopenai.ChatCompletionMessage{
		{Role: goopenai.ChatMessageRoleUser, Content: prompt},
	}
	logger.Info("thirdparty request", "service", "openai", "operation", "transliterate_text", "model", model, "message_count", len(msgs), "message_chars", messageContentChars(msgs), "max_tokens", 200, "temperature", 0.2, "subject_id", subjectID, "field", fieldLabel)
	resp, err := client.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    msgs,
		Temperature: 0.2,
		MaxTokens:   200,
		ResponseFormat: &goopenai.ChatCompletionResponseFormat{
			Type: goopenai.ChatCompletionResponseFormatTypeJSONObject,
		},
	})
	if err != nil {
		return "", fmt.Errorf("openai transliterate %s: %w", fieldLabel, err)
	}

	var result struct {
		Romanized string `json:"romanized"`
	}
	content := extractJSONObject(resp.Choices[0].Message.Content)
	if err := json.Unmarshal([]byte(content), &result); err != nil {
		return "", fmt.Errorf("parse transliteration json for %s: %w", fieldLabel, err)
	}
	result.Romanized = strings.TrimSpace(result.Romanized)
	if result.Romanized == "" {
		return "", fmt.Errorf("empty transliteration for %s", fieldLabel)
	}
	return result.Romanized, nil
}

func containsArabicRune(text string) bool {
	for _, r := range text {
		if r >= 0x0600 && r <= 0x06FF {
			return true
		}
	}
	return false
}

// ---- Learning Chat ----

const startLearningChatPrompt = `You are Kaifa, a friendly and patient Muslim teacher and %s tutor.

Start a learning chat for this student.

Student profile:
- Language: %s
- Module: "%s"
- Level: %s
- Topic scope (strict): %s
- Vocabulary load target: %d
- Grammar focus: %s

Muslim-friendly language rules:
%s

Opening rule:
%s

Rules:
- If this is the first message in the student's conversation, start with the required salaam before saying hi, hello, or any other greeting, and greet the student warmly.
- Start with one simple question inside the topic scope.
- Use vocabulary appropriate for the student's level.
- Keep it concise, 2-3 sentences.
- Do not ask about unrelated topics.`

func (c *Client) StartLearningChat(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
) (string, error) {
	prompt := fmt.Sprintf(
		startLearningChatPrompt,
		displayLanguage(session.Language),
		displayLanguage(session.Language),
		module.Title,
		session.Level,
		session.TopicScope,
		module.VocabularyLoad,
		strings.Join(module.GrammarFocus, ", "),
		muslimFriendlyLanguageRules(session.Language),
		openingGreetingRule(session.Language),
	)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    []goopenai.ChatCompletionMessage{{Role: goopenai.ChatMessageRoleUser, Content: prompt}},
		Temperature: 0.6,
		MaxTokens:   180,
	})
	if err != nil {
		return "", fmt.Errorf("openai start learning chat: %w", err)
	}
	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

const learningSystemPrompt = `You are Kaifa, a friendly and patient Muslim teacher and %s tutor.

Student profile:
- Language: %s
- Module: learning "%s"
- Level: %s
- Topic scope (strict): %s
- Vocabulary load target: introduce and recycle as many of these %d target words as practical across the module without overwhelming the student.
- Grammar focus: %s
- Current learning step: %d of %d — "%s"

Muslim-friendly language rules:
%s

Teaching rules:
1. Teach and converse only about topics within the topic scope above.
2. For every student message, check whether it stays within the topic scope before answering.
3. If the student asks about something outside the scope, do not answer the unrelated topic. Acknowledge it briefly and redirect in %s:
   "Interesting topic, but for now let's focus on [topic]. Let's continue the lesson."
   Translate/adapt this redirect into %s and adapt it to the module topic.
4. Check the student's answer against the grammar focus. Briefly correct grammar errors that relate to the grammar focus, then show one improved example.
5. Introduce useful vocabulary from the topic scope gradually and keep recycling it. Do not dump a word list unless the student asks.
6. Adapt your language complexity to the student's level.
7. Keep every user-facing reply, correction, example, follow-up question, and guardrail redirect in %s.
8. Occasionally ask follow-up questions to keep the student engaged.`

func (c *Client) ChatLearning(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	userMessage string,
) (string, error) {
	currentTitle := "Introduction"
	totalSteps := 0
	if session.LearningPath != nil {
		totalSteps = session.LearningPath.TotalSteps
		for _, s := range session.LearningPath.Steps {
			if s.Order == session.CurrentStep {
				currentTitle = s.Title
				break
			}
		}
	}

	systemPrompt := buildLearningSystemPrompt(module, session, currentTitle, totalSteps)

	msgs := []goopenai.ChatCompletionMessage{
		{Role: goopenai.ChatMessageRoleSystem, Content: systemPrompt},
	}
	for _, m := range session.Messages {
		msgs = append(msgs, goopenai.ChatCompletionMessage{Role: m.Role, Content: m.Content})
	}
	msgs = append(msgs, goopenai.ChatCompletionMessage{Role: goopenai.ChatMessageRoleUser, Content: userMessage})

	logger.Info("thirdparty request", "service", "openai", "operation", "learning_chat", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "message_count", len(msgs), "message_chars", messageContentChars(msgs), "max_tokens", 400, "temperature", 0.7, "module_id", session.ModuleID, "current_step", session.CurrentStep)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    msgs,
		Temperature: 0.7,
		MaxTokens:   400,
	})
	if err != nil {
		logger.Error("thirdparty request failed", "service", "openai", "operation", "learning_chat", "model", model, "api_key_suffix", c.apiKeySuffix, "api_key_hash8", c.apiKeyHash8, "err", err)
		return "", fmt.Errorf("openai learning chat: %w", err)
	}
	logger.Info("thirdparty request completed", "service", "openai", "operation", "learning_chat", "model", model, "prompt_tokens", resp.Usage.PromptTokens, "completion_tokens", resp.Usage.CompletionTokens, "total_tokens", resp.Usage.TotalTokens)

	return resp.Choices[0].Message.Content, nil
}

func buildLearningSystemPrompt(module *entity.Module, session *entity.LearningSession, currentTitle string, totalSteps int) string {
	language := displayLanguage(session.Language)
	return fmt.Sprintf(
		learningSystemPrompt,
		language,
		language,
		module.Title,
		session.Level,
		session.TopicScope,
		module.VocabularyLoad,
		strings.Join(module.GrammarFocus, ", "),
		session.CurrentStep,
		totalSteps,
		currentTitle,
		muslimFriendlyLanguageRules(session.Language),
		language,
		language,
		language,
	)
}

const listeningParagraphPrompt = `You are Kaifa, a Muslim teacher and %s listening tutor.

Create one listening paragraph for this module.

Module:
- Language: %s
- Title: %s
- Topic scope: %s
- Grammar focus: %s
- Vocabulary load target: %d
- Student level: %s

Muslim-friendly language rules:
%s

Rules:
- Return only the paragraph text.
- Use the target language.
- Minimum 100 words and maximum 150 words.
- Stay strictly inside the topic scope.
- Include natural examples of the grammar focus.
- Introduce useful vocabulary from the topic scope without making the passage unnatural.`

func (c *Client) GenerateListeningParagraph(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
) (string, error) {
	prompt := fmt.Sprintf(
		listeningParagraphPrompt,
		displayLanguage(session.Language),
		displayLanguage(session.Language),
		module.Title,
		session.TopicScope,
		strings.Join(module.GrammarFocus, ", "),
		module.VocabularyLoad,
		session.Level,
		muslimFriendlyLanguageRules(session.Language),
	)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    []goopenai.ChatCompletionMessage{{Role: goopenai.ChatMessageRoleUser, Content: prompt}},
		Temperature: 0.5,
		MaxTokens:   260,
	})
	if err != nil {
		return "", fmt.Errorf("openai listening paragraph: %w", err)
	}
	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

const listeningQuestionPrompt = `You are Kaifa, a Muslim teacher and %s listening tutor.

The student listened to or read this material:
%s

Previous listening questions and answers:
%s

Ask question %d of 5 to check listening comprehension.

Muslim-friendly language rules:
%s

Rules:
- Return only one question.
- Use the target language.
- The question must be directly answerable using only an explicit detail stated in the material.
- Do not ask about background knowledge, opinions, inferences, or details that are not written in the material.
- Before returning the question, silently verify the exact answer appears in the material.
- Keep the question appropriate for level %s.
- Stay inside this module topic scope: %s`

func (c *Client) GenerateListeningQuestion(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	paragraph string,
	questionNumber int,
) (string, error) {
	prompt := fmt.Sprintf(
		listeningQuestionPrompt,
		displayLanguage(session.Language),
		paragraph,
		formatMessages(session.Messages),
		questionNumber,
		muslimFriendlyLanguageRules(session.Language),
		session.Level,
		session.TopicScope,
	)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    []goopenai.ChatCompletionMessage{{Role: goopenai.ChatMessageRoleUser, Content: prompt}},
		Temperature: 0.4,
		MaxTokens:   80,
	})
	if err != nil {
		return "", fmt.Errorf("openai listening question: %w", err)
	}
	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

func formatMessages(messages []entity.Message) string {
	if len(messages) == 0 {
		return "None yet."
	}
	lines := make([]string, 0, len(messages))
	for _, message := range messages {
		lines = append(lines, fmt.Sprintf("%s: %s", message.Role, message.Content))
	}
	return strings.Join(lines, "\n")
}

const listeningAssessmentPrompt = `You are Kaifa, a Muslim teacher and %s listening assessor.

Assess the student's listening comprehension using the paragraph and answers below.

Paragraph:
%s

Student answers:
%s

Muslim-friendly language rules:
%s

Return ONLY valid JSON with this shape:
{
  "score": <0-100>,
  "summary": "Short summary of the student's listening skill in the target language. Include the required completion phrase.",
  "strengths": ["strength 1", "strength 2"],
  "areas": ["area 1", "area 2"]
}`

func (c *Client) AssessListening(
	ctx context.Context,
	module *entity.Module,
	session *entity.LearningSession,
	paragraph string,
	answers []string,
) (*entity.ListeningAssessment, error) {
	_ = module
	answerLines := make([]string, 0, len(answers))
	for i, answer := range answers {
		answerLines = append(answerLines, fmt.Sprintf("%d. %s", i+1, answer))
	}
	prompt := fmt.Sprintf(
		listeningAssessmentPrompt,
		displayLanguage(session.Language),
		paragraph,
		strings.Join(answerLines, "\n"),
		muslimFriendlyLanguageRules(session.Language),
	)
	resp, err := c.c.CreateChatCompletion(ctx, goopenai.ChatCompletionRequest{
		Model:       model,
		Messages:    []goopenai.ChatCompletionMessage{{Role: goopenai.ChatMessageRoleUser, Content: prompt}},
		Temperature: 0.2,
		MaxTokens:   300,
		ResponseFormat: &goopenai.ChatCompletionResponseFormat{
			Type: goopenai.ChatCompletionResponseFormatTypeJSONObject,
		},
	})
	if err != nil {
		return nil, fmt.Errorf("openai listening assessment: %w", err)
	}

	var assessment entity.ListeningAssessment
	if err := json.Unmarshal([]byte(resp.Choices[0].Message.Content), &assessment); err != nil {
		return nil, fmt.Errorf("parse listening assessment json: %w", err)
	}
	return &assessment, nil
}

func messageContentChars(messages []goopenai.ChatCompletionMessage) int {
	total := 0
	for _, message := range messages {
		total += len(message.Content)
	}
	return total
}

func displayLanguage(language string) string {
	switch strings.ToLower(strings.TrimSpace(language)) {
	case "arabic":
		return "Arabic"
	case "english", "":
		return "English"
	default:
		return language
	}
}

func muslimFriendlyLanguageRules(language string) string {
	if strings.EqualFold(strings.TrimSpace(language), "arabic") {
		return strings.Join([]string{
			`- When an assessment is complete, include "الحمد لله".`,
			`- When the student's answer is excellent and you want to compliment them, use either "سبحان الله" or "ما شاء الله".`,
			`- Use Arabic script for these Islamic phrases in Arabic-language modules; do not transliterate them with English letters.`,
		}, "\n")
	}
	return strings.Join([]string{
		`- When an assessment is complete, include "Alhamdulillah".`,
		`- When the student's answer is excellent and you want to compliment them, use either "Subhanallah" or "Masya Allah".`,
		`- Use English alphabet transliteration for these Islamic phrases in English-language modules; do not use Arabic script.`,
	}, "\n")
}

func openingGreetingRule(language string) string {
	if strings.EqualFold(strings.TrimSpace(language), "arabic") {
		return `- If this is the first message in the student's conversation, begin with "السلام عليكم".`
	}
	return `- If this is the first message in the student's conversation, begin with "Assalaamu'alaykum".`
}

func secretSuffix(secret string) string {
	if len(secret) <= 4 {
		return "****"
	}
	return secret[len(secret)-4:]
}

func secretHash8(secret string) string {
	if secret == "" {
		return ""
	}
	sum := sha256.Sum256([]byte(secret))
	return hex.EncodeToString(sum[:])[:8]
}
