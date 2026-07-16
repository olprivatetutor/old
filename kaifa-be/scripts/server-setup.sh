#!/bin/bash
# Run this script ONCE on a fresh VPS as root.
#
# Kedua repo bersifat private, jadi butuh GitHub PAT dengan scope "repo".
# Buat di: github.com/settings/tokens → Generate new token (classic) → centang "repo"
#
# Usage:
#   GITHUB_PAT=ghp_xxxx bash server-setup.sh
#
set -euo pipefail

if [[ -z "${GITHUB_PAT:-}" ]]; then
  echo "ERROR: GITHUB_PAT tidak di-set."
  echo "Usage: GITHUB_PAT=ghp_xxxx bash server-setup.sh"
  exit 1
fi

VPS_IP="46.250.226.24"
BE_REPO="https://${GITHUB_PAT}@github.com/dev-keuber/kaifa-be.git"
FE_REPO="https://${GITHUB_PAT}@github.com/dev-keuber/kaifa-fe.git"
APP_DIR="/opt/kaifa"

echo ">>> [1/7] Updating system packages..."
apt-get update -qq && apt-get upgrade -y -qq

echo ">>> [2/7] Installing Docker..."
curl -fsSL https://get.docker.com | sh
docker compose version

echo ">>> [3/7] Installing Nginx, Git, Certbot..."
apt-get install -y nginx git ufw certbot python3-certbot-nginx

echo ">>> [4/7] Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 8080/tcp
ufw --force enable
ufw status

echo ">>> [5/7] Cloning repositories..."
mkdir -p "$APP_DIR"
cd "$APP_DIR"

if [ ! -d "kaifa-be/.git" ]; then
  git clone "$BE_REPO" kaifa-be
else
  echo "kaifa-be already cloned, skipping."
fi

if [ ! -d "kaifa-fe/.git" ]; then
  git clone "$FE_REPO" kaifa-fe
else
  echo "kaifa-fe already cloned, skipping."
fi

echo ">>> [6/7] Configuring Nginx (HTTP only — for SSL verification)..."
# Temporary HTTP config so certbot can complete ACME challenge.
# After certbot runs, apply the SSL config from the repo (see DEPLOY.md Step 5).
cat > /etc/nginx/sites-available/kaifa <<'NGINX'
server {
    listen 80;
    server_name api.kaifanesia.com demo.kaifanesia.com;
    root /var/www/html;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 200 'VPS OK';
        add_header Content-Type text/plain;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/kaifa /etc/nginx/sites-enabled/kaifa
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo ">>> [7/7] Done!"
echo ""
echo "==========================================="
echo " NEXT STEPS — ikuti DEPLOY.md"
echo "==========================================="
echo ""
echo "File panduan lengkap ada di: $APP_DIR/kaifa-be/DEPLOY.md"
echo ""
echo "Ringkasan langkah selanjutnya:"
echo "  1. Pastikan DNS sudah propagasi (dig api.kaifanesia.com)"
echo "  2. Buat .env BE: cp $APP_DIR/kaifa-be/.env.production.example $APP_DIR/kaifa-be/.env"
echo "  3. Buat .env FE: cp $APP_DIR/kaifa-fe/.env.example $APP_DIR/kaifa-fe/.env"
echo "  4. Jalankan certbot:"
echo "     certbot --nginx -d api.kaifanesia.com"
echo "     certbot --nginx -d demo.kaifanesia.com"
echo "  5. Apply SSL nginx config:"
echo "     cp $APP_DIR/kaifa-be/nginx/kaifa.conf /etc/nginx/sites-available/kaifa"
echo "     nginx -t && systemctl reload nginx"
echo "  6. Setup SSH key & GitHub Secrets (lihat DEPLOY.md)"
echo "  7. First deploy:"
echo "     cd $APP_DIR/kaifa-be && docker compose -f docker-compose.prod.yml up -d"
echo "     cd $APP_DIR/kaifa-fe && docker compose up -d"
echo ""
