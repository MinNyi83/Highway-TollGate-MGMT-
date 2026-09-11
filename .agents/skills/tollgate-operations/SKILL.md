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
│  │ Admin Hub    │  │ Customer PWA │  │ Financial Portal 🆕  │  │
│  │ (Port 80)    │  │ (Port 8080)  │  │ (Port 8081)          │  │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬─────────┘  │
│         │                  │                       │             │
│  ┌──────┴──────────────────┴───────────────────────┴──────────┐  │
│  │              HQ Backend API (Port 3000)                    │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │  hqPrisma   │  │customerPrisma│  │financialPrisma   │  │  │
│  │  └──────┬──────┘  └──────┬───────┘  └───────┬──────────┘  │  │
│  └─────────┼────────────────┼───────────────────┼────────────┘  │
│            │                │                   │               │
│  ┌─────────▼──────┐  ┌─────▼────────┐  ┌──────▼───────────┐  │
│  │  HQ DB (:5432) │  │Customer DB   │  │ HQ DB (:5432)    │  │
│  │  tollgate       │  │(:5433)       │  │ (financial tbls) │  │
│  │  vehicles,      │  │tollgate_     │  │ regions,         │  │
│  │  events, plazas │  │customer      │  │ collections,     │  │
│  └────────────────┘  └──────────────┘  │ receipts         │  │
│                                         └──────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Internet / VPN / 4G
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────────┐ ┌──────┴──────────┐ ┌──────┴──────────┐
│ Plaza 01 (0-Mile)│ │ Plaza 02 (Bago) │ │ Plaza N (Edge)  │
│ - RPi / Edge     │ │ - RPi / Edge    │ │ - RPi / Edge    │
│ - PostgreSQL     │ │ - PostgreSQL    │ │ - PostgreSQL    │
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

### Database Migration (3 Databases)
```bash
# Run pending migrations (HQ database - default)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx prisma migrate deploy'

# Create new migration (if schema changed)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx prisma migrate dev --name <migration_name> --create-only'

# Seed HQ database (fresh install only)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx tsx prisma/seed.ts'

# Seed Customer database
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@customer-db:5432/tollgate_customer npx tsx prisma/seeds/customer-seed.ts'

# Seed Plaza database
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@plaza-db:5432/tollgate_plaza npx tsx prisma/seeds/plaza-seed.ts'

# Push schema to Customer database (no migration)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@customer-db:5432/tollgate_customer npx prisma db push --schema=prisma/schema.customer.prisma --accept-data-loss'

# Push schema to Plaza database (no migration)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@plaza-db:5432/tollgate_plaza npx prisma db push --schema=prisma/schema.plaza.prisma --accept-data-loss'

# Seed Financial data (15 regions + financial staff + sample data)
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c \
  'cd packages/backend && npx tsx prisma/seeds/financial-seed.ts'
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
| **Financial Admin** | `fin.admin@tollgate.com` | `password123` | Financial Portal admin access |
| **Financial Manager** | `fin.manager@tollgate.com` | `password123` | Financial Portal approval workflow |
| **Financial Viewer** | `fin.viewer@tollgate.com` | `password123` | Financial Portal read-only access |

### Financial Terminology
| Term | Meaning |
|---|---|
| **Toll Revenue** | Actual charges deducted at plaza (COMPANY INCOME) |
| **Wallet Deposits** | Customer loaded money (COMPANY LIABILITY - NOT revenue) |
| **Revenue Remittance** | Plaza → Treasury transfer |
| **Daily Collection Statement** | Per-plaza daily toll earnings |
| **Financial Reconciliation** | Monthly approval workflow |
| **Fiscal Year** | April–March (Q1=Apr-Jun, Q2=Jul-Sep, Q3=Oct-Dec, Q4=Jan-Mar) |

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
  "timestamp": "2026-09-09T06:45:20.332Z",
  "uptime": 69.269982444,
  "databases": {
    "hq": { "name": "hq", "status": "connected", "latencyMs": 2 },
    "customer": { "name": "customer", "status": "connected", "latencyMs": 2 },
    "plaza": { "name": "plaza", "status": "connected", "latencyMs": 2 }
  },
  "memory": {
    "total": 8188993536,
    "free": 6204076032,
    "usagePercent": "24.2"
  },
  "cpu": {
    "model": "Intel(R) Core(TM) i5-6300HQ CPU @ 2.30GHz",
    "cores": 4,
    "loadAvg": [0.8, 0.47, 0.28]
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

### Applied Indexes (23 total across HQ + Customer databases)
- **Vehicles** (HQ): plate_number, status, approval_status, vehicle_class, created_at
- **Accounts** (Customer): user_id, status, customer_type
- **Toll Events** (HQ): vehicle_id, plaza_id, entry_time, status, anpr_plate
- **Transactions** (HQ): account_id, event_id, status, type, created_at
- **Violations** (HQ): vehicle_id, event_id, status, violation_type, created_at
- **RFID Tags** (Customer): account_id, vehicle_id, tag_uid
- **Notifications** (Customer): user_id, read

### Creating New Indexes
1. Add `@@index([column])` to the model in the appropriate schema:
   - HQ: `packages/backend/prisma/schema.prisma`
   - Customer: `packages/customer-portal/prisma/schema.prisma`
   - Plaza: `packages/plaza-server/prisma/schema.prisma`
2. Run migration or push:
   ```bash
   # HQ database
   npx prisma migrate dev --name add_<index_name>
   
   # Customer database (push)
   DATABASE_URL=postgresql://postgres:postgres@customer-db:5432/tollgate_customer \
     npx prisma db push --schema=prisma/schema.customer.prisma --accept-data-loss
   
   # Plaza database (push)
   DATABASE_URL=postgresql://postgres:postgres@plaza-db:5432/tollgate_plaza \
     npx prisma db push --schema=prisma/schema.plaza.prisma --accept-data-loss
   ```
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

# Financial System (Port 8081)
GET /api/financial/regions
GET /api/financial/daily-collection
GET /api/financial/revenue/by-region
GET /api/financial/topup/by-region
GET /api/financial/vehicles/by-region
GET /api/financial/toll-usage/:plazaId
GET /api/financial/settlement
GET /api/financial/reconciliation
POST /api/financial/reconciliation/:id/approve
POST /api/financial/reconciliation/:id/reject
GET /api/financial/receipts
POST /api/financial/receipts/generate
GET /api/financial/fiscal-year/summary
GET /api/financial/export/:type
GET /api/financial/plaza-performance
GET /api/financial/violations
GET /api/financial/forecast
GET /api/financial/heatmap
GET /api/financial/transactions
GET /api/financial/settlement-pipeline
GET /api/financial/alerts
GET /api/financial/comparison
GET /api/financial/audit-logs
GET /api/financial/dashboard/kpi
GET /api/financial/dashboard/revenue-by-region
GET /api/financial/dashboard/deposits-by-region
GET /api/financial/dashboard/monthly-trend
GET /api/financial/plazas
GET /api/financial/wallet-analytics
GET /api/financial/revenue-by-vehicle
GET /api/financial/customer-spending
GET /api/financial/revenue-by-payment
GET /api/financial/loyalty-analytics
GET /api/financial/reports/summary
GET /api/financial/budget-tracker
GET /api/financial/cost-allocation
GET /api/financial/revenue-sharing
GET /api/financial/debt-management
GET /api/financial/cash-flow
GET /api/financial/financial-ratios
GET /api/financial/vendor-payments
GET /api/financial/tax-withholding
GET /api/financial/integrations/plugins
GET /api/financial/integrations/status
POST /api/financial/integrations/sync
POST /api/financial/integrations/webhooks/register
DELETE /api/financial/integrations/webhooks/:id
GET /api/financial/integrations/webhooks/logs
POST /api/financial/integrations/webhooks/trigger
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
- **Dual-Mode Switcher**: Slide Deck Mode (15 slides) and Web Solution Portal Mode.
- **3D Isometric Scenario Digital Twin**: High-resolution 3D cutaway rendering.
- **Financial Portal Slide**: Slide 14 covers Financial Portal & Government Reporting.

### Myanmar RTAD Wheel Tax OCR & Auto-Fill (`/api/ocr/scan-wheel-tax`)
- **Dual-Side Support**: Scans both Front and Back of Myanmar RTAD cards.
- **VIN/Chassis Decoder**: Automatically maps chassis codes to vehicle make, model, and class.

### Real Geographic GPS Highway Map (Leaflet / OpenStreetMap)
- **Corridor Coverage (Highway 1)**: 352.0 miles with real GPS waypoints.

### Dual-Theme Adaptive UI (Dark / Light Mode)
- **Header Sun/Moon Toggle**: Available on both Admin Command Hub and Customer Portal.
- **Persistent Preferences**: Theme state persisted to `localStorage`.

### Financial Portal (Port 8081) 🆕
- **Standalone Frontend**: React + Vite + Tailwind, separate from other portals.
- **35 Financial Pages**: Dashboard, Daily Collection, Revenue by Region, Wallet Deposits, Vehicle Registration, Pass-Through Volume, Revenue Remittance, Financial Reconciliation, Official Receipts, Fiscal Year Report, Comparison Report, Plaza Performance, Violation Analytics, Revenue Forecast, Revenue Heatmap, Transaction Search, Settlement Pipeline, Audit Trail, Wallet Analytics, Revenue by Vehicle, Customer Spending, Revenue by Payment Method, Loyalty Analytics, Financial Reports Generator, Budget Tracker, Cost Allocation, Revenue Sharing, Debt Management, Cash Flow, Financial Ratios, Vendor Payments, Tax Withholding.
- **Myanmar/English Toggle**: i18n support with correct financial terminology.
- **Excel & PDF Export**: All pages support Excel export via SheetJS and PDF export via jsPDF.
- **Approval Workflow**: Monthly reconciliation with Submit → Approve/Reject flow.
- **Copyright Protection**: Watermarks (login + dashboard), footer, login watermarks, meta tags.
- **34 Backend Endpoints**: Under `/api/financial/*` using `hqPrisma` client.
- **API Integration Layer**: Connects to external ERP, accounting, banking, and government systems.
- **Supported Integrations**: SAP, Oracle, Dynamics 365, QuickBooks, Wave, Xero, FreshBooks, CBM, KBZ, Ayeyarwady, UAB, AYA, MyCO, IRD, Myanmar Tax, Customs.

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
| Relation "User" does not exist | Fresh PostgreSQL instance unmigrated | Run `npx prisma migrate deploy` and seed all 3 databases |
| Rate limit 429 error | Too many rapid requests | Wait for window to reset; check `NODE_ENV=test` skips |
| CORS origin not allowed | Request from unauthorized origin | Add origin to `CORS_ORIGINS` env var or `ALLOWED_ORIGINS` in `app.ts` |
| Health returns 503 | One or more databases disconnected | Check `docker ps`, restart db container: `docker compose restart db customer-db plaza-db` |
| Prisma client outdated | Schema changed without regen | Run `npx prisma generate` for HQ, customer, and plaza schemas |
| Migration not applied | New migration created but not deployed | Run `npx prisma migrate deploy` |
| Frontend 404 on reload | nginx missing SPA fallback | Check `try_files $uri /index.html` in nginx.conf |
| Presentation page shows 404 | Missing presentation.html in web root | Copy `PRESENTATION.html` to `packages/frontend/dist/presentation.html` |
| Plaza offline sync backlog | Network interruption between Plaza and HQ | Run `SyncService.forceSync()` or check `/api/sync/status` |
| Container won't start | Port already in use | `docker compose down` then `docker compose up -d --build` |
| DNS resolution fails on server | Missing nameserver | `echo 1512 | sudo -S sh -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf'` |
| Customer login fails | Wrong database client | Ensure auth routes use `customerPrisma` not `hqPrisma` |
| Cross-database query fails | Using wrong Prisma client | Import correct client: `hqPrisma` for HQ, `customerPrisma` for customer |
| Financial portal "Login failed" | Response parsing mismatch | API returns `{user, token}` directly; use `res.data` not `res.data.data` |
| Financial portal rate limited | In-memory rate limiter full | Restart backend: `docker restart tollgate-rfid-backend-1` |
| Financial portal rate limited | In-memory rate limiter full | Use admin endpoint: `POST /api/auth/reset-rate-limiters` with SUPER_ADMIN token |

---

## 13. UI/UX Infrastructure (M008)

### Error Boundaries
All 3 portals have `ErrorBoundary` components that catch render errors and show a graceful fallback UI with a reload button.
- `packages/frontend/src/components/ErrorBoundary.tsx`
- `packages/customer-portal/src/components/ErrorBoundary.tsx`
- `packages/financial-portal/src/components/ErrorBoundary.tsx`

### Toast Notifications
- **Admin portal**: `packages/frontend/src/components/Toast.tsx` — `useToast()` hook, `addToast(type, message)`
- **Financial portal**: `packages/financial-portal/src/components/Toast.tsx` — same API
- **Customer portal**: `packages/customer-portal/src/components/Toast.tsx` — `showToast()` event-based system

### Skeleton Loading
- `packages/frontend/src/components/Skeleton.tsx` — `CardSkeleton`, `TableSkeleton`, `ChartSkeleton`, `DashboardSkeleton`
- `packages/financial-portal/src/components/Skeleton.tsx` — same components
- `packages/customer-portal/src/components/Skeleton.tsx` — `Skeleton`, `CardSkeleton`, `TableSkeleton`, `StatSkeleton`

### Rate Limiter Reset
Admin-only endpoint to clear all in-memory rate limiters:
```
POST /api/auth/reset-rate-limiters
Authorization: Bearer <SUPER_ADMIN_TOKEN>
Response: { success: true, message: "All rate limiters reset", results: { auth: 1, global: 1, strict: 1 } }
```

### Command-Palette + Floating Rail Layout
All 3 portals use a modern Command-Palette + Floating Rail layout:
- **FloatingRail**: Slim glassmorphic icon rail (64px wide) positioned at left center, vertically centered
- **CommandPalette**: Fuzzy search with Cmd+K / Ctrl+K keyboard shortcut, grouped results
- **Financial Portal**: 33 nav items grouped by category (Dashboard, Revenue, Settlement, Reports, Analytics, Finance, Search, Compliance) with section dividers
- **Overflow handling**: All rails have `overflow-auto` + `max-h-[calc(100vh-3rem)]` + thin scrollbar

### Mobile Navigation
- **Admin Hub & Financial Portal**: Hamburger menu (top-left) + bottom tab bar (4 items)
- **Customer Portal**: Bottom tab bar (6 items) with safe-area-bottom for iOS
- **All portals**: Responsive padding `p-4 md:p-6 pb-24 md:pb-6` for bottom bar clearance

### Dark Mode
- **Strategy**: Tailwind `darkMode: 'class'` across all portals
- **FOUC Prevention**: Inline `<script>` in all `index.html` reads `localStorage('theme')` before React mounts
- **OS Preference**: `window.matchMedia('(prefers-color-scheme: dark)')` detection on first visit
- **Persistence**: `localStorage.setItem('theme', 'dark'|'light')` on every toggle
- **Components with dark mode**: Layout, FloatingRail, CommandPalette, Watermark, NotificationPanel, Skeleton, Toast, NotificationBell, Settings page

### Watermarks
All 3 portals display a subtle "NYIMIN © 2026" diagonal text overlay:
- Text size: `text-2xl` (smaller than previous `text-5xl`)
- Opacity: `0.02` (very subtle)
- Font: `font-serif font-semibold`
- Position: 10 instances in a 2-column grid across the viewport

### Key Files
| File | Purpose |
|---|---|
| `packages/frontend/src/components/FloatingRail.tsx` | Admin hub floating rail with overflow |
| `packages/frontend/src/components/Layout.tsx` | Admin hub layout with mobile nav |
| `packages/frontend/src/components/CommandPalette.tsx` | Admin hub command palette |
| `packages/frontend/src/components/Watermark.tsx` | Admin hub watermark |
| `packages/frontend/src/components/NotificationPanel.tsx` | Admin hub notifications (dark mode) |
| `packages/customer-portal/src/components/FloatingRail.tsx` | Customer portal floating rail |
| `packages/customer-portal/src/components/Layout.tsx` | Customer portal layout with mobile bottom tab |
| `packages/customer-portal/src/hooks/useTheme.tsx` | Customer portal theme hook |
| `packages/customer-portal/src/components/Skeleton.tsx` | Customer portal skeletons (dark mode) |
| `packages/customer-portal/src/components/Toast.tsx` | Customer portal toasts (dark mode) |
| `packages/customer-portal/src/components/NotificationBell.tsx` | Customer portal notifications (dark mode) |
| `packages/customer-portal/src/pages/Settings.tsx` | Settings page (dark mode) |
| `packages/financial-portal/src/components/FloatingRail.tsx` | Financial portal grouped rail |
| `packages/financial-portal/src/components/Layout.tsx` | Financial portal layout with mobile nav |
| `packages/financial-portal/src/components/CommandPalette.tsx` | Financial portal command palette |
| `packages/financial-portal/src/components/Watermark.tsx` | Financial portal watermark |
