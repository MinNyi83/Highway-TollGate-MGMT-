# Highway Tollgate Management System

A full-stack highway toll management system with RFID + ANPR integration, built with Express, React, and PostgreSQL.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL  │
│ React/Vite   │     │   Express    │     │   Prisma     │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴───────┐   ┌───────┴───────┐   ┌───────┴───────┐
│   Simulator   │   │  Customer     │   │  Branch       │
│   CLI Tool    │   │  Portal       │   │  Server       │
└───────────────┘   └───────────────┘   └───────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts |
| Customer Portal | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Express, TypeScript, Prisma ORM, JWT Auth, Socket.io |
| Database | PostgreSQL |
| Simulator | Node.js CLI, Commander.js, Holiday Traffic Simulation |
| Deployment | Docker Compose |

## Project Structure

```
tollgate-rfid-pass/
├── packages/
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── modules/   # Feature modules (auth, vehicles, toll-events, reports, etc.)
│   │   │   ├── middleware/ # Auth, upload, rate-limiting
│   │   │   ├── websocket/ # Socket.io gateway
│   │   │   └── utils/     # JWT utilities
│   │   └── prisma/        # Schema & migrations
│   ├── frontend/          # Admin dashboard
│   │   └── src/pages/     # Dashboard, Vehicles, TollPlazas, Reports, Simulator, etc.
│   ├── customer-portal/   # Customer-facing portal
│   │   └── src/pages/     # Dashboard, MyVehicles, TollHistory, Account, TopUp
│   ├── simulator/         # RFID/ANPR simulator CLI
│   │   └── src/
│   │       ├── simulation/# Passage, scenarios, holiday traffic
│   │       └── generators/# Vehicle pool, route generation
│   └── shared/            # Shared types
├── docs/                  # API docs, user guide, architecture
└── docker-compose.yml     # Full stack deployment
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### 1. Start Database

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

```bash
cd packages/backend
npm run db:generate    # Generate Prisma client
npm run db:migrate     # Run migrations
npm run db:seed        # Seed test data
```

### 4. Start Backend

```bash
cd packages/backend
npm run dev            # http://localhost:3000
```

### 5. Start Frontend

```bash
cd packages/frontend
npm run dev            # http://localhost:5173
```

### 6. Start Customer Portal

```bash
cd packages/customer-portal
npm run dev            # http://localhost:8080
```

### 7. Login

| Email | Password | Role |
|-------|----------|------|
| admin@tollgate.com | admin123 | ADMIN |
| operator@tollgate.com | operator123 | OPERATOR |
| viewer@tollgate.com | viewer123 | VIEWER |

## API Endpoints

### Auth & Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/users` | List users (admin) |

### Vehicles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/vehicles` | List vehicles |
| POST | `/api/vehicles` | Create vehicle (admin) |
| PUT | `/api/vehicles/:id` | Update vehicle |
| DELETE | `/api/vehicles/:id` | Delete vehicle |
| POST | `/api/vehicles/:id/rfid` | Bind RFID tag |
| DELETE | `/api/vehicles/:id/rfid/:tagId` | Unbind RFID tag |
| POST | `/api/vehicles/import/csv` | Bulk import from CSV |
| GET | `/api/vehicles/approvals/pending` | List pending approvals |
| PATCH | `/api/vehicles/:id/approve` | Approve vehicle |
| PATCH | `/api/vehicles/:id/reject` | Reject vehicle |

### Toll Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/toll-plazas` | List plazas |
| POST | `/api/toll-plazas` | Create plaza |
| PUT | `/api/toll-plazas/:id` | Update plaza |
| DELETE | `/api/toll-plazas/:id` | Delete plaza |
| POST | `/api/toll-events/entry` | Vehicle entry |
| PUT | `/api/toll-events/:id/exit` | Vehicle exit |
| GET | `/api/toll-events` | List toll events |

### Transactions & Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions |
| GET | `/api/violations` | List violations |
| PUT | `/api/violations/:id/status` | Update violation |
| GET | `/api/reports/revenue` | Revenue report |
| GET | `/api/reports/violations/stats` | Violation stats |
| GET | `/api/reports/transactions/excel` | Export transactions Excel |
| GET | `/api/reports/violations/excel` | Export violations Excel |
| GET | `/api/reports/revenue/excel` | Export revenue Excel |
| GET | `/api/reports/events/excel` | Export events Excel |

### Customer Portal

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customer/register-vehicle` | Register vehicle (PENDING approval) |
| GET | `/api/customer/my-vehicles` | List my vehicles |
| PUT | `/api/customer/my-vehicles/:id` | Update vehicle |
| DELETE | `/api/customer/my-vehicles/:id` | Delete vehicle |
| POST | `/api/payments/topup` | Top up account |

### Device & System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/device-status` | Device status |
| GET | `/api/notifications` | List notifications |

## Simulator

### Normal Simulation

```bash
cd packages/simulator

# Single vehicle passage
npx tsx src/cli.ts simulate -s normal -c 1

# Continuous simulation
npx tsx src/cli.ts simulate -s normal -c 10 -i 2000

# No RFID scenario
npx tsx src/cli.ts simulate -s no-rfid -c 5

# ANPR mismatch scenario
npx tsx src/cli.ts simulate -s anpr-mismatch -c 5
```

### Holiday Traffic Simulation

```bash
# Thingyan (Water Festival) - 4x traffic, high congestion
npx tsx src/cli.ts holiday -t thingyan -c 20

# Thadingyut (Festival of Lights) - 2x traffic
npx tsx src/cli.ts holiday -t thadingyut -c 15

# Weekend traffic
npx tsx src/cli.ts holiday -t weekend -c 10

# Independence/Union Day
npx tsx src/cli.ts holiday -t independence-day -c 15
```

| Holiday Type | Traffic Multiplier | Congestion | Violation Rate |
|---|---|---|---|
| thingyan | 4x | High | 25% |
| thadingyut | 2x | Medium | 15% |
| weekend | 1.5x | Low | 10% |
| independence-day | 2.5x | Medium | 18% |
| normal-day | 1x | Low | 5% |

### Traffic Waves (Simulated Day)

- 5AM-6AM: Early birds
- 6AM-9AM: Morning rush (exiting city)
- 10AM-3PM: Midday steady flow
- 4PM-8PM: Evening rush (returning home)
- 9PM-5AM: Night low traffic

## Database Schema

- **User** - System users with roles (ADMIN, OPERATOR, VIEWER, CUSTOMER)
- **Account** - User accounts with balance
- **Vehicle** - Registered vehicles with approval status (PENDING/APPROVED/REJECTED)
- **RFIDTag** - RFID tags bound to vehicles
- **TollPlaza** - Toll collection points with gate codes
- **TollRate** - Rates per vehicle class per plaza
- **TollEvent** - Entry/exit events with ANPR data, lane numbers, direction
- **Transaction** - Balance deductions and top-ups with payment method
- **Violation** - ANPR mismatches and unpaid tolls
- **Notification** - System notifications
- **DeviceStatus** - RFID/ANPR device health
- **PromoCode** - Discount promo codes
- **LoyaltyPoints** - Customer loyalty points
- **Webhook** - Webhook integrations
- **VehiclePhoto** - Vehicle photo storage
- **Tenant** - Multi-tenant support

## Vehicle Approval Workflow

1. Customer registers vehicle via Customer Portal → Status: **PENDING**
2. Admin reviews in Vehicles → **Pending Approval** tab
3. Admin clicks **Approve** or **Reject** (with reason)
4. Customer sees updated status badge (✓ Approved / ✗ Rejected)

## Deployment (Ubuntu)

```bash
# On Ubuntu laptop (192.168.100.101)
cd ~/TollGate-RFID
git pull origin master
docker compose up -d --build

# Run Prisma migration
cd packages/backend
npx prisma migrate dev --name migration_name
```

## Excel Export

Reports page includes Excel export with styled headers:
- Transactions (amount, type, status, account, vehicle)
- Violations (type, status, amount, plate, vehicle, plaza)
- Revenue by plaza (plaza, vehicle class, count, revenue)
- Toll events (plate, vehicle, plaza, lane, direction, amount)

## License

MIT
