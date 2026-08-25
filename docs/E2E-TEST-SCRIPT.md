# TollGate RFID Pass - End-to-End Test Script

## Prerequisites
- Backend server running on http://localhost:3000
- Database seeded with test data
- Docker running (for PostgreSQL)

## Test Steps

### 1. Authentication Flow
1. Register a new user
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","name":"Test User","role":"ADMIN"}'
   ```
   Expected: 201 Created with user data

2. Login with credentials
   ```bash
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```
   Expected: 200 OK with accessToken and refreshToken

3. Access protected route
   ```bash
   curl http://localhost:3000/api/users/me \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with user data

### 2. Vehicle Management
1. Create a vehicle
   ```bash
   curl -X POST http://localhost:3000/api/vehicles \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"plateNumber":"ABC-1234","rfidTag":"rf1234567890","vehicleClass":"SEDAN","make":"Toyota","model":"Camry","year":2024,"color":"White"}'
   ```
   Expected: 201 Created

2. List vehicles
   ```bash
   curl http://localhost:3000/api/vehicles \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with vehicle list

### 3. Toll Event Simulation
1. Create toll event entry
   ```bash
   curl -X POST http://localhost:3000/api/toll-events/entry \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"vehiclePlateNumber":"ABC-1234","rfidTag":"rf1234567890","plazaId":"plaza-1","vehicleClass":"SEDAN","anprPlateNumber":"ABC-1234"}'
   ```
   Expected: 201 Created with event ID

2. Complete toll event exit
   ```bash
   curl -X PUT http://localhost:3000/api/toll-events/<event-id>/exit \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"plazaId":"plaza-1","anprPlateNumber":"ABC-1234"}'
   ```
   Expected: 200 OK with transaction details

### 4. Transaction Verification
1. List transactions
   ```bash
   curl http://localhost:3000/api/transactions \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with transaction list

2. Check account balance
   ```bash
   curl http://localhost:3000/api/accounts/me \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with balance

### 5. Violation Check
1. List violations
   ```bash
   curl http://localhost:3000/api/violations \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with violation list

### 6. Reports
1. Get revenue report
   ```bash
   curl "http://localhost:3000/api/reports/revenue?startDate=2024-01-01&endDate=2024-12-31" \
     -H "Authorization: Bearer <token>"
   ```
   Expected: 200 OK with revenue data

## Expected Results
- All API calls return appropriate status codes
- Transaction creates correct toll amount
- Account balance updates correctly
- Violations detected for ANPR mismatches
- Reports show aggregated data

## Notes
- Replace `<token>` with actual JWT token from login
- Replace `<event-id>` with actual event ID from entry
- Ensure database is seeded before running tests
