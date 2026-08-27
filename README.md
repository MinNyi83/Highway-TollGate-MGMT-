# Highway Tollgate Management System

A distributed highway toll management system with RFID + ANPR integration, built for 10+ toll plazas with offline-first Raspberry Pi servers, centralized HQ management, and customer portal.

## Architecture

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
│  │  - Sync engine  - Plaza management  - Analytics            │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴───────────────────────────────────┐  │
│  │              Storage Server                                 │  │
│  │  - Vehicle photos  - ANPR captures  - Documents            │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Internet/VPN
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────┐  ┌────────┴───────┐  ┌───────┴──────┐
│  Plaza 1     │  │  Plaza 2       │  │  Plaza N     │
│  (RPi)       │  │  (RPi)         │  │  (RPi)       │
│  SQLite      │  │  SQLite        │  │  SQLite      │
│  RFID Reader │  │  RFID Reader   │  │  RFID Reader │
│  Sync Engine │  │  Sync Engine   │  │  Sync Engine │
│  Admin Panel │  │  Admin Panel   │  │  Admin Panel │
└──────────────┘  └────────────────┘  └──────────────┘
```

## Server Components

| Server | Location | Port | Purpose |
|--------|----------|------|---------|
| HQ Backend | Cloud | 3000 | Central API, sync, analytics |
| Admin Portal | Cloud | 80 | Highway administration dashboard |
| Customer Portal | Cloud | 8080 | Vehicle owner portal |
| Storage Server | Cloud | 5000 | Photos, ANPR captures, documents |
| Plaza Server | Each RPi | 4000 | Local toll operations, offline-first |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Customer Portal | React 18, TypeScript, Vite, Tailwind CSS |
| HQ Backend | Express, TypeScript, Prisma ORM, PostgreSQL |
| Plaza Server | Express, TypeScript, Prisma ORM, SQLite |
| Storage Server | Express, TypeScript, Multer, Sharp |
| RFID Support | Serial (RS232/USB) + TCP/IP readers |
| Deployment | Docker Compose |

## Project Structure

```
tollgate-rfid-pass/
├── packages/
│   ├── backend/              # HQ Express API server
│   │   ├── src/modules/      # Feature modules
│   │   └── prisma/           # PostgreSQL schema & migrations
│   ├── frontend/             # Admin dashboard (React)
│   ├── customer-portal/      # Customer portal (React)
│   ├── plaza-server/         # Raspberry Pi plaza server
│   │   ├── src/services/     # RFID reader, sync engine, toll processor
│   │   ├── src/admin-panel/  # Built-in admin UI
│   │   └── prisma/           # SQLite schema
│   ├── storage-server/       # File storage server
│   ├── hq-server/            # HQ sync endpoints
│   ├── simulator/            # RFID/ANPR simulator CLI
│   └── shared/               # Shared types
├── scripts/
│   ├── deploy-hq.sh          # HQ server deployment
│   └── deploy-plaza.sh       # Plaza server deployment (RPi)
├── docker-compose.hq.yml     # HQ stack
└── docker-compose.yml        # Development
```

## Quick Start

### Development (Local)

```bash
# 1. Start database
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Setup database
cd packages/backend
npm run db:generate
npm run db:migrate
npm run db:seed

# 4. Start services
npm run dev          # Backend: http://localhost:3000
cd ../frontend && npm run dev          # Admin: http://localhost:5173
cd ../customer-portal && npm run dev   # Customer: http://localhost:8080
```

### Production (HQ Server)

```bash
chmod +x scripts/deploy-hq.sh
./scripts/deploy-hq.sh
```

### Plaza Server (Each Raspberry Pi)

```bash
chmod +x scripts/deploy-plaza.sh
./scripts/deploy-plaza.sh plaza-001 "0 Mile Plaza" "0MILE" "http://hq-server:3000" "sync-token"
```

## Login Credentials

### HQ Server

| Email | Password | Role |
|-------|----------|------|
| admin@tollgate.com | admin123 | Admin |
| operator@tollgate.com | operator123 | Operator |
| viewer@tollgate.com | viewer123 | Viewer |

### Customer Portal

| Email | Password | Role |
|-------|----------|------|
| ko.min@personal.com | password123 | Customer |
| fleet@transportco.com | password123 | Enterprise |

### Plaza Server

| Email | Password | Role |
|-------|----------|------|
| admin@plaza.local | admin123 | Plaza Admin |

## API Endpoints

### HQ Backend (port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/vehicles` | List vehicles |
| POST | `/api/vehicles` | Create vehicle |
| GET | `/api/toll-events` | List toll events |
| GET | `/api/reports/revenue` | Revenue report |
| GET | `/api/reports/transactions/excel` | Export Excel |

### Plaza Server (port 4000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/config` | Plaza configuration |
| GET | `/api/events` | Today's toll events |
| GET | `/api/vehicles` | Local vehicles |
| GET | `/api/sync/status` | Sync queue status |
| POST | `/api/admin/login` | Plaza admin login |

### Storage Server (port 5000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/vehicle` | Upload vehicle photo |
| POST | `/api/upload/anpr` | Upload ANPR capture |
| GET | `/files/:type/:filename` | Serve files |
| GET | `/api/stats` | Storage statistics |

### Sync API (HQ port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sync/push` | Plaza → HQ data sync |
| POST | `/api/sync/pull` | HQ → Plaza data sync |
| POST | `/api/sync/plazas` | Register new plaza |
| GET | `/api/sync/plazas` | Get all plazas status |

## Features

### HQ Admin Dashboard
- Real-time monitoring across all plazas
- Revenue analytics and reporting
- Vehicle registration and management
- RFID tag management
- Violation tracking
- Plaza management (CRUD)
- Excel export for reports

### Plaza Server (Raspberry Pi)
- **Offline-first**: All toll operations work without internet
- **Local SQLite**: Fast, reliable local database
- **RFID Reader**: Serial (USB) and TCP/IP support
- **Built-in Admin Panel**: Web UI for toll employees
- **Sync Engine**: Automatic bidirectional sync with HQ
- **Queue-based**: Stores pending sync items when offline

### Customer Portal
- Vehicle registration (requires admin approval)
- Toll history with detailed receipts
- Account balance and top-up
- Payment via KBZ Pay, Wave Pay, MMQR
- Dark mode support

### Sync Protocol
- **Bidirectional**: Plaza → HQ (events, vehicles) / HQ → Plaza (rates, blacklists)
- **Conflict Resolution**: Last-write-wins with retry
- **Queue-based**: Pending items stored in sync queue
- **Automatic Retry**: Exponential backoff on failures
- **Manual Retry**: Force retry from admin panel

## Hardware Requirements

### Plaza Server (Raspberry Pi)
- Raspberry Pi 4 (2GB+ RAM recommended)
- 32GB+ microSD card
- USB-to-Serial adapter (for RFID reader)
- Ethernet or WiFi connection
- UPS/battery backup recommended

### RFID Reader
- **Serial**: RS232/USB RFID reader (Impinj, Zebra, etc.)
- **TCP/IP**: Network-connected RFID reader
- Supports standard RFID protocols

## Database

### HQ Database (PostgreSQL)
- Users, accounts, vehicles, RFID tags
- Toll plazas, rates, events, transactions
- Violations, notifications, device status
- Promo codes, loyalty points, webhooks

### Plaza Database (SQLite)
- Local vehicles and RFID tags
- Toll events (entry/exit)
- Sync queue for pending items
- Device status and audit logs

## Deployment

### Network Requirements
- HTTPS API calls for sync
- WebSocket for real-time updates (optional)
- Minimum 1Mbps bandwidth per plaza
- VPN recommended for production

### Offline Tolerance
- Plazas can operate indefinitely offline
- Sync queue stores up to 10,000 events
- Automatic retry with exponential backoff
- Manual force retry available

## License

MIT
