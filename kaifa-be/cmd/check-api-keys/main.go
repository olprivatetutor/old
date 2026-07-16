package main

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

const (
	deepgramProjectsURL     = "https://api.deepgram.com/v1/projects"
	elevenLabsTTSURL        = "https://api.elevenlabs.io/v1/text-to-speech/%s"
	elevenLabsDefaultVoice  = "21m00Tcm4TlvDq8ikWAM"
	elevenLabsTTSModel      = "eleven_turbo_v2_5"
	elevenLabsTestText      = "test"
	elevenLabsExpectedMedia = "audio/mpeg"
)

type checkResult struct {
	name   string
	ok     bool
	detail string
}

func main() {
	envFile := flag.String("env", ".env", "path to env file")
	timeout := flag.Duration("timeout", 15*time.Second, "HTTP request timeout")
	flag.Parse()

	if err := godotenv.Load(*envFile); err != nil && !os.IsNotExist(err) {
		fmt.Fprintf(os.Stderr, "warning: could not load %s: %v\n", *envFile, err)
	}

	fmt.Println("deepgram apikey ", os.Getenv("DEEPGRAM_API_KEY"))
	fmt.Println("elevenlabs apikey ", os.Getenv("ELEVENLABS_API_KEY"))

	client := &http.Client{Timeout: *timeout}
	ctx := context.Background()

	results := []checkResult{
		checkDeepgram(ctx, client, strings.TrimSpace(os.Getenv("DEEPGRAM_API_KEY"))),
		checkElevenLabs(ctx, client, strings.TrimSpace(os.Getenv("ELEVENLABS_API_KEY")), elevenLabsVoiceID()),
	}

	failed := false
	for _, result := range results {
		status := "OK"
		if !result.ok {
			status = "FAIL"
			failed = true
		}
		fmt.Printf("[%s] %s: %s\n", status, result.name, result.detail)
	}

	if failed {
		os.Exit(1)
	}
}

func checkDeepgram(ctx context.Context, client *http.Client, apiKey string) checkResult {
	if apiKey == "" {
		return checkResult{name: "Deepgram", detail: "DEEPGRAM_API_KEY is not set"}
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, deepgramProjectsURL, nil)
	if err != nil {
		return checkResult{name: "Deepgram", detail: err.Error()}
	}
	req.Header.Set("Authorization", "Token "+apiKey)
	req.Header.Set("User-Agent", "kaifa-be-api-key-check/1.0")

	return doCheck(client, req, "Deepgram")
}

func checkElevenLabs(ctx context.Context, client *http.Client, apiKey, voiceID string) checkResult {
	if apiKey == "" {
		return checkResult{name: "ElevenLabs", detail: "ELEVENLABS_API_KEY is not set"}
	}

	body, err := json.Marshal(map[string]string{
		"text":     elevenLabsTestText,
		"model_id": elevenLabsTTSModel,
	})
	if err != nil {
		return checkResult{name: "ElevenLabs", detail: err.Error()}
	}

	url := fmt.Sprintf(elevenLabsTTSURL, voiceID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return checkResult{name: "ElevenLabs", detail: err.Error()}
	}
	req.Header.Set("xi-api-key", apiKey)
	req.Header.Set("Accept", elevenLabsExpectedMedia)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "kaifa-be-api-key-check/1.0")

	return doCheck(client, req, "ElevenLabs")
}

func doCheck(client *http.Client, req *http.Request, name string) checkResult {
	resp, err := client.Do(req)
	if err != nil {
		return checkResult{name: name, detail: err.Error()}
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		return checkResult{name: name, ok: true, detail: fmt.Sprintf("authenticated successfully (%s)", resp.Status)}
	}

	body, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	detail := fmt.Sprintf("request returned %s", resp.Status)
	if trimmed := strings.TrimSpace(string(body)); trimmed != "" {
		detail += ": " + compact(trimmed)
	}
	return checkResult{name: name, detail: detail}
}

func compact(s string) string {
	fields := strings.Fields(s)
	if len(fields) == 0 {
		return ""
	}
	return strings.Join(fields, " ")
}

func elevenLabsVoiceID() string {
	if voiceID := strings.TrimSpace(os.Getenv("ELEVENLABS_VOICE_ID")); voiceID != "" {
		return voiceID
	}
	return elevenLabsDefaultVoice
}
