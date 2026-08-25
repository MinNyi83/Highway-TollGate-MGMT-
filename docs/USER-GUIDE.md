# Highway Tollgate Management System - User Guide

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Vehicle Management](#vehicle-management)
4. [Toll Plaza Management](#toll-plaza-management)
5. [Toll Events](#toll-events)
6. [Transactions](#transactions)
7. [Violations](#violations)
8. [Reports](#reports)
9. [Device Status](#device-status)
10. [Notifications](#notifications)

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Edge)
- Docker Desktop (for database)
- Node.js 18+ (for development)

### First Time Setup

1. Start Docker Desktop
2. Open terminal and navigate to project folder
3. Run: `docker-compose up -d`
4. Run: `npm install`
5. Run: `cd packages/backend && npm run db:generate && npm run db:migrate && npm run db:seed`
6. Run: `npm run dev` (in packages/backend folder)
7. Run: `cd packages/frontend && npm run dev`
8. Open browser to `http://localhost:5173`

### Login

1. Enter your email and password
2. Click "Sign In"
3. You will be redirected to the Dashboard

**Default Accounts:**
| Email | Password | Role |
|-------|----------|------|
| admin@tollgate.com | admin123 | Administrator |
| operator@tollgate.com | operator123 | Operator |
| viewer@tollgate.com | viewer123 | Viewer |

---

## Dashboard

The Dashboard provides an overview of system activity.

### What You See

- **Total Vehicles** - Number of registered vehicles
- **Today's Revenue** - Income from toll collections
- **Active Violations** - Unresolved violations
- **Events Today** - Toll events processed today

### Charts

- Revenue by Plaza (bar chart)
- Violations by Type (pie chart)
- Traffic by Hour (line chart)

---

## Vehicle Management

### View Vehicles

1. Click **Vehicles** in the sidebar
2. Browse the list of registered vehicles
3. Use the search bar to filter by plate number or RFID tag
4. Click column headers to sort

### Register New Vehicle

1. Click **Add Vehicle** button
2. Fill in the form:
   - Plate Number (e.g., ABC-1234)
   - RFID Tag (auto-generated or manual)
   - Vehicle Class (Sedan, SUV, Truck, Bus)
   - Make & Model
   - Year & Color
3. Click **Save**

### Bind RFID Tag

1. Find the vehicle in the list
2. Click the **RFID** icon
3. Enter the RFID tag number
4. Click **Bind**

### Unbind RFID Tag

1. Find the vehicle with bound RFID
2. Click the **Unbind** icon
3. Confirm the action

---

## Toll Plaza Management

### View Plazas

1. Click **Toll Plazas** in the sidebar
2. Browse the grid of plaza cards
3. Each card shows:
   - Plaza name and location
   - Status (Active/Inactive)
   - Rates per vehicle class

### Add New Plaza

1. Click **Add Plaza** button
2. Enter plaza details:
   - Name
   - Location/Address
   - Status
3. Click **Save**

### Manage Rates

1. Click on a plaza card
2. View current rates for each vehicle class
3. Click **Edit Rates** to modify:
   - Sedan rate
   - SUV rate
   - Truck rate
   - Bus rate
4. Click **Save Changes**

---

## Toll Events

The Toll Events page shows real-time vehicle passage activity.

### What You See

- Live feed of toll events (auto-updates)
- Entry and exit timestamps
- Vehicle plate numbers
- RFID tag reads
- ANPR plate recognition results
- Toll amounts

### Manual Entry

1. Click **Manual Entry** button
2. Enter vehicle plate number
3. Select toll plaza
4. Click **Record Entry**

### Manual Exit

1. Find the entry event in the list
2. Click **Record Exit**
3. System calculates toll automatically

### Cross-Verification

The system automatically compares:
- RFID tag read vs registered tag
- ANPR plate vs registered plate
- If mismatch detected, creates a violation

---

## Transactions

View all financial transactions in the system.

### Transaction Types

- **DEBIT** - Toll payment deducted from account
- **TOPUP** - Account balance increase
- **REFUND** - Refund for overcharge or error

### View Transactions

1. Click **Transactions** in the sidebar
2. Browse the list with columns:
   - Date & Time
   - Vehicle
   - Type (Debit/Topup/Refund)
   - Amount
   - Balance After
   - Status

### Filter Transactions

1. Use date range picker
2. Filter by transaction type
3. Search by vehicle plate number

---

## Violations

Manage traffic violations detected by the system.

### Violation Types

- **ANPR_MISMATCH** - Plate number doesn't match
- **NO_RFID** - Vehicle without RFID tag
- **INSUFFICIENT_BALANCE** - Account has insufficient funds
- **TOLL_EVASION** - Attempted to avoid toll

### View Violations

1. Click **Violations** in the sidebar
2. See list with:
   - Vehicle plate number
   - Violation type
   - Fine amount
   - Due date
   - Status

### Process Violation

1. Find the violation in the list
2. Click **Process** to acknowledge
3. Click **Mark Paid** when payment received
4. Click **Escalate** if needed

### Violation Status Flow

```
PENDING → PROCESSING → PAID
         ↓
      ESCALATED
```

---

## Reports

Generate and view system reports.

### Revenue Report

1. Click **Reports** in the sidebar
2. Select date range
3. View revenue by plaza (bar chart)
4. See total revenue and transaction count

### Violation Report

1. View violation statistics (pie chart)
2. See breakdown by violation type
3. View total fines collected

### Traffic Report

1. See traffic patterns by hour
2. Identify peak hours
3. View vehicle class distribution

---

## Device Status

Monitor RFID and ANPR device health.

### What You See

- Device name and type
- Current status (Online/Offline/Error)
- Last ping timestamp
- Assigned plaza

### Device Status Indicators

- **Green** - Online and working
- **Red** - Offline or disconnected
- **Yellow** - Error or warning

---

## Notifications

Stay informed with real-time notifications.

### Notification Types

- New toll event recorded
- Violation detected
- Account low balance
- Device offline
- System alerts

### Notification Panel

1. Click the **bell icon** in the header
2. See unread notification count (red badge)
3. Click notification to mark as read
4. Click **Mark all read** to clear all

### Real-time Updates

Notifications appear automatically via WebSocket connection.

---

## User Roles

### Administrator

- Full access to all features
- Manage users and accounts
- Configure system settings
- View all reports

### Operator

- Manage vehicles and plazas
- Process toll events
- Handle violations
- View reports

### Viewer

- Read-only access
- View dashboard and reports
- View vehicle and plaza information

---

## Troubleshooting

### Cannot Login

1. Check email and password
2. Ensure backend server is running
3. Check browser console for errors

### No Data Showing

1. Verify database is running (`docker-compose ps`)
2. Run seed script: `npm run db:seed`
3. Check backend logs

### WebSocket Not Connecting

1. Ensure backend is running on port 3000
2. Check firewall settings
3. Refresh the page

### Slow Performance

1. Check database connection
2. Verify Docker resources (CPU/Memory)
3. Clear browser cache

---

## Support

For issues or questions:
- Check the [E2E Test Script](./E2E-TEST-SCRIPT.md)
- Review API documentation at `http://localhost:3000/api-docs`
- Check server logs in terminal
