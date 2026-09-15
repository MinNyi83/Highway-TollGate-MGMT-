# TollGate Backend API — Security Audit Report

**Date:** 2026-09-15
**Scope:** Backend API (Express + TypeScript + Prisma), all 6 portal nginx configs
**Auditor:** Automated security audit using tollgate-security-audit skill

---

## Executive Summary

| Category | Status | Findings |
|---|---|---|
| JWT Authentication | ⚠️ MEDIUM | Hardcoded fallback secret, no algorithm pinning |
| CORS Configuration | ✅ GOOD | Whitelist-based, but missing production domain |
| Rate Limiting | ✅ GOOD | In-memory, 10 req/15min auth, reset endpoint exposed |
| SQL Injection | ✅ GOOD | Prisma ORM with parameterized queries |
| Docker Security | ⚠️ MEDIUM | No read-only filesystem, no user restrictions |
| Nginx Headers | ⚠️ MIXED | Missing HSTS on HR/Plaza/Employee, no CSP on Plaza/Employee |
| Password Security | ✅ GOOD | bcrypt with salt rounds=10 |
| Sensitive Data | ⚠️ MEDIUM | API keys stored in plaintext in DB |

---

## 1. JWT Authentication

### ✅ Strengths
- Token expiration configured (`JWT_EXPIRES_IN` defaults to 7d)
- Role-based access control via `requireRole()` middleware
- Proper 401/403 responses with error codes

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| J-1 | **MEDIUM** | Hardcoded fallback secret: `'default-secret-change-in-production'` | `jwt.ts:3` |
| J-2 | **MEDIUM** | No JWT algorithm pinning — vulnerable to algorithm confusion attacks | `jwt.ts:16` |
| J-3 | **LOW** | 7-day token expiration is long for financial system | `jwt.ts:4` |
| J-4 | **LOW** | No token revocation mechanism (blacklist) | `auth.service.ts` |
| J-5 | **INFO** | Refresh token not implemented — only full re-auth | `auth.service.ts:132` |

### Recommendations
1. **J-1:** Remove hardcoded fallback. Crash on missing `JWT_SECRET`:
   ```typescript
   const JWT_SECRET = process.env.JWT_SECRET;
   if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');
   ```
2. **J-2:** Pin algorithm to HS256:
   ```typescript
   jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
   ```
3. **J-3:** Reduce to 24h for financial operations, implement refresh tokens
4. **J-4:** Add token blacklist (Redis or database) for logout/revocation

---

## 2. CORS Configuration

### ✅ Strengths
- Whitelist-based — no wildcard `*`
- Credentials enabled with explicit origin check
- 24-hour preflight cache (`maxAge: 86400`)

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| C-1 | **MEDIUM** | Missing `http://192.168.100.101` (port 80) in whitelist | `app.ts:52` |
| C-2 | **LOW** | `localhost:80` in whitelist — should only exist in dev | `app.ts:42` |
| C-3 | **INFO** | Dev origins (5173-5177) in production config | `app.ts:49-51` |
| C-4 | **LOW** | No origin validation for WebSocket connections | `app.ts:66-78` |

### Recommendations
1. **C-1:** Add missing origin `http://192.168.100.101`
2. **C-2/C-3:** Separate dev/production CORS lists via `NODE_ENV`
3. **C-4:** Validate origin on WebSocket upgrade

---

## 3. Rate Limiting

### ✅ Strengths
- Auth limiter: 10 requests per 15 minutes
- Global limiter: 100 requests per minute
- Strict limiter: 5 requests per hour
- Reset endpoint with role check (`SUPER_ADMIN` only)

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| R-1 | **MEDIUM** | In-memory store — resets on container restart | `rateLimiter.ts` |
| R-2 | **MEDIUM** | Rate limit bypass in test mode (`NODE_ENV=test`) | `rateLimiter.ts:6` |
| R-3 | **LOW** | No per-IP rate limit on non-auth endpoints | `app.ts:80` |
| R-4 | **INFO** | `keyGenerator` falls back to `'unknown'` — allows bypass | `rateLimiter.ts:10` |

### Recommendations
1. **R-1:** Use Redis-backed rate limiting for distributed system
2. **R-2:** Never use `NODE_ENV=test` in production containers
3. **R-4:** Reject requests with unknown IP instead of using fallback key

---

## 4. SQL Injection (Prisma ORM)

### ✅ Strengths
- Prisma ORM with parameterized queries — no raw SQL in business logic
- Input validation via Zod schemas
- Proper error handling

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| S-1 | **INFO** | No SQL injection risk with Prisma parameterized queries | All routes |
| S-2 | **INFO** | Prisma `findFirst` with user-controlled reset token | `auth.service.ts:179` |

---

## 5. Docker Security

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| D-1 | **MEDIUM** | No `read_only: true` on containers | `docker-compose.yml` |
| D-2 | **MEDIUM** | No `security_opt: no-new-privileges:true` | `docker-compose.yml` |
| D-3 | **LOW** | Backend runs as root (no USER directive) | `Dockerfile` |
| D-4 | **LOW** | No resource limits (memory/CPU) | `docker-compose.yml` |
| D-5 | **INFO** | PostgreSQL uses default `postgres:postgres` credentials | `docker-compose.yml` |

### Recommendations
1. Add `read_only: true` and `tmpfs: [/tmp]` to all containers
2. Add `security_opt: [no-new-privileges:true]`
3. Add non-root USER in Dockerfiles
4. Set `deploy.resources.limits` in docker-compose
5. Change PostgreSQL passwords for production

---

## 6. Nginx Security Headers Audit

### Headers Present

| Header | Admin | Customer | Financial | HR | Plaza | Employee |
|---|---|---|---|---|---|---|
| X-Frame-Options | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| X-Content-Type-Options | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| X-XSS-Protection | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Referrer-Policy | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Content-Security-Policy | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Strict-Transport-Security | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| N-1 | **HIGH** | Employee App (8084) has NO security headers at all | `employee-app/nginx.conf` |
| N-2 | **HIGH** | Plaza Portal (8083) missing CSP, XSS, Referrer, HSTS | `plaza-portal/nginx.conf` |
| N-3 | **MEDIUM** | HR Portal missing HSTS header | `hr-portal/nginx.conf:10` |
| N-4 | **MEDIUM** | All portals serve on HTTP (no TLS) | All nginx configs |
| N-5 | **LOW** | CSP allows `'unsafe-inline'` and `'unsafe-eval'` | All CSP headers |

### Recommendations
1. **N-1/N-2:** Add full security header set to Employee App and Plaza Portal
2. **N-3:** Add HSTS to HR Portal
3. **N-4:** Add TLS termination (Let's Encrypt) for production
4. **N-5:** Replace `'unsafe-inline'` with nonce-based CSP where possible

---

## 7. Password Security

### ✅ Strengths
- bcrypt with salt rounds=10
- Same error message for wrong email and wrong password (prevents enumeration)
- Password reset with time-limited tokens

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| P-1 | **LOW** | No password complexity requirements enforced | `auth.service.ts:47` |
| P-2 | **INFO** | Reset token is 32-byte hex (good entropy) | `auth.service.ts:167` |

---

## 8. Financial Data Security

### ⚠️ Findings

| # | Severity | Finding | Location |
|---|---|---|---|
| F-1 | **MEDIUM** | API keys for devices stored in plaintext | `device_status.api_key` |
| F-2 | **LOW** | Webhook secrets stored in plaintext | `webhooks.secret` |
| F-3 | **LOW** | No encryption at rest for financial PII | `accounts` table |
| F-4 | **INFO** | Audit logs exist for financial operations | `financial_audit_logs` |

---

## Priority Remediation Plan

### Immediate (Critical)
1. Remove hardcoded JWT secret fallback
2. Pin JWT algorithm to HS256
3. Add security headers to Employee App and Plaza Portal
4. Add HSTS to HR Portal

### Short-term (1 week)
5. Add missing CORS origin for port 80
6. Separate dev/production CORS lists
7. Add `no-new-privileges` to Docker containers
8. Add resource limits to docker-compose

### Medium-term (1 month)
9. Implement Redis-backed rate limiting
10. Add TLS termination (Let's Encrypt)
11. Add password complexity requirements
12. Encrypt sensitive fields at rest

### Long-term (3 months)
13. Implement token revocation (blacklist)
14. Add 2FA enforcement for admin accounts
15. Penetration testing by external auditor
16. PCI DSS compliance review for payment data
