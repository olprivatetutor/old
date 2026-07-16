package deepgram

import (
	"context"
	"net/url"
	"testing"

	"github.com/dev-keuber/kaifa-be/internal/domain/port"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDeepgramLanguageFromContext(t *testing.T) {
	tests := []struct {
		name     string
		language string
		expected string
	}{
		{name: "default", expected: "en-US"},
		{name: "english", language: "english", expected: "en-US"},
		{name: "arabic", language: "arabic", expected: "ar"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			ctx := context.Background()
			if tt.language != "" {
				ctx = port.WithSTTLanguage(ctx, tt.language)
			}

			assert.Equal(t, tt.expected, deepgramLanguageFromContext(ctx))
		})
	}
}

func TestDeepgramListenURLUsesLanguage(t *testing.T) {
	rawURL := deepgramListenURL(listenBaseURL, "ar", false)
	parsedURL, err := url.Parse(rawURL)
	require.NoError(t, err)

	assert.Equal(t, "ar", parsedURL.Query().Get("language"))
	assert.Equal(t, "nova-3", parsedURL.Query().Get("model"))
	assert.Equal(t, "true", parsedURL.Query().Get("punctuate"))
	assert.Equal(t, "true", parsedURL.Query().Get("smart_format"))
}

func TestDeepgramStreamURLUsesLanguage(t *testing.T) {
	rawURL := deepgramListenURL(streamBaseURL, "ar", true)
	parsedURL, err := url.Parse(rawURL)
	require.NoError(t, err)

	assert.Equal(t, "ar", parsedURL.Query().Get("language"))
	assert.Equal(t, "false", parsedURL.Query().Get("interim_results"))
	assert.Equal(t, "300", parsedURL.Query().Get("endpointing"))
}
