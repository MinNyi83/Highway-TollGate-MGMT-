#!/bin/bash
# TollGate Plaza - Raspberry Pi Deployment Script
# Run this on each Raspberry Pi to set up the plaza server

set -e

PLAZA_ID="${1:-plaza-001}"
PLAZA_NAME="${2:-0 Mile Plaza}"
GATE_CODE="${3:-0MILE}"
HQ_SERVER="${4:-http://your-hq-server:3000}"
SYNC_TOKEN="${5:-tollgate-sync-token-2026}"

echo "=== TollGate Plaza Deployment ==="
echo "Plaza: $PLAZA_NAME ($PLAZA_ID)"
echo "Gate Code: $GATE_CODE"
echo "HQ Server: $HQ_SERVER"

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
PLAZA_DIR="/opt/tollgate-plaza"
sudo mkdir -p $PLAZA_DIR
sudo chown $USER:$USER $PLAZA_DIR

# Copy files
echo "Copying plaza files..."
cp -r packages/plaza-server/* $PLAZA_DIR/

# Create environment file
cat > $PLAZA_DIR/.env << EOF
DATABASE_URL=file:./data/plaza.db
PLAZA_ID=$PLAZA_ID
PLAZA_NAME=$PLAZA_NAME
GATE_CODE=$GATE_CODE
HQ_SERVER_URL=$HQ_SERVER
SYNC_TOKEN=$SYNC_TOKEN
JWT_SECRET=$(openssl rand -hex 32)
PORT=4000

# RFID Reader (USB Serial)
RFID_TYPE=serial
RFID_SERIAL_PORT=/dev/ttyUSB0
RFID_BAUD_RATE=9600

# OR RFID Reader (TCP/IP)
# RFID_TYPE=tcp
# RFID_TCP_HOST=192.168.1.100
# RFID_TCP_PORT=5000
EOF

# Create data directory
mkdir -p $PLAZA_DIR/data

# Setup serial port permissions
sudo usermod -a -G dialout $USER

# Build and start
cd $PLAZA_DIR
docker-compose up -d --build

# Wait for database
sleep 5

# Run migrations
docker-compose exec plaza npx prisma db push --skip-generate

# Seed database
docker-compose exec plaza npx tsx src/db/seed.ts

echo ""
echo "=== Deployment Complete ==="
echo "Plaza server: http://$(hostname -I | awk '{print $1}'):4000"
echo "Admin panel: http://$(hostname -I | awk '{print $1}'):4000/admin"
echo "Login: admin@plaza.local / admin123"
echo ""
echo "RFID Reader: $RFID_TYPE on $RFID_SERIAL_PORT"
echo "Sync: $HQ_SERVER"
