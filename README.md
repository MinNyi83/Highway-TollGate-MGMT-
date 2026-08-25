# Highway Tollgate Management System

A full-stack highway toll management system with RFID + ANPR integration, built with Express, React, and PostgreSQL.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  PostgreSQL │
│  React/Vite │     │   Express   │     │   Prisma    │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  Simulator  │
                    │   CLI Tool  │
                    └─────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Zustand, Socket.io Client |
| Backend | Express, TypeScript, Prisma ORM, JWT Auth, Socket.io |
| Database | PostgreSQL |
| Simulator | Node.js CLI, Commander.js |
| Workflow | PitWay milestone-based development |

## Project Structure

```
tollgate-rfid-pass/
├── packages/
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── modules/   # Feature modules (auth, vehicles, toll-events, etc.)
│   │   │   ├── middleware/ # Auth middleware
│   │   │   ├── websocket/ # Socket.io gateway
│   │   │   ├── utils/     # JWT utilities
│   │   │   └── __tests__/ # Integration tests
│   │   └── prisma/        # Schema & seed data
│   ├── frontend/          # React dashboard
│   │   └── src/
│   │       ├── pages/     # Dashboard, Vehicles, TollPlazas, etc.
│   │       ├── components/# Layout, Sidebar, NotificationPanel
│   │       ├── stores/    # Zustand auth store
│   │       └── lib/       # API client
│   └── simulator/         # RFID/ANPR simulator CLI
│       └── src/
│           ├── api/       # Backend API client
│           ├── generators/# Vehicle pool generator
│           └── simulation/# Passage, scenarios, stats
├── docs/                  # Milestone contracts & test scripts
└── docker-compose.yml     # PostgreSQL setup
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm

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

API docs: http://localhost:3000/api-docs

### 5. Start Frontend

```bash
cd packages/frontend
npm run dev            # http://localhost:5173
```

### 6. Login

| Email | Password | Role |
|-------|----------|------|
| admin@tollgate.com | admin123 | ADMIN |
| operator@tollgate.com | operator123 | OPERATOR |
| viewer@tollgate.com | viewer123 | VIEWER |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/vehicles` | List vehicles |
| POST | `/api/vehicles` | Create vehicle |
| PUT | `/api/vehicles/:id/rfid` | Bind RFID tag |
| GET | `/api/toll-plazas` | List plazas |
| POST | `/api/toll-plazas` | Create plaza |
| GET | `/api/toll-plazas/:id/rates` | Get plaza rates |
| POST | `/api/toll-events/entry` | Vehicle entry |
| PUT | `/api/toll-events/:id/exit` | Vehicle exit |
| GET | `/api/transactions` | List transactions |
| GET | `/api/violations` | List violations |
| PUT | `/api/violations/:id/status` | Update violation |
| GET | `/api/reports/revenue` | Revenue report |
| GET | `/api/reports/violations/stats` | Violation stats |
| GET | `/api/device-status` | Device status |
| GET | `/api/notifications` | List notifications |

## Simulator

```bash
cd packages/simulator

# Single passage
npm run dev simulate -- --plaza plaza-1 --count 1

# Continuous simulation
npm run dev simulate -- --plaza plaza-1 --count 100 --interval 2000

# Check status
npm run dev status
```

## Database Schema

- **User** - System users with roles (ADMIN, OPERATOR, VIEWER)
- **Account** - User accounts with balance
- **Vehicle** - Registered vehicles with RFID tags
- **TollPlaza** - Toll collection points
- **TollRate** - Rates per vehicle class per plaza
- **TollEvent** - Entry/exit events with ANPR data
- **Transaction** - Balance deductions and top-ups
- **Violation** - ANPR mismatches and unpaid tolls
- **Notification** - System notifications
- **DeviceStatus** - RFID/ANPR device health

## Development

This project uses [PitWay](https://github.com/thixpin/pitway) for milestone-based workflow management.

```bash
pitway resume          # Check current status
pitway verify M001     # Run verification checks
pitway milestone-complete M001  # Complete milestone
```

## License

MIT
