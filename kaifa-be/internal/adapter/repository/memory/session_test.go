package memory_test

import (
	"context"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/adapter/repository/memory"
	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAssessmentSessionRepository_AllowsOneActiveModulePerLanguage(t *testing.T) {
	repo := memory.NewAssessmentSessionRepository()
	ctx := context.Background()

	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.AssessmentSession{
		Language: "english",
		ModuleID: "mod-001",
	}))
	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.AssessmentSession{
		Language: "arabic",
		ModuleID: "mod-010",
	}))
	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.AssessmentSession{
		Language: "english",
		ModuleID: "mod-002",
	}))

	oldEnglish, err := repo.Get(ctx, "stdnt0001", "mod-001")
	require.NoError(t, err)
	assert.Nil(t, oldEnglish)

	currentEnglish, err := repo.Get(ctx, "stdnt0001", "mod-002")
	require.NoError(t, err)
	require.NotNil(t, currentEnglish)
	assert.Equal(t, "english", currentEnglish.Language)

	currentArabic, err := repo.Get(ctx, "stdnt0001", "mod-010")
	require.NoError(t, err)
	require.NotNil(t, currentArabic)
	assert.Equal(t, "arabic", currentArabic.Language)
}

func TestLearningSessionRepository_AllowsMultipleLearningPathsPerStudent(t *testing.T) {
	repo := memory.NewLearningSessionRepository()
	ctx := context.Background()

	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.LearningSession{
		LearningPathID: "lp-001",
		Language:       "english",
		ModuleID:       "mod-001",
	}))
	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.LearningSession{
		LearningPathID: "lp-010",
		Language:       "arabic",
		ModuleID:       "mod-010",
	}))
	require.NoError(t, repo.Save(ctx, "stdnt0001", entity.LearningSession{
		LearningPathID: "lp-002",
		Language:       "english",
		ModuleID:       "mod-002",
	}))

	firstEnglish, err := repo.GetByPathID(ctx, "stdnt0001", "lp-001")
	require.NoError(t, err)
	require.NotNil(t, firstEnglish)
	assert.Equal(t, "mod-001", firstEnglish.ModuleID)

	secondEnglish, err := repo.GetByPathID(ctx, "stdnt0001", "lp-002")
	require.NoError(t, err)
	require.NotNil(t, secondEnglish)
	assert.Equal(t, "mod-002", secondEnglish.ModuleID)

	currentArabic, err := repo.Get(ctx, "stdnt0001", "mod-010")
	require.NoError(t, err)
	require.NotNil(t, currentArabic)
	assert.Equal(t, "arabic", currentArabic.Language)
}
