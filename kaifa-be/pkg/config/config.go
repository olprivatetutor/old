package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Env                                string
	Port                               string
	OpenAIKey                          string
	DeepgramKey                        string
	ElevenLabsKey                      string
	ElevenLabsVoiceID                  string
	AllowedOrigins                     string
	JWTSecret                          string
	DatabaseURL                        string
	LearningPathCacheEnabled           bool
	LearningPathTransliterationEnabled bool
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}
	return &Config{
		Env:                                getEnv("env", "dev"),
		Port:                               getEnv("PORT", "8080"),
		OpenAIKey:                          getEnv("OPENAI_API_KEY", ""),
		DeepgramKey:                        getEnv("DEEPGRAM_API_KEY", ""),
		ElevenLabsKey:                      getEnv("ELEVENLABS_API_KEY", ""),
		ElevenLabsVoiceID:                  getEnv("ELEVENLABS_VOICE_ID", "21m00Tcm4TlvDq8ikWAM"), // Rachel (default)
		AllowedOrigins:                     getEnv("ALLOWED_ORIGINS", "*"),
		JWTSecret:                          getEnv("JWT_SECRET", ""),
		DatabaseURL:                        getEnv("DATABASE_URL", ""),
		LearningPathCacheEnabled:           getEnvBool("LEARNING_PATH_CACHE_ENABLED", false),
		LearningPathTransliterationEnabled: getEnvBool("LEARNING_PATH_TRANSLITERATION_ENABLED", false),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}

func getEnvBool(key string, fallback bool) bool {
	value := os.Getenv(key)
	if value == "" {
		return fallback
	}
	parsed, err := strconv.ParseBool(value)
	if err != nil {
		return fallback
	}
	return parsed
}
