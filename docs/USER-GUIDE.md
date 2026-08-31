# Highway TollGate RFID Management System - Comprehensive User Guide

## Table of Contents

1. [System Overview & Access URLs](#1-system-overview--access-urls)
2. [Default Seed Credentials](#2-default-seed-credentials)
3. [HQ Admin Command Hub & Operator Console](#3-hq-admin-command-hub--operator-console)
   - [Day-by-Day Revenue Transfer & Plaza Settlement](#day-by-day-revenue-transfer--plaza-settlement)
   - [Dahua Highway Solution Presentation & 3D Digital Twin](#dahua-highway-solution-presentation--3d-digital-twin)
   - [Real Interactive Geographic Highway Map (Leaflet)](#real-interactive-geographic-highway-map-leaflet)
   - [Operator Quick Actions Ribbon](#operator-quick-actions-ribbon)
   - [Instant Booth Dynamic QR Payment](#instant-booth-dynamic-qr-payment)
   - [Myanmar RTAD Wheel Tax AI Scanner & OCR](#myanmar-rtad-wheel-tax-ai-scanner--ocr)
4. [Customer Portal & Progressive Web App (PWA)](#4-customer-portal--progressive-web-app-pwa)
   - [Expressway Trip Planner with Live Mini-Map](#expressway-trip-planner-with-live-mini-map)
   - [One-Click Vehicle Registration via RTAD Card](#one-click-vehicle-registration-via-rtad-card)
   - [Digital Toll Pass (Virtual RFID QR)](#digital-toll-pass-virtual-rfid-qr)
   - [Prepaid Wallet & Dynamic Top-Up](#prepaid-wallet--dynamic-top-up)
5. [Toll Simulator (Canvas Multi-Lane Highway)](#5-toll-simulator-canvas-multi-lane-highway)
6. [Plaza Edge Server (Offline-First Raspberry Pi)](#6-plaza-edge-server-offline-first-raspberry-pi)

---

## 1. System Overview & Access URLs

| Portal / Feature | Default Port | Default URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<SERVER_IP>` | Central telemetry, operator ribbon, real highway map, reports |
| **Dahua Solution Presentation** | `80` | `http://<SERVER_IP>/presentation.html` | 14-slide executive deck + 3D interactive web portal |
| **In-App Presentation Page** | `80` | `http://<SERVER_IP>/presentation` | Embedded solution portal inside Command Hub |
| **Customer Portal (PWA)** | `8080` | `http://<SERVER_IP>:8080` | Driver digital wallet, virtual RFID pass, trip history & route planner |
| **Central Backend API** | `3000` | `http://<SERVER_IP>:3000` | REST API, WebSocket streams, OCR engine, payment webhooks |
| **Toll Simulator** | `80` | `http://<SERVER_IP>/simulator` | Real-time animated canvas multi-lane simulation |

---

## 2. Default Seed Credentials

| Role | Username / Email | Password | Purpose |
|---|---|---|---|
| **System Admin** | `admin@tollgate.com` | `password123` | Full administrative control & Command Hub |
| **Manager** | `manager@tollgate.com` | `password123` | Operations management |
| **Booth Operator 1** | `operator1@tollgate.com` | `password123` | Lane cashier & barrier control |
| **Auditor / Viewer** | `viewer@tollgate.com` | `password123` | Reports, revenue settlement & financial logs |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` | TransportCo Fleet (8 vehicles) |
| **Individual Driver** | `ko.min@personal.com` | `password123` | Customer PWA portal |

---

## 3. HQ Admin Command Hub & Operator Console

### Day-by-Day Revenue Transfer & Plaza Settlement
- **Today's Revenue (Live)**: Live accumulating revenue and verified pass count across all toll plazas.
- **Previous Day Total Revenue**: Yesterday's toll revenue collection total.
- **Settlement Status Badges**:
  - 🟢 **`TRANSFERRED` (Green)**: Indicates that the plaza has transferred its daily revenue to HQ bank accounts. Shows bank reference ID (e.g. `#KBZ-DEP-994812`), bank name, and timestamp.
  - 🔴 **`NEED TRANSFER` (Red Pulsing)**: Highlights plazas with pending daily revenue transfers.
- **Settlement Workflow**:
  1. Click **"Transfer Revenue Now"** on any red-tagged plaza card.
  2. Select the destination bank account (*KBZ Corporate Banking, CB Bank, AYA Bank, WavePay, Central Cash Deposit*).
  3. Enter the bank deposit slip / transaction reference number.
  4. Click **"Confirm Settlement"** to transition the plaza badge to **🟢 TRANSFERRED (Green)**.
  5. Use **"Settle All"** for batch one-click settlement across all pending plazas.
  6. Click **"Transfer History"** to view and export the complete historical audit log.

### Dahua Highway Solution Presentation & 3D Digital Twin
- Access directly at `http://<SERVER_IP>/presentation.html` or click the glowing **"Presentation"** button in the top navbar.
- **Dual-Mode Control**:
  - **Slide Deck Mode**: 14 presentation slides covering Problem Statement, Dahua Architecture, 5-Tier Topology, Hardware Matrix, Business Model, and ROI Analysis.
  - **Web Solution Portal Mode**: Scrollable enterprise layout matching Dahua's official solution page.
- **3D Isometric Scenario Aerial View**: Interactive 3D map featuring clickable floating badges (`(1) General Road`, `(2) Toll Plaza`, `(3) Bridge Gantry`, `(4) Tunnel System`).
- **Hardware Catalog**: High-resolution studio product photos of `DHI-ITC-RFID`, `DHI-ITC431` 4K ANPR Camera, `ITS-RADAR-79G` 79GHz Radar, and `DHI-EDGE-RPI` Industrial Gateway Box.

### Real Interactive Geographic Highway Map (Leaflet)
- **Plaza Nodes & Waypoints**: Visualizes 352 miles along the Yangon – Mandalay Expressway (0-Mile, Bago 39M, Phyu 115M, Naypyitaw 201M, Meiktila 285M, Mandalay 352M).
- **Interactive Tile Switcher**: Switch between CartoDB Dark Mode, Standard Street Map, and Satellite Imagery.

### Operator Quick Actions Ribbon
- **Shift Tracking & Lane Control**: Live lane health indicators and gate barrier overrides (`Auto`, `Force Open`, `Lock Gate`).
- **Instant Dynamic QR Code**: Generates on-the-spot KBZPay / WavePay / MMQR codes for low-balance drivers at the barrier to clear transactions instantly.

### Myanmar RTAD Wheel Tax AI Scanner & OCR
- **Dual-Side Auto Recognition**: Scans both Front and Back of Myanmar RTAD (ကညန စာအုပ် / စမတ်ကတ်) registration cards.
- **Auto-Extracts Key Fields**: License Plate, Model Year, Make/Model, Color, Engine No, Chassis No, and Owner Name with automatic VIN vehicle classification.

---

## 4. Customer Portal & Progressive Web App (PWA)

### Expressway Trip Planner with Live Mini-Map
- Select Entry and Exit plazas along the expressway.
- Instantly calculates distance (miles/km), estimated travel time, fuel consumption, and toll fee breakdown by vehicle class.

### One-Click Vehicle Registration via RTAD Card
- Click **"✨ Scan Wheel Tax (AI)"** in `My Vehicles`.
- Upload or capture front and back photos of the registration document.
- All vehicle fields auto-populate with high accuracy.

### Digital Toll Pass (Virtual RFID QR)
- Rotating optical QR code usable as a fallback if the physical windshield RFID tag is damaged or unreadable.

### Prepaid Wallet & Dynamic Top-Up
- Real-time balance tracker with low-balance auto-alert banner (< K3,000).
- Instant top-up via KBZPay, WavePay, and MMQR with downloadable trip receipts.

---

## 5. Toll Simulator (Canvas Multi-Lane Highway)
- Live 2D multi-lane highway canvas at `http://<SERVER_IP>/simulator`.
- Simulates RFID detection, ANPR license plate recognition, boom barrier raising, and LED message display in real time.

---

## 6. Plaza Edge Server (Offline-First Raspberry Pi)
- Local SQLite database on each toll plaza Raspberry Pi.
- Sub-100ms barrier trigger response.
- Queue-based Delta Sync engine with zero-loss transaction buffering during network dropouts.
