# TollGate RFID - Distributed Highway Toll Management System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUD (HQ)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  HQ Admin     │  │  Customer    │  │  Main Database        │  │
│  │  Dashboard    │  │  Portal      │  │  (PostgreSQL)         │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                      │              │
│  ┌──────┴──────────────────┴──────────────────────┴───────────┐  │
│  │              HQ API Server (Node.js)                       │  │
│  │  - Sync engine (bidirectional)                             │  │
│  │  - Plaza management                                        │  │
│  │  - Customer management                                     │  │
│  │  - Analytics & reporting                                   │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴───────────────────────────────────┐  │
│  │              Storage Server (S3/Local)                      │  │
│  │  - Vehicle photos                                          │  │
│  │  - ANPR captures                                           │  │
│  │  - Document uploads                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │  Internet/VPN  │
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────┐  ┌────────┴───────┐  ┌───────┴──────┐
│  Plaza 1     │  │  Plaza 2       │  │  Plaza N     │
│  (Raspberry Pi)│  │  (Raspberry Pi)│  │  (Raspberry Pi)│
│              │  │                │  │              │
│  ┌─────────┐ │  │  ┌──────────┐ │  │  ┌─────────┐ │
│  │ SQLite  │ │  │  │ SQLite   │ │  │  │ SQLite  │ │
│  └─────────┘ │  │  └──────────┘ │  │  └─────────┘ │
│  ┌─────────┐ │  │  ┌──────────┐ │  │  ┌─────────┐ │
│  │ Plaza   │ │  │  │ Plaza    │ │  │  │ Plaza   │ │
│  │ Admin   │ │  │  │ Admin    │ │  │  │ Admin   │ │
│  └─────────┘ │  │  └──────────┘ │  │  └─────────┘ │
│  ┌─────────┐ │  │  ┌──────────┐ │  │  ┌─────────┐ │
│  │ Sync    │ │  │  │ Sync     │ │  │  │ Sync    │ │
│  │ Engine  │ │  │  │ Engine   │ │  │  │ Engine  │ │
│  └─────────┘ │  │  └──────────┘ │  │  └─────────┘ │
│  ┌─────────┐ │  │  ┌──────────┐ │  │  ┌─────────┐ │
│  │ RFID    │ │  │  │ RFID     │ │  │  │ RFID    │ │
│  │ Reader  │ │  │  │ Reader   │ │  │  │ Reader  │ │
│  └─────────┘ │  │  └──────────┘ │  │  └─────────┘ │
└──────────────┘  └────────────────┘  └──────────────┘
```

## Server Components

### 1. HQ Server (Cloud)
- **Backend API**: Central management, analytics, user management
- **Admin Portal**: React dashboard for highway administrators
- **Customer Portal**: React app for vehicle owners
- **Main Database**: PostgreSQL with all data
- **Storage Server**: Vehicle photos, ANPR captures, documents

### 2. Plaza Server (Raspberry Pi)
- **SQLite Database**: Local storage for offline operation
- **Plaza Admin Panel**: Built-in web UI for toll employees
- **RFID Reader**: Serial (RS232/USB) or TCP/IP support
- **Sync Engine**: Bidirectional sync with HQ when connected
- **Offline Queue**: Queues transactions for sync when online

### 3. Storage Server
- **Vehicle Photos**: Vehicle registration images
- **ANPR Captures**: Automatic Number Plate Recognition photos
- **Documents**: Wheel tax cards, permits, etc.

## Deployment

### HQ Server Deployment
```bash
# On the HQ server
chmod +x scripts/deploy-hq.sh
./scripts/deploy-hq.sh
```

### Plaza Server Deployment (per Raspberry Pi)
```bash
# On each Raspberry Pi
chmod +x scripts/deploy-plaza.sh
./scripts/deploy-plaza.sh plaza-001 "0 Mile Plaza" "0MILE" "http://hq-server:3000" "tollgate-sync-token-2026"
```

## Configuration

### Plaza Server (.env)
```env
DATABASE_URL=file:./data/plaza.db
PLAZA_ID=plaza-001
PLAZA_NAME=0 Mile Plaza
GATE_CODE=0MILE
HQ_SERVER_URL=http://hq-server:3000
SYNC_TOKEN=tollgate-sync-token-2026

# RFID Reader
RFID_TYPE=serial
RFID_SERIAL_PORT=/dev/ttyUSB0
RFID_BAUD_RATE=9600
```

### RFID Reader Options
- **Serial (USB)**: Connect via `/dev/ttyUSB0`
- **TCP/IP**: Network-connected readers

## Sync Protocol

### Bidirectional Sync
1. **Plaza → HQ**: Toll events, vehicle data, sync status
2. **HQ → Plaza**: Vehicle registrations, rate updates, blacklists

### Conflict Resolution
- Last-write-wins for most fields
- Queue-based retry with exponential backoff
- Manual retry option in admin panel

### Offline Operation
- All toll operations work locally
- Queue stores pending sync items
- Automatic retry when connectivity returns
- Manual force retry available

## Default Credentials

### HQ Server
- **Admin**: admin@tollgate.com / admin123
- **Customer Portal**: ko.min@personal.com / password123

### Plaza Server
- **Admin**: admin@plaza.local / admin123

## API Endpoints

### Plaza Server (port 4000)
- `GET /api/health` - Health check
- `GET /api/config` - Plaza configuration
- `GET /api/events` - Today's toll events
- `GET /api/vehicles` - Local vehicles
- `GET /api/tags` - RFID tags
- `GET /api/sync/status` - Sync queue status
- `GET /api/devices` - Device status
- `POST /api/admin/login` - Plaza admin login
- `GET /api/admin/dashboard` - Dashboard stats

### HQ Sync API (port 3000)
- `POST /api/sync/push` - Receive data from plazas
- `POST /api/sync/pull` - Send data to plazas
- `POST /api/sync/plazas` - Register new plaza
- `GET /api/sync/plazas` - Get all plazas status

### Storage Server (port 5000)
- `POST /api/upload/vehicle` - Upload vehicle photo
- `POST /api/upload/anpr` - Upload ANPR capture
- `GET /files/:type/:filename` - Serve files
- `GET /api/stats` - Storage statistics

## Hardware Requirements

### Plaza Server (Raspberry Pi)
- Raspberry Pi 4 (2GB+ RAM recommended)
- 32GB+ microSD card
- USB-to-Serial adapter (for RFID reader)
- Ethernet or WiFi connection
- UPS/battery backup recommended

### RFID Reader
- **Serial**: RS232/USB RFID reader (e.g., Impinj, Zebra)
- **TCP/IP**: Network-connected RFID reader
- Supports standard RFID protocols

## Network Requirements

### Plaza ↔ HQ Communication
- HTTPS API calls for sync
- WebSocket for real-time updates (optional)
- Minimum 1Mbps bandwidth recommended
- VPN recommended for production

### Offline Tolerance
- Plazas can operate indefinitely offline
- Sync queue stores up to 10,000 events
- Automatic retry with exponential backoff
- Manual force retry available
