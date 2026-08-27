# TollGate RFID - User Guide

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [HQ Admin Portal](#hq-admin-portal)
4. [Plaza Server Admin Panel](#plaza-server-admin-panel)
5. [Customer Portal](#customer-portal)
6. [RFID Reader Setup](#rfid-reader-setup)
7. [Sync & Offline Operation](#sync--offline-operation)
8. [Troubleshooting](#troubleshooting)

---

## Overview

The TollGate RFID system manages highway toll collection using RFID tags and ANPR (Automatic Number Plate Recognition). It consists of:

- **HQ Server** (Cloud): Central management, analytics, customer portal
- **Plaza Servers** (Raspberry Pi): Local toll operations at each plaza
- **Storage Server**: Vehicle photos and ANPR captures

---

## System Architecture

```
Cloud (HQ):
├── Admin Portal (http://your-server)
├── Customer Portal (http://your-server:8080)
├── Backend API (http://your-server:3000)
├── Storage Server (http://your-server:5000)
└── PostgreSQL Database

Each Plaza (Raspberry Pi):
├── Plaza Admin Panel (http://raspberry-pi:4000/admin)
├── Plaza API (http://raspberry-pi:4000)
├── SQLite Database (local)
├── RFID Reader (Serial/TCP)
└── Sync Engine (automatic)
```

---

## HQ Admin Portal

### Login

1. Open browser to `http://your-server`
2. Enter credentials:
   - Email: `admin@tollgate.com`
   - Password: `admin123`

### Dashboard

The dashboard shows:
- **Today's Statistics**: Events, revenue, active vehicles
- **Revenue Chart**: Daily revenue trend
- **Recent Events**: Latest toll transactions
- **Device Status**: RFID reader and ANPR status

### Vehicle Management

#### Adding a Vehicle

1. Click **Vehicles** in sidebar
2. Click **Add Vehicle** button
3. Fill in details:
   - Plate Number (required)
   - Make, Model, Year, Color
   - Vehicle Class (Sedan, SUV, Truck, etc.)
   - Upload vehicle photo
4. Click **Save**

#### Approving Vehicles

When customers register vehicles:
1. Go to **Vehicles** → **Pending Approval** tab
2. Review vehicle details
3. Click **Approve** or **Reject** (with reason)
4. Customer receives notification

#### Binding RFID Tags

1. Go to vehicle detail page
2. Click **Bind RFID Tag**
3. Enter tag UID (from RFID sticker)
4. Click **Bind**

### Toll Plaza Management

1. Click **Toll Plazas** in sidebar
2. **Add Plaza**: Name, gate code, mile marker, location
3. **Edit Plaza**: Update rates, lanes, status
4. **View Stats**: Events and revenue per plaza

### Reports

1. Click **Reports** in sidebar
2. Select report type:
   - Revenue Report
   - Transaction Report
   - Violation Report
   - Toll Events Report
3. Set date range
4. Click **Export Excel** for download

---

## Plaza Server Admin Panel

### Accessing the Panel

1. Open browser to `http://raspberry-pi:4000/admin`
2. Login with:
   - Email: `admin@plaza.local`
   - Password: `admin123`

### Overview Tab

Shows real-time statistics:
- **Today's Events**: Total entry/exit events
- **Today's Revenue**: Total collected (MMK)
- **Pending Sync**: Items waiting to sync with HQ
- **Devices Online**: RFID reader status

### Events Tab

Lists today's toll events:
- **Time**: When the event occurred
- **Vehicle**: Plate number and vehicle info
- **RFID**: Tag UID if detected
- **Status**: ENTRY or COMPLETED
- **Amount**: Toll charged (MMK)

### Vehicles Tab

Shows locally registered vehicles:
- **Plate Number**: Vehicle identifier
- **Make/Model**: Vehicle details
- **Class**: Vehicle class for rate calculation
- **Synced**: Whether synced with HQ

### Sync Queue Tab

Monitors synchronization with HQ:
- **Pending**: Items waiting to sync
- **Completed**: Successfully synced items
- **Failed**: Items that failed to sync
- **Force Retry**: Button to retry failed items

### Devices Tab

Shows connected hardware:
- **RFID Reader**: Serial/TCP connection status
- **ANPR Camera**: Camera connection status
- **Last Heartbeat**: When device was last seen

### Settings Tab

Configure plaza settings:
- **Plaza Name**: Display name
- **Gate Code**: Unique identifier (e.g., "0MILE")
- **HQ Server URL**: Address of HQ server
- **Enable Sync**: Turn sync on/off

---

## Customer Portal

### Registration

1. Go to `http://your-server:8080`
2. Click **Register**
3. Fill in:
   - Name, Email, Phone
   - Password
4. Click **Register**
5. Login with your credentials

### Dashboard

Shows:
- **Account Balance**: Current balance (MMK)
- **Total Vehicles**: Number of registered vehicles
- **Total Trips**: Number of toll events
- **Recent Activity**: Latest toll transactions

### My Vehicles

#### Registering a Vehicle

1. Click **My Vehicles**
2. Click **Register Vehicle**
3. Fill in details:
   - Plate Number (required)
   - Make, Model, Year, Color
   - Vehicle Class
   - Upload vehicle photos (front, back)
   - Upload wheel tax card
4. Click **Submit**
5. Vehicle status: **PENDING** (awaiting admin approval)

#### Vehicle Status

- **Pending**: Awaiting admin approval
- **Approved**: Vehicle active, RFID tag can be bound
- **Rejected**: Admin rejected (see reason)

### Toll History

View all toll transactions:
- **Date/Time**: When toll was collected
- **Vehicle**: Plate number
- **Plaza**: Which toll plaza
- **Amount**: Toll charged (MMK)
- **Status**: Paid/Unpaid

### Account

#### Top Up Balance

1. Click **Account**
2. Click **Top Up**
3. Enter amount (MMK)
4. Select payment method:
   - **KBZ Pay**: Scan QR with KBZ Pay app
   - **Wave Pay**: Scan QR with Wave Pay app
   - **MMQR**: Scan QR with any Myanmar QR app
5. Complete payment
6. Balance updated automatically

#### Payment Instructions

**KBZ Pay:**
1. Open KBZ Pay app
2. Tap **Scan to Pay**
3. Scan the QR code
4. Confirm payment amount
5. Enter PIN

**Wave Pay:**
1. Open Wave Pay app
2. Tap **Scan**
3. Scan the QR code
4. Confirm payment

**MMQR:**
1. Open your bank's mobile app
2. Select **QR Payment**
3. Scan the QR code
4. Confirm payment

### Dark Mode

Click the sun/moon icon in the header to toggle dark mode.

---

## RFID Reader Setup

### Serial (USB) Reader

1. Connect RFID reader to Raspberry Pi USB port
2. Check device: `ls /dev/ttyUSB*`
3. Configure plaza server:

```env
RFID_TYPE=serial
RFID_SERIAL_PORT=/dev/ttyUSB0
RFID_BAUD_RATE=9600
```

4. Add user to dialout group: `sudo usermod -a -G dialout $USER`
5. Restart plaza server

### TCP/IP Reader

1. Connect RFID reader to network
2. Find reader's IP address
3. Configure plaza server:

```env
RFID_TYPE=tcp
RFID_TCP_HOST=192.168.1.100
RFID_TCP_PORT=5000
```

4. Restart plaza server

### Testing RFID Reader

1. Go to plaza admin panel → Devices tab
2. Check RFID Reader status shows "ONLINE"
3. Scan a tag
4. Check Events tab for new entry

---

## Sync & Offline Operation

### How Sync Works

1. **Plaza → HQ**: Toll events, vehicle data sync automatically
2. **HQ → Plaza**: Rate updates, vehicle registrations sync to plazas
3. **Frequency**: Every 30 seconds when connected
4. **Queue**: Pending items stored locally until sync succeeds

### Offline Mode

When internet is down:
- All toll operations continue normally
- Events stored in local SQLite database
- Sync queue holds pending items
- Automatic retry when connection returns

### Checking Sync Status

**Plaza Admin Panel:**
1. Go to Sync Queue tab
2. View pending/completed/failed items
3. Click **Force Retry** to retry failed items

**Via API:**
```bash
curl http://raspberry-pi:4000/api/sync/status
```

### Manual Sync

To force sync from command line:
```bash
# On Raspberry Pi
docker exec tollgate-plaza npx tsx src/services/sync-engine.ts --force
```

---

## Troubleshooting

### RFID Reader Not Working

**Problem:** Tags not detected

**Solution:**
1. Check physical connection (USB/Network)
2. Verify device status in admin panel
3. Check serial port permissions:
   ```bash
   ls -la /dev/ttyUSB0
   sudo usermod -a -G dialout $USER
   ```
4. Try different baud rate (9600, 19200, 38400)
5. Check reader documentation for protocol

### Sync Not Working

**Problem:** Events not syncing to HQ

**Solution:**
1. Check internet connection: `ping your-hq-server`
2. Verify HQ server URL in plaza settings
3. Check sync token matches
4. View sync queue for errors
5. Click **Force Retry** in admin panel

### Plaza Server Won't Start

**Problem:** Docker container crashes

**Solution:**
1. Check logs: `docker logs tollgate-plaza`
2. Verify database file exists: `ls data/plaza.db`
3. Run migrations: `docker exec tollgate-plaza npx prisma db push`
4. Check port 4000 not in use

### Customer Portal Login Fails

**Problem:** Cannot login to customer portal

**Solution:**
1. Verify backend is running: `curl http://localhost:3000/api/health`
2. Check database has user: `docker exec tollgate-db psql -U postgres -d tollgate -c "SELECT * FROM users"`
3. Clear browser localStorage
4. Try registering a new account

### High CPU on Raspberry Pi

**Problem:** Raspberry Pi running slow

**Solution:**
1. Check for sync loops in logs
2. Reduce sync frequency in cron
3. Limit concurrent connections
4. Consider Raspberry Pi 4 (2GB+ RAM)

---

## Default Credentials

| Server | Email | Password | Role |
|--------|-------|----------|------|
| HQ Admin | admin@tollgate.com | admin123 | Admin |
| HQ Operator | operator@tollgate.com | operator123 | Operator |
| HQ Viewer | viewer@tollgate.com | viewer123 | Viewer |
| Customer | ko.min@personal.com | password123 | Customer |
| Enterprise | fleet@transportco.com | password123 | Enterprise |
| Plaza | admin@plaza.local | admin123 | Plaza Admin |

---

## API Reference

### Plaza Server API (port 4000)

```bash
# Health check
curl http://raspberry-pi:4000/api/health

# Get plaza config
curl http://raspberry-pi:4000/api/config

# Get today's events
curl -H "Authorization: Bearer TOKEN" http://raspberry-pi:4000/api/events

# Get sync status
curl http://raspberry-pi:4000/api/sync/status

# Get device status
curl http://raspberry-pi:4000/api/devices
```

### HQ Sync API (port 3000)

```bash
# Push data from plaza to HQ
curl -X POST http://hq-server:3000/api/sync/push \
  -H "Content-Type: application/json" \
  -H "X-Plaza-Id: plaza-001" \
  -H "X-Sync-Token: your-token" \
  -d '{"table":"TollEvent","recordId":"123","action":"CREATE","payload":{...}}'

# Pull data from HQ to plaza
curl -X POST http://hq-server:3000/api/sync/pull \
  -H "Content-Type: application/json" \
  -H "X-Plaza-Id: plaza-001" \
  -H "X-Sync-Token: your-token" \
  -d '{"lastSyncAt":"2026-01-01T00:00:00Z","tables":["Vehicle","RFIDTag"]}'
```

### Storage Server API (port 5000)

```bash
# Upload vehicle photo
curl -X POST http://storage:5000/api/upload/vehicle \
  -F "photo=@vehicle.jpg"

# Upload ANPR capture
curl -X POST http://storage:5000/api/upload/anpr \
  -F "photo=@capture.jpg" \
  -F "plateNumber=ABC-1234" \
  -F "confidence=0.95"

# Get storage stats
curl http://storage:5000/api/stats
```

---

## Support

For issues or questions:
- Check this user guide
- Review API documentation
- Check system logs
- Contact system administrator
