package postgres

import (
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/domain/entity"
)

func TestNormalizeLearningStepTranslationOverridesCallerProvidedID(t *testing.T) {
	translation := normalizeLearningStepTranslation(entity.LearningStepTranslation{
		ID:          "custom-id",
		Language:    "Bahasa Indonesia",
		Activity:    " speaking ",
		Title:       " title ",
		Description: " description ",
		TopicScope:  " topic scope ",
	}, "lp-123-step-1")

	if translation.ID != "lp-123-step-1-bahasa-indonesia" {
		t.Fatalf("unexpected translation ID: %q", translation.ID)
	}
	if translation.LearningPathStepID != "lp-123-step-1" {
		t.Fatalf("unexpected learning path step ID: %q", translation.LearningPathStepID)
	}
}

func TestNormalizeLearningPathTranslationOverridesCallerProvidedID(t *testing.T) {
	translation := normalizeLearningPathTranslation(entity.LearningPathTranslation{
		ID:         "custom-id",
		Language:   "Bahasa Indonesia",
		TopicScope: " topic scope ",
	}, "lp-123")

	if translation.ID != "lp-123-bahasa-indonesia" {
		t.Fatalf("unexpected translation ID: %q", translation.ID)
	}
	if translation.LearningPathID != "lp-123" {
		t.Fatalf("unexpected learning path ID: %q", translation.LearningPathID)
	}
}
