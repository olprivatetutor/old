package elevenlabs

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
)

const (
	baseURL              = "https://api.elevenlabs.io/v1"
	ttsModel             = "eleven_turbo_v2_5"
	chunkSize            = 4096
	errorBodyLogMaxBytes = 4096
)

type Client struct {
	apiKey  string
	voiceID string
	http    *http.Client
}

func NewClient(apiKey, voiceID string) *Client {
	return &Client{
		apiKey:  apiKey,
		voiceID: voiceID,
		http:    &http.Client{},
	}
}

type ttsRequest struct {
	Text    string `json:"text"`
	ModelID string `json:"model_id"`
}

func (c *Client) voiceIDForContext(ctx context.Context) string {
	if voiceID, ok := port.TTSVoiceIDFromContext(ctx); ok {
		return voiceID
	}
	return c.voiceID
}

// Synthesize generates audio for the full text and returns a reader (MP3).
func (c *Client) Synthesize(ctx context.Context, text string) (io.ReadCloser, error) {
	body, err := json.Marshal(ttsRequest{Text: text, ModelID: ttsModel})
	if err != nil {
		logger.Error("thirdparty request build failed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "err", err)
		return nil, err
	}

	voiceID := c.voiceIDForContext(ctx)
	url := fmt.Sprintf("%s/text-to-speech/%s", baseURL, voiceID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		logger.Error("thirdparty request build failed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "err", err)
		return nil, err
	}
	req.Header.Set("xi-api-key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "audio/mpeg")

	logger.Info("thirdparty request", "service", "elevenlabs", "operation", "synthesize", "method", http.MethodPost, "url", url, "model", ttsModel, "voice_id", voiceID, "text_chars", len(text), "request_bytes", len(body))
	resp, err := c.http.Do(req)
	if err != nil {
		logger.Error("thirdparty request failed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "voice_id", voiceID, "err", err)
		return nil, fmt.Errorf("elevenlabs synthesize: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		errorBody := readErrorBody(resp.Body)
		logger.Error("thirdparty request failed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "voice_id", voiceID, "status", resp.StatusCode, "response_body", errorBody)
		return nil, fmt.Errorf("elevenlabs synthesize: status %d", resp.StatusCode)
	}

	audio, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Error("thirdparty response read failed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "voice_id", voiceID, "status", resp.StatusCode, "err", err)
		return nil, fmt.Errorf("elevenlabs synthesize: read response: %w", err)
	}

	logger.Info("thirdparty request completed", "service", "elevenlabs", "operation", "synthesize", "model", ttsModel, "voice_id", voiceID, "status", resp.StatusCode, "audio_bytes", len(audio))
	return io.NopCloser(bytes.NewReader(audio)), nil
}

// SynthesizeStream generates audio and streams it back in chunks via a channel.
func (c *Client) SynthesizeStream(ctx context.Context, text string) (<-chan []byte, error) {
	body, err := json.Marshal(ttsRequest{Text: text, ModelID: ttsModel})
	if err != nil {
		logger.Error("thirdparty request build failed", "service", "elevenlabs", "operation", "synthesize_stream", "model", ttsModel, "err", err)
		return nil, err
	}

	voiceID := c.voiceIDForContext(ctx)
	url := fmt.Sprintf("%s/text-to-speech/%s/stream", baseURL, voiceID)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		logger.Error("thirdparty request build failed", "service", "elevenlabs", "operation", "synthesize_stream", "model", ttsModel, "err", err)
		return nil, err
	}
	req.Header.Set("xi-api-key", c.apiKey)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "audio/mpeg")

	logger.Info("thirdparty request", "service", "elevenlabs", "operation", "synthesize_stream", "method", http.MethodPost, "url", url, "model", ttsModel, "voice_id", voiceID, "text_chars", len(text), "request_bytes", len(body))
	resp, err := c.http.Do(req)
	if err != nil {
		logger.Error("thirdparty request failed", "service", "elevenlabs", "operation", "synthesize_stream", "model", ttsModel, "voice_id", voiceID, "err", err)
		return nil, fmt.Errorf("elevenlabs stream: %w", err)
	}
	if resp.StatusCode != http.StatusOK {
		errorBody := readErrorBody(resp.Body)
		logger.Error("thirdparty request failed", "service", "elevenlabs", "operation", "synthesize_stream", "model", ttsModel, "voice_id", voiceID, "status", resp.StatusCode, "response_body", errorBody)
		resp.Body.Close()
		return nil, fmt.Errorf("elevenlabs stream: status %d", resp.StatusCode)
	}
	logger.Info("thirdparty request completed", "service", "elevenlabs", "operation", "synthesize_stream", "model", ttsModel, "voice_id", voiceID, "status", resp.StatusCode)

	ch := make(chan []byte, 16)
	go func() {
		defer close(ch)
		defer resp.Body.Close()
		chunksRead := 0
		bytesRead := 0
		defer func() {
			logger.Info("thirdparty stream closed", "service", "elevenlabs", "operation", "synthesize_stream", "audio_chunks", chunksRead, "audio_bytes", bytesRead)
		}()
		buf := make([]byte, chunkSize)
		for {
			n, err := resp.Body.Read(buf)
			if n > 0 {
				chunksRead++
				bytesRead += n
				chunk := make([]byte, n)
				copy(chunk, buf[:n])
				select {
				case ch <- chunk:
				case <-ctx.Done():
					return
				}
			}
			if err != nil {
				if err != io.EOF {
					logger.Error("thirdparty stream read failed", "service", "elevenlabs", "operation", "synthesize_stream", "err", err)
				}
				return
			}
		}
	}()

	return ch, nil
}

func readErrorBody(body io.Reader) string {
	data, err := io.ReadAll(io.LimitReader(body, errorBodyLogMaxBytes))
	if err != nil {
		return fmt.Sprintf("failed to read response body: %v", err)
	}
	return string(data)
}
