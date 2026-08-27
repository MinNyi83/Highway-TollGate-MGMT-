#!/bin/bash
# TollGate HQ Server Deployment Script
# Run this on the HQ server

set -e

echo "=== TollGate HQ Server Deployment ==="

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo usermod -aG docker $USER
fi

# Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt-get install -y docker-compose
fi

# Create project directory
HQ_DIR="/opt/tollgate-hq"
sudo mkdir -p $HQ_DIR
sudo chown $USER:$USER $HQ_DIR

# Copy files
echo "Copying HQ files..."
cp -r packages/backend $HQ_DIR/
cp -r packages/frontend $HQ_DIR/
cp -r packages/customer-portal $HQ_DIR/
cp -r packages/storage-server $HQ_DIR/
cp -r packages/shared $HQ_DIR/
cp docker-compose.hq.yml $HQ_DIR/docker-compose.yml

# Create environment file
cat > $HQ_DIR/.env << EOF
# Database
POSTGRES_DB=tollgate
POSTGRES_USER=postgres
POSTGRES_PASSWORD=$(openssl rand -hex 16)

# Backend
DATABASE_URL=postgresql://postgres:\${POSTGRES_PASSWORD}@db:5432/tollgate
JWT_SECRET=$(openssl rand -hex 32)
SYNC_TOKEN=tollgate-sync-token-2026
STORAGE_SERVER_URL=http://storage:5000
PORT=3000

# Storage
UPLOAD_DIR=/app/uploads
EOF

# Build and start
cd $HQ_DIR
docker-compose up -d --build

# Wait for database
sleep 10

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx tsx prisma/seed.ts

echo ""
echo "=== HQ Deployment Complete ==="
HQ_IP=$(hostname -I | awk '{print $1}')
echo "Admin Portal: http://$HQ_IP"
echo "Customer Portal: http://$HQ_IP:8080"
echo "Backend API: http://$HQ_IP:3000"
echo "Storage API: http://$HQ_IP:5000"
echo ""
echo "Default admin: admin@tollgate.com / admin123"
echo "Sync token: tollgate-sync-token-2026"
