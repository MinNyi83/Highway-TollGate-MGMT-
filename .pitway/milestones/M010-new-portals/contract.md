# M010: New Portals — HR Portal + Plaza Operations Portal

## Objective
Create two new standalone portals: HR Management Portal (port 8082) and Toll Plaza Operations Portal (port 8083) with offline PWA support.

## Scope
1. **HR Portal** (`packages/hr-portal/`) — Standalone React+Vite portal for HR staff
   - Login with shared TollGate JWT auth
   - 10 HR pages: Dashboard, Employees, EmployeeDetail, Departments, Attendance, Shifts, LeaveRequests, Payroll, Performance, Training
   - Dark mode, purple theme, responsive sidebar
   - Docker container on port 8082

2. **Plaza Operations Portal** (`packages/plaza-portal/`) — Lightweight PWA for Raspberry Pi
   - Offline-first with service worker (Workbox)
   - IndexedDB sync queue for pending toll events
   - Touch-friendly booth operator UI (large buttons, plate input)
   - Entry/Exit mode toggle
   - Network status indicator
   - Auto-sync when online
   - Docker container on port 8083

3. **SUPER_ADMIN** can access all 5 portals with single login

## Deliverables
- packages/hr-portal/ (complete React app + Dockerfile + nginx)
- packages/plaza-portal/ (complete PWA + Dockerfile + nginx)
- docker-compose.yml updated with hr-portal and plaza-portal services
- Documentation updated

## Status: COMPLETED
