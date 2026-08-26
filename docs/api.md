# Highway Tollgate Management System - API Documentation

## Overview

The Tollgate Management System API provides endpoints for managing toll plazas, vehicles, toll events, payments, fleet management, and more.

**Base URL**: `http://localhost:3000/api`

**Authentication**: Bearer token in Authorization header

---

## Authentication

### Register User
```
POST /api/auth/register
```
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "customerType": "INDIVIDUAL",
  "nrcNumber": "12/ABM(N)123456",
  "companyName": "Company Name",
  "companyRegNo": "REG-123",
  "phone": "09-976543210"
}
```

### Login
```
POST /api/auth/login
```
**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## Vehicles (Admin)

### List Vehicles
```
GET /api/vehicles
```

### Create Vehicle (Admin - Auto APPROVED)
```
POST /api/vehicles
```
**Body** (multipart/form-data):
- `plateNumber` - Required
- `make` - Required
- `model` - Required
- `year` - Required
- `color` - Optional
- `vehicleClass` - Required (MOTORCYCLE, SEDAN, SUV, TRUCK, BUS)
- `rfidTagUid` - Optional
- `vehiclePhoto` - Optional (up to 2 files)
- `wheelTaxCard` - Optional (up to 2 files)

### Update Vehicle
```
PUT /api/vehicles/:id
```

### Delete Vehicle
```
DELETE /api/vehicles/:id
```

### Bind RFID Tag
```
POST /api/vehicles/:id/rfid
```
**Body**:
```json
{
  "tagUid": "E2801160116012345",
  "accountId": "uuid"
}
```

### Unbind RFID Tag
```
DELETE /api/vehicles/:id/rfid/:tagId
```

### Bulk Import from CSV
```
POST /api/vehicles/import/csv
```
**CSV Format**: `plateNumber,make,model,year,color,vehicleClass`

### List Pending Approvals
```
GET /api/vehicles/approvals/pending
```

### Approve Vehicle
```
PATCH /api/vehicles/:id/approve
```

### Reject Vehicle
```
PATCH /api/vehicles/:id/reject
```
**Body**:
```json
{
  "reason": "Invalid plate number"
}
```

---

## Customer Vehicle Registration

### Register Vehicle (PENDING Approval)
```
POST /api/customer/register-vehicle
```
**Body** (multipart/form-data):
- `plateNumber` - Required
- `make` - Required
- `model` - Required
- `year` - Required
- `color` - Optional
- `vehicleClass` - Required
- `vehiclePhoto` - Optional

### List My Vehicles
```
GET /api/customer/my-vehicles
```

### Update My Vehicle
```
PUT /api/customer/my-vehicles/:vehicleId
```

### Delete My Vehicle
```
DELETE /api/customer/my-vehicles/:vehicleId
```

### Get Vehicle Classes
```
GET /api/customer/vehicle-classes
```

---

## Toll Plazas

### List Toll Plazas
```
GET /api/toll-plazas
```

### Create Toll Plaza
```
POST /api/toll-plazas
```
**Body**:
```json
{
  "name": "Yangon Toll Plaza",
  "gateCode": "YGN",
  "locationLat": 16.8661,
  "locationLng": 96.1951,
  "mileMarker": 0,
  "lanes": 8
}
```

### Get Toll Plaza Detail
```
GET /api/toll-plazas/:id
```

### Update Toll Plaza
```
PUT /api/toll-plazas/:id
```

### Delete Toll Plaza
```
DELETE /api/toll-plazas/:id
```

### Get Plaza Rates
```
GET /api/toll-plazas/:id/rates
```

---

## Toll Events

### List Toll Events
```
GET /api/toll-events
```

### Create Entry Event
```
POST /api/toll-events/entry
```
**Body**:
```json
{
  "vehicleId": "uuid",
  "plazaId": "uuid",
  "rfidTagId": "uuid",
  "anprPlate": "ABC-123",
  "laneNumber": "1A",
  "direction": "UP",
  "amount": 1000
}
```

### Complete Exit Event
```
PUT /api/toll-events/:id/exit
```
**Body**:
```json
{
  "anprPlate": "ABC-123"
}
```

---

## Transactions

### List Transactions
```
GET /api/transactions
```

---

## Payments

### List Payment Methods
```
GET /api/payments/methods
```

### Initiate Top-up
```
POST /api/payments/topup
```
**Body**:
```json
{
  "amount": 10000,
  "paymentMethod": "kbzpay"
}
```

### Check Payment Status
```
GET /api/payments/status/:transactionId
```

### Process Refund
```
POST /api/payments/refund
```
**Body**:
```json
{
  "transactionId": "uuid",
  "amount": 5000,
  "reason": "Customer request"
}
```

---

## Account

### Get Account Info
```
GET /api/customer/account
```

### Update Account
```
PUT /api/customer/account
```

### Get Payment History
```
GET /api/customer/transactions
```

---

## Fleet Management (Enterprise)

### Get Fleet Stats
```
GET /api/fleet/stats
```

### List Fleet Vehicles
```
GET /api/fleet/vehicles
```

### Get Trip History
```
GET /api/fleet/trips?page=1&limit=20
```

### Get Spending Report
```
GET /api/fleet/spending?period=daily&startDate=2024-01-01&endDate=2024-01-31
```

---

## Dashboard (Admin)

### Get Dashboard Stats
```
GET /api/dashboard/stats
```

### Get Real-time Metrics
```
GET /api/dashboard/realtime
```

---

## Reports & Excel Export

### Revenue Report
```
GET /api/reports/revenue
```

### Violation Stats
```
GET /api/reports/violations/stats
```

### Export Transactions to Excel
```
GET /api/reports/transactions/excel
```
Returns `.xlsx` file with styled headers.

### Export Violations to Excel
```
GET /api/reports/violations/excel
```

### Export Revenue to Excel
```
GET /api/reports/revenue/excel
```

### Export Events to Excel
```
GET /api/reports/events/excel
```

---

## Violations

### List Violations
```
GET /api/violations
```

### Update Violation
```
PUT /api/violations/:id/status
```
**Body**:
```json
{
  "status": "RESOLVED"
}
```

---

## Device Status

### List Device Status
```
GET /api/device-status
```

---

## Notifications

### List Notifications
```
GET /api/notifications
```

---

## WebSocket Events

### Connect
```javascript
const socket = io('http://localhost:3000');
socket.emit('authenticate', { token: 'your_jwt_token' });
```

### Subscribe to Channels
```javascript
// Admin dashboard
socket.emit('subscribe:dashboard');
socket.on('dashboard:update', (data) => console.log(data));

// Toll events
socket.emit('subscribe:toll-events');
socket.on('toll-event:entry', (event) => console.log(event));

// New vehicle registration
socket.on('new-vehicle-registration', (data) => console.log(data));
```

---

## Error Responses

All errors follow this format:
```json
{
  "error": "Error description"
}
```

**Common HTTP Status Codes**:
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate plate number)
- `429` - Rate Limited
- `500` - Internal Server Error

---

## Rate Limits

- **General API**: 100 requests per minute
- **Auth endpoints**: 10 requests per minute
- **Payment endpoints**: 30 requests per minute
