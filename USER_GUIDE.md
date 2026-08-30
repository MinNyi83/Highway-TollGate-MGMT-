# Highway TollGate RFID Management System - Comprehensive User Guide

## Table of Contents

1. [System Overview & Access URLs](#system-overview--access-urls)
2. [HQ Admin Command Hub & Operator Console](#hq-admin-command-hub--operator-console)
   - [Theme Customization (Dark / Light Mode)](#theme-customization-dark--light-mode)
   - [Operator Quick Actions Ribbon](#operator-quick-actions-ribbon)
   - [Interactive Highway Map View](#interactive-highway-map-view)
   - [Instant Booth Dynamic QR Payment](#instant-booth-dynamic-qr-payment)
   - [Gate Barrier State Overrides](#gate-barrier-state-overrides)
   - [Peak-Hour Traffic Analytics](#peak-hour-traffic-analytics)
   - [Myanmar RTAD Wheel Tax AI Scanner & OCR](#myanmar-rtad-wheel-tax-ai-scanner--ocr)
   - [Vehicle & RFID Tag Management](#vehicle--rfid-tag-management)
   - [Violation Workbench](#violation-workbench)
3. [Customer Portal & Progressive Web App (PWA)](#customer-portal--progressive-web-app-pwa)
   - [Dark & Light Theme Switching](#dark--light-theme-switching)
   - [Mobile PWA Installation](#mobile-pwa-installation)
   - [Digital Toll Pass (Virtual RFID QR)](#digital-toll-pass-virtual-rfid-qr)
   - [Prepaid Wallet & Dynamic Top-Up](#prepaid-wallet--dynamic-top-up)
   - [One-Click Vehicle Registration via RTAD Card](#one-click-vehicle-registration-via-rtad-card)
   - [Low Balance Alerts](#low-balance-alerts)
4. [Toll Simulator (Canvas Multi-Lane Highway)](#toll-simulator-canvas-multi-lane-highway)
5. [Plaza Edge Server (Offline-First Raspberry Pi)](#plaza-edge-server-offline-first-raspberry-pi)
6. [Hardware & Reader Setup](#hardware--reader-setup)
7. [Sync Engine & Network Fault Tolerance](#sync-engine--network-fault-tolerance)
8. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. System Overview & Access URLs

The system is deployed as a distributed stack with cloud HQ coordination and edge toll plaza servers:

| Portal | Port | Default URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<SERVER_IP>` | Central telemetry, operator ribbon, highway map, reports |
| **Customer Portal (PWA)** | `8080` | `http://<SERVER_IP>:8080` | Driver digital wallet, virtual RFID pass, trip history |
| **Central Backend API** | `3000` | `http://<SERVER_IP>:3000` | REST API, WebSocket streams, OCR engine, payment webhooks |
| **Storage Server** | `5000` | `http://<SERVER_IP>:5000` | ANPR captures, license plate snapshots, receipts |
| **Toll Simulator** | `80` | `http://<SERVER_IP>/simulator` | Real-time animated canvas multi-lane simulation |
| **Plaza Edge Server** | `4000` | `http://<PLAZA_IP>:4000` | Offline-first booth operation, serial RFID controller |

---

## 2. HQ Admin Command Hub & Operator Console

### Default Credentials
- **Admin**: `admin@tollgate.com` / `password123`
- **Manager**: `manager@tollgate.com` / `password123`
- **Booth Operator 1**: `operator1@tollgate.com` / `password123`
- **Auditor / Viewer**: `viewer@tollgate.com` / `password123`

---

### Theme Customization (Dark / Light Mode)
- **Top Header Toggle**: Click the **Sun / Moon** icon in the top header bar to switch between sleek command-center dark mode and clean daylight mode.
- **Adaptive Glassmorphism**: Cards, live telemetry charts, and operator action panels smoothly adapt their contrast and lighting.

---

### Operator Quick Actions Ribbon
Located at the top of the Command Hub, the Operator Ribbon provides instant actions for booth cashiers and supervisors:
1. **Shift Indicator**: Displays current shift status (e.g., `ACTIVE SHIFT #04 • Lane 01-A`).
2. **Log Vehicle Entry**:
   - Manually record a vehicle passing through the plaza.
   - Automatically computes toll fee based on vehicle class (`SEDAN`, `SUV`, `VAN`, `BUS`, `TRUCK`).
   - Instantly triggers the barrier clear animation.
3. **Quick Tag/Plate Search**: Instant popover to inspect vehicle owner, registered class, and prepaid account balance without navigating away from the dashboard.

---

### Real Interactive Geographic Highway Map (Leaflet)
Click the **"Highway Map"** button on the Operator Ribbon or switch to **"🗺️ Real Map View"** on the Toll Plazas page to open the live GPS map:
- **Leaflet & Multi-Layer Tiles**: Switch between Dark Mode tiles, Street Map (OpenStreetMap), and Satellite Imagery (Esri World Imagery).
- **Corridor Coverage**: Maps 6 primary plazas spanning **352 miles** along Highway 1 with real geographic GPS coordinates:
  - Yangon 0-Mile (`0MILE`, `17.0372° N, 96.1788° E`, 6 lanes)
  - Bago Bypass (`BAGO39`, `17.3353° N, 96.4817° E`, 4 lanes)
  - Phyu Rest Stop (`PHYU115`, `18.5284° N, 96.4385° E`, 4 lanes)
  - Naypyitaw Southern Gate (`NPT201`, `19.7450° N, 96.1297° E`, 6 lanes)
  - Meiktila Junction (`MEIK285`, `20.8762° N, 95.8611° E`, 4 lanes)
  - Mandalay Gate (`MDY352`, `21.9750° N, 96.0836° E`, 6 lanes)
- **Real-Time Telemetry & Controls**: Click any plaza marker to fly to its GPS coordinates, view active lane counts, hourly throughput, daily revenue, and RFID/ANPR camera health. Zoom in/out and route auto-fit controls are built in.

---

### Instant Booth Dynamic QR Payment
When a driver reaches the toll gate with an unlinked RFID tag or insufficient prepaid balance:
1. Click **"Instant Booth QR"** on the Operator Ribbon.
2. Enter the license plate number (e.g., `4D-5918` or `7B-8899`) and select the vehicle class.
3. Present the generated dynamic **KBZPay / WavePay / MMQR** code to the driver.
4. Once scanned and paid, the barrier automatically unlocks and raises.

---

### Myanmar RTAD Wheel Tax AI Scanner & OCR
Booth operators and administrative staff can register customer vehicles in seconds by scanning physical Myanmar RTAD (Road Transport Administration Department / ကညန) registration cards:
1. Navigate to **Vehicles** in the sidebar.
2. Click **"✨ Scan Document (AI)"** or open **"Add Vehicle"** ➔ **"Auto-Fill from RTAD Card"**.
3. Upload or snap a photo of the card (supports both Front & Back sides).
4. The system automatically reads and populates:
   - **Plate Number** (e.g. `4D-5918` / `YGN 4D-5918`)
   - **Model Year** (e.g. `2009`)
   - **Make & Model** (e.g. `Honda Civic FD3`)
   - **Vehicle Class** (`SEDAN`, `SUV`, `TRUCK`, `BUS`, `MOTORCYCLE`)
   - **Color** (e.g. `Gray`)
   - **Engine Number & Chassis Number** (`LDA-1372845`, `FD3-1302842`)
   - **Registered Owner & Address** (`U NYI NYI MIN`)

---

## 3. Customer Portal & Progressive Web App (PWA)

### Default Customer Logins
- **Enterprise Fleet**: `fleet@transportco.com` / `password123`
- **Individual Driver**: `ko.min@personal.com` / `password123`

### Dark & Light Theme Switching
- Drivers can toggle between dark and light themes at any time by clicking the **Sun / Moon** icon in the desktop header or mobile top-bar.

---

### Mobile PWA Installation
The customer portal is a Progressive Web App (PWA) with full offline support:
- **iOS (Safari)**: Tap Share → **"Add to Home Screen"**.
- **Android (Chrome)**: Tap the 3 dots menu → **"Install App"**.

---

### One-Click Vehicle Registration via RTAD Card
Drivers can add new vehicles without typing long chassis or engine numbers:
1. Log in to the Customer Portal.
2. Go to **My Vehicles** ➔ Click **"✨ Scan Wheel Tax (AI)"**.
3. Snap a photo of the vehicle registration card.
4. Review the auto-detected fields and tap **"Apply to Registration Form"**.
5. The form is populated instantly and the card photo is attached for verification.

---

### Digital Toll Pass (Virtual RFID QR)
If a driver's physical windshield RFID sticker is damaged or not yet delivered:
1. Tap **"Digital Pass"** on the mobile dashboard.
2. The portal renders a high-contrast dynamic QR pass linked to the driver's registered vehicles.
3. Hold the phone up to the optical reader at the toll booth barrier to validate and pass.
4. Auto-rotates token timestamps for anti-cloning security.

---

### Prepaid Wallet & Top-Up
- **Supported Payment Channels**: KBZPay, WavePay, AYA Pay, MMQR.
- **Auto Low-Balance Alert**: Whenever the wallet balance drops below **K3,000 MMK**, a warning banner appears with a 1-tap top-up button.
- **Downloadable Receipts**: Export official PDF/Excel receipts for company expense reimbursement.

---

## 4. Toll Simulator (Canvas Multi-Lane Highway)

Access the live simulation at `http://<SERVER_IP>/simulator`:
- **Highway Layout**: 4 lanes (2 Northbound, 2 Southbound) with plaza booths and median dividers.
- **Vehicle Simulation**: Sedans, SUVs, light trucks, and heavy buses driving at realistic speeds.
- **Visual Effects**:
  - Yellow glow: RFID radio wave detected.
  - Green pulse: Successful payment & barrier lift.
  - Red flashing: Unregistered vehicle / ANPR violation triggered.

---

## 5. Plaza Edge Server (Raspberry Pi)

Each toll plaza operates an edge Raspberry Pi running an offline-first SQLite database:
- **Offline Resilience**: Even if the fiber/4G connection to drops, toll booths continue scanning RFID tags, logging transactions, and lifting barriers with zero latency (< 80ms).
- **Auto Resync**: Once internet connectivity resumes, the local `SyncService` pushes all buffered events in FIFO batches to HQ.

---

## 6. Troubleshooting & FAQ

### Q: Why did a vehicle trigger an "Insufficient Balance" alert?
> **A**: The vehicle's linked prepaid account has less than the toll rate for its class. The operator can click **"Instant Booth QR"** to accept immediate MMQR/KBZPay payment.

### Q: What if an ANPR plate doesn't match the RFID tag UID?
> **A**: The event is automatically flagged and sent to the **Violation Workbench** for operator review.

### Q: How do I restart the Docker containers on the server?
> **A**: Run `docker compose up -d --build` on the server terminal (`192.168.100.101`).
