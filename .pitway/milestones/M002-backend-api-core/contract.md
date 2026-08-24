---
schema_version: 1
id: M002
title: Backend API Core
status: completed
requirement: null
confirmed_at: 2026-08-24T22:07:04Z
verification_approved_hash: sha256:b297c3fdd8adda565d81b3e9729dbab9f3d775fd094e96a48f1b23721fdd91fe
base_branch: pitway/M001-project-scaffolding-database-schema
base_revision: 1e3093080b8da9f53250503d36e664ce4b77ac7a
acceptance_criteria:
  - id: AC001
    text: JWT auth module with register, login, refresh token, and auth middleware.
  - id: AC002
    text: User and Account CRUD endpoints with balance top-up.
  - id: AC003
    text: Vehicle CRUD with RFID tag binding/unbinding.
  - id: AC004
    text: Toll Plaza and Toll Rate management endpoints.
  - id: AC005
    text: Toll Event processing with RFID/ANPR cross-verification logic.
  - id: AC006
    text: Transaction engine with automatic toll deduction on event completion.
  - id: AC007
    text: Violation management with status workflow.
  - id: AC008
    text: Notification system with in-app storage and WebSocket broadcast.
  - id: AC009
    text: Device status management with heartbeat tracking.
  - id: AC010
    text: Reporting endpoints for revenue, traffic, and violations.
  - id: AC011
    text: OpenAPI/Swagger documentation available at /api-docs.
  - id: AC012
    text: WebSocket gateway for real-time event broadcasting.
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: cd packages/backend && npx tsc --noEmit
  - id: CT002
    criterion: AC005
    type: command
    command: cd packages/backend && npx tsc --noEmit
---

# Contract

## Objective

Build the complete REST API backend for the TollGate system. This milestone implements all core business logic: authentication, CRUD operations for all entities, toll event processing with RFID/ANPR cross-verification, automatic transaction deduction, violation management, real-time WebSocket notifications, and OpenAPI documentation.

## Scope

- Auth module: register, login, refresh token, JWT middleware
- User/Account management: CRUD, balance top-up, account status
- Vehicle management: CRUD, RFID tag binding/unbinding
- Toll Plaza + Toll Rate management: CRUD
- Toll Event processing: entry/exit recording, RFID/ANPR cross-match
- Transaction engine: auto-deduction, balance check, insufficient funds
- Violation management: create, status workflow, escalation
- Notification system: in-app notifications, WebSocket broadcast
- Device status management: heartbeat endpoint, status tracking
- Reporting: revenue summary, traffic flow, violation stats
- OpenAPI/Swagger documentation
- WebSocket gateway (Socket.io): authenticated real-time events

## Non-Goals

- Frontend dashboard (M003)
- Simulation engine (M004)
- Production deployment
- Email/SMS notification delivery (just in-app storage)

## Change Log

- 2026-08-24: Draft created.
