package config

import "testing"

func TestLoadDefaultsEnvToDev(t *testing.T) {
	t.Setenv("env", "")

	cfg := Load()

	if cfg.Env != "dev" {
		t.Fatalf("expected env to default to dev, got %q", cfg.Env)
	}
	if cfg.LearningPathCacheEnabled {
		t.Fatal("expected learning path cache to default to false")
	}
	if cfg.LearningPathTransliterationEnabled {
		t.Fatal("expected learning path transliteration to default to false")
	}
}

func TestLoadLearningPathFlagsFromEnv(t *testing.T) {
	t.Setenv("LEARNING_PATH_CACHE_ENABLED", "true")
	t.Setenv("LEARNING_PATH_TRANSLITERATION_ENABLED", "true")

	cfg := Load()

	if !cfg.LearningPathCacheEnabled {
		t.Fatal("expected learning path cache to load from env")
	}
	if !cfg.LearningPathTransliterationEnabled {
		t.Fatal("expected learning path transliteration to load from env")
	}
}
