#!/bin/bash
# Jalankan dari root folder kaifa-be:
#   bash scripts/dev.sh
set -e

cd "$(dirname "$0")/.."

usage() {
  echo "Usage:"
  echo "  bash scripts/dev.sh           # start DB + backend lokal"
  echo "  bash scripts/dev.sh --db-only # hanya nyalakan PostgreSQL"
  echo "  bash scripts/dev.sh --stop    # stop PostgreSQL"
}

MODE="start"
case "${1:-}" in
  "")
    MODE="start"
    ;;
  --db-only)
    MODE="db-only"
    ;;
  --stop)
    MODE="stop"
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    echo "ERROR: unknown option: $1"
    echo ""
    usage
    exit 1
    ;;
esac

if [ "$MODE" = "stop" ]; then
  echo ">>> Stopping PostgreSQL..."
  docker compose down
  echo "Done."
  exit 0
fi

# Pastikan .env sudah ada dan diisi manual oleh user
if [ ! -f .env ]; then
  echo ""
  echo "ERROR: file .env tidak ditemukan."
  echo ""
  echo "Buat dulu secara manual:"
  echo "  1. Buat file .env di folder kaifa-be"
  echo "  2. Isi semua values (lihat .env.example sebagai referensi)"
  echo "  3. Jalankan script ini lagi"
  echo ""
  exit 1
fi

echo ">>> Starting PostgreSQL..."

docker compose up -d postgres

echo ""
docker compose ps postgres
echo ""

cleanup() {
  echo ""
  echo ">>> Stopping PostgreSQL..."
  docker compose down
}

if [ "$MODE" = "start" ]; then
  trap cleanup EXIT INT TERM
fi

if [ "$MODE" = "db-only" ]; then
  echo ""
  echo "DB is running on localhost:5432 (user: kaifa | pass: kaifa | db: kaifa)"
  echo "Logs  : docker compose logs -f postgres"
  echo "Stop  : bash scripts/dev.sh --stop"
  exit 0
fi

echo ""
echo ">>> Starting backend locally..."
echo "API   : http://localhost:8080/api/health"
echo "DB    : localhost:5432 (user: kaifa | pass: kaifa | db: kaifa)"
echo ""
echo "Logs  : docker compose logs -f postgres"
echo "Stop  : bash scripts/dev.sh --stop"
echo ""

DATABASE_URL="${DATABASE_URL:-postgres://kaifa:kaifa@localhost:5432/kaifa?sslmode=disable}" \
  go run ./cmd/api
