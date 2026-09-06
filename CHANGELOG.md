# Changelog

All notable changes to the TollGate RFID Pass system are documented here.

## [1.1.0] - 2026-09-06

### Security
- Enhanced rate limiting: separate limits for auth (10/15min), global (100/min), strict (5/hr)
- CORS restricted to allowed origins with configurable CORS_ORIGINS env var
- Helmet.js with CSP enabled in production
- JWT secret now uses environment variable
- Consistent error responses with success flag, error code, and details

### Performance
- Added database indexes for high-query columns:
  - Vehicles: plateNumber, status, approvalStatus, vehicleClass, createdAt
  - Accounts: userId, status, customerType
  - Toll Events: vehicleId, plazaId, entryTime, status, anprPlate
  - Transactions: accountId, eventId, status, type, createdAt
  - Violations: vehicleId, eventId, status, violationType, createdAt
- Docker health checks for all services
- PostgreSQL connection pooling via Prisma

### API
- Vehicle search with text search across plateNumber, make, model
- Vehicle filtering by status, vehicleClass, approvalStatus
- Pagination support with page/limit parameters
- Enhanced Zod validation schemas with detailed error messages
- Password change validation (uppercase, lowercase, number, min 8 chars)
- Consistent API response format with success flag

### Health & Monitoring
- New `/api/health/live` endpoint (liveness probe)
- New `/api/health/ready` endpoint (readiness probe)
- New `/api/health/metrics` endpoint with formatted uptime
- Database latency measurement in health check
- Health status returns 503 when database is disconnected
- API documentation at `/api-docs` with enhanced Swagger UI

### DevOps
- Docker Compose health checks for all services
- Service dependency ordering with `condition: service_healthy`
- Redis health check in HQ configuration
- Storage server health check
- Start period configuration for slow-starting services

### Code Quality
- Consistent error handler with success flag and error codes
- Auth middleware returns structured error responses
- Validation middleware for request body and query parameters
- Rate limiter skip in test environment

## [1.0.0] - 2026-09-05

### Initial Release
- Highway toll management system with RFID + ANPR integration
- Admin dashboard with Command Hub UI
- Customer portal with balance management
- Fleet management portal
- Toll plaza management
- Vehicle registration and approval workflow
- Payment gateway integration (KBZ Pay, Wave Money, MMQR)
- Violation management system
- Report generation with Excel export
- Dark mode support
- Responsive design
- Docker containerization
- Distributed architecture support (HQ + Plaza servers)
