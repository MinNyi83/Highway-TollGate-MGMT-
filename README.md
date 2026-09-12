# Highway Tollgate Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-green.svg)](https://www.postgresql.org/)
[![Raspberry Pi](https://img.shields.io/badge/Raspberry_Pi-4-red.svg)](https://www.raspberrypi.com/)

A distributed, enterprise-grade highway toll management system with **RFID + ANPR integration**, built for 10+ toll plazas with offline-first Raspberry Pi edge servers, centralized HQ Command Hub, Customer Portal PWA with Virtual RFID Pass, **Financial Portal with 35 pages**, **Myanmar RTAD Wheel Tax AI OCR**, and **comprehensive hardware installation guides with 3D visualizations**.

---

## System Architecture

```
                                ┌──────────────────────┐
                                │      INTERNET        │
                                │   (VPN / 4G LTE)     │
                                └──────────┬───────────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
    ╔═════════╩═════════════════════════════╧═══════════════════════════╩═════════╗
    ║                         HQ SERVER (192.168.100.101)                        ║
    ║                                                                            ║
    ║  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          ║
    ║  │ 🌐 Admin   │  │ 👤 Customer│  │ 💰 Financial│ │ 📊 API     │          ║
    ║  │ Hub :80    │  │ Portal:8080│  │ Portal:8081│  │ Server:3000│          ║
    ║  └────────────┘  └────────────┘  └────────────┘  └─────┬──────┘          ║
    ║                                                         │                 ║
    ║  ┌──────────────────────────────────────────────────────┴──────────────┐  ║
    ║  │                     Docker Containers                               │  ║
    ║  │                                                                     │  ║
    ║  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │  ║
    ║  │  │ HQ DB    │  │ Cust DB  │  │ Plaza DB │  │ Backend API      │   │  ║
    ║  │  │ :5432    │  │ :5433    │  │ :5434    │  │ Express+Prisma   │   │  ║
    ║  │  │ 27+ tbl  │  │ 9 tables │  │ sync     │  │ Zod+Socket.IO    │   │  ║
    ║  │  └──────────┘  └──────────┘  └──────────┘  └──────────────────┘   │  ║
    ║  └─────────────────────────────────────────────────────────────────────┘  ║
    ╚═══════════════════════════════╤═══════════════════════════════════════════╝
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
    ╔═════════╩════════╗ ╔═════════╩════════╗ ╔═════════╩════════╗
    ║  PLAZA 01 (RPi)  ║ ║  PLAZA 02 (RPi)  ║ ║  PLAZA N (RPi)   ║
    ║  0-Mile           ║ ║  Bago 39-Mile     ║ ║  Mandalay         ║
    ║  :4000            ║ ║  :4000            ║ ║  :4000            ║
    ║                   ║ ║                   ║ ║                   ║
    ║  ┌─────────────┐  ║ ║  ┌─────────────┐  ║ ║  ┌─────────────┐  ║
    ║  │ Lane 1A-2B  │  ║ ║  │ Lane 1A-2B  │  ║ ║  │ Lane 1A-2B  │  ║
    ║  │ 📡 RFID     │  ║ ║  │ 📡 RFID     │  ║ ║  │ 📡 RFID     │  ║
    ║  │ 📷 ANPR     │  ║ ║  │ 📷 ANPR     │  ║ ║  │ 📷 ANPR     │  ║
    ║  │ 🔲 Barrier  │  ║ ║  │ 🔲 Barrier  │  ║ ║  │ 🔲 Barrier  │  ║
    ║  │ 🔴🟡🟢 LED  │  ║ ║  │ 🔴🟡🟢 LED  │  ║ ║  │ 🔴🟡🟢 LED  │  ║
    ║  │ 📞 Intercom │  ║ ║  │ 📞 Intercom │  ║ ║  │ 📞 Intercom │  ║
    ║  │ 🎫 Ticket   │  ║ ║  │ 🎫 Ticket   │  ║ ║  │ 🎫 Ticket   │  ║
    ║  └─────────────┘  ║ ║  └─────────────┘  ║ ║  └─────────────┘  ║
    ╚═══════════════════╝ ╚═══════════════════╝ ╚═══════════════════╝
```

---

## Hardware Components (per Lane)

| Device | Model | Connection | Protocol | Purpose |
|--------|-------|-----------|----------|---------|
| **UHF RFID Reader** | ZKTeco UHF300 / Impinj R420 | TCP/IP | Port 5000 | Tag identification (3–12m) |
| **ANPR Camera** | Hikvision DS-2CD7A46 | Ethernet | ISAPI :80, RTSP :554 | Plate recognition (>99%) |
| **Barrier Gate** | FAAC 640 | Serial/TCP | RS232 or TCP 5000 | Vehicle access (1.5–4s) |
| **Lane Controller** | Raspberry Pi 4 (4GB) | Ethernet | GPIO + Docker | Edge computing |
| **LED Traffic Light** | 3-Aspect (R/Y/G) | GPIO | 3.3V Logic | Signal control |
| **Vehicle Loop Detector** | Inductive Loop | GPIO | Digital Input | Vehicle presence |
| **Intercom** | Master-Slave Station | GPIO | Audio/PTT | Driver communication |
| **Ticket Dispenser** | Serial Printer | UART | Serial | Paper ticket |
| **LED Sign** | Variable Message | Serial/TCP | Port 5000 | Display messages |

> Full hardware installation guides: [`docs/hardware/`](docs/hardware/)
> Interactive 3D visualization: [`http://<HOST>/hardware-3d.html`](http://localhost/hardware-3d.html)

---

## Server Components & Ports

| Server / Application | Port | URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<HOST>/` | Highway admin dashboard, operator console |
| **Hardware 3D Visualization** | `80` | `http://<HOST>/hardware-3d.html` | Interactive 3D hardware diagram |
| **Presentation Deck** | `80` | `http://<HOST>/presentation` | 20-slide executive deck |
| **Customer Portal (PWA)** | `8080` | `http://<HOST>:8080` | Driver wallet, vehicle manager, virtual RFID |
| **Financial Portal** | `8081` | `http://<HOST>:8081` | Government ministry reporting, 35 pages |
| **HQ Backend API** | `3000` | `http://<HOST>:3000` | REST API, OCR, settlement, WebSockets |
| **API Documentation** | `3000` | `http://<HOST>:3000/api-docs` | Swagger UI |
| **Toll Simulator** | `80` | `http://<HOST>/simulator` | Multi-lane canvas highway simulator |
| **HQ Database** | `5432` | `postgresql://<HOST>:5432/tollgate` | Core: vehicles, events, violations, financial |
| **Customer Database** | `5433` | `postgresql://<HOST>:5433/tollgate_customer` | Accounts, wallets, notifications |
| **Plaza Database** | `5434` | `postgresql://<HOST>:5434/tollgate_plaza` | Sync queue, local events, device config |

---

## Documentation

### Hardware Installation Guides

| Guide | File | Description |
|-------|------|-------------|
| Hardware Overview | [`docs/hardware/00-overview.md`](docs/hardware/00-overview.md) | 3D ASCII diagrams, vehicle flow, network topology, BOM |
| RFID Reader | [`docs/hardware/01-rfid-reader.md`](docs/hardware/01-rfid-reader.md) | TCP/Serial/ZKTeco setup, wiring, VLAN config |
| ANPR Camera | [`docs/hardware/02-anpr-camera.md`](docs/hardware/02-anpr-camera.md) | Hikvision ISAPI, RTSP, camera angles, PoE |
| Barrier Gate | [`docs/hardware/03-barrier-gate.md`](docs/hardware/03-barrier-gate.md) | FAAC 640 install, serial/TCP/Modbus, safety |
| Lane Controller | [`docs/hardware/04-lane-controller.md`](docs/hardware/04-lane-controller.md) | RPi GPIO mapping, loop detector, peripherals |
| 3D Visualization | [`docs/hardware/hardware-3d.html`](docs/hardware/hardware-3d.html) | Interactive HTML — rotating plaza, animations |

### Server Installation Guides

| Guide | File | Description |
|-------|------|-------------|
| Plaza Server (RPi) | [`docs/server/01-raspberry-pi-plaza-server.md`](docs/server/01-raspberry-pi-plaza-server.md) | RPi setup, Docker, sync protocol, offline mode |
| HQ Server | [`docs/server/02-hq-server.md`](docs/server/02-hq-server.md) | Central server deploy, backup, monitoring |

---

## Key Features

### Vehicle Passage Flow

```
Vehicle → Loop Detect → RFID Read → ANPR Capture → Match & Validate
  → Debit Account → Barrier Open → LED Green → Vehicle Pass → Sync to HQ
```

**9 steps, < 3 seconds end-to-end, works offline.**

### 1. Hardware Architecture
- **9 device types** per lane: RFID, ANPR, barrier, lane controller, LED signal, loop detector, intercom, ticket dispenser, LED sign
- **Offline-first**: Each plaza processes tolls independently via Raspberry Pi edge server
- **Sync protocol**: Push (30s) + Pull (60s) with exponential backoff retry
- **3D visualization**: Interactive HTML with CSS 3D rotating plaza model

### 2. HQ Command Hub & Operator Console
- **Interactive Geographic Highway Map (Leaflet)**: 352-mile Yangon–Mandalay Expressway
- **Operator Quick Action Ribbon**: Shift tracking, live lane indicators, barrier overrides
- **Violation Workbench**: ANPR mismatch events with visual snapshot proof
- **Real-time Dashboard**: Live revenue, traffic, device health

### 3. Customer Portal (Progressive Web App)
- **Installable PWA**: iOS/Android home screens without app store
- **Digital Toll Pass (Virtual RFID)**: Rotating optical QR code fallback
- **Prepaid Wallet**: Top-up via KBZPay, WavePay, MMQR
- **Vehicle Registration**: Myanmar RTAD Wheel Tax AI OCR scanner

### 4. Financial Portal (Port 8081)
- **35 Pages**: Dashboard, Revenue by Region, Settlement, Reconciliation, Fiscal Year, and more
- **Myanmar/English i18n**: Toggle between languages
- **Excel & PDF Export**: SheetJS + jsPDF
- **Approval Workflow**: Monthly reconciliation Submit → Approve/Reject
- **34 Backend Endpoints**: `/api/financial/*` with hqPrisma
- **API Integration Layer**: SAP, Oracle, QuickBooks, KBZ, CB, IRD

### 5. Myanmar RTAD Wheel Tax AI OCR
- **Dual-Side Recognition**: Front and back of RTAD registration cards
- **Auto-Extract**: License Plate, Year, Make, Model, Color, Engine/Chassis No, Owner
- **1-Click Auto-Fill**: Customer Portal + Admin Hub vehicle forms

### 6. Security & Performance
- **Rate Limiting**: Auth 10/15min, Global 100/min, Strict 5/hr
- **CORS + Helmet.js + CSP**: Production-grade security headers
- **JWT Auth**: Bearer token with Zod validation
- **23 Database Indexes**: Optimized queries across all tables
- **Docker Health Checks**: All services with dependency ordering

---

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
cd Highway-TollGate-MGMT-

# 2. Launch complete stack (8 containers)
docker compose up -d --build

# 3. Access applications
# Admin Hub:            http://localhost
# Hardware 3D:          http://localhost/hardware-3d.html
# Presentation:         http://localhost/presentation
# Customer Portal:      http://localhost:8080
# Financial Portal:     http://localhost:8081
# Central API:          http://localhost:3000/api/health
# API Documentation:    http://localhost:3000/api-docs
# Simulator:            http://localhost/simulator
```

---

## Seed Accounts

| Role | Email | Password |
|---|---|---|
| **System Admin** | `admin@tollgate.com` | `password123` |
| **Manager** | `manager@tollgate.com` | `password123` |
| **Operator** | `operator1@tollgate.com` | `password123` |
| **Viewer** | `viewer@tollgate.com` | `password123` |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` |
| **Individual Driver** | `ko.min@personal.com` | `password123` |
| **Financial Admin** | `fin.admin@tollgate.com` | `password123` |
| **Financial Manager** | `fin.manager@tollgate.com` | `password123` |
| **Financial Viewer** | `fin.viewer@tollgate.com` | `password123` |

---

## Project Structure

```
Highway-TollGate-MGMT-/
├── packages/
│   ├── backend/           # Express + TypeScript + Prisma (multi-DB)
│   ├── frontend/          # React + Vite (Admin Command Hub)
│   ├── customer-portal/   # React + Vite (Driver PWA)
│   ├── financial-portal/  # React + Vite (Financial System)
│   ├── shared/            # Shared TypeScript types
│   ├── simulator/         # Canvas toll highway simulator
│   └── plaza-server/      # Raspberry Pi edge server (SQLite)
├── docs/
│   ├── hardware/          # Hardware installation guides (5 files + 3D HTML)
│   └── server/            # Server installation guides (2 files)
├── scripts/               # Deployment scripts
├── docker-compose.yml     # Full stack (8 containers)
├── PRESENTATION.html      # 20-slide executive deck
├── USER_GUIDE.md          # Comprehensive user guide
└── ARCHITECTURE.md        # System architecture docs
```

---

## License

MIT License. Developed for Highway Infrastructure & Automated Tolling Systems.
