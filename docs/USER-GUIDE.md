# Highway Tollgate Management System - User Guide

## Overview

The Highway Tollgate Management System is a comprehensive solution for managing toll collection, vehicle tracking, and fleet management. It supports RFID and ANPR technology for automatic toll collection, with full mobile-responsive design.

---

## Getting Started

### Customer Registration

1. Visit the Customer Portal at `http://192.168.100.101:8080`
2. Click "Register" and fill in your details
3. Choose between Individual or Enterprise account
4. After registration, you will receive your account number

### Login

| Portal | URL | Default Credentials |
|--------|-----|---------------------|
| Admin Dashboard | `http://192.168.100.101` | admin@tollgate.com / admin123 |
| Customer Portal | `http://192.168.100.101:8080` | (Register new account) |

---

## Customer Portal

### Dashboard

- View your current balance (MMK)
- See recent toll transactions
- Quick access to vehicle registration and top-up

### Vehicle Registration & Approval

1. Go to "My Vehicles"
2. Click "Register" button
3. Fill in vehicle details:
   - Plate number (e.g., 1A-12345)
   - Make and model (dropdown selection)
   - Year (1997-2026)
   - Color (20 options)
   - Vehicle class (Motorcycle, Sedan, SUV, Truck, Bus)
4. Upload vehicle photo (optional)
5. Click "Register Vehicle"

**Approval Status:**
- ⏳ **Pending Approval** — Your vehicle is waiting for admin review
- ✓ **Approved** — Vehicle is active and can use toll plazas
- ✗ **Rejected** — Admin rejected with reason (shown in red banner)

### Top Up Account

1. Go to "Account"
2. Click "Top Up"
3. Enter the amount (in MMK)
4. Choose payment method:
   - KBZ Pay
   - Wave Money
   - MMQR
   - Manual (admin-assisted)
5. Complete the payment

### View Toll History

1. Go to "Toll History"
2. View all trips with:
   - Entry/exit times
   - Plaza used
   - Amount charged (MMK)
   - Duration

---

## Admin Dashboard

### Login

1. Visit `http://192.168.100.101`
2. Login with admin credentials: `admin@tollgate.com` / `admin123`

### Dashboard Overview

- Real-time revenue metrics (MMK)
- Active vehicles count
- Total trips today
- System status indicators

### Vehicle Management

#### All Vehicles Tab
1. Go to "Vehicles"
2. View all registered vehicles with photos, plates, make/model
3. Search by plate number, make, or model
4. Click plate number to view vehicle detail

#### Pending Approval Tab
1. Click "Pending Approval" tab
2. Review customer-submitted vehicles
3. Click **Approve** (green) to approve
4. Click **Reject** (red) to reject with reason
5. Yellow badge shows pending count

#### Add Vehicle (Admin)
1. Click "Add Vehicle"
2. Fill in all fields (plate, year, make/model dropdowns, color, class)
3. Optionally scan RFID tag UID
4. Upload vehicle photos (up to 2) and wheel tax card photos (up to 2)
5. Click "Register Vehicle" — automatically APPROVED

#### CSV Import
1. Click "Import CSV"
2. Upload CSV with format: `plateNumber,make,model,year,color,vehicleClass`
3. Review import results

### Toll Plaza Management

1. Go to "Toll Plazas"
2. View all plazas with device status summary
3. **Add Plaza:** Click "Add Plaza" → Enter name, gate code, coordinates, lanes
4. **View Detail:** Click "View" → See device status, toll rates, add devices
5. **Edit Plaza:** Click edit icon → Modify details
6. **Delete Plaza:** Click delete icon → Confirm deletion

### Toll Event Monitoring

1. Go to "Toll Events"
2. View card-based event list with expandable details:
   - Vehicle photo, plate number
   - ANPR match indicator (✓/✗)
   - Plaza gate code, lane number, direction (↑/↓)
   - Amount in MMK, duration
   - RFID tag, transaction status
3. Filter by status (success, violation, error)
4. Search by plate number

### Transaction Management

1. Go to "Transactions"
2. View color-coded transaction cards:
   - 💳 Debit (red)
   - 💰 Credit (green)
   - 🔋 Top-up (blue)
   - ⚠️ Fine (orange)
3. Expandable details: Transaction info, Account info, Vehicle info
4. Filter by type and status
5. Search by account number or plate

### Violation Management

1. go to "Violations"
2. View violation cards with:
   - Type badges (ANPR Mismatch, No RFID, Insufficient Balance)
   - Overdue indicators
   - Amount in MMK
3. Action buttons: Process Payment, Escalate, Dismiss, Mark Paid
4. Filter by type and status

### Reports & Analytics

1. Go to "Reports"
2. View summary cards and 4 charts:
   - Revenue by Plaza (bar chart)
   - Violations by Type (pie chart)
   - Daily Revenue Trend (line chart)
   - Events by Plaza (horizontal bar)
3. Filter by date range
4. **Excel Export** buttons:
   - Transactions Excel
   - Violations Excel
   - Revenue Excel
   - Events Excel

### Device Management

1. Go to "Device Status"
2. Filter by plaza
3. Monitor device health:
   - Online/Offline status
   - Last ping times
   - Device type (RFID Reader, ANPR Camera, etc.)

### Simulator

1. Go to "Simulator"
2. Choose mode:
   - **Manual:** Select vehicle, plaza, scenario, run single/continuous
   - **Holiday Traffic:** Select holiday type, set vehicle count, run simulation

#### Holiday Traffic Types
| Type | Description |
|------|-------------|
| Thingyan | Water Festival (April) — 4x traffic, high congestion |
| Thadingyut | Festival of Lights (Oct) — 2x traffic |
| Weekend | Regular weekend — 1.5x traffic |
| National Day | Independence/Union Day — 2.5x traffic |
| Normal Day | Regular weekday — baseline |

---

## Toll Plaza Operations

### How Toll Collection Works

1. **Vehicle Entry:**
   - RFID tag scanned at entry point
   - ANPR captures license plate
   - Entry event created with lane number and direction

2. **During Transit:**
   - Vehicle travels on the highway
   - System tracks the journey

3. **Vehicle Exit:**
   - RFID tag scanned at exit point
   - ANPR captures license plate again
   - System cross-verifies RFID and ANPR data

4. **Payment Processing:**
   - System calculates toll based on:
     - Entry/exit plaza
     - Vehicle class
   - Amount deducted from account (MMK)

5. **Violation Detection:**
   - If RFID and ANPR don't match → violation created
   - Fine applied to the account

---

## Payment Methods

### KBZ Pay

1. Select "KBZ Pay" as payment method
2. Enter amount
3. Scan QR code with KBZ Pay app
4. Confirm payment

### Wave Money

1. Select "Wave Money" as payment method
2. Enter amount
3. Receive payment link via SMS
4. Complete payment in Wave Money app

### MMQR

1. Select "MMQR" as payment method
2. Enter amount
3. Scan QR code with any Myanmar payment app
4. Confirm payment

---

## Account Management

### View Balance

- Current balance displayed on dashboard (MMK)
- Real-time updates after transactions

### Transaction History

1. Go to "Transactions" (admin) or "Toll History" (customer)
2. View all transactions:
   - Toll deductions
   - Top-ups
   - Refunds
   - Violation payments
3. Filter by date or type
4. Export to CSV or Excel

---

## Violations

### Understanding Violations

- **RFID-ANPR Mismatch:** Vehicle plate doesn't match RFID tag
- **No RFID:** Vehicle passed without RFID tag
- **Insufficient Balance:** Vehicle passed with zero/negative balance

### Paying Violations

1. Go to "Violations" in Customer Portal
2. View violation details
3. Click "Pay Now"
4. Complete payment

### Disputing Violations

1. Contact support with violation ID
2. Provide evidence (photos, receipts)
3. Admin will review and respond

---

## Troubleshooting

### Login Issues

- Check email and password
- Reset password if needed
- Contact admin if account is locked

### Payment Issues

- Verify payment method is active
- Check internet connection
- Contact support if payment fails

### Vehicle Not Recognized

- Verify RFID tag is active
- Check vehicle registration status (must be APPROVED)
- Ensure account has sufficient balance

---

## Support

For technical support or inquiries:
- Email: support@tollgate.com
- Phone: 09-976543210
- Office: Yangon, Myanmar

---

## System Requirements

### Customer Portal
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Mobile-friendly design

### Admin Dashboard
- Modern web browser
- Stable internet connection
- Recommended: Desktop or tablet

---

## Security Notes

- Never share your login credentials
- Log out after each session
- Report suspicious activity immediately
- Keep your contact information updated
