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
│  │  HQ Command  │  │  Customer    │  │  Financial Portal    │  │
│  │  Hub (Admin) │  │  Portal PWA  │  │  (Port 8081)         │  │
│  │  (Port 80)   │  │  (Port 8080) │  │  35 pages, i18n      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘  │
│         │                  │                     │               │
│  ┌──────┴──────────────────┴─────────────────────┴───────────┐  │
│  │              HQ API Server (Node.js/Express)               │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │  │
│  │  │  hqPrisma   │  │customerPrisma│  │  plazaPrisma     │  │  │
│  │  │  :5432      │  │  :5433       │  │  :5434           │  │  │
│  │  └──────┬──────┘  └──────┬───────┘  └───────┬──────────┘  │  │
│  └─────────┼────────────────┼───────────────────┼─────────────┘  │
│            │                │                   │                │
│  ┌─────────▼──────┐  ┌─────▼────────┐  ┌──────▼────────────┐  │
│  │  HQ DB (:5432) │  │Customer DB   │  │ Plaza DB          │  │
│  │  tollgate       │  │(:5433)       │  │ (:5434)           │  │
│  │  27 tables      │  │tollgate_     │  │ tollgate_plaza     │  │
│  │  vehicles,      │  │customer      │  │ plaza_config       │  │
│  │  events,        │  │ 9 tables     │  │ sync_queue         │  │
│  │  financial,     │  │ users,       │  │ local_events       │  │
│  │  reports        │  │ accounts,    │  │                    │  │
│  │                 │  │ wallets      │  │                    │  │
│  └────────────────┘  └──────────────┘  └────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Internet / VPN / 4G
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴──────┐  ┌────────┴───────┐  ┌───────┴──────┐
│  Plaza 01    │  │  Plaza 02      │  │  Plaza N     │
│  (0-Mile)    │  │  (Bago 39M)    │  │  (Mandalay)  │
│  PostgreSQL  │  │  PostgreSQL    │  │  PostgreSQL  │
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
| **Dahua Solution Presentation** | `80` | `http://<HOST>/presentation.html` | 17-slide executive deck + 3D interactive web portal |
| **Customer Portal (PWA)** | `8080` | `http://<HOST>:8080` | Driver digital wallet, vehicle manager, virtual RFID pass |
| **Financial Portal** | `8081` | `http://<HOST>:8081` | Government ministry financial reporting, 35 pages |
| **HQ Central Backend API** | `3000` | `http://<HOST>:3000` | Central REST API, OCR engine, settlement service, WebSockets |
| **API Documentation** | `3000` | `http://<HOST>:3000/api-docs` | Swagger UI for API exploration |
| **File Storage Server** | `5000` | `http://<HOST>:5000` | Vehicle photos, ANPR captures, violation proofs |
| **Toll Simulator** | `80` | `http://<HOST>/simulator` | Live animated multi-lane canvas highway simulator |
| **HQ Database** | `5432` | `postgresql://<HOST>:5432/tollgate` | Core toll operations: vehicles, events, violations |
| **Customer Database** | `5433` | `postgresql://<HOST>:5433/tollgate_customer` | Customer accounts, wallets, notifications |
| **Plaza Database** | `5434` | `postgresql://<HOST>:5434/tollgate_plaza` | Plaza sync queue, local events, device config |

---

## Key Features

### 1. Day-by-Day Revenue Transfer & Plaza Settlement Monitor
- **Live Today's Revenue**: Continuous live accumulating revenue ticker per plaza and total system with pass count.
- **Previous Day Total Revenue**: Yesterday's toll revenue total across all active highway plazas.
- **Plaza Settlement Status**:
  - `TRANSFERRED` (Green): Revenue confirmed and transferred to HQ bank account with Bank Name, Deposit Ref ID, and timestamp.
  - `NEED TRANSFER` (Red Pulsing): Highlights plazas with pending daily transfers that require cashier settlement.
- **Settlement Actions**:
  - 1-Click Modal: Select bank (*KBZ, CB, AYA, WavePay, Cash*), enter transaction reference ID, and confirm settlement.
  - Batch Settle: Bulk approve all pending plazas for yesterday in a single click.
  - Historical Audit Table: Filter and inspect settlement history day-by-day.

### 2. Dahua Highway Solution Presentation & 3D Digital Twin
- **Dual-Mode Switcher**:
  - Slide Deck Mode: 14-slide executive presentation with timer, fullscreen mode, slide drawer, and keyboard navigation.
  - Web Solution Portal Mode: Scrollable enterprise layout with sticky navigation tabs.
- **3D Isometric Scenario Digital Twin**: High-resolution 3D cutaway rendering of toll plaza, mountain tunnel, and suspension bridge.

### 3. Myanmar RTAD Wheel Tax AI Scanner & OCR
- **Dual-Side Auto Recognition**: Scans both Front and Back of Myanmar RTAD registration cards.
- **Auto-Extracts Key Fields**: License Plate, Model Year, Make & Model, Color, Engine No, Chassis No, and Owner.
- **1-Click Auto-Fill**: Available in Customer Portal (`My Vehicles`) and Admin Command Hub (`Vehicles`).

### 4. HQ Command Hub & Operator Console
- **Real Interactive Geographic Highway Map (Leaflet)**: Visualizes the entire 352-mile Yangon - Mandalay Expressway.
- **Operator Quick Action Ribbon**: Shift tracking, live lane indicators, and barrier overrides.
- **Violation Workbench**: Review flagged ANPR mismatch events with visual snapshot proof.

### 5. Customer Portal (Progressive Web App)
- **Installable PWA**: Works on iOS and Android home screens without app store downloads.
- **Digital Toll Pass (Virtual RFID)**: Rotating optical QR code usable as a fallback.
- **Prepaid Wallet & Receipts**: Instant balance top-up via KBZPay, WavePay, and MMQR.

### 6. Financial Portal (Port 8081)
- **35 Pages**: Dashboard, Daily Collection, Revenue by Region, Wallet Deposits, Vehicle Registration, Pass-Through Volume, Revenue Remittance, Financial Reconciliation, Official Receipts, Fiscal Year Report, Comparison Report, Plaza Performance, Violation Analytics, Revenue Forecast, Revenue Heatmap, Transaction Search, Settlement Pipeline, Audit Trail, Wallet Analytics, Revenue by Vehicle, Customer Spending, Revenue by Payment Method, Loyalty Analytics, Financial Reports Generator, Budget Tracker, Cost Allocation, Revenue Sharing, Debt Management, Cash Flow, Financial Ratios, Vendor Payments, Tax Withholding.
- **Myanmar/English Toggle**: i18n support with correct financial terminology.
- **Excel & PDF Export**: All pages support Excel export via SheetJS and PDF export via jsPDF.
- **Approval Workflow**: Monthly reconciliation with Submit → Approve/Reject flow.
- **Real-Time Alerts**: Dashboard alerts for traffic drops, revenue changes, pending settlements.
- **Copyright Protection**: Watermarks (login + dashboard), footer, meta tags.
- **34 Backend Endpoints**: Under `/api/financial/*` using `hqPrisma` client.
- **API Integration Layer**: Connects to external ERP, accounting, banking, and government systems.
- **Supported Integrations**: SAP, Oracle, Dynamics 365, QuickBooks, Wave, Xero, FreshBooks, CBM, KBZ, Ayeyarwady, UAB, AYA, MyCO, IRD, Myanmar Tax, Customs.

---

## Security & Performance

### Security Features
- **Rate Limiting**: Auth (10 req/15min), Global (100 req/min), Strict (5 req/hr)
- **CORS**: Restricted to allowed origins via `CORS_ORIGINS` env var
- **Helmet.js**: Content Security Policy enabled in production
- **JWT**: Environment-configurable secret with Bearer token auth
- **Validation**: Zod schemas with detailed error messages
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Content-Security-Policy, Strict-Transport-Security
- **HTTP Warning**: System runs on HTTP by default. For production, enable HTTPS with SSL certificates.

### Performance Optimizations
- **Database Indexes**: 23 indexes on high-query columns across vehicles, accounts, toll_events, transactions, violations
- **Docker Health Checks**: All services have health checks with dependency ordering
- **Prisma Connection Pooling**: Automatic database connection management

### UI/UX Infrastructure
- **Error Boundaries**: All 3 portals catch render errors with graceful fallback UI
- **Error State Handling**: All 76 useQuery calls show error UI with retry button on failure
- **Toast Notifications**: Success/error feedback on mutations (admin, financial, customer portals)
- **Skeleton Loading**: Card, table, chart, and dashboard skeleton components replace bare "Loading..." text
- **i18n System**: English/Myanmar translations for all 35 financial portal page titles
- **Accessibility**: ARIA labels on icon-only buttons, focus trapping on modals, Escape key support
- **Rate Limiter Reset**: Admin endpoint `POST /api/auth/reset-rate-limiters` to clear in-memory rate limits
- **Command-Palette + Responsive Sidebar**: Full text sidebar (w-64) on desktop, slim icon rail (w-14) on tablet, hamburger + bottom tab on mobile
- **Mobile Navigation**: Hamburger menu + bottom tab bar on admin hub and financial portal; bottom tab bar on customer portal
- **Dark Mode**: Class-based dark/light toggle with OS preference detection, localStorage persistence, and FOUC prevention via inline `<script>` in `index.html`
- **Customizable Color Themes**: 6 selectable themes (Navy Gold, Emerald Silver, Royal Purple, Ocean Blue, Crimson Gold, Monochrome) via Palette icon in topbar. Applied via CSS variables (`--accent`, `--accent-hover`, etc.)
- **Small Watermarks**: Subtle "NYIMIN © 2026" diagonal text overlay on all 3 portals (text-2xl, 2% opacity)

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
# Financial Portal:     http://localhost:8081
# Central API:          http://localhost:3000/api/health
# API Documentation:    http://localhost:3000/api-docs
```

---

## Health Endpoints

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | No | Full health: DB status, latency, memory, CPU |
| `/api/health/live` | GET | No | Liveness probe (always 200 if process alive) |
| `/api/health/ready` | GET | No | Readiness probe (200 if DB connected) |
| `/api/health/metrics` | GET | Yes | Detailed metrics: DB counts, storage, uptime |
| `/api/health/backup` | GET | Yes | Full DB backup as JSON download |

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
| **Financial Admin** | `fin.admin@tollgate.com` | `password123` | Financial Portal admin access |
| **Financial Manager** | `fin.manager@tollgate.com` | `password123` | Financial Portal approval workflow |
| **Financial Viewer** | `fin.viewer@tollgate.com` | `password123` | Financial Portal read-only access |

---

## License
MIT License. Developed for Highway Infrastructure & Automated Tolling Systems.
