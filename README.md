# Highway Tollgate Management System

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)

A distributed, enterprise-grade highway toll management system with RFID + ANPR integration, built for 10+ toll plazas with offline-first Raspberry Pi edge servers, centralized HQ Command Hub, Customer Portal PWA with Virtual RFID Pass, **Dahua Highway Solution Presentation & 3D Digital Twin**, **Day-by-Day Revenue Transfer & Plaza Settlement Monitor**, and **Myanmar RTAD Wheel Tax AI OCR Document Scanner**.

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
│  │  - Myanmar RTAD OCR  - Revenue Settlement - Delta sync     │ │
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

## Server Components & Ports

| Server / Application | Default Port | Access URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<HOST>` | Highway administration dashboard, operator console, telemetry |
| **Dahua Solution Presentation** | `80` | `http://<HOST>/presentation.html` | 14-slide executive deck + 3D interactive web portal |
| **Customer Portal (PWA)** | `8080` | `http://<HOST>:8080` | Driver digital wallet, vehicle manager, virtual RFID pass |
| **HQ Central Backend API** | `3000` | `http://<HOST>:3000` | Central REST API, OCR engine, settlement service, WebSockets |
| **File Storage Server** | `5000` | `http://<HOST>:5000` | Vehicle photos, ANPR captures, violation proofs |
| **Toll Simulator** | `80` | `http://<HOST>/simulator` | Live animated multi-lane canvas highway simulator |

---

## Key Features

### 1. 💰 Day-by-Day Revenue Transfer & Plaza Settlement Monitor
- **Live Today's Revenue**: Continuous live accumulating revenue ticker per plaza and total system with pass count.
- **Previous Day Total Revenue**: Yesterday's toll revenue total across all active highway plazas.
- **Plaza Settlement Status**:
  - 🟢 **`TRANSFERRED` (Green)**: Revenue confirmed and transferred to HQ bank account with Bank Name, Deposit Ref ID, and timestamp.
  - 🔴 **`NEED TRANSFER` (Red Pulsing)**: Highlights plazas with pending daily transfers that require cashier settlement.
- **Settlement Actions**:
  - **1-Click Modal**: Select bank (*KBZ, CB, AYA, WavePay, Cash*), enter transaction reference ID, and confirm settlement.
  - **Batch Settle**: Bulk approve all pending plazas for yesterday in a single click.
  - **Historical Audit Table**: Filter and inspect settlement history day-by-day.

### 2. 📽️ Dahua Highway Solution Presentation & 3D Digital Twin
- **Dual-Mode Switcher**:
  - **Slide Deck Mode**: 14-slide executive presentation with timer, fullscreen mode, slide drawer, and keyboard navigation.
  - **Web Solution Portal Mode**: Scrollable enterprise layout matching Dahua's highway solution with sticky navigation tabs (*Overview*, *Scenario Aerial View*, *Challenges & Offers*, *System Topology*, *Product Recommendation*, *Field Deployment*).
- **3D Isometric Scenario Digital Twin**:
  - High-resolution 3D cutaway rendering of toll plaza solar canopy, mountain tunnel, and suspension bridge.
  - Interactive floating Dahua pill badges (`(1) General Road`, `(2) Toll Plaza`, `(3) Bridge Gantry`, `(4) Tunnel System`).
- **Industrial Edge Hardware Catalog**:
  - Real industrial studio hardware photography for `DHI-ITC-RFID`, `DHI-ITC431` 4K ANPR Camera, `ITS-RADAR-79G` 79GHz Radar, and `DHI-EDGE-RPI` Industrial Gateway Box.

### 3. 🪪 Myanmar RTAD Wheel Tax AI Scanner & OCR
- **Dual-Side Auto Recognition**: Scans both Front and Back of Myanmar RTAD (ကညန စာအုပ် / စမတ်ကတ်) registration cards.
- **Auto-Extracts Key Fields**: License Plate (`4D-5918`), Model Year (`2009`), Make & Model (`Honda Civic FD3`), Color (`Gray`), Engine No (`LDA-1372845`), Chassis No (`FD3-1302842`), and Owner (`U NYI NYI MIN`).
- **Chassis & VIN Decoder**: Automatically identifies vehicle make, model, and class (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`).
- **1-Click Auto-Fill**: Available in Customer Portal (`My Vehicles`) and Admin Command Hub (`Vehicles`).

### 4. 🚦 HQ Command Hub & Operator Console
- **Real Interactive Geographic Highway Map (Leaflet)**: Visualizes the entire 352-mile Yangon – Mandalay Expressway on real OpenStreetMap / CartoDB / Satellite tile layers with pulsing GPS plaza nodes, real expressway route paths, live vehicle throughput, and lane health telemetry.
- **Operator Quick Action Ribbon**: Shift tracking, live lane indicators, and barrier overrides (`Auto`, `Force Open`, `Lock Gate`).
- **Instant Booth Dynamic QR Code**: Generates on-the-spot KBZPay / WavePay / MMQR codes for low-balance drivers at the barrier to clear transactions instantly.
- **Peak-Hour Traffic Analytics**: Hourly vehicle throughput distribution charts with congestion thresholds.
- **Violation Workbench**: Review flagged ANPR mismatch events with visual snapshot proof.

### 5. 📱 Customer Portal (Progressive Web App)
- **Installable PWA**: Works on iOS and Android home screens without app store downloads.
- **Digital Toll Pass (Virtual RFID)**: Rotating optical QR code usable as a fallback if the windshield RFID tag is damaged.
- **Low-Balance Auto Alert**: Dynamic warning banner with 1-click top-up when balance drops below K3,000.
- **Prepaid Wallet & Receipts**: Instant balance top-up via KBZPay, WavePay, and MMQR with downloadable trip receipts.

---

## Quick Start (Docker)

```bash
# 1. Clone repository
git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
cd Highway-TollGate-MGMT-

# 2. Launch complete stack
docker compose up -d --build

# 3. Access applications
# HQ Command Hub:       http://localhost:80
# Presentation Portal:  http://localhost:80/presentation.html
# Customer Portal:      http://localhost:8080
# Central API:          http://localhost:3000/api/health
```

---

## Seed Accounts & Credentials

| Role | Email | Password | Access Area |
|---|---|---|---|
| **System Admin** | `admin@tollgate.com` | `password123` | Full administrative control & Command Hub |
| **Manager** | `manager@tollgate.com` | `password123` | Operations & shift management |
| **Booth Operator** | `operator1@tollgate.com` | `password123` | Lane cashier, manual logging & barrier control |
| **Auditor / Viewer** | `viewer@tollgate.com` | `password123` | Reports, revenue settlement & audit logs |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` | TransportCo Fleet management (8 vehicles) |
| **Individual Driver** | `ko.min@personal.com` | `password123` | Customer PWA portal, digital wallet & pass |

---

## License
MIT License. Developed for Highway Infrastructure & Automated Tolling Systems.
