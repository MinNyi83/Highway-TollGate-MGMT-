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

# Build and launch stack
docker compose up -d --build
```

### Checking Service Health
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
curl -sI http://localhost:80       # Admin Command Hub
curl -sI http://localhost:8080     # Customer Portal PWA
curl -s http://localhost:3000/api/health # Central Backend API
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

### Dual-Theme Adaptive UI (Dark / Light Mode)
- **Header Sun/Moon Toggle**: Available on both Admin Command Hub (top-right header) and Customer Portal (desktop header and mobile top-bar).
- **Persistent Preferences**: Theme state is persisted to `localStorage` (`theme: 'dark' | 'light'`) and defaults to sleek slate dark mode for command centers while respecting OS preferences.
- **Glassmorphism Theme Tokens**: Custom `.glass-card`, `.status-*`, and `.event-tag-*` CSS utilities seamlessly transition between dark slate and light card aesthetics.

### Myanmar RTAD Wheel Tax OCR & Auto-Fill (`/api/ocr/scan-wheel-tax`)
- **Dual-Side Support**: Scans both Front (Plate No, Model Year, Make/Model, Vehicle Type, Region) and Back (Engine No, Chassis No, Color, Gross Weight, Owner, Expiry Date) of Myanmar RTAD cards.
- **VIN/Chassis Decoder**: Automatically maps chassis codes (e.g. `FD3` -> Honda Civic Hybrid, `NCP91` -> Toyota Vitz, `JB64W` -> Suzuki Jimny, `GUN125` -> Toyota Hilux) to vehicle make, model, and class (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`).
- **One-Click Auto-Fill**:
  - Customer Portal: `MyVehicles.tsx` with **"✨ Scan Wheel Tax (AI)"**
  - Admin Hub: `Vehicles.tsx` with **"✨ Scan Document (AI)"**

### Real Geographic GPS Highway Map (Leaflet / OpenStreetMap)
- **Interactive Leaflet Map Engine**: Fully integrated real map with satellite imagery, street map, and CartoDB dark mode tile layers.
- **Corridor Coverage (Highway 1)**: Visualizes 352.0 miles along the Yangon – Mandalay Expressway with real GPS waypoints and custom pulsing plaza markers:
  - Yangon 0-Mile (`lat: 17.0372, lng: 96.1788`)
  - Bago Bypass 39M (`lat: 17.3353, lng: 96.4817`)
  - Phyu Rest Oasis 115M (`lat: 18.5284, lng: 96.4385`)
  - Naypyitaw Capital Gate 201M (`lat: 19.7450, lng: 96.1297`)
  - Meiktila Junction 285M (`lat: 20.8762, lng: 95.8611`)
  - Mandalay Southern Gate 352M (`lat: 21.9750, lng: 96.0836`)
- **Access Points**:
  - **Admin Command Hub**: Click **"Highway Map"** on the Operator Ribbon or switch to **"🗺️ Real Map View"** on the Toll Plazas page.
  - **Customer Portal**: Click **"Trip Planner"** on the dashboard to view real GPS route segment previews, distance, fuel, and toll fee calculations.

### Dynamic Booth QR Code (Pay-at-Gate)
- Triggered directly from **Operator Quick Actions** ribbon when a vehicle arrives with insufficient balance.
- Dynamically calculates toll rate per vehicle class and verifies payment for instant gate raise.

### Customer Portal Progressive Web App (PWA)
- Manifest configured at `packages/customer-portal/public/manifest.json`.
- Supports mobile home-screen installation with **Digital Toll Pass** (virtual dynamic RFID QR code).

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

### Database Entity Rules (Prisma Schema Constraints)
- **`model User`**:
  - `customerType`: `'INDIVIDUAL'` requires `nrcNumber`.
  - `customerType`: `'ENTERPRISE'` requires `companyName` and `companyRegNo`.
- **`model TollPlaza`**:
  - Primary code field is `gateCode` (not `code`).
  - GPS coordinates require `locationLat` and `locationLng` as Decimals.
- **`model Vehicle`**:
  - Related to `User` via `RFIDTag` or `Account` models.
- **Unit Test Throttling**:
  - `rateLimiter.ts` automatically bypasses limits when `NODE_ENV === 'test'`.

---

## 6. Troubleshooting Runbook

| Symptom | Probable Cause | Resolution |
|---|---|---|
| Relation "User" does not exist | Fresh PostgreSQL instance unmigrated | Run `npx prisma migrate deploy` and `npx tsx prisma/seed.ts` in `packages/backend`. |
| OCR scan returns default fallback | Image too blurry or text unextracted | Check `/api/ocr/scan-wheel-tax` logs; review client OCR fallback. |
| Test suite fails with HTTP 429 | Rate limiter active in test environment | Verify `skip: () => process.env.NODE_ENV === 'test'` in `rateLimiter.ts`. |
| Plaza offline sync backlog | Network interruption between Plaza and HQ | Run `SyncService.forceSync()` or check `/api/sync/status`. |
| Dark mode looks washed out | Missing dark class on HTML root | Check `document.documentElement.classList.contains('dark')`. |
