# Agent Instructions

<!-- pitway:managed:start -->
- This project uses [PitWay](https://github.com/thixpin/pitway) to control the engineering workflow.
- Run `pitway resume` before starting or resuming any work.
- Never edit `.pitway/` directly.
- Work only within a confirmed task boundary.
- Obtain a task's bounded context via `pitway task-status <id> --context`.
<!-- pitway:managed:end -->

---

## Development Environment

### Project Structure (Monorepo)
```
Highway-TollGate-MGMT-/
├── packages/
│   ├── backend/          # Express + TypeScript + Prisma (multi-DB)
│   ├── frontend/         # React + Vite (Admin Command Hub)
│   ├── customer-portal/  # React + Vite (Driver PWA)
│   ├── financial-portal/ # React + Vite (Financial System) 🆕
│   ├── shared/           # Shared TypeScript types
│   ├── simulator/        # Canvas toll highway simulator
│   └── plaza-server/     # Raspberry Pi edge server (PostgreSQL)
├── scripts/              # Deployment scripts
├── docker-compose.yml    # Full stack (3 databases + 4 frontends)
├── docker-compose.hq.yml # HQ + Storage stack
└── ARCHITECTURE.md       # System architecture docs
```

### Database Architecture (3 Separate Databases)
```
┌─────────────────────────────────────────────────────────┐
│                    Backend API (port 3000)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   hqPrisma   │  │customerPrisma│  │  plazaPrisma  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
    ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
    │    db      │    │customer-db│    │ plaza-db   │
    │ :5432      │    │ :5433     │    │ :5434     │
    │ tollgate   │    │tollgate_  │    │tollgate_  │
    │            │    │customer   │    │plaza      │
    └────────────┘    └───────────┘    └───────────┘
```

| Database | Port | Tables | Purpose |
|----------|------|--------|---------|
| **HQ** (`tollgate`) | 5432 | vehicles, toll_plazas, toll_rates, toll_events, violations, device_status, audit_logs, vehicle_photos, tenants, regions, daily_collections, monthly_reconciliations, revenue_transfers, official_receipts, financial_audit_logs | Core toll operations + Financial system |
| **Customer** (`tollgate_customer`) | 5433 | users, accounts, rfid_tags, notifications, sms_logs, promo_codes, loyalty_points, webhooks | Customer accounts & wallets |
| **Plaza** (`tollgate_plaza`) | 5434 | plaza_config, sync_queue, sync_status, local_toll_events, device_config | Plaza sync & local events |

### Database Client Import Convention
```typescript
// HQ Database - vehicles, toll events, violations, devices, reports
import { hqPrisma } from '../../config/database';

// Customer Database - users, accounts, wallets, notifications
import { customerPrisma } from '../../config/database';

// Plaza Database - sync queue, plaza config, local events
import { plazaPrisma } from '../../config/database';

// Default (backward compat) - same as hqPrisma
import prisma from '../../config/database';
```

### Build & Test Commands
```bash
# Build backend
cd packages/backend && npm run build

# Build frontend
cd packages/frontend && npm run build

# Build customer portal
cd packages/customer-portal && npm run build

# Run tests
npm test --workspace=@tollgate/backend

# Type check
cd packages/backend && npx tsc --noEmit
cd packages/frontend && npx tsc --noEmit

# Generate Prisma client (HQ - default)
cd packages/backend && npx prisma generate

# Generate Prisma client (Customer DB)
cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@localhost:5433/tollgate_customer npx prisma generate --schema=prisma/schema.customer.prisma

# Generate Prisma client (Plaza DB)
cd packages/backend && DATABASE_URL=postgresql://postgres:postgres@localhost:5434/tollgate_plaza npx prisma generate --schema=prisma/schema.plaza.prisma

# Create migration (HQ)
cd packages/backend && npx prisma migrate dev --name <migration_name>

# Deploy migrations (all databases)
cd packages/backend && npx prisma migrate deploy
```

### Docker Commands
```bash
# Full stack build and launch
docker compose up -d --build

# Check container health
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# View backend logs
docker logs tollgate-rfid-backend-1 --tail 50

# Restart a single service
docker compose restart backend

# Rebuild a single service
docker compose up -d --build backend

# Rebuild frontend with updated presentation
docker compose up -d --build frontend
```

### Remote Server Deployment (Kali Linux)
```bash
# SSH into server
ssh nyimin@192.168.100.101  # password: 1512

# Fix DNS if resolution fails
echo 1512 | sudo -S sh -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf'

# Pull latest and rebuild
cd ~/TollGate-RFID
git pull origin master
echo 1512 | sudo -S docker compose up -d --build

# Verify all containers healthy
docker ps --format 'table {{.Names}}\t{{.Status}}'

# Run DB migrations
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 sh -c 'cd packages/backend && npx prisma migrate deploy'

# Check health endpoints
curl -s http://localhost:3000/api/health | python3 -m json.tool
curl -s http://localhost:3000/api/health/live
curl -s http://localhost:3000/api/health/ready
```

### Health Endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | No | Full health: DB status, latency, memory, CPU |
| `/api/health/live` | GET | No | Liveness probe (always 200 if process alive) |
| `/api/health/ready` | GET | No | Readiness probe (200 if DB connected) |
| `/api/health/metrics` | GET | Yes | Detailed metrics: DB counts, storage, uptime |
| `/api/health/detailed` | GET | Yes | Same as metrics (legacy alias) |
| `/api/health/backup` | GET | Yes | Full DB backup as JSON download |

### Financial System Endpoints
| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/financial/regions` | GET | Yes | List all Myanmar regions |
| `/api/financial/daily-collection` | GET | Yes | Daily collection statements |
| `/api/financial/revenue/by-region` | GET | Yes | Toll revenue by region |
| `/api/financial/topup/by-region` | GET | Yes | Wallet deposits by region |
| `/api/financial/vehicles/by-region` | GET | Yes | Vehicle registration by region |
| `/api/financial/toll-usage/:plazaId` | GET | Yes | Per-plaza pass-through volume |
| `/api/financial/settlement` | GET | Yes | Revenue remittance list |
| `/api/financial/reconciliation` | GET | Yes | Monthly financial reconciliation |
| `/api/financial/receipts` | GET | Yes | Official receipts |
| `/api/financial/fiscal-year/summary` | GET | Yes | Fiscal year report |

### API Documentation
- Swagger UI: `http://<HOST>:3000/api-docs`
- OpenAPI JSON: `http://<HOST>:3000/api-docs.json`

### Rate Limiting
| Scope | Limit | Window | Effect |
|---|---|---|---|
| Auth (login/register) | 10 requests | 15 minutes | Returns 429 |
| Global (all endpoints) | 100 requests | 1 minute | Returns 429 |
| Strict (sensitive ops) | 5 requests | 1 hour | Returns 429 |

### Code Conventions
- **Backend**: TypeScript, Express, Prisma ORM, Zod validation
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Error format**: `{ success: false, error: string, code: string, details?: any }`
- **Success format**: `{ success: true, data: any }` or direct payload
- **Auth**: JWT Bearer token in Authorization header
- **Validation**: Zod schemas in `packages/backend/src/validation/schemas.ts`
- **Database indexes**: Defined in Prisma schema with `@@index` directive

### Troubleshooting
| Issue | Fix |
|---|---|
| DB connection refused | Check container health: `docker ps` |
| Rate limit 429 error | Wait for window to reset or check `NODE_ENV=test` skips |
| CORS error | Check `CORS_ORIGINS` env var or allowed origins in `app.ts` |
| Prisma client outdated | Run `npx prisma generate` |
| Migration not applied | Run `npx prisma migrate deploy` |
| Frontend 404 on reload | Check nginx conf has SPA fallback (`try_files`) |
| Presentation not updated | Rebuild frontend: `docker compose up -d --build frontend` |
