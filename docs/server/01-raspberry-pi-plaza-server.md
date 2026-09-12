# Raspberry Pi Plaza Server Installation Guide

## TollGate RFID Pass — Edge Server Setup

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    RASPBERRY PI PLAZA SERVER                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SOFTWARE STACK                            │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │  Docker Containers                                  │   │   │
│  │  │                                                     │   │   │
│  │  │  ┌──────────────┐  ┌──────────────┐                │   │   │
│  │  │  │ plaza        │  │ anpr         │                │   │   │
│  │  │  │ :4000        │  │ :8080        │                │   │   │
│  │  │  │              │  │              │                │   │   │
│  │  │  │ - Express    │  │ - ANPR       │                │   │   │
│  │  │  │ - Socket.IO  │  │   Server     │                │   │   │
│  │  │  │ - Sync Engine│  │ - Plate      │                │   │   │
│  │  │  │ - Toll Proc  │  │   Detection  │                │   │   │
│  │  │  └──────┬───────┘  └──────┬───────┘                │   │   │
│  │  │         │                 │                         │   │   │
│  │  │         └────────┬────────┘                         │   │   │
│  │  │                  │                                  │   │   │
│  │  │         ┌────────┴────────┐                         │   │   │
│  │  │         │   SQLite DB     │                         │   │   │
│  │  │         │   plaza.db      │                         │   │   │
│  │  │         └─────────────────┘                         │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  │                                                             │   │
│  │  ┌─────────────────────────────────────────────────────┐   │   │
│  │  │  Hardware Interfaces                                │   │   │
│  │  │                                                     │   │   │
│  │  │  /dev/ttyUSB0 ◄── Serial RFID Reader               │   │   │
│  │  │  eth0         ◄── Network (ANPR, HQ sync)          │   │   │
│  │  │  wlan0        ◄── WiFi (backup)                     │   │   │
│  │  │  GPIO         ◄── Lane control signals              │   │   │
│  │  └─────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    HARDWARE                                 │   │
│  │                                                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   │
│  │  │ RPi 4    │  │ microSD  │  │ PoE HAT  │  │ Case     │  │   │
│  │  │ 4GB RAM  │  │ 64GB     │  │ (power)  │  │ (fan)    │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Network Topology — Plaza to HQ

```
                            ┌──────────────────────┐
                            │    INTERNET / VPN     │
                            │    4G/LTE Backup      │
                            └──────────┬───────────┘
                                       │
                            ┌──────────┴───────────┐
                            │     HQ SERVER        │
                            │  192.168.100.101     │
                            │  :3000 (API)         │
                            │  :5432 (HQ DB)       │
                            │  :5433 (Customer DB) │
                            │  :5434 (Plaza DB)    │
                            └──────────┬───────────┘
                                       │
              ┌────────────────────────┼────────────────────────┐
              │                        │                        │
    ┌─────────┴─────────┐    ┌─────────┴─────────┐    ┌─────────┴─────────┐
    │  PLAZA 01 (0-Mile)│    │  PLAZA 02 (39-Mile)│    │  PLAZA N          │
    │  RPi :4000         │    │  RPi :4000         │    │  RPi :4000         │
    │                    │    │                    │    │                    │
    │  ┌──────────────┐  │    │  ┌──────────────┐  │    │  ┌──────────────┐  │
    │  │ Sync Engine  │  │    │  │ Sync Engine  │  │    │  │ Sync Engine  │  │
    │  │ - Push: 30s  │  │    │  │ - Push: 30s  │  │    │  │ - Push: 30s  │  │
    │  │ - Pull: 60s  │  │    │  │ - Pull: 60s  │  │    │  │ - Pull: 60s  │  │
    │  │ - Retry: 5x  │  │    │  │ - Retry: 5x  │  │    │  │ - Retry: 5x  │  │
    │  └──────────────┘  │    │  └──────────────┘  │    │  └──────────────┘  │
    │                    │    │                    │    │                    │
    │  ┌──────────────┐  │    │  ┌──────────────┐  │    │  ┌──────────────┐  │
    │  │ Toll Process │  │    │  │ Toll Process │  │    │  │ Toll Process │  │
    │  │ - Local calc │  │    │  │ - Local calc │  │    │  │ - Local calc │  │
    │  │ - Offline OK │  │    │  │ - Offline OK │  │    │  │ - Offline OK │  │
    │  └──────────────┘  │    │  └──────────────┘  │    │  └──────────────┘  │
    │                    │    │                    │    │                    │
    │  ┌──────────────┐  │    │  ┌──────────────┐  │    │  ┌──────────────┐  │
    │  │ Local DB     │  │    │  │ Local DB     │  │    │  │ Local DB     │  │
    │  │ SQLite       │  │    │  │ SQLite       │  │    │  │ SQLite       │  │
    │  │ plaza.db     │  │    │  │ plaza.db     │  │    │  │ plaza.db     │  │
    │  └──────────────┘  │    │  └──────────────┘  │    │  └──────────────┘  │
    └────────────────────┘    └────────────────────┘    └────────────────────┘
```

---

## 3. Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Board | Raspberry Pi 4 (2GB) | Raspberry Pi 4 (4GB/8GB) |
| Storage | 32GB microSD (Class 10) | 64GB microSD (A2) + USB SSD |
| Network | Ethernet (100Mbps) | Gigabit Ethernet |
| Power | USB-C 5V/3A | PoE HAT (802.3af) |
| Case | Basic case | Case with fan/heatsink |
| Serial | USB-to-Serial adapter | Industrial USB-to-Serial |

---

## 4. Installation Steps

### 4.1 Prepare microSD Card

```bash
# Download Raspberry Pi Imager
# https://www.raspberrypi.com/software/

# Flash Raspberry Pi OS Lite (64-bit)
# Enable SSH, set hostname: plaza-01
# Set username: pi, password: <secure>
```

### 4.2 Initial Setup

```bash
# SSH into Raspberry Pi
ssh pi@plaza-01.local

# Update system
sudo apt update && sudo apt upgrade -y

# Set timezone
sudo timedatectl set-time-zone Asia/Yangon

# Install dependencies
sudo apt install -y \
  python3-pip python3-serial python3-rpi.gpio \
  curl wget git unzip \
  docker.io docker-compose

# Add user to groups
sudo usermod -a -G dialout,video,gpio $USER

# Reboot
sudo reboot
```

### 4.3 Deploy Plaza Server

```bash
# Clone repository
cd /opt
sudo git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
sudo chown -R pi:pi /opt/Highway-TollGate-MGMT-
cd /opt/Highway-TollGate-MGMT-/packages/plaza-server

# Create environment file
cat > .env << 'EOF'
# Plaza Identity
PLAZA_ID=plaza-001
PLAZA_NAME=0-Mile Plaza
GATE_CODE=0ML
TOTAL_LANES=4

# Server
SERVER_PORT=4000
NODE_ENV=production

# HQ Connection
HQ_URL=http://192.168.100.101:3000
SYNC_TOKEN=tollgate-sync-token-2026

# RFID Configuration
RFID_TYPE=tcp
RFID_TCP_HOST=192.168.1.101
RFID_TCP_PORT=5000

# Serial (alternative)
# RFID_TYPE=serial
# RFID_SERIAL_PORT=/dev/ttyUSB0
# RFID_BAUD_RATE=9600

# Database
DATABASE_URL=file:./data/plaza.db
EOF

# Create data directory
mkdir -p data

# Build and start
docker compose up -d --build

# Check status
docker compose ps
docker compose logs -f plaza
```

### 4.4 Serial Port Passthrough (if using USB RFID)

```bash
# Ensure device is connected
ls /dev/ttyUSB*

# Set permissions
sudo chmod 666 /dev/ttyUSB0
sudo usermod -a -G dialout pi

# Update docker-compose.yml for serial passthrough
# Uncomment the serial device section:
#   devices:
#     - /dev/ttyUSB0:/dev/ttyUSB0
#   volumes:
#     - /dev/ttyUSB0:/dev/ttyUSB0
```

---

## 5. Sync Protocol

### 5.1 Push Sync (Plaza → HQ)

```
┌──────────────┐                     ┌──────────────┐
│  Plaza RPi   │                     │  HQ Server   │
│  :4000       │                     │  :3000       │
│              │                     │              │
│  Every 30s:  │   POST /api/sync    │              │
│  ┌────────┐  │   ──────────────►   │  ┌────────┐  │
│  │ Local  │  │   Headers:          │  │ HQ     │  │
│  │ Events │  │   X-Plaza-Id        │  │ DB     │  │
│  │ Queue  │  │   X-Sync-Token      │  │        │  │
│  └────────┘  │                     │  │ Insert │  │
│              │   Response:         │  │ Events │  │
│              │   ◄──────────────   │  └────────┘  │
│              │   { synced: 50 }    │              │
│              │                     │              │
│  Batch: 50   │                     │              │
│  items/cycle │                     │              │
└──────────────┘                     └──────────────┘
```

### 5.2 Pull Sync (HQ → Plaza)

```
┌──────────────┐                     ┌──────────────┐
│  Plaza RPi   │                     │  HQ Server   │
│  :4000       │                     │  :3000       │
│              │                     │              │
│  Every 60s:  │   POST /api/sync    │              │
│  ┌────────┐  │   /pull             │  ┌────────┐  │
│  │ Request│  │   ──────────────►   │  │ Query  │  │
│  │ Tables:│  │   Body:             │  │ HQ     │  │
│  │ - Rate │  │   { tables:         │  │ DB     │  │
│  │ - Tags │  │     ["TollRate",    │  │        │  │
│  │        │  │      "RFIDTag"] }   │  │ Return │  │
│  └────────┘  │                     │  │ Data   │  │
│              │   Response:         │  └────────┘  │
│              │   ◄──────────────   │              │
│              │   { TollRate: [...],│              │
│              │     RFIDTag: [...] }│              │
│              │                     │              │
│  Conflict:   │                     │              │
│  Last-Write  │                     │              │
│  -Wins       │                     │              │
└──────────────┘                     └──────────────┘
```

### 5.3 Offline Operation

```
┌─────────────────────────────────────────────────────────────┐
│                    OFFLINE MODE                              │
│                                                             │
│  Network Status: ─── DISCONNECTED ───                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Queue Status                                       │   │
│  │                                                     │   │
│  │  Pending: 234 events     ┌─────────────────────┐   │   │
│  │  Failed: 0 events        │ ████████████░░░░░░░ │   │   │
│  │  Max Capacity: 10,000    │ 23% of 10,000       │   │   │
│  │                          └─────────────────────┘   │   │
│  │                                                     │   │
│  │  Oldest Event: 2026-09-12 09:15:00                 │   │
│  │  Newest Event: 2026-09-12 10:45:00                 │   │
│  │                                                     │   │
│  │  Retry Schedule:                                    │   │
│  │  - Attempt 1: 5s                                   │   │
│  │  - Attempt 2: 15s                                  │   │
│  │  - Attempt 3: 45s                                  │   │
│  │  - Attempt 4: 135s                                 │   │
│  │  - Attempt 5: 405s (give up, mark FAILED)          │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Toll Processing: ✅ LOCAL (independent)                     │
│  Barrier Control: ✅ LOCAL (independent)                     │
│  RFID Reading: ✅ LOCAL (independent)                        │
│  ANPR Camera: ✅ LOCAL (independent)                         │
│                                                             │
│  Network Recovery:                                          │
│  - Connectivity check: every 10s                            │
│  - Timeout: 5s                                              │
│  - Auto-resume sync on reconnect                            │
│  - Queue cleanup: completed items > 24h deleted hourly      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Monitoring & Health

### 6.1 Health Check Endpoint

```bash
# Check plaza server health
curl -s http://localhost:4000/api/health | jq .

# Response:
{
  "status": "healthy",
  "uptime": 86400,
  "plaza": {
    "id": "plaza-001",
    "name": "0-Mile Plaza",
    "lanes": 4
  },
  "sync": {
    "status": "connected",
    "lastPush": "2026-09-12T10:45:00Z",
    "lastPull": "2026-09-12T10:44:00Z",
    "pendingItems": 0,
    "failedItems": 0
  },
  "devices": {
    "rfidReader": "online",
    "anprCamera": "online",
    "barrierGate": "online"
  },
  "database": {
    "type": "sqlite",
    "size": "12MB",
    "records": 15234
  }
}
```

### 6.2 Admin Panel

```
Access: http://<plaza-ip>:4000/admin

Features:
- Real-time lane status
- Sync queue viewer
- Device management
- Log viewer
- Manual sync trigger
- Configuration editor
```

---

## 7. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Sync fails | Network down | Check connectivity, VPN status |
| RFID not reading | Wrong port/baud | Check /dev/ttyUSB*, verify baud rate |
| High queue items | Slow sync | Check HQ server load, increase batch size |
| SQLite locked | Concurrent writes | Check for multiple instances |
| Docker won't start | Insufficient storage | Clean old images, expand filesystem |
| GPIO errors | Permission denied | Add user to gpio group |

---

## 8. Bill of Materials (per Plaza)

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| Raspberry Pi 4 (4GB) | 1 | 350,000 | 350,000 |
| microSD Card (64GB A2) | 1 | 80,000 | 80,000 |
| PoE HAT (802.3af) | 1 | 120,000 | 120,000 |
| Case with Fan | 1 | 60,000 | 60,000 |
| USB-to-Serial Adapter | 1 | 80,000 | 80,000 |
| Ethernet Cable (50m) | 1 | 200,000 | 200,000 |
| **Total per Plaza** | | | **890,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
