---
schema_version: 1
id: M005
title: Full Integration & Testing
status: completed
requirement: null
confirmed_at: 2026-08-25T01:04:54Z
verification_approved_hash: sha256:5c59133153f21c1dc0ac51d8e946e50801828c4f87631d479e68fd6b892a54ed
base_branch: pitway/M004-rfid-anpr-simulator
base_revision: b4fa0432bb281ca2f25926516cc0e406fc99f0c4
acceptance_criteria:
  - id: AC001
    text: Integration test environment configured.
  - id: AC002
    text: Auth flow test (register, login, access protected routes, refresh token).
  - id: AC003
    text: Vehicle + RFID flow test (create vehicle, bind RFID, simulate passage,
      verify event).
  - id: AC004
    text: Toll event + transaction flow test (entry, exit, auto-deduction, verify
      balance).
  - id: AC005
    text: Violation flow test (ANPR mismatch, violation created, status update).
  - id: AC006
    text: WebSocket integration test (connect, join plaza, verify real-time events).
  - id: AC007
    text: End-to-end manual test script.
  - id: AC008
    text: Seed data verification (run seed, verify all endpoints return data).
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: cd packages/backend && npx tsc --noEmit
---

# Contract

## Objective

Wire simulator, backend, and frontend together and verify end-to-end flows with integration tests. This milestone ensures all components work together correctly.

## Scope

- Integration test setup
- End-to-end flow tests
- WebSocket integration tests
- Seed data verification
- Manual test script

## Non-Goals

- Performance/load testing
- Security penetration testing
- Production deployment

## Change Log

- 2026-08-25: Draft created.
