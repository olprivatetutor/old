.PHONY: run build tidy lint hooks check-api-keys docker-build docker-up docker-down

run:
	go run ./cmd/api

build:
	CGO_ENABLED=0 go build -ldflags="-s -w" -o bin/server ./cmd/api

tidy:
	go mod tidy

lint:
	golangci-lint run ./...

hooks:
	git config core.hooksPath .githooks

check-api-keys:
	go run ./cmd/check-api-keys

docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f api
