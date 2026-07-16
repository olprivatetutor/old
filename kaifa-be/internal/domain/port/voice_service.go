package port

import (
	"context"
	"io"
)

type ttsVoiceIDContextKey struct{}

func WithTTSVoiceID(ctx context.Context, voiceID string) context.Context {
	return context.WithValue(ctx, ttsVoiceIDContextKey{}, voiceID)
}

func TTSVoiceIDFromContext(ctx context.Context) (string, bool) {
	voiceID, ok := ctx.Value(ttsVoiceIDContextKey{}).(string)
	return voiceID, ok && voiceID != ""
}

type sttLanguageContextKey struct{}

func WithSTTLanguage(ctx context.Context, language string) context.Context {
	return context.WithValue(ctx, sttLanguageContextKey{}, language)
}

func STTLanguageFromContext(ctx context.Context) (string, bool) {
	language, ok := ctx.Value(sttLanguageContextKey{}).(string)
	return language, ok && language != ""
}

// STTService converts audio bytes to text transcripts.
// The Deepgram adapter implements this.
type STTService interface {
	// Transcribe accepts a complete audio file and returns its transcript.
	Transcribe(ctx context.Context, audio []byte, contentType string) (string, error)

	// TranscribeStream accepts a channel of raw audio chunks and returns a channel
	// of final transcript strings. The returned channel is closed when audioIn closes.
	TranscribeStream(ctx context.Context, audioIn <-chan []byte) (<-chan string, error)
}

// TTSService converts text to audio bytes.
// The ElevenLabs adapter implements this.
type TTSService interface {
	// Synthesize converts text to audio and returns a reader for the audio stream
	// (MP3). Suitable for short, non-streaming responses.
	Synthesize(ctx context.Context, text string) (io.ReadCloser, error)

	// SynthesizeStream returns a channel that receives MP3 audio chunks as they are
	// generated. The channel is closed when synthesis is complete.
	SynthesizeStream(ctx context.Context, text string) (<-chan []byte, error)
}
