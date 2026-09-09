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
   - [One-Click Vehicle Registration via RTAD Card](#one-click-via-registration-via-rtad-card)
   - [Low Balance Alerts](#low-balance-alerts)
4. [Toll Simulator (Canvas Multi-Lane Highway)](#toll-simulator-canvas-multi-lane-highway)
5. [Plaza Edge Server (Offline-First Raspberry Pi)](#plaza-edge-server-offline-first-raspberry-pi)
6. [API Reference](#api-reference)
7. [Health & Monitoring](#health--monitoring)
8. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## 1. System Overview & Access URLs

The system is deployed as a distributed stack with cloud HQ coordination and edge toll plaza servers:

| Portal | Port | Default URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<SERVER_IP>` | Central telemetry, operator ribbon, highway map, reports |
| **Customer Portal (PWA)** | `8080` | `http://<SERVER_IP>:8080` | Driver digital wallet, virtual RFID pass, trip history |
| **Financial Portal** 🆕 | `8081` | `http://<SERVER_IP>:8081` | Ministry reporting, revenue tracking, reconciliation |
| **Central Backend API** | `3000` | `http://<SERVER_IP>:3000` | REST API, WebSocket streams, OCR engine, payment webhooks |
| **API Documentation** | `3000` | `http://<SERVER_IP>:3000/api-docs` | Swagger UI for API exploration |
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
1. **Shift Indicator**: Displays current shift status (e.g., `ACTIVE SHIFT #04 - Lane 01-A`).
2. **Log Vehicle Entry**: Manually record a vehicle passing through the plaza.
3. **Quick Tag/Plate Search**: Instant popover to inspect vehicle owner, registered class, and prepaid account balance.

---

### Real Interactive Geographic Highway Map (Leaflet)
Click the **"Highway Map"** button on the Operator Ribbon or switch to **"Real Map View"** on the Toll Plazas page to open the live GPS map:
- **Leaflet & Multi-Layer Tiles**: Switch between Dark Mode tiles, Street Map (OpenStreetMap), and Satellite Imagery.
- **Corridor Coverage**: Maps 6 primary plazas spanning **352 miles** along Highway 1 with real geographic GPS coordinates.

---

### Instant Booth Dynamic QR Payment
When a driver reaches the toll gate with an unlinked RFID tag or insufficient prepaid balance:
1. Click **"Instant Booth QR"** on the Operator Ribbon.
2. Enter the license plate number and select the vehicle class.
3. Present the generated dynamic **KBZPay / WavePay / MMQR** code to the driver.
4. Once scanned and paid, the barrier automatically unlocks and raises.

---

### Myanmar RTAD Wheel Tax AI Scanner & OCR
Booth operators and administrative staff can register customer vehicles in seconds by scanning physical Myanmar RTAD registration cards:
1. Navigate to **Vehicles** in the sidebar.
2. Click **"Scan Document (AI)"** or open **"Add Vehicle"** > **"Auto-Fill from RTAD Card"**.
3. Upload or snap a photo of the card (supports both Front & Back sides).
4. The system automatically reads and populates all vehicle fields.

---

## 3. Customer Portal & Progressive Web App (PWA)

### Default Customer Logins
- **Enterprise Fleet**: `fleet@transportco.com` / `password123`
- **Individual Driver**: `ko.min@personal.com` / `password123`

### Dark & Light Theme Switching
- Drivers can toggle between dark and light themes at any time by clicking the **Sun / Moon** icon.

---

### Mobile PWA Installation
The customer portal is a Progressive Web App (PWA) with full offline support:
- **iOS (Safari)**: Tap Share > **"Add to Home Screen"**.
- **Android (Chrome)**: Tap the 3 dots menu > **"Install App"**.

---

### One-Click Vehicle Registration via RTAD Card
Drivers can add new vehicles without typing long chassis or engine numbers:
1. Log in to the Customer Portal.
2. Go to **My Vehicles** > Click **"Scan Wheel Tax (AI)"**.
3. Snap a photo of the vehicle registration card.
4. Review the auto-detected fields and tap **"Apply to Registration Form"**.

---

### Digital Toll Pass (Virtual RFID QR)
If a driver's physical windshield RFID sticker is damaged or not yet delivered:
1. Tap **"Digital Pass"** on the mobile dashboard.
2. The portal renders a high-contrast dynamic QR pass linked to the driver's registered vehicles.
3. Hold the phone up to the optical reader at the toll booth barrier to validate and pass.

---

### Prepaid Wallet & Top-Up
- **Supported Payment Channels**: KBZPay, WavePay, AYA Pay, MMQR.
- **Auto Low-Balance Alert**: Whenever the wallet balance drops below **K3,000 MMK**, a warning banner appears with a 1-tap top-up button.
- **Downloadable Receipts**: Export official PDF/Excel receipts for company expense reimbursement.

---

## 4. Financial Portal (Port 8081) 🆕

### Default Financial Logins
- **Financial Admin**: `fin.admin@tollgate.com` / `password123`
- **Financial Manager**: `fin.manager@tollgate.com` / `password123`
- **Financial Viewer**: `fin.viewer@tollgate.com` / `password123`

### Financial Portal Pages

#### Dashboard
- **KPI Cards**: Total toll revenue, total wallet deposits, active vehicles, total plazas, total regions
- **Revenue Trend Chart**: Daily revenue and deposit trends
- **Regional Comparison**: Revenue breakdown by 15 Myanmar regions
- **Real-Time Alerts**: Traffic drops, revenue changes, pending settlements

#### Daily Collection Statement
- Per-plaza daily toll revenue breakdown
- Filter by plaza, date range, and region
- Excel & PDF export for accounting reconciliation

#### Toll Revenue by Region
- Revenue breakdown across 15 administrative regions
- Daily revenue trends per region
- Excel & PDF export by region

#### Wallet Deposits by Region
- Customer wallet top-up amounts by region
- **Important**: These are customer liabilities, NOT company revenue
- Excel & PDF export by region

#### Vehicle Registration by Region
- Vehicle counts and class distribution by region
- Vehicle registration trends

#### Pass-Through Volume by Plaza
- Vehicle count per plaza
- RFID vs manual entry percentage
- Peak hour distribution

#### Revenue Remittance
- Plaza → Treasury transfer tracking
- Settlement status (TRANSFERRED / NEEDS TRANSFER)
- Batch confirmation workflow

#### Financial Reconciliation
- Monthly reconciliation with approval workflow
- Submit → Approve/Reject flow
- Status tracking: DRAFT → PENDING → APPROVED/REJECTED

#### Official Receipts
- PDF receipt generation for revenue transfers
- Receipt status tracking (PENDING → APPROVED → ISSUED)

#### Fiscal Year Report
- Annual revenue summary by fiscal year (April–March)
- Quarterly breakdown (Q1=Apr-Jun, Q2=Jul-Sep, Q3=Oct-Dec, Q4=Jan-Mar)
- Executive summary with total revenue, remittances, reconciliation status

#### Comparison Report
- Year-over-year revenue comparison
- Monthly breakdown with growth percentages
- Interactive bar chart visualization

#### Plaza Performance
- Compare individual plaza revenue and traffic
- Plaza rankings by revenue
- Average revenue per trip analysis

#### Violation Analytics
- Violations by type (pie chart)
- Violations by region (bar chart)
- Fine collection summary

#### Revenue Forecast
- Linear projection based on historical trends
- 3/6/12 month forecast periods
- Confidence levels for predictions

#### Revenue Heatmap
- Hourly/daily traffic patterns
- Peak hour and peak day identification
- Visual heatmap grid

#### Transaction Search
- Search by license plate, date range, plaza
- Pagination for large result sets
- PDF export of search results

#### Settlement Pipeline
- Track pending/confirmed transfers
- Visual pipeline flow
- Recent transfer history

#### Audit Trail
- Financial action history
- Who approved/rejected what, when, with notes
- IP address logging

#### Wallet Analytics
- Account balances by type
- Total system balance
- Average balance per account

#### Revenue by Vehicle Type
- Revenue contribution by vehicle class
- Trips and average revenue per trip
- Share percentage visualization

#### Customer Spending Dashboard
- Top 10 spending customers
- Spending patterns and trends
- Customer rankings

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

## 5. Toll Simulator (Canvas Multi-Lane Highway)

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
- **Offline Resilience**: Even if the fiber/4G connection drops, toll booths continue scanning RFID tags, logging transactions, and lifting barriers with zero latency (< 80ms).
- **Auto Resync**: Once internet connectivity resumes, the local `SyncService` pushes all buffered events in FIFO batches to HQ.

---

## 6. API Reference

### Authentication
```bash
# Login
POST /api/auth/login
Content-Type: application/json
{"email": "admin@tollgate.com", "password": "password123"}

# Response
{
  "user": {"id": "...", "email": "admin@tollgate.com", "role": "ADMIN"},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

# Use token in subsequent requests
GET /api/vehicles
Authorization: Bearer <token>
```

### Vehicles
```bash
# List vehicles with search/filter
GET /api/vehicles?search=ABC&status=ACTIVE&vehicleClass=SEDAN&page=1&limit=50

# Get single vehicle
GET /api/vehicles/:id

# Create vehicle
POST /api/vehicles
{"plateNumber": "4D-5918", "make": "Honda", "model": "Civic", "year": 2009, "vehicleClass": "SEDAN"}

# Bind RFID tag
POST /api/vehicles/:id/rfid
{"tagUid": "E20034128901021200000001", "accountId": "..."}
```

### Health Check
```bash
# Full health status
GET /api/health
{"status": "healthy", "database": {"status": "connected", "latencyMs": 1}, ...}

# Liveness probe
GET /api/health/live
{"status": "alive", "timestamp": "..."}

# Readiness probe
GET /api/health/ready
{"status": "ready", "timestamp": "..."}
```

### Reports
```bash
# Revenue report
GET /api/reports/revenue?startDate=2026-09-01&endDate=2026-09-06

# Transaction history
GET /api/reports/transactions?page=1&limit=50

# Violation summary
GET /api/reports/violations?status=PENDING
```

### Full API Documentation
Visit `http://<SERVER_IP>:3000/api-docs` for interactive Swagger UI documentation.

---

## 7. Health & Monitoring

### Container Health Status
```bash
# Check all containers
docker ps --format 'table {{.Names}}\t{{.Status}}'

# Expected output
NAMES                             STATUS                    PORTS
tollgate-rfid-customer-portal-1   Up (healthy)              0.0.0.0:8080->80/tcp
tollgate-rfid-frontend-1          Up (healthy)              0.0.0.0:80->80/tcp
tollgate-rfid-backend-1           Up (healthy)              0.0.0.0:3000->3000/tcp
tollgate-rfid-db-1                Up (healthy)              0.0.0.0:5432->5432/tcp
```

### Health Endpoint Details
| Endpoint | Response | Description |
|---|---|---|
| `GET /api/health` | `{"status": "healthy", "database": {"status": "connected", "latencyMs": 1}, ...}` | Full system health with DB latency, memory, CPU |
| `GET /api/health/live` | `{"status": "alive"}` | Liveness probe - always 200 if process is running |
| `GET /api/health/ready` | `{"status": "ready"}` | Readiness probe - 200 only if DB is connected |
| `GET /api/health/metrics` | Detailed JSON | DB counts, memory usage, CPU load, storage size |

### Monitoring Commands
```bash
# Quick health check
curl -s http://localhost:3000/api/health | python3 -m json.tool

# Watch container resources
docker stats --format 'table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}'

# View backend logs
docker logs tollgate-rfid-backend-1 --tail 50 -f

# Check database connectivity
docker exec tollgate-rfid-db-1 pg_isready -U postgres
```

---

## 8. Troubleshooting & FAQ

### Q: Why did a vehicle trigger an "Insufficient Balance" alert?
> **A**: The vehicle's linked prepaid account has less than the toll rate for its class. The operator can click **"Instant Booth QR"** to accept immediate MMQR/KBZPay payment.

### Q: What if an ANPR plate doesn't match the RFID tag UID?
> **A**: The event is automatically flagged and sent to the **Violation Workbench** for operator review.

### Q: How do I restart the Docker containers on the server?
> **A**: Run `docker compose up -d --build` on the server terminal (`192.168.100.101`).

### Q: What does "Rate limit 429 error" mean?
> **A**: Too many requests sent in a short period. Auth endpoints allow 10 requests per 15 minutes. Wait for the window to reset.

### Q: How do I fix "CORS origin not allowed"?
> **A**: The server only accepts requests from configured origins. Set the `CORS_ORIGINS` environment variable with comma-separated allowed origins, or add your origin to the `ALLOWED_ORIGINS` array in `app.ts`.

### Q: How do I check if the database is healthy?
> **A**: 
> ```bash
> curl -s http://localhost:3000/api/health/ready
> # Returns {"status": "ready"} if DB is connected
> # Returns {"status": "not ready"} with HTTP 503 if DB is down
> ```

### Q: How do I deploy database migrations?
> **A**:
> ```bash
> docker exec tollgate-rfid-backend-1 sh -c 'cd packages/backend && npx prisma migrate deploy'
> ```

### Q: Where can I find API documentation?
> **A**: Visit `http://<SERVER_IP>:3000/api-docs` for interactive Swagger UI, or `http://<SERVER_IP>:3000/api-docs.json` for the OpenAPI spec.

### Q: How do I access the Financial Portal?
> **A**: Visit `http://<SERVER_IP>:8081` and login with financial staff credentials. Financial Admin has full access, Financial Manager can approve reconciliations, Financial Viewer has read-only access.

### Q: What's the difference between Toll Revenue and Wallet Deposits?
> **A**: **Toll Revenue** is actual money earned from toll charges (DEBIT transactions). **Wallet Deposits** are customer loaded money (TOPUP transactions) - this is a company LIABILITY, not revenue.

### Q: How do I access the Presentation?
> **A**: Visit `http://<SERVER_IP>/presentation.html` for the interactive slide deck (17 slides) with fullscreen mode.

### Q: How many slides are in the presentation?
> **A**: 17 slides covering: Title & System Overview, Monorepo Structure, Database Architecture, Challenges, Solution Pillars, System Topology, Myanmar RTAD OCR, Dual Verification, Offline-First Sync, Customer PWA, HQ Command Hub, Highway Simulator, Hardware Matrix, Financial Portal, Docker Deployment, API Reference, and Conclusion.

### Q: Financial portal shows "Login failed" but credentials are correct?
> **A**: The backend may be rate-limited from too many login attempts. Restart the backend: `docker restart tollgate-rfid-backend-1`. The rate limiter resets on restart.
