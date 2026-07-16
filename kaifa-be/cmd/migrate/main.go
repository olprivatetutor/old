package main

import (
	"context"
	"log"
	"time"

	postgresrepo "github.com/dev-keuber/kaifa-be/internal/adapter/repository/postgres"
	"github.com/dev-keuber/kaifa-be/pkg/config"
	_ "github.com/dev-keuber/kaifa-be/pkg/logger"
)

func main() {
	cfg := config.Load()
	if cfg.DatabaseURL == "" {
		log.Fatal("DATABASE_URL is required")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	db, err := postgresrepo.Open(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := postgresrepo.Migrate(ctx, db); err != nil {
		log.Fatalf("failed to migrate database: %v", err)
	}

	log.Println("database migration completed")
}
