package memory_test

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"

	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
)

func TestGetSyllabi_ReturnsEnglishAndArabicSyllabi(t *testing.T) {
	syllabi := memory.GetSyllabi()
	assert.Len(t, syllabi, 6)

	var englishCount, arabicCount int
	for _, s := range syllabi {
		switch s.Language {
		case "english":
			englishCount++
		case "arabic":
			arabicCount++
		}
	}
	assert.Equal(t, 3, englishCount)
	assert.Equal(t, 3, arabicCount)
}

func TestGetSyllabi_OmitsModulesFromListView(t *testing.T) {
	for _, s := range memory.GetSyllabi() {
		assert.Nil(t, s.Modules, "modules should be nil in list view for syllabus %s", s.ID)
	}
}

func TestListSyllabiByLanguage_ReturnsOnlyRequestedLanguage(t *testing.T) {
	repo := memory.NewSyllabusRepository()

	syllabi, err := repo.ListSyllabiByLanguage(context.Background(), "arabic")
	require.NoError(t, err)
	require.Len(t, syllabi, 3)

	for _, s := range syllabi {
		assert.Equal(t, "arabic", s.Language)
		assert.Nil(t, s.Modules)
	}
}

func TestGetSyllabusByID_ReturnsCorrectSyllabus(t *testing.T) {
	s := memory.GetSyllabusByID("syl-arab-vii-01")

	require.NotNil(t, s)
	assert.Equal(t, "syl-arab-vii-01", s.ID)
	assert.Equal(t, "As-salamu alaykum", s.TitleRomanized)
	assert.Equal(t, "At-tahiyyat wa at-taaruf", s.DescriptionRomanized)
	assert.Equal(t, "VII", s.Class)
	require.Len(t, s.Translations, 1)
	assert.Equal(t, "bahasa indonesia", s.Translations[0].Language)
	assert.Equal(t, "Assalamu'alaikum", s.Translations[0].Title)
}

func TestGetSyllabusByID_ReturnsNilForUnknown(t *testing.T) {
	assert.Nil(t, memory.GetSyllabusByID("syl-999"))
}

func TestGetModulesBySyllabusID_ReturnsModules(t *testing.T) {
	tests := []struct {
		syllabusID string
		count      int
	}{
		{"syl-eng-vii-01", 3},
		{"syl-eng-vii-02", 3},
		{"syl-eng-vii-03", 2},
		{"syl-arab-vii-01", 3},
		{"syl-arab-vii-02", 3},
		{"syl-arab-vii-03", 2},
	}
	for _, tt := range tests {
		t.Run(tt.syllabusID, func(t *testing.T) {
			modules := memory.GetModulesBySyllabusID(tt.syllabusID)
			assert.Len(t, modules, tt.count)
		})
	}
}

func TestGetModulesBySyllabusID_ReturnsNilForUnknown(t *testing.T) {
	assert.Nil(t, memory.GetModulesBySyllabusID("syl-999"))
}

func TestGetModuleByID_ReturnsCorrectModule(t *testing.T) {
	tests := []struct {
		moduleID               string
		expectedTitle          string
		expectedRomanizedTitle string
	}{
		{"mod-eng-vii-04", "This Is My World", ""},
		{"mod-eng-vii-08", "That's What Friends Are Supposed To Do", ""},
		{"mod-arab-vii-01", "صباح الخير، كيف حالك؟", "Sabah al-khayr, kayfa haluk?"},
	}
	for _, tt := range tests {
		t.Run(tt.moduleID, func(t *testing.T) {
			m := memory.GetModuleByID(tt.moduleID)
			require.NotNil(t, m)
			assert.Equal(t, tt.moduleID, m.ID)
			assert.Equal(t, tt.expectedTitle, m.Title)
			assert.Equal(t, tt.expectedRomanizedTitle, m.TitleRomanized)
			if tt.moduleID == "mod-arab-vii-01" {
				require.Len(t, m.Translations, 1)
				assert.Equal(t, "bahasa indonesia", m.Translations[0].Language)
				assert.Equal(t, "Selamat pagi, apa kabar?", m.Translations[0].Title)
			}
		})
	}
}

func TestGetModuleByID_ReturnsNilForUnknown(t *testing.T) {
	assert.Nil(t, memory.GetModuleByID("mod-999"))
}

func TestModules_HaveTopicScopeAndLanguage(t *testing.T) {
	for _, s := range []string{"syl-eng-vii-01", "syl-eng-vii-02", "syl-eng-vii-03", "syl-arab-vii-01", "syl-arab-vii-02", "syl-arab-vii-03"} {
		for _, m := range memory.GetModulesBySyllabusID(s) {
			assert.NotEmpty(t, m.TopicScope, "module %s must have a topic_scope for guardrail", m.ID)
			assert.NotEmpty(t, m.Language, "module %s must have a language", m.ID)
		}
	}
}
