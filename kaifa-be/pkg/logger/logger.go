package logger

import (
	"log/slog"
	"os"
)

var Default *slog.Logger

func init() {
	Default = slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))
	slog.SetDefault(Default)
}

func Info(msg string, args ...any) { slog.Info(msg, args...) }

func Error(msg string, args ...any) { slog.Error(msg, args...) }

func Warn(msg string, args ...any) { slog.Warn(msg, args...) }

func Debug(msg string, args ...any) { slog.Debug(msg, args...) }
