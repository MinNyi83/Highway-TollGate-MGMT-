---
schema_version: 1
id: M001
title: Project Scaffolding & Database Schema
status: draft
requirement: null
confirmed_at: null
verification_approved_hash: null
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
    command: npm run dev
  - id: CT002
    criterion: AC002
    type: command
    command: npx prisma migrate dev --name init
  - id: CT003
    criterion: AC003
    type: command
    command: npx prisma db seed
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
