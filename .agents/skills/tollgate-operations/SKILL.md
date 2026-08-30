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

# Navigate to project and build stack
cd /home/nyimin/TollGate-RFID
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
| **System Admin** | `admin@tollgate.com` | `password123` | Full administrative control |
| **Manager** | `manager@tollgate.com` | `password123` | Operations management |
| **Booth Operator 1** | `operator1@tollgate.com` | `password123` | Lane cashier & barrier control |
| **Auditor / Viewer** | `viewer@tollgate.com` | `password123` | Reports & financial logs |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` | TransportCo Fleet (8 vehicles) |
| **Individual Driver** | `ko.min@personal.com` | `password123` | Customer PWA portal |

---

## 4. Key Operational Features

### Myanmar RTAD Wheel Tax OCR & Auto-Fill (`/api/ocr/scan-wheel-tax`)
- **Dual-Side Support**: Scans both Front (Plate No, Model Year, Make/Model, Vehicle Type, Region) and Back (Engine No, Chassis No, Color, Gross Weight, Owner, Expiry Date) of Myanmar RTAD cards.
- **VIN/Chassis Decoder**: Automatically maps chassis codes (e.g. `FD3` -> Honda Civic Hybrid, `NCP91` -> Toyota Vitz, `JB64W` -> Suzuki Jimny, `GUN125` -> Toyota Hilux) to vehicle make, model, and class (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`).
- **One-Click Auto-Fill**:
  - Customer Portal: `MyVehicles.tsx` with **"✨ Scan Wheel Tax (AI)"**
  - Admin Hub: `Vehicles.tsx` with **"✨ Scan Document (AI)"**

### Interactive Multi-Plaza Highway Map
- Accessible via the **"Highway Map"** button on the Operator Ribbon.
- Shows live telemetry for Yangon 0-Mile, Bago 39M, Phyu 115M, Naypyitaw 201M, Meiktila 285M, and Mandalay 352M.

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
