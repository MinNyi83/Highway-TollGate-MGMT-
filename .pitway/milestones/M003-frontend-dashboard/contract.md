---
schema_version: 1
id: M003
title: Frontend Dashboard
status: completed
requirement: null
confirmed_at: 2026-08-24T23:26:24Z
verification_approved_hash: sha256:7e8f874babcb10a4823e7f5cfddbc3bc1275ade7396e9be3c1e629e62376d7dd
base_branch: pitway/M002-backend-api-core
base_revision: f84580483297732e69967027043b886ecb07c569
acceptance_criteria:
  - id: AC001
    text: Vite + React project compiles and starts on port 5173.
  - id: AC002
    text: Login page with JWT token storage and auth guard.
  - id: AC003
    text: Responsive sidebar layout with navigation.
  - id: AC004
    text: Dashboard overview with stats cards and charts.
  - id: AC005
    text: Vehicles list with search, filter, create, and RFID binding.
  - id: AC006
    text: Toll Plaza management with rate configuration.
  - id: AC007
    text: Real-time toll events feed via WebSocket.
  - id: AC008
    text: Transactions history with filters.
  - id: AC009
    text: Violation management with status workflow.
  - id: AC010
    text: Notifications panel with real-time badge.
  - id: AC011
    text: Reports page with date range filters and Recharts.
  - id: AC012
    text: Device status dashboard per plaza.
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: cd packages/frontend && npx tsc --noEmit
  - id: CT002
    criterion: AC001
    type: command
    command: cd packages/frontend && npx vite build
---

# Contract

## Objective

Build a React admin dashboard for the TollGate RFID Pass system. The dashboard provides a user-friendly interface for managing vehicles, toll plazas, monitoring toll events in real-time, reviewing transactions, handling violations, and viewing reports.

## Scope

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui components
- React Router for navigation
- TanStack Query for data fetching
- Zustand for auth state
- Recharts for charts
- Socket.io-client for real-time updates
- Login page with JWT auth
- Dashboard overview with stats and charts
- Vehicles management with RFID binding
- Toll Plaza management with rates
- Real-time toll events feed
- Transactions history
- Violation management
- Notifications panel
- Reports with charts
- Device status dashboard

## Non-Goals

- Simulator (M004)
- Integration tests (M005)
- Production deployment

## Change Log

- 2026-08-25: Draft created.
