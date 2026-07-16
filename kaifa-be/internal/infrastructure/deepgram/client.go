package deepgram

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	"github.com/dev-keuber/kaifa-be/pkg/logger"
	"github.com/gorilla/websocket"
)

const (
	listenBaseURL = "https://api.deepgram.com/v1/listen"
	streamBaseURL = "wss://api.deepgram.com/v1/listen"
)

type Client struct {
	apiKey string
}

func NewClient(apiKey string) *Client {
	return &Client{apiKey: apiKey}
}

// deepgramResponse is a partial representation of Deepgram's streaming response.
type deepgramResponse struct {
	Results struct {
		Channels []struct {
			Alternatives []struct {
				Transcript string `json:"transcript"`
			} `json:"alternatives"`
		} `json:"channels"`
	} `json:"results"`
	IsFinal bool `json:"is_final"`
	Channel struct {
		Alternatives []struct {
			Transcript string `json:"transcript"`
		} `json:"alternatives"`
	} `json:"channel"`
}

// Transcribe sends a complete audio file to Deepgram's prerecorded API.
func (c *Client) Transcribe(ctx context.Context, audio []byte, contentType string) (string, error) {
	if strings.TrimSpace(contentType) == "" {
		contentType = "application/octet-stream"
	}

	language := deepgramLanguageFromContext(ctx)
	listenURL := deepgramListenURL(listenBaseURL, language, false)
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, listenURL, bytes.NewReader(audio))
	if err != nil {
		return "", fmt.Errorf("deepgram request: %w", err)
	}
	req.Header.Set("Authorization", "Token "+c.apiKey)
	req.Header.Set("Content-Type", contentType)

	logger.Info("thirdparty request", "service", "deepgram", "operation", "transcribe_file", "url", listenURL, "language", language, "audio_bytes", len(audio), "content_type", contentType)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		logger.Error("thirdparty request failed", "service", "deepgram", "operation", "transcribe_file", "err", err)
		return "", fmt.Errorf("deepgram transcribe: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		logger.Error("thirdparty response read failed", "service", "deepgram", "operation", "transcribe_file", "status", resp.StatusCode, "err", err)
		return "", fmt.Errorf("deepgram response read: %w", err)
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		logger.Error("thirdparty request failed", "service", "deepgram", "operation", "transcribe_file", "status", resp.StatusCode, "response_bytes", len(body), "response", string(body))
		return "", fmt.Errorf("deepgram transcribe status %d", resp.StatusCode)
	}

	logger.Info("thirdparty raw response", "service", "deepgram", "operation", "transcribe_file", "status", resp.StatusCode, "response_bytes", len(body), "response", string(body))

	var dResp deepgramResponse
	if err := json.Unmarshal(body, &dResp); err != nil {
		logger.Error("thirdparty response parse failed", "service", "deepgram", "operation", "transcribe_file", "status", resp.StatusCode, "response_bytes", len(body), "response", string(body), "err", err)
		return "", fmt.Errorf("deepgram response parse: %w", err)
	}

	text := strings.TrimSpace(dResp.prerecordedTranscript())
	logger.Info("thirdparty request completed", "service", "deepgram", "operation", "transcribe_file", "status", resp.StatusCode, "response_bytes", len(body), "transcript_chars", len(text), "transcript", text)
	return text, nil
}

func (r deepgramResponse) prerecordedTranscript() string {
	if len(r.Results.Channels) == 0 || len(r.Results.Channels[0].Alternatives) == 0 {
		return ""
	}
	return r.Results.Channels[0].Alternatives[0].Transcript
}

// TranscribeStream connects to Deepgram's streaming API, forwards audio chunks
// from audioIn, and returns a channel of final transcript strings.
func (c *Client) TranscribeStream(ctx context.Context, audioIn <-chan []byte) (<-chan string, error) {
	header := http.Header{}
	header.Set("Authorization", "Token "+c.apiKey)

	language := deepgramLanguageFromContext(ctx)
	streamURL := deepgramListenURL(streamBaseURL, language, true)
	logger.Info("thirdparty request", "service", "deepgram", "operation", "transcribe_stream", "url", streamURL, "language", language)
	conn, resp, err := websocket.DefaultDialer.DialContext(ctx, streamURL, header)
	if err != nil {
		status := 0
		if resp != nil {
			status = resp.StatusCode
		}
		logger.Error("thirdparty request failed", "service", "deepgram", "operation", "transcribe_stream", "status", status, "err", err)
		return nil, fmt.Errorf("deepgram dial: %w", err)
	}
	status := 0
	if resp != nil {
		status = resp.StatusCode
	}
	logger.Info("thirdparty request completed", "service", "deepgram", "operation", "transcribe_stream", "status", status)

	transcriptCh := make(chan string, 8)

	// Forward audio chunks to Deepgram
	go func() {
		chunksSent := 0
		bytesSent := 0
		defer func() {
			logger.Info("thirdparty stream closed", "service", "deepgram", "operation", "transcribe_stream", "audio_chunks", chunksSent, "audio_bytes", bytesSent)
			// Send CloseMessage so Deepgram flushes remaining transcripts
			_ = conn.WriteMessage(websocket.CloseMessage,
				websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
		}()
		for {
			select {
			case <-ctx.Done():
				return
			case chunk, ok := <-audioIn:
				if !ok {
					return
				}
				chunksSent++
				bytesSent += len(chunk)
				if err := conn.WriteMessage(websocket.BinaryMessage, chunk); err != nil {
					logger.Error("thirdparty stream write failed", "service", "deepgram", "operation", "transcribe_stream", "audio_chunk_bytes", len(chunk), "err", err)
					return
				}
			}
		}
	}()

	// Read transcript events from Deepgram
	go func() {
		defer close(transcriptCh)
		defer conn.Close()
		for {
			_, msg, err := conn.ReadMessage()
			if err != nil {
				logger.Warn("thirdparty stream read closed", "service", "deepgram", "operation", "transcribe_stream", "err", err)
				return
			}
			logger.Info("thirdparty raw response", "service", "deepgram", "operation", "transcribe_stream", "response_bytes", len(msg), "response", string(msg))
			var dResp deepgramResponse
			if err := json.Unmarshal(msg, &dResp); err != nil {
				logger.Warn("thirdparty response parse failed", "service", "deepgram", "operation", "transcribe_stream", "response_bytes", len(msg), "response", string(msg), "err", err)
				continue
			}
			if dResp.IsFinal && len(dResp.Channel.Alternatives) > 0 {
				text := dResp.Channel.Alternatives[0].Transcript
				if text != "" {
					select {
					case transcriptCh <- text:
					case <-ctx.Done():
						return
					}
				}
			}
		}
	}()

	return transcriptCh, nil
}

func deepgramLanguageFromContext(ctx context.Context) string {
	if language, ok := port.STTLanguageFromContext(ctx); ok {
		switch strings.ToLower(strings.TrimSpace(language)) {
		case "arabic", "ar":
			return "ar"
		case "english", "en", "en-us":
			return "en-US"
		}
	}
	return "en-US"
}

func deepgramListenURL(baseURL string, language string, streaming bool) string {
	values := url.Values{}
	values.Set("model", "nova-3")
	values.Set("language", language)
	values.Set("punctuate", "true")
	if streaming {
		values.Set("interim_results", "false")
		values.Set("endpointing", "300")
	} else {
		values.Set("smart_format", "true")
	}
	return baseURL + "?" + values.Encode()
}
