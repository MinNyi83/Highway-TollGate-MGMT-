# Highway Tollgate Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

A distributed, enterprise-grade highway toll management system with RFID + ANPR integration, built for 10+ toll plazas with offline-first Raspberry Pi edge servers, centralized HQ Command Hub, Customer Portal PWA with Virtual RFID Pass, animated toll simulator, and **Myanmar RTAD Wheel Tax AI OCR Document Scanner**.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLOUD (HQ)                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │  HQ Command  │  │  Customer    │  │  Main Database       │  │
│  │  Hub (Admin) │  │  Portal PWA  │  │  (PostgreSQL)        │  │
│  │  (Port 80)   │  │  (Port 8080) │  │  (Port 5432)         │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                      │             │
│  ┌──────┴──────────────────┴──────────────────────┴───────────┐ │
│  │              HQ API Server (Node.js/Express)               │ │
│  │  - Myanmar RTAD OCR  - Sync engine  - Plaza telemetry      │ │
│  └────────────────────────┬───────────────────────────────────┘ │
│                           │                                     │
│  ┌────────────────────────┴───────────────────────────────────┐ │
│  │              Storage Server (Port 5000)                    │ │
│  │  - Vehicle photos  - ANPR captures  - Documents           │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Internet / VPN / 4G
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────┐  ┌────────┴───────┐  ┌───────┴──────┐
│  Plaza 01    │  │  Plaza 02      │  │  Plaza N     │
│  (0-Mile)    │  │  (Bago 39M)    │  │  (Mandalay)  │
│  SQLite      │  │  SQLite        │  │  SQLite      │
│  RFID Reader │  │  RFID Reader   │  │  RFID Reader │
│  Sync Engine │  │  Sync Engine   │  │  Sync Engine │
│  Booth Panel │  │  Booth Panel   │  │  Booth Panel │
└──────────────┘  └────────────────┘  └──────────────┘
```

---

## Server Components

| Server | Location | Default Port | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | Cloud / Server | `80` | Highway administration dashboard, interactive map & operator console |
| **Customer Portal (PWA)** | Cloud / Server | `8080` | Driver digital wallet, vehicle management, and virtual RFID QR pass |
| **HQ Backend API** | Cloud / Server | `3000` | Central API, RTAD OCR engine, delta sync engine, WebSockets |
| **Storage Server** | Cloud / Server | `5000` | Vehicle photos, ANPR captures, violation proof documents |
| **Plaza Edge Server** | Each RPi | `4000` | Local offline-first toll operations, barrier triggers, serial RFID |
| **Toll Simulator** | HQ Stack | `80/simulator` | Real-time animated canvas multi-lane toll simulation |

---

## Key Features

### 1. 🪪 Myanmar RTAD Wheel Tax AI Scanner & OCR
- **Dual-Side Auto Recognition**: Scans both Front and Back of Myanmar RTAD (ကညန စာအုပ် / စမတ်ကတ်) registration cards.
- **Auto-Extracts Key Fields**: License Plate (`4D-5918`), Model Year (`2009`), Make & Model (`Honda Civic FD3`), Color (`Gray`), Engine No (`LDA-1372845`), Chassis No (`FD3-1302842`), and Owner (`U NYI NYI MIN`).
- **Chassis & VIN Decoder**: Automatically identifies vehicle make, model, and class (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`).
- **1-Click Auto-Fill**: Available in Customer Portal (`My Vehicles`) and Admin Command Hub (`Vehicles`).

### 2. 🚦 HQ Command Hub & Operator Console
- **Interactive Multi-Plaza Highway Map**: Visualizes 6 major expressway plazas across 352 miles (Yangon 0-Mile, Bago 39M, Phyu 115M, Naypyitaw 201M, Meiktila 285M, Mandalay 352M) with real-time throughput and health telemetry.
- **Operator Quick Action Ribbon**: Shift tracking, live lane indicators, and barrier overrides (`Auto`, `Force Open`, `Lock Gate`).
- **Instant Booth Dynamic QR Code**: Generates on-the-spot KBZPay / WavePay / MMQR codes for low-balance drivers at the barrier to clear transactions instantly.
- **Peak-Hour Traffic Analytics**: Hourly vehicle throughput distribution charts with congestion thresholds.
- **Violation Workbench**: Review flagged ANPR mismatch events with visual snapshot proof.

### 3. 📱 Customer Portal (Progressive Web App)
- **Installable PWA**: Works on iOS and Android home screens without app store downloads.
- **Digital Toll Pass (Virtual RFID)**: Rotating optical QR code usable as a fallback if the windshield RFID tag is damaged.
- **Low-Balance Auto Alert**: Dynamic warning banner with 1-click top-up when balance drops below K3,000.
- **Prepaid Wallet & Receipts**: Instant balance top-up via KBZPay, WavePay, and MMQR with downloadable trip receipts.

### 4. 🌓 Dual-Theme Adaptive UI (Dark & Light Mode)
- **Instant Header Toggle**: 1-click Sun/Moon toggle in both the Admin Command Hub and Customer Portal.
- **Glassmorphic Contrast**: Adapts between sleek dark-slate telemetry screens and high-visibility daylight mode while saving preferences.

### 5. 🔄 Resilient Offline-First Edge Sync (Plaza ↔ HQ)
- **Zero-Downtime Local SQLite**: Continues processing RFID tags and ANPR plates during network dropouts.
- **Queue-based Delta Sync**: Automatically pushes buffered transactions and pulls updated blacklists/rates once connectivity restores.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Admin Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Lucide Icons |
| **Customer Portal** | React 18, TypeScript, Vite, Tailwind CSS, PWA Service Worker |
| **HQ Backend** | Node.js, Express, TypeScript, Prisma ORM, PostgreSQL |
| **Edge Plaza Server** | Express, TypeScript, Prisma ORM, SQLite |
| **File Storage** | Express, Multer, Sharp image optimizer |
| **Simulator** | HTML5 Canvas API, Vanilla JS, Real-time physics engine |
| **Hardware Interfacing** | Serial RS232 / USB RFID readers, TCP/IP ANPR optical cameras |
| **Containers & Orchestration** | Docker & Docker Compose v2 |

---

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
cd Highway-TollGate-MGMT-

# 2. Build and launch full Docker stack
docker compose up -d --build

# 3. Seed initial test accounts & plazas
docker compose exec backend npx prisma migrate deploy
docker compose exec backend npx tsx prisma/seed.ts
```

Access the services in your browser:
- **Admin Command Hub**: `http://localhost` (or `http://<SERVER_IP>`)
- **Customer Portal (PWA)**: `http://localhost:8080` (or `http://<SERVER_IP>:8080`)
- **Backend Health Check**: `http://localhost:3000/api/health`

---

## Testing & Validation

Run the complete test suite across all feature modules:
```bash
npm test --workspace=@tollgate/backend
```
> **Result**: `Test Suites: 10 passed, 10 total. Tests: 54 passed, 54 total.`

---

## Default Login Credentials

### HQ Admin Portal ([http://localhost](http://localhost))
- **System Admin**: `admin@tollgate.com` / `password123`
- **Manager**: `manager@tollgate.com` / `password123`
- **Booth Operator 1**: `operator1@tollgate.com` / `password123`
- **Auditor / Viewer**: `viewer@tollgate.com` / `password123`

### Customer Portal (PWA) ([http://localhost:8080](http://localhost:8080))
- **Individual Driver**: `ko.min@personal.com` / `password123`
- **Enterprise Fleet**: `fleet@transportco.com` / `password123`

---

## License

This project is licensed under the [MIT License](LICENSE).
