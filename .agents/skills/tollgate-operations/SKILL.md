---
name: tollgate-operations
description: Comprehensive operational workflows, deployment steps, test commands, database migration procedures, and troubleshooting guidelines for the Highway TollGate RFID Pass system.
---

# Highway TollGate Operations & Engineering Guide

This skill provides step-by-step procedures, standard operating instructions, and troubleshooting runbooks for developing, testing, deploying, and maintaining the **Highway TollGate RFID Pass System**.

---

## 1. System Architecture & Topology

```
┌─────────────────────────────────────────────────────────────────┐
│                      CENTRAL HQ CLOUD                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Admin Hub    │  │ Customer PWA │  │ PostgreSQL Database  │  │
│  │ (Port 80)    │  │ (Port 8080)  │  │ (Port 5432)          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                      │              │
│  ┌──────┴──────────────────┴──────────────────────┴───────────┐  │
│  │              HQ Backend API (Port 3000)                    │  │
│  │  - Express / TypeScript / Prisma                           │  │
│  │  - Helmet.js security + CORS + Rate Limiting              │  │
│  │  - Myanmar RTAD OCR Document Parser (/api/ocr)             │  │
│  │  - Day-by-Day Revenue Transfer & Settlement (/api/reports) │  │
│  │  - WebSocket Telemetry & Payment Webhooks                  │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │                                      │
│  ┌────────────────────────┴───────────────────────────────────┐  │
│  │              Storage Server (Port 5000)                    │  │
│  │  - Vehicle photos  - ANPR captures  - Documents           │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Internet / VPN / 4G
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────────┐ ┌──────┴──────────┐ ┌──────┴──────────┐
│ Plaza 01 (0-Mile)│ │ Plaza 02 (Bago) │ │ Plaza N (Edge)  │
│ - RPi / Edge     │ │ - RPi / Edge    │ │ - RPi / Edge    │
│ - SQLite Cache   │ │ - SQLite Cache  │ │ - SQLite Cache  │
│ - RFID + ANPR    │ │ - RFID + ANPR   │ │ - RFID + ANPR   │
│ - Sync Engine    │ │ - Sync Engine   │ │ - Sync Engine   │
└──────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## 2. Standard Deployment Runbook

### Default Host Credentials
- **Server IP**: `192.168.100.101`
- **SSH User**: `nyimin`
- **SSH Password**: `1512`
- **Project Directory**: `~/TollGate-RFID`

### Remote Deployment via SSH (Kali Linux)
```bash
# SSH into server
ssh nyimin@192.168.100.101

# Fix DNS if resolution fails
echo 1512 | sudo -S sh -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf'

# Navigate to project and pull latest master
cd ~/TollGate-RFID
git pull origin master

# Build and launch Docker compose stack
echo 1512 | sudo -S docker compose up -d --build

# Verify all containers healthy
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

### Database Migration
```bash
# Run pending migrations
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx prisma migrate deploy'

# Create new migration (if schema changed)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx prisma migrate dev --name <migration_name> --create-only'

# Seed database (fresh install only)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx tsx prisma/seed.ts'
```

---

## 3. Seed Accounts & Credentials

| Role | Username / Email | Password | Purpose |
|---|---|---|---|
| **System Admin** | `admin@tollgate.com` | `password123` | Full administrative control & Command Hub |
| **Manager** | `manager@tollgate.com` | `password123` | Operations & shift management |
| **Booth Operator 1** | `operator1@tollgate.com` | `password123` | Lane cashier, manual logging & barrier control |
| **Auditor / Viewer** | `viewer@tollgate.com` | `password123` | Reports, audit logs & financial inspection |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` | TransportCo Fleet management (8 vehicles) |
| **Individual Driver** | `ko.min@personal.com` | `password123` | Customer PWA portal, digital wallet & pass |

---

## 4. Health & Monitoring

### Health Endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | No | Full health: DB status, latency, memory, CPU |
| `/api/health/live` | GET | No | Liveness probe (always 200 if process alive) |
| `/api/health/ready` | GET | No | Readiness probe (200 if DB connected) |
| `/api/health/metrics` | GET | Yes | Detailed metrics: DB counts, storage, uptime |
| `/api/health/detailed` | GET | Yes | Same as metrics (legacy alias) |
| `/api/health/backup` | GET | Yes | Full DB backup as JSON download |

### Health Check Commands
```bash
# Full health check
curl -s http://localhost:3000/api/health | python3 -m json.tool

# Liveness probe
curl -s http://localhost:3000/api/health/live

# Readiness probe
curl -s http://localhost:3000/api/health/ready

# Detailed metrics (requires auth)
curl -s -H "Authorization: Bearer <token>" http://localhost:3000/api/health/metrics

# Container health
docker ps --format 'table {{.Names}}\t{{.Status}}'

# Container resource usage
docker stats --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}'
```

### Health Response Format
```json
{
  "status": "healthy",
  "timestamp": "2026-09-06T00:19:07.517Z",
  "uptime": 66.943,
  "database": {
    "status": "connected",
    "latencyMs": 1
  },
  "memory": {
    "total": 8188993536,
    "free": 5286567936,
    "usagePercent": "35.4"
  },
  "cpu": {
    "model": "Intel(R) Core(TM) i5-6300HQ CPU @ 2.30GHz",
    "cores": 4,
    "loadAvg": [1.88, 1.95, 0.94]
  }
}
```

---

## 5. Security & Rate Limiting

### Rate Limiting
| Scope | Limit | Window | Effect |
|---|---|---|---|
| Auth (login/register) | 10 requests | 15 minutes | Returns 429 |
| Global (all endpoints) | 100 requests | 1 minute | Returns 429 |
| Strict (sensitive ops) | 5 requests | 1 hour | Returns 429 |

### Security Features
- **Helmet.js**: Content Security Policy enabled in production
- **CORS**: Restricted to allowed origins via `CORS_ORIGINS` env var
- **JWT**: Environment-configurable secret with Bearer token auth
- **Validation**: Zod schemas with detailed error messages

### Testing Rate Limiting
```bash
# Test is skipped in test environment
NODE_ENV=test  # Rate limiter disabled

# Production behavior
# Send 11 rapid login attempts -> 429 Too Many Requests
```

---

## 6. Database Indexes

### Applied Indexes (23 total)
- **Vehicles**: plate_number, status, approval_status, vehicle_class, created_at
- **Accounts**: user_id, status, customer_type
- **Toll Events**: vehicle_id, plaza_id, entry_time, status, anpr_plate
- **Transactions**: account_id, event_id, status, type, created_at
- **Violations**: vehicle_id, event_id, status, violation_type, created_at

### Creating New Indexes
1. Add `@@index([column])` to the model in `packages/backend/prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name add_<index_name>`
3. Deploy: `npx prisma migrate deploy`

---

## 7. API Documentation

### Swagger UI
- **Interactive Docs**: `http://<HOST>:3000/api-docs`
- **OpenAPI JSON**: `http://<HOST>:3000/api-docs.json`

### Key API Endpoints
```bash
# Authentication
POST /api/auth/login
POST /api/auth/register

# Vehicles
GET /api/vehicles?search=&status=&vehicleClass=&page=&limit=
GET /api/vehicles/:id
POST /api/vehicles
PUT /api/vehicles/:id
DELETE /api/vehicles/:id

# Toll Events
GET /api/toll-events
POST /api/toll-events/entry
POST /api/toll-events/:id/exit

# Transactions
GET /api/transactions
POST /api/transactions

# Violations
GET /api/violations
POST /api/violations
PATCH /api/violations/:id/resolve

# Reports
GET /api/reports/revenue
GET /api/reports/transactions
GET /api/reports/violations

# Customer Portal
POST /api/customer/login
GET /api/customer/dashboard
POST /api/customer/topup
```

---

## 8. Key Operational Features

### Day-by-Day Revenue Transfer & Plaza Settlement Monitor
- **Live Today's Revenue**: Continuous live accumulating revenue ticker per plaza and total system.
- **Previous Day Total Revenue**: Yesterday's toll collection total across all plazas.
- **Settlement Status Indicators**:
  - `TRANSFERRED` (Green): Plaza revenue confirmed and transferred to HQ central bank account.
  - `NEED TRANSFER` (Red Pulsing): Highlights plazas with pending transfers that require immediate settlement.
- **API Endpoints**:
  - `GET /api/reports/revenue/transfers`: Full overview and 7-day settlement history.
  - `POST /api/reports/revenue/transfers/confirm`: Confirm individual plaza transfer.
  - `POST /api/reports/revenue/transfers/batch-confirm`: Batch confirm pending plazas.

### Dahua Highway Solution Presentation & Web Portal (`/presentation.html`)
- **Dual-Mode Switcher**: Slide Deck Mode (14 slides) and Web Solution Portal Mode.
- **3D Isometric Scenario Digital Twin**: High-resolution 3D cutaway rendering.

### Myanmar RTAD Wheel Tax OCR & Auto-Fill (`/api/ocr/scan-wheel-tax`)
- **Dual-Side Support**: Scans both Front and Back of Myanmar RTAD cards.
- **VIN/Chassis Decoder**: Automatically maps chassis codes to vehicle make, model, and class.

### Real Geographic GPS Highway Map (Leaflet / OpenStreetMap)
- **Corridor Coverage (Highway 1)**: 352.0 miles with real GPS waypoints.

### Dual-Theme Adaptive UI (Dark / Light Mode)
- **Header Sun/Moon Toggle**: Available on both Admin Command Hub and Customer Portal.
- **Persistent Preferences**: Theme state persisted to `localStorage`.

---

## 9. Testing & Validation

### Executing Test Suites
```bash
# Run all backend tests
npm test --workspace=@tollgate/backend

# Run OCR parser tests
npx jest src/__tests__/ocr.test.ts

# Build verification for frontends
npm run build --workspace=@tollgate/frontend
npm run build --workspace=@tollgate/customer-portal

# Type check
cd packages/backend && npx tsc --noEmit
cd packages/frontend && npx tsc --noEmit
```

---

## 10. Troubleshooting Runbook

| Symptom | Probable Cause | Resolution |
|---|---|---|
| Relation "User" does not exist | Fresh PostgreSQL instance unmigrated | Run `npx prisma migrate deploy` and `npx tsx prisma/seed.ts` |
| Rate limit 429 error | Too many rapid requests | Wait for window to reset; check `NODE_ENV=test` skips |
| CORS origin not allowed | Request from unauthorized origin | Add origin to `CORS_ORIGINS` env var or `ALLOWED_ORIGINS` in `app.ts` |
| Health returns 503 | Database connection lost | Check `docker ps`, restart db container: `docker compose restart db` |
| Prisma client outdated | Schema changed without regen | Run `npx prisma generate` |
| Migration not applied | New migration created but not deployed | Run `npx prisma migrate deploy` |
| Frontend 404 on reload | nginx missing SPA fallback | Check `try_files $uri /index.html` in nginx.conf |
| Presentation page shows 404 | Missing presentation.html in web root | Copy `PRESENTATION.html` to `packages/frontend/dist/presentation.html` |
| Plaza offline sync backlog | Network interruption between Plaza and HQ | Run `SyncService.forceSync()` or check `/api/sync/status` |
| Container won't start | Port already in use | `docker compose down` then `docker compose up -d --build` |
| DNS resolution fails on server | Missing nameserver | `echo 1512 | sudo -S sh -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf'` |
