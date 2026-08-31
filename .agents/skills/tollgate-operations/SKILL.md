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
│  │  - Myanmar RTAD OCR Document Parser (/api/ocr)             │  │
│  │  - Day-by-Day Revenue Transfer & Settlement (/api/reports) │  │
│  │  - WebSocket Telemetry & Payment Webhooks                  │  │
│  └────────────────────────┬───────────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────┘
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

## 2. Standard Deployment Runbook (Ubuntu Server)

### Default Host Credentials
- **Server IP**: `192.168.100.101`
- **SSH User**: `nyimin`
- **Project Directory**: `/home/nyimin/TollGate-RFID`

### Remote Deployment via SSH
```bash
# SSH into Ubuntu server
ssh nyimin@192.168.100.101

# Navigate to project and pull latest master
cd /home/nyimin/TollGate-RFID
git pull origin master

# Build and launch Docker compose stack
docker compose up -d --build
```

### Checking Service Health & Port Mappings
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sI http://localhost:80                 # Admin Command Hub (Frontend)
curl -sI http://localhost:80/presentation.html # Dahua Highway Solution Portal & Slides
curl -sI http://localhost:8080               # Customer Portal PWA
curl -s http://localhost:3000/api/health     # Central Backend API
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

## 4. Key Operational Features

### 1. Day-by-Day Revenue Transfer & Plaza Settlement Monitor
- **Live Today's Revenue**: Continuous live accumulating revenue ticker per plaza and total system.
- **Previous Day Total Revenue**: Yesterday's toll collection total across all plazas.
- **Settlement Status Indicators**:
  - 🟢 **`TRANSFERRED` (Green)**: Plaza revenue confirmed and transferred to HQ central bank account (with Bank Name, Deposit Ref ID, and timestamp).
  - 🔴 **`NEED TRANSFER` (Red Pulsing)**: Highlights plazas with pending transfers that require immediate settlement.
- **Interactive Transfer Actions**:
  - **1-Click Modal**: Enter bank name, transaction reference ID, and confirm settlement.
  - **Batch Settle**: Bulk approve all pending plazas for yesterday in a single click.
  - **Historical Audit Table**: Filter and inspect settlement history day-by-day.
- **API Endpoints**:
  - `GET /api/reports/revenue/transfers`: Full overview and 7-day settlement history.
  - `POST /api/reports/revenue/transfers/confirm`: Confirm individual plaza transfer.
  - `POST /api/reports/revenue/transfers/batch-confirm`: Batch confirm pending plazas.

### 2. Dahua Highway Solution Presentation & Web Portal (`/presentation.html`)
- **Dual-Mode Switcher**:
  - **📽️ Slide Deck Mode**: 14-slide executive presentation with timer, fullscreen mode, slide drawer, and keyboard controls (`Arrow Keys` / `Space`).
  - **🌐 Web Solution Portal Mode**: Scrollable enterprise layout matching Dahua's highway solution with sticky navigation tabs (*Overview*, *Scenario Aerial View*, *Challenges & Offers*, *System Topology*, *Product Recommendation*, *Field Deployment*).
- **3D Isometric Scenario Digital Twin**:
  - High-resolution 3D cutaway rendering of toll plaza solar canopy, mountain tunnel, and suspension bridge.
  - Interactive floating Dahua pill badges (`(1) General Road`, `(2) Toll Plaza`, `(3) Bridge Gantry`, `(4) Tunnel System`).
- **Industrial Edge Hardware Catalog**:
  - Real industrial studio hardware photography for `DHI-ITC-RFID`, `DHI-ITC431` 4K ANPR Camera, `ITS-RADAR-79G` 79GHz Radar, and `DHI-EDGE-RPI` Industrial Gateway Box.

### 3. Myanmar RTAD Wheel Tax OCR & Auto-Fill (`/api/ocr/scan-wheel-tax`)
- **Dual-Side Support**: Scans both Front (Plate No, Model Year, Make/Model, Vehicle Type, Region) and Back (Engine No, Chassis No, Color, Gross Weight, Owner, Expiry Date) of Myanmar RTAD cards.
- **VIN/Chassis Decoder**: Automatically maps chassis codes (e.g. `FD3` -> Honda Civic Hybrid, `NCP91` -> Toyota Vitz, `JB64W` -> Suzuki Jimny, `GUN125` -> Toyota Hilux) to vehicle make, model, and class (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`).
- **One-Click Auto-Fill**: Available in Customer Portal (`My Vehicles`) and Admin Hub (`Vehicles`).

### 4. Real Geographic GPS Highway Map (Leaflet / OpenStreetMap)
- **Interactive Leaflet Map Engine**: Satellite imagery, street map, and CartoDB dark mode tile layers.
- **Corridor Coverage (Highway 1)**: Visualizes 352.0 miles along the Yangon – Mandalay Expressway with real GPS waypoints:
  - Yangon 0-Mile (`lat: 17.0372, lng: 96.1788`)
  - Bago Bypass 39M (`lat: 17.3353, lng: 96.4817`)
  - Phyu Rest Oasis 115M (`lat: 18.5284, lng: 96.4385`)
  - Naypyitaw Capital Gate 201M (`lat: 19.7450, lng: 96.1297`)
  - Meiktila Junction 285M (`lat: 20.8762, lng: 95.8611`)
  - Mandalay Southern Gate 352M (`lat: 21.9750, lng: 96.0836`)

### 5. Dual-Theme Adaptive UI (Dark / Light Mode)
- **Header Sun/Moon Toggle**: Available on both Admin Command Hub (top-right header) and Customer Portal.
- **Persistent Preferences**: Theme state is persisted to `localStorage` (`theme: 'dark' | 'light'`).

---

## 5. Testing & Validation

### Executing Test Suites
```bash
# Run all backend tests
npm test --workspace=@tollgate/backend

# Run OCR parser tests
npx jest src/__tests__/ocr.test.ts

# Build verification for frontends
npm run build --workspace=@tollgate/frontend
npm run build --workspace=@tollgate/customer-portal
```

---

## 6. Troubleshooting Runbook

| Symptom | Probable Cause | Resolution |
|---|---|---|
| Relation "User" does not exist | Fresh PostgreSQL instance unmigrated | Run `npx prisma migrate deploy` and `npx tsx prisma/seed.ts` in `packages/backend`. |
| Revenue Transfer status shows Pending | Yesterday's revenue transfer unconfirmed | Click "Transfer Revenue Now" or use "Settle All Pending" on Command Hub. |
| Presentation page shows 404 | Missing presentation.html in web root | Copy `PRESENTATION.html` to `packages/frontend/dist/presentation.html`. |
| Test suite fails with HTTP 429 | Rate limiter active in test environment | Verify `skip: () => process.env.NODE_ENV === 'test'` in `rateLimiter.ts`. |
| Plaza offline sync backlog | Network interruption between Plaza and HQ | Run `SyncService.forceSync()` or check `/api/sync/status`. |
