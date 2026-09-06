# TollGate RFID - Distributed Highway Toll Management System

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUD (HQ)                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  HQ Admin     │  │  Customer    │  │  Main Database        │  │
│  │  Dashboard    │  │  Portal      │  │  (PostgreSQL)         │  │
│  │  (Port 80)    │  │  (Port 8080) │  │  (Port 5432)          │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                      │              │
│  ┌──────┴──────────────────┴──────────────────────┴───────────┐  │
│  │              HQ API Server (Node.js/Express)               │  │
│  │  - Helmet.js security + CORS + Rate Limiting              │  │
│  │  - Zod input validation                                    │  │
│  │  - JWT authentication + RBAC                               │  │
│  │  - Sync engine (bidirectional)                             │  │
│  │  - Plaza management                                        │  │
│  │  - Customer management                                     │  │
│  │  - Analytics & reporting                                   │  │
│  │  - Swagger API documentation                               │  │
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

---

## Security Architecture

### Middleware Stack
```
Request → Rate Limiter → CORS → Helmet → JWT Auth → Zod Validation → Handler → Error Handler
```

### Security Layers

| Layer | Implementation | Configuration |
|---|---|---|
| **Rate Limiting** | express-rate-limit | Auth: 10/15min, Global: 100/min, Strict: 5/hr |
| **CORS** | cors package | `CORS_ORIGINS` env var or hardcoded list |
| **Helmet** | helmet package | CSP enabled in production |
| **JWT** | jsonwebtoken | `JWT_SECRET` env var, 24h expiry |
| **Validation** | Zod | Schemas in `src/validation/schemas.ts` |
| **Error Handling** | Custom middleware | Consistent `{success, error, code}` format |

### Error Response Format
```json
{
  "success": false,
  "error": "Validation error",
  "code": "VALIDATION_ERROR",
  "details": [
    {"field": "email", "message": "Invalid email format"},
    {"field": "password", "message": "Password must be at least 8 characters"}
  ]
}
```

---

## Database Design

### Schema (Prisma)

#### Core Models
- **User**: Authentication, roles (ADMIN, PLAZA_OPERATOR, LANE_OPERATOR)
- **Account**: Customer accounts (INDIVIDUAL, ENTERPRISE), balance, status
- **Vehicle**: Plate number, class, make/model, approval status
- **RFIDTag**: Tag UID, vehicle binding, activation status
- **TollPlaza**: Name, GPS coordinates, lanes, status

#### Transaction Models
- **TollEvent**: Entry/exit records, ANPR plate, RFID match status
- **Transaction**: Payment records, amount, method, status
- **Violation**: ANPR mismatches, unpaid tolls, blacklist hits
- **DeviceStatus**: Hardware health monitoring

### Database Indexes (23 total)

#### Vehicles
```sql
CREATE INDEX "vehicles_plate_number_idx" ON "vehicles"("plate_number");
CREATE INDEX "vehicles_status_idx" ON "vehicles"("status");
CREATE INDEX "vehicles_approval_status_idx" ON "vehicles"("approval_status");
CREATE INDEX "vehicles_vehicle_class_idx" ON "vehicles"("vehicle_class");
CREATE INDEX "vehicles_created_at_idx" ON "vehicles"("created_at");
```

#### Accounts
```sql
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");
CREATE INDEX "accounts_status_idx" ON "accounts"("status");
CREATE INDEX "accounts_customer_type_idx" ON "accounts"("customer_type");
```

#### Toll Events
```sql
CREATE INDEX "toll_events_vehicle_id_idx" ON "toll_events"("vehicle_id");
CREATE INDEX "toll_events_plaza_id_idx" ON "toll_events"("plaza_id");
CREATE INDEX "toll_events_entry_time_idx" ON "toll_events"("entry_time");
CREATE INDEX "toll_events_status_idx" ON "toll_events"("status");
CREATE INDEX "toll_events_anpr_plate_idx" ON "toll_events"("anpr_plate");
```

#### Transactions
```sql
CREATE INDEX "transactions_account_id_idx" ON "transactions"("account_id");
CREATE INDEX "transactions_event_id_idx" ON "transactions"("event_id");
CREATE INDEX "transactions_status_idx" ON "transactions"("status");
CREATE INDEX "transactions_type_idx" ON "transactions"("type");
CREATE INDEX "transactions_created_at_idx" ON "transactions"("created_at");
```

#### Violations
```sql
CREATE INDEX "violations_vehicle_id_idx" ON "violations"("vehicle_id");
CREATE INDEX "violations_event_id_idx" ON "violations"("event_id");
CREATE INDEX "violations_status_idx" ON "violations"("status");
CREATE INDEX "violations_violation_type_idx" ON "violations"("violation_type");
CREATE INDEX "violations_created_at_idx" ON "violations"("created_at");
```

---

## Health & Monitoring

### Health Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | No | Full health: DB status, latency, memory, CPU |
| `/api/health/live` | GET | No | Liveness probe (always 200 if process alive) |
| `/api/health/ready` | GET | No | Readiness probe (200 if DB connected) |
| `/api/health/metrics` | GET | Yes | Detailed metrics: DB counts, storage, uptime |
| `/api/health/backup` | GET | Yes | Full DB backup as JSON download |

### Health Check Response
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
    "used": 2902425600,
    "usagePercent": "35.4"
  },
  "cpu": {
    "model": "Intel(R) Core(TM) i5-6300HQ CPU @ 2.30GHz",
    "cores": 4,
    "loadAvg": [1.88, 1.95, 0.94]
  },
  "platform": "linux",
  "nodeVersion": "v20.20.2",
  "version": "1.0.0"
}
```

### Docker Health Checks

All services have health checks with dependency ordering:

```yaml
backend:
  healthcheck:
    test: ["CMD-SHELL", "curl -f http://localhost:3000/api/health || exit 1"]
    interval: 15s
    timeout: 10s
    retries: 3
    start_period: 20s
  depends_on:
    db:
      condition: service_healthy

frontend:
  healthcheck:
    test: ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
    interval: 15s
    timeout: 10s
    retries: 3
  depends_on:
    backend:
      condition: service_healthy
```

---

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

### Docker Deployment
```bash
# Full stack
docker compose up -d --build

# HQ + Storage stack
docker compose -f docker-compose.hq.yml up -d --build
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | postgresql://... | PostgreSQL connection string |
| `JWT_SECRET` | - | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | 24h | Token expiry time |
| `CORS_ORIGINS` | - | Comma-separated allowed origins |
| `SYNC_TOKEN` | - | Plaza sync authentication token |
| `STORAGE_SERVER_URL` | http://storage:5000 | Storage server URL |
| `NODE_ENV` | development | Environment mode |

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

---

## Sync Protocol

### Bidirectional Sync
1. **Plaza -> HQ**: Toll events, vehicle data, sync status
2. **HQ -> Plaza**: Vehicle registrations, rate updates, blacklists

### Conflict Resolution
- Last-write-wins for most fields
- Queue-based retry with exponential backoff
- Manual retry option in admin panel

### Offline Operation
- All toll operations work locally
- Queue stores pending sync items
- Automatic retry when connectivity returns
- Manual force retry available

---

## Default Credentials

### HQ Server
- **Admin**: admin@tollgate.com / password123
- **Customer Portal**: ko.min@personal.com / password123

### Plaza Server
- **Admin**: admin@plaza.local / admin123

---

## API Endpoints

### HQ API (port 3000)
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe
- `POST /api/auth/login` - Login
- `GET /api/vehicles` - List vehicles with search/filter
- `POST /api/vehicles` - Create vehicle
- `GET /api/reports/revenue` - Revenue report
- Swagger UI: `/api-docs`

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

### Storage Server (port 5000)
- `POST /api/upload/vehicle` - Upload vehicle photo
- `POST /api/upload/anpr` - Upload ANPR capture
- `GET /files/:type/:filename` - Serve files
- `GET /api/stats` - Storage statistics

---

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

### Plaza <-> HQ Communication
- HTTPS API calls for sync
- WebSocket for real-time updates (optional)
- Minimum 1Mbps bandwidth recommended
- VPN recommended for production

### Offline Tolerance
- Plazas can operate indefinitely offline
- Sync queue stores up to 10,000 events
- Automatic retry with exponential backoff
- Manual force retry available
