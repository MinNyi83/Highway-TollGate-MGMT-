# Highway Tollgate Management System - User Guide

## Overview

The Highway Tollgate Management System is a comprehensive solution for managing toll collection, vehicle tracking, and fleet management. It supports RFID and ANPR technology for automatic toll collection.

---

## Getting Started

### Customer Registration

1. Visit the Customer Portal at `http://localhost:8080`
2. Click "Register" and fill in your details
3. Choose between Individual or Enterprise account
4. After registration, you will receive your account number

### Login

1. Enter your email and password on the login page
2. Click "Sign In"
3. You will be redirected to your dashboard

---

## Individual Customer

### Dashboard

- View your current balance
- See recent toll transactions
- Check account status

### Vehicle Management

1. Go to "My Vehicles"
2. Click "Add Vehicle"
3. Enter vehicle details:
   - Plate number
   - Vehicle class (SEDAN, SUV, TRUCK, BUS, etc.)
   - Make and model
   - Year
4. Register an RFID tag for the vehicle

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
2. Filter by date range
3. View transaction details including:
   - Entry/exit times
   - Plaza used
   - Amount charged

---

## Enterprise Customer

### Fleet Dashboard

- View fleet statistics
- Total vehicles, trips, and revenue
- Violation count

### Fleet Management

1. Go to "Fleet Vehicles"
2. Add multiple vehicles to your fleet
3. Assign RFID tags to each vehicle

### Trip Monitoring

1. Go to "Trip History"
2. View all fleet trips
3. Filter by vehicle, date, or plaza
4. Export data to CSV

### Spending Reports

1. Go to "Spending"
2. Select time period (daily, weekly, monthly)
3. View spending breakdown by vehicle
4. Download reports

---

## Admin Dashboard

### Login

1. Visit `http://localhost`
2. Login with admin credentials
3. Default: admin@example.com / password123

### Dashboard Overview

- Real-time revenue metrics
- Active users count
- Total trips today
- System status

### Toll Plaza Management

1. Go to "Toll Plazas"
2. Add new plazas with location coordinates
3. Set toll rates for each vehicle class
4. Enable/disable plazas

### Toll Event Monitoring

1. Go to "Toll Events"
2. View real-time entry/exit events
3. Monitor ANPR and RFID scans
4. Review mismatch alerts

### Violation Management

1. Go to "Violations"
2. Review RFID-ANPR mismatches
3. Update violation status
4. Process payments

### Device Management

1. Go to "Devices"
2. Monitor device status
3. View last ping times
4. Identify offline devices

---

## Toll Plaza Operations

### How Toll Collection Works

1. **Vehicle Entry**:
   - RFID tag is scanned at entry point
   - ANPR captures license plate
   - Entry event is created

2. **During Transit**:
   - Vehicle travels on the highway
   - System tracks the journey

3. **Vehicle Exit**:
   - RFID tag is scanned at exit point
   - ANPR captures license plate again
   - System cross-verifies RFID and ANPR data

4. **Payment Processing**:
   - System calculates toll based on:
     - Entry plaza
     - Exit plaza
     - Vehicle class
   - Amount is deducted from account

5. **Violation Detection**:
   - If RFID and ANPR don't match, violation is created
   - Fine is applied to the account

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

- Current balance is displayed on dashboard
- Real-time updates after transactions

### Transaction History

1. Go to "Transactions"
2. View all transactions:
   - Toll deductions
   - Top-ups
   - Refunds
   - Violation payments
3. Filter by date or type
4. Export to CSV

### Update Profile

1. Go to "Account"
2. Click "Edit Profile"
3. Update your information
4. Save changes

---

## Violations

### Understanding Violations

- **RFID-ANPR Mismatch**: Vehicle plate doesn't match RFID tag
- **Insufficient Balance**: Vehicle passed with zero/negative balance
- **Expired Tag**: RFID tag has expired

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
- Check vehicle registration
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
