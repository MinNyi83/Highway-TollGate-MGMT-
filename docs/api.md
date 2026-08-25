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
  "customerType": "INDIVIDUAL", // or "ENTERPRISE"
  "nrcNumber": "12/ABM(N)123456", // for individual
  "companyName": "Company Name", // for enterprise
  "companyRegNo": "REG-123", // for enterprise
  "phone": "09-976543210"
}
```
**Response**:
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "CUSTOMER"
  }
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
**Response**:
```json
{
  "accessToken": "jwt_token_here"
}
```

---

## Vehicles

### List Vehicles
```
GET /api/vehicles
```
**Response**:
```json
[
  {
    "id": "uuid",
    "plateNumber": "ABC-123",
    "make": "Toyota",
    "model": "Camry",
    "year": 2024,
    "vehicleClass": "SEDAN"
  }
]
```

### Add Vehicle
```
POST /api/vehicles
```
**Body**:
```json
{
  "plateNumber": "ABC-123",
  "rfidTag": "RF123456789",
  "vehicleClass": "SEDAN",
  "make": "Toyota",
  "model": "Camry",
  "year": 2024
}
```

---

## Toll Plazas

### List Toll Plazas
```
GET /api/toll-plazas
```
**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Mandalay Toll Plaza",
    "locationLat": 21.9588,
    "locationLng": 96.0891,
    "lanes": 6,
    "status": "ACTIVE",
    "tollRates": [
      {
        "id": "uuid",
        "vehicleClass": "SEDAN",
        "rateAmount": 2000
      }
    ]
  }
]
```

### Create Toll Plaza
```
POST /api/toll-plazas
```
**Body**:
```json
{
  "name": "Yangon Toll Plaza",
  "locationLat": 16.8661,
  "locationLng": 96.1951,
  "lanes": 8
}
```

### Update Toll Plaza
```
PUT /api/toll-plazas/:id
```
**Body**:
```json
{
  "status": "MAINTENANCE",
  "lanes": 4
}
```

---

## Toll Events

### List Toll Events
```
GET /api/toll-events
```
**Response**:
```json
[
  {
    "id": "uuid",
    "vehicleId": "uuid",
    "plazaId": "uuid",
    "status": "COMPLETED",
    "entryTime": "2024-01-15T10:30:00Z",
    "exitTime": "2024-01-15T11:00:00Z",
    "vehicle": { "plateNumber": "ABC-123" },
    "plaza": { "name": "Mandalay Toll Plaza" }
  }
]
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
  "rfidTagId": "uuid", // optional
  "anprPlate": "ABC-123" // optional
}
```

### Complete Exit Event
```
POST /api/toll-events/exit
```
**Body**:
```json
{
  "eventId": "uuid",
  "anprPlate": "ABC-123" // optional
}
```

---

## Payments

### List Payment Methods
```
GET /api/payments/methods
```
**Response**:
```json
[
  {
    "id": "kbzpay",
    "name": "KBZ Pay",
    "description": "Pay with KBZ Pay",
    "configured": true,
    "supported": true
  }
]
```

### Initiate Top-up
```
POST /api/payments/topup
```
**Body**:
```json
{
  "amount": 10000,
  "paymentMethod": "kbzpay" // or "wavepay", "mmqr", "manual"
}
```
**Response**:
```json
{
  "success": true,
  "transactionId": "uuid",
  "orderId": "uuid",
  "amount": 10000,
  "qrCode": "base64_qr_code", // for QR payments
  "paymentUrl": "https://...", // for redirect payments
  "balance": 50000 // for manual top-up
}
```

### Check Payment Status
```
GET /api/payments/status/:transactionId
```
**Response**:
```json
{
  "status": "completed",
  "transactionId": "uuid",
  "amount": 10000,
  "createdAt": "2024-01-15T10:30:00Z"
}
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
**Response**:
```json
{
  "id": "uuid",
  "accountNumber": "TOLL-2024-000001",
  "accountType": "PREPAID",
  "balance": 50000,
  "status": "ACTIVE",
  "customerType": "INDIVIDUAL"
}
```

### Update Account
```
PUT /api/customer/account
```
**Body**:
```json
{
  "name": "John Doe Updated",
  "phone": "09-976543211"
}
```

### Get Payment History
```
GET /api/customer/transactions
```
**Response**:
```json
{
  "transactions": [
    {
      "id": "uuid",
      "amount": 2000,
      "type": "TOLL_DEDUCTION",
      "status": "COMPLETED",
      "createdAt": "2024-01-15T10:30:00Z",
      "tollEvent": { "plaza": { "name": "Mandalay Toll Plaza" } }
    }
  ]
}
```

---

## Fleet Management (Enterprise)

### Get Fleet Stats
```
GET /api/fleet/stats
```
**Response**:
```json
{
  "totalVehicles": 25,
  "activeVehicles": 22,
  "totalTrips": 1250,
  "totalRevenue": 2500000,
  "totalViolations": 3
}
```

### List Fleet Vehicles
```
GET /api/fleet/vehicles
```
**Response**:
```json
[
  {
    "id": "uuid",
    "plateNumber": "FLEET-001",
    "make": "Toyota",
    "model": "HiAce",
    "vehicleClass": "BUS"
  }
]
```

### Get Trip History
```
GET /api/fleet/trips?page=1&limit=20
```
**Response**:
```json
{
  "events": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1250,
    "totalPages": 63
  }
}
```

### Get Spending Report
```
GET /api/fleet/spending?period=daily&startDate=2024-01-01&endDate=2024-01-31
```
**Response**:
```json
{
  "period": "daily",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "totalSpending": 2500000,
  "transactionCount": 500,
  "spendingByVehicle": [
    {
      "vehicleId": "uuid",
      "plateNumber": "FLEET-001",
      "tripCount": 45,
      "totalSpent": 90000
    }
  ]
}
```

---

## Dashboard (Admin)

### Get Dashboard Stats
```
GET /api/dashboard/stats
```
**Response**:
```json
{
  "totalRevenue": 50000000,
  "activeUsers": 1250,
  "totalTrips": 25000,
  "systemStatus": "OPERATIONAL"
}
```

### Get Real-time Metrics
```
GET /api/dashboard/realtime
```
**Response**:
```json
{
  "currentHourTrips": 150,
  "currentHourRevenue": 300000,
  "activeVehicles": 250,
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

---

## Violations

### List Violations
```
GET /api/violations
```
**Response**:
```json
[
  {
    "id": "uuid",
    "vehicleId": "uuid",
    "violationType": "RFID_ANPR_MISMATCH",
    "fineAmount": 5000,
    "status": "PENDING",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

### Update Violation
```
PUT /api/violations/:id
```
**Body**:
```json
{
  "status": "RESOLVED",
  "paidAmount": 5000
}
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
socket.on('dashboard:update', (data) => {
  console.log('Dashboard updated:', data);
});

// Toll events
socket.emit('subscribe:toll-events');
socket.on('toll-event:entry', (event) => {
  console.log('New entry:', event);
});

// Vehicle tracking
socket.emit('subscribe:vehicle', { vehicleId: 'uuid' });
socket.on('vehicle:update', (update) => {
  console.log('Vehicle update:', update);
});
```

---

## Error Responses

All errors follow this format:
```json
{
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

**Common Error Codes**:
- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `VALIDATION_ERROR` - Invalid request data
- `CONFLICT` - Resource already exists
- `RATE_LIMITED` - Too many requests

---

## Rate Limits

- **General API**: 100 requests per minute
- **Auth endpoints**: 10 requests per minute
- **Payment endpoints**: 30 requests per minute

---

## Pagination

All list endpoints support pagination:
```
GET /api/resource?page=1&limit=20
```

**Response includes**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
