---
schema_version: 1
id: M008
title: System-Wide UI/UX Upgrade - Error Boundaries, Toast Notifications,
  Skeleton Loading, Accessibility
status: in_progress
requirement: R000
confirmed_at: 2026-09-10T16:10:05Z
verification_approved_hash: sha256:da23f1aae270715f214009ca9b4585a05ba8b7ec9a7c2f93de93b6a234508e1c
base_branch: master
base_revision: fee00e768e88aa3f5ee98ed09ccfbb47722de546
acceptance_criteria:
  - id: AC001
    text: Error Boundary component added to all 3 portals (frontend,
      customer-portal, financial-portal)
  - id: AC002
    text: Toast notification system added to admin and financial portals; activated
      in customer portal
  - id: AC003
    text: Skeleton loading states added to all portals, replacing bare "Loading..."
      text
  - id: AC004
    text: isError handling added to all useQuery calls across all portals
  - id: AC005
    text: Dead code cleaned up (unused deps, unused components activated or removed)
  - id: AC006
    text: i18n bypass fixed in 14 financial portal pages
  - id: AC007
    text: Accessibility improvements (ARIA labels, focus trapping, keyboard nav)
  - id: AC008
    text: Design consistency standardized (glass-card, DataTable usage)
  - id: AC009
    text: All changes deployed to Kali Linux server
  - id: AC010
    text: Documentation updated (SKILL.md, README.md, USER_GUIDE.md)
verification:
  - id: CT001
    criterion: AC001
    type: command
    command: grep -rq 'ErrorBoundary' packages/frontend/src/
      packages/customer-portal/src/ packages/financial-portal/src/
  - id: CT002
    criterion: AC002
    type: command
    command: grep -rq 'showToast\|ToastContainer' packages/frontend/src/
      packages/customer-portal/src/ packages/financial-portal/src/
  - id: CT003
    criterion: AC003
    type: command
    command: grep -rq 'Skeleton\|skeleton' packages/frontend/src/pages/
      packages/customer-portal/src/pages/ packages/financial-portal/src/pages/
  - id: CT004
    criterion: AC004
    type: command
    command: grep -r 'isError' packages/financial-portal/src/pages/ | head -5
  - id: CT005
    criterion: AC005
    type: command
    command: "! grep -q '@types/leaflet' packages/frontend/package.json"
  - id: CT006
    criterion: AC009
    type: command
    command: curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/health
      | grep -q 200
  - id: CT007
    criterion: AC010
    type: command
    command: test -f README.md && test -f USER_GUIDE.md && test -f
      .agents/skills/tollgate-operations/SKILL.md
---

## Objective

System-wide UI/UX upgrade across all 3 portals: Admin Frontend, Customer Portal, and Financial Portal. Add Error Boundaries, Toast Notifications, Skeleton Loading, fix dead code, improve accessibility, and standardize design.

## Scope

- Add reusable ErrorBoundary component to all 3 portals
- Add toast notification system to admin and financial portals; activate existing Toast.tsx in customer portal
- Add skeleton loading components and replace all bare "Loading..." text
- Add isError/error state handling to all useQuery calls
- Clean up dead dependencies (@types/leaflet from frontend and customer-portal)
- Activate unused Skeleton.tsx and Toast.tsx in customer portal
- Fix i18n bypass in 14 financial portal pages
- Add ARIA labels, focus trapping to modals, keyboard navigation
- Standardize glass-card styling and DataTable usage

## Non-Goals

- New features or API endpoints
- Database schema changes
- Infrastructure changes
- Business logic changes

## Change Log

- 2026-09-10: Created milestone for system-wide UI/UX upgrade
