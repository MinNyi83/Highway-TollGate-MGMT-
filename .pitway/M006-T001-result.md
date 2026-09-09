# T001 Result: Verify all login credentials

## Status: PASSED

## Evidence
All 5 login credentials verified working on server 192.168.100.101:

1. `admin@tollgate.com` / `password123` → 200 OK + JWT token
2. `ko.min@personal.com` / `password123` → 200 OK + JWT token
3. `fleet@transportco.com` / `password123` → 200 OK + JWT token
4. `fin.admin@tollgate.com` / `password123` → 200 OK + JWT token
5. `fin.manager@tollgate.com` / `password123` → 200 OK + JWT token
6. `fin.viewer@tollgate.com` / `password123` → 200 OK + JWT token

## Verification Command
```bash
curl -s -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -d '{"email":"fin.admin@tollgate.com","password":"password123"}' | grep -q token
```

## Date
2026-09-09
