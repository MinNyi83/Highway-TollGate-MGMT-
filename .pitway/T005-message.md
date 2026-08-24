feat(M001): T005 - Health-check endpoint + Docker Compose

- Create src/routes/health.ts with GET /api/health endpoint
- Update src/app.ts to use health routes
- Create docker-compose.yml with PostgreSQL 16 and Redis 7
- Add healthcheck configurations for both services
