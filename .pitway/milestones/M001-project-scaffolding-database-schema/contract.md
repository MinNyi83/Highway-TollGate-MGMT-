---
schema_version: 1
id: M001
title: Project Scaffolding & Database Schema
status: completed
requirement: null
confirmed_at: 2026-08-24T13:23:23Z
verification_approved_hash: sha256:58bb9835aa9889efb13fe0e6bd155444a621fb0b9550b1ea900523ca23646391
base_branch: master
base_revision: 94edd0cf9ae55d4a5a1e27aabbebc726bdb8d695
acceptance_criteria:
  - id: AC001
    text: npm workspaces monorepo with packages/backend, packages/frontend,
      packages/simulator initialized.
  - id: AC002
    text: Backend Express + TypeScript project compiles and starts on port 3000.
  - id: AC003
    text: PostgreSQL schema defined via Prisma with all required tables (users,
      accounts, vehicles, rfid_tags, toll_plazas, toll_rates, toll_events,
      transactions, violations, notifications, device_status).
  - id: AC004
    text: Database seed script populates sample data (vehicles, accounts, toll
      plazas, RFID tags).
  - id: AC005
    text: Health-check endpoint returns 200 OK.
  - id: AC006
    text: Docker Compose starts PostgreSQL and Redis containers.
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: npm ls --workspaces
  - id: CT002
    criterion: AC002
    type: command
    command: cd packages/backend && npx tsc --noEmit
  - id: CT003
    criterion: AC003
    type: command
    command: cd packages/backend && npx prisma validate
---

# Contract

## Objective

Set up the foundational project structure for the TollGate RFID Pass system. This milestone establishes the npm workspaces monorepo, backend Express server with TypeScript, PostgreSQL database schema via Prisma ORM, seed data for development, and Docker infrastructure for local development.

## Scope

- Root package.json with npm workspaces configuration
- Backend package: Express.js, TypeScript, Prisma, dotenv, cors, helmet
- Frontend package: Vite + React scaffold (minimal, just project init)
- Simulator package: TypeScript scaffold (minimal, just project init)
- Prisma schema with all 11 database tables
- Seed script with sample vehicles, accounts, toll plazas, RFID tags
- Health-check GET /api/health endpoint
- Docker Compose for PostgreSQL 16 and Redis 7
- .env.example with required environment variables

## Non-Goals

- Full backend API implementation (M002)
- Frontend UI components (M003)
- Simulation logic (M004)
- Production deployment configuration
- CI/CD pipeline

## Change Log

- 2026-08-24: Draft created.
- 2026-08-24: Updated verification commands to use exit-safe checks (tsc, prisma validate, npm ls) instead of server startup commands.
