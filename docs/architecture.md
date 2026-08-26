# TollGate Distributed System Architecture

## Overview

The TollGate Management System uses a **3-tier distributed architecture**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Pages     │  │   Workers   │  │     KV      │                │
│  │  (Customer  │  │   (API)     │  │   (Cache)   │                │
│  │   Portal)   │  │             │  │             │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
└────────────────────────────┬────────────────────────────────────────┘
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      HQ SERVER (Main Data Center)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   Admin     │  │  PostgreSQL │  │   Redis     │                │
│  │  Dashboard  │  │  (Primary)  │  │   (Cache)   │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │   API       │  │  WebSocket  │  │  Payment    │                │
│  │  Gateway    │  │   Server    │  │  Gateway    │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
└────────────────────────────┬────────────────────────────────────────┘
                             │ VPN/Internet
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│  BRANCH PLAZA 1   │ │  BRANCH PLAZA 2   │ │  BRANCH PLAZA N   │
│  ┌─────────────┐  │ │  ┌─────────────┐  │ │  ┌─────────────┐  │
│  │  SQLite DB  │  │ │  │  SQLite DB  │  │ │  │  SQLite DB  │  │
│  │  (Local)    │  │ │  │  (Local)    │  │ │  │  (Local)    │  │
│  └─────────────┘  │ │  └─────────────┘  │ │  └─────────────┘  │
│  ┌─────────────┐  │ │  ┌─────────────┐  │ │  ┌─────────────┐  │
│  │ Edge Server │  │ │  │ Edge Server │  │ │  │ Edge Server │  │
│  │ (Sync +     │  │ │  │ (Sync +     │  │ │  │ (Sync +     │  │
│  │  Processing)│  │ │  │  Processing)│  │ │  │  Processing)│  │
│  └─────────────┘  │ │  └─────────────┘  │ │  └─────────────┘  │
│  ┌─────────────┐  │ │  ┌─────────────┐  │ │  ┌─────────────┐  │
│  │ RFID Reader │  │ │  │ RFID Reader │  │ │  │ RFID Reader │  │
│  │ ANPR Camera │  │ │  │ ANPR Camera │  │ │  │ ANPR Camera │  │
│  └─────────────┘  │ │  └─────────────┘  │ │  └─────────────┘  │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

---

## Component Details

### 1. HQ Server (Main Data Center)

**Purpose**: Central management, data aggregation, admin operations

**Stack**:
- **Runtime**: Node.js + TypeScript
- **Database**: PostgreSQL 16 (Primary)
- **Cache**: Redis 7
- **API**: Express.js + REST + WebSocket
- **Auth**: JWT + Refresh Tokens
- **Queue**: BullMQ (for async tasks)

**Responsibilities**:
- Admin dashboard API
- Central user/account management
- Payment processing
- Report generation
- Branch server synchronization
- Fleet management
- Violation management

**API Endpoints**:
```
/api/admin/*          - Admin operations
/api/auth/*           - Authentication
/api/accounts/*       - Account management
/api/payments/*       - Payment processing
/api/reports/*        - Report generation
/api/sync/*           - Branch synchronization
```

---

### 2. Branch Toll Plaza Server (On-Premise)

**Purpose**: Local toll collection, offline operation, edge processing

**Stack**:
- **Runtime**: Node.js + TypeScript (lightweight)
- **Database**: SQLite (local) + Prisma
- **Sync**: CRDT-based conflict resolution
- **Hardware**: Raspberry Pi 4 or similar

**Responsibilities**:
- RFID tag scanning
- ANPR plate recognition
- Local toll event processing
- Offline operation (cached data)
- Sync with HQ when online
- Real-time lane management

**Database Schema (SQLite)**:
```sql
-- Local tables with sync metadata
CREATE TABLE TollEvents (
  id TEXT PRIMARY KEY,
  vehicleId TEXT,
  plazaId TEXT,
  entryTime DATETIME,
  exitTime DATETIME,
  status TEXT,
  syncVersion INTEGER DEFAULT 0,
  syncedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vehicles (
  id TEXT PRIMARY KEY,
  plateNumber TEXT UNIQUE,
  rfidTag TEXT,
  vehicleClass TEXT,
  syncVersion INTEGER DEFAULT 0,
  lastSyncedAt DATETIME
);

CREATE TABLE SyncQueue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tableName TEXT,
  recordId TEXT,
  operation TEXT, -- INSERT, UPDATE, DELETE
  payload TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  syncedAt DATETIME
);
```

**Sync Protocol**:
```
1. Branch operates independently (offline-capable)
2. When online, push local changes to HQ
3. Pull latest data from HQ periodically
4. Conflict resolution: Last-write-wins + manual review
5. Version vectors for causal ordering
```

---

### 3. Cloudflare (Customer Portal)

**Purpose**: Customer-facing web application, global CDN

**Services Used**:
- **Cloudflare Pages**: Static site hosting
- **Cloudflare Workers**: Serverless API (optional)

**Pages Deployment**:
```
packages/customer-portal/
├── dist/                    # Built files
├── wrangler.toml           # Cloudflare config
└── functions/              # Edge functions (optional)
    └── api/
        └── [...].js        # Catch-all API route
```

**Customer Portal Features**:
- Account registration/login
- Vehicle management
- Top-up (redirects to HQ payment API)
- Toll history
- Violation management
- Real-time notifications (WebSocket)

---

## Data Flow

### Toll Collection Flow
```
1. Vehicle arrives at plaza
2. RFID reader scans tag → Branch Server
3. ANPR camera captures plate → Branch Server
4. Branch Server:
   a. Validates RFID tag (local cache)
   b. Cross-checks plate number
   c. Creates TollEvent (local SQLite)
   d. Deducts from account balance (if sufficient)
   e. Opens gate
5. Branch Server queues sync to HQ
6. When online, syncs to HQ PostgreSQL
```

### Payment Flow
```
1. Customer initiates top-up on Cloudflare Portal
2. Portal redirects to HQ Payment API
3. HQ processes payment (KBZ/Wave/MMQR)
4. HQ updates account balance
5. HQ pushes balance update to Branch Servers
6. Branch Server updates local cache
```

### Sync Flow
```
Branch → HQ (Push):
1. Collect local changes in SyncQueue
2. Batch send to /api/sync/push
3. HQ applies changes to PostgreSQL
4. Return sync status + conflicts

HQ → Branch (Pull):
1. Branch requests changes since last sync
2. HQ returns changes from PostgreSQL
3. Branch applies changes to SQLite
4. Update syncVersion
```

---

## Network Requirements

### HQ Server
- **Bandwidth**: 100+ Mbps
- **Latency**: < 50ms to branches
- **Uptime**: 99.9%

### Branch Servers
- **Bandwidth**: 10+ Mbps (for sync)
- **Latency**: < 200ms to HQ
- **Uptime**: 99.5% (with offline fallback)

### Cloudflare
- **Global CDN**: Automatic
- **Edge Locations**: 300+ worldwide

---

## Security Architecture

### Authentication
```
HQ Server:
- JWT tokens (15 min expiry)
- Refresh tokens (7 days)
- API keys for branch sync

Branch Servers:
- Certificate-based auth to HQ
- Local JWT validation
- Hardware token support

Cloudflare:
- OAuth2 (Google, Facebook)
- Magic Link login
- Rate limiting
```

### Data Encryption
```
At Rest:
- PostgreSQL: AES-256 encryption
- SQLite: SQLCipher encryption
- Cloudflare: Automatic

In Transit:
- TLS 1.3 for all connections
- mTLS for HQ-Branch sync
- Certificate pinning
```

---

## Deployment

### HQ Server
```bash
# Docker deployment
docker compose -f docker-compose.prod.yml up -d

# Services:
- postgres (primary database)
- redis (cache + queue)
- backend (API server)
- nginx (reverse proxy)
```

### Branch Server
```bash
# Raspberry Pi setup
./setup-branch.sh --plaza-id "PLAZA-001" --hq-url "https://hq.tollgate.com"

# Services:
- sqlite (local database)
- edge-server (sync + processing)
- rfid-service (hardware interface)
- anpr-service (camera interface)
```

### Cloudflare Pages
```bash
# Deploy customer portal
cd packages/customer-portal
npm run build
npx wrangler pages deploy dist --project-name=tollgate-portal
```

---

## Monitoring

### HQ Server
- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack
- **Tracing**: Jaeger

### Branch Servers
- **Health Checks**: Every 30 seconds
- **Sync Status**: Real-time dashboard
- **Hardware Status**: Temperature, CPU, memory

### Cloudflare
- **Analytics**: Cloudflare Dashboard
- **Errors**: Sentry integration
- **Performance**: Web Vitals

---

## Scalability

### Branch Servers
- Each plaza runs independently
- No shared state between branches
- Horizontal scaling by adding plazas

### HQ Server
- Read replicas for reports
- Connection pooling
- Cache layer (Redis)

### Cloudflare
- Automatic edge caching
- Global load balancing
- DDoS protection

---

## Disaster Recovery

### Branch Server Failure
1. Hardware replacement (swap unit)
2. Restore from latest backup
3. Sync from HQ to catch up
4. Resume operation

### HQ Server Failure
1. Failover to standby server
2. Restore from daily backup
3. Re-sync all branches
4. Resume operation

### Data Loss Prevention
- Real-time replication to standby
- Daily backups to cloud storage
- Branch servers maintain local copies
- Cloudflare Pages versioned deployments

---

## Cost Estimation

### HQ Server (Monthly)
```
- Server Hardware: $500/month (amortized)
- PostgreSQL: $200/month
- Redis: $100/month
- Internet: $100/month
- Total: ~$900/month
```

### Branch Server (Per Plaza)
```
- Raspberry Pi 4: $100 (one-time)
- RFID Reader: $200 (one-time)
- ANPR Camera: $500 (one-time)
- Internet: $50/month
- Maintenance: $50/month
- Total: ~$100/month ongoing
```

### Cloudflare (Monthly)
```
- Pages: Free tier
- Workers: $5/month
- KV: $5/month
- Total: ~$10/month
```

---

## Implementation Phases

### Phase 1: HQ Server (Current)
- [x] Admin dashboard
- [x] API backend
- [x] Database schema
- [x] Authentication

### Phase 2: Branch Server
- [ ] SQLite sync engine
- [ ] Edge server
- [ ] RFID/ANPR integration
- [ ] Offline mode

### Phase 3: Cloudflare
- [ ] Customer portal deployment
- [ ] Edge functions
- [ ] KV cache

### Phase 4: Integration
- [ ] HQ-Branch sync
- [ ] Cloudflare-HQ API
- [ ] End-to-end testing

---

## API Contracts

### Branch → HQ Sync

#### Push Changes
```
POST /api/sync/push
Headers:
  X-Branch-ID: plaza-001
  X-Sync-Version: 12345
  Authorization: Bearer <branch_token>

Body:
{
  "changes": [
    {
      "table": "TollEvents",
      "operation": "INSERT",
      "recordId": "uuid",
      "data": { ... },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}

Response:
{
  "status": "ok",
  "synced": 10,
  "conflicts": 0,
  "nextSyncVersion": 12346
}
```

#### Pull Changes
```
GET /api/sync/pull?since=12345
Headers:
  X-Branch-ID: plaza-001
  Authorization: Bearer <branch_token>

Response:
{
  "changes": [
    {
      "table": "Vehicles",
      "operation": "UPDATE",
      "recordId": "uuid",
      "data": { ... },
      "timestamp": "2024-01-15T10:35:00Z"
    }
  ],
  "syncVersion": 12350
}
```

### Cloudflare → HQ API

#### Customer Registration
```
POST https://api.tollgate.com/api/customer/register
Body:
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "John Doe",
  "customerType": "INDIVIDUAL"
}
```

#### Top-up
```
POST https://api.tollgate.com/api/payments/topup
Body:
{
  "amount": 10000,
  "paymentMethod": "kbzpay"
}
```
