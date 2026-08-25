---
schema_version: 1
id: M004
title: RFID/ANPR Simulator
status: draft
requirement: null
confirmed_at: null
verification_approved_hash: null
acceptance_criteria:
  - id: AC001
    text: CLI starts with tollgate-simulator command.
  - id: AC002
    text: Single passage simulation (entry + exit).
  - id: AC003
    text: Continuous simulation with configurable interval.
  - id: AC004
    text: Vehicle pool generation with random plates and RFID tags.
  - id: AC005
    text: Configurable scenarios (normal, no-RFID, mismatch, insufficient balance).
  - id: AC006
    text: Real-time stats display during simulation.
  - id: AC007
    text: API integration with backend toll-events endpoints.
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: cd packages/simulator && npx tsc --noEmit
---

# Contract

## Objective

Build a CLI tool that simulates realistic vehicle passages at toll plazas. The simulator generates random vehicles, simulates RFID reads and ANPR plate scans, and communicates with the backend API to create toll events.

## Scope

- Node.js + TypeScript CLI
- Commander for command parsing
- Axios for API communication
- Chalk for colored output
- Configurable simulation scenarios
- Single passage and continuous modes
- Vehicle pool generation
- Real-time stats display

## Non-Goals

- Frontend integration (M005)
- Production deployment
- Hardware integration

## Change Log

- 2026-08-25: Draft created.
