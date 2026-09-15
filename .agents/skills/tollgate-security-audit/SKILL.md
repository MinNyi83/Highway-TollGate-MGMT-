---
name: tollgate-security-audit
description: Security audit skills for the TollGate RFID highway toll management system. Use when reviewing backend API security, nginx hardening, JWT authentication, database security, Docker container security, rate limiting, CORS configuration, or conducting penetration testing on the system.
metadata:
  version: "1.0"
  derived-from: anthropic-cybersecurity-skills
---

# TollGate Security Audit

Security audit skills derived from the 818 Anthropic Cybersecurity Skills library, curated for the TollGate RFID highway toll management system.

## Relevant Skills for TollGate System

### API Security (Critical)
| Skill | Path | Use When |
|---|---|---|
| API Security Testing | `repo/skills/conducting-api-security-testing/SKILL.md` | Audit backend REST API endpoints |
| JWT Vulnerabilities | `repo/skills/testing-for-json-web-token-vulnerabilities/SKILL.md` | Review JWT auth implementation |
| JWT Algorithm Confusion | `repo/skills/exploiting-jwt-algorithm-confusion-attack/SKILL.md` | Check JWT signing algorithm |
| OAuth Misconfiguration | `repo/skills/exploiting-oauth-misconfiguration/SKILL.md` | Review customer portal OAuth |
| Rate Limiting Bypass | `repo/skills/performing-api-rate-limiting-bypass/SKILL.md` | Test in-memory rate limiter |
| API Schema Validation | `repo/skills/implementing-api-schema-validation-security/SKILL.md` | Validate Zod schemas |
| Broken Object-Level Auth | `repo/skills/testing-api-for-broken-object-level-authorization/SKILL.md` | Check data access controls |
| Mass Assignment | `repo/skills/exploiting-mass-assignment-in-rest-apis/SKILL.md` | Review Express body parsing |

### Authentication & Authorization
| Skill | Path | Use When |
|---|---|---|
| Authentication Testing | `repo/skills/testing-for-broken-access-control/SKILL.md` | Audit role-based access |
| CORS Misconfiguration | `repo/skills/testing-cors-misconfiguration/SKILL.md` | Verify CORS whitelist |
| Session Management | `repo/skills/exploiting-idor-vulnerabilities/SKILL.md` | Check for IDOR in API |
| API Key Security | `repo/skills/implementing-api-key-security-controls/SKILL.md` | Review API key storage |

### Database Security
| Skill | Path | Use When |
|---|---|---|
| SQL Injection | `repo/skills/exploiting-sql-injection-vulnerabilities/SKILL.md` | Audit Prisma queries |
| PostgreSQL Hardening | `repo/skills/implementing-pam-for-database-access/SKILL.md` | Secure 4 PostgreSQL instances |
| Sensitive Data Exposure | `repo/skills/testing-for-sensitive-data-exposure/SKILL.md` | Check financial data handling |

### Docker & Infrastructure
| Skill | Path | Use When |
|---|---|---|
| Docker Security Assessment | `repo/skills/performing-docker-bench-security-assessment/SKILL.md` | Audit 12 Docker containers |
| Docker Hardening | `repo/skills/hardening-docker-containers-for-production/SKILL.md` | Harden container images |
| Container Escape Detection | `repo/skills/performing-container-escape-detection/SKILL.md` | Verify container isolation |
| Docker Forensics | `repo/skills/analyzing-docker-container-forensics/SKILL.md` | Investigate container issues |
| Network Segmentation | `repo/skills/configuring-network-segmentation-with-vlans/SKILL.md` | Verify inter-container network |

### Nginx & Web Server
| Skill | Path | Use When |
|---|---|---|
| Web App Firewall Bypass | `repo/skills/performing-web-application-firewall-bypass/SKILL.md` | Test nginx security |
| SSL/TLS Assessment | `repo/skills/performing-ssl-tls-security-assessment/SKILL.md` | Verify HTTPS configuration |
| Security Headers Audit | `repo/skills/performing-security-headers-audit/SKILL.md` | Audit nginx security headers |
| CSP Bypass | `repo/skills/performing-content-security-policy-bypass/SKILL.md` | Test Content-Security-Policy |
| XSS Testing | `repo/skills/testing-for-xss-vulnerabilities/SKILL.md` | Check for XSS in portals |

### Financial System Security
| Skill | Path | Use When |
|---|---|---|
| PCI DSS Compliance | `repo/skills/implementing-pci-dss-compliance-controls/SKILL.md` | Review payment data handling |
| Data Loss Prevention | `repo/skills/implementing-endpoint-dlp-controls/SKILL.md` | Protect toll revenue data |
| Encryption at Rest | `repo/skills/implementing-aes-encryption-for-data-at-rest/SKILL.md` | Encrypt sensitive fields |

### Rate Limiting & DoS
| Skill | Path | Use When |
|---|---|---|
| DDoS Mitigation | `repo/skills/implementing-ddos-mitigation-with-cloudflare/SKILL.md` | Review rate limiting strategy |
| API Rate Limiting | `repo/skills/implementing-api-rate-limiting-and-throttling/SKILL.md` | Improve auth rate limiter |
| Port Scanning Detection | `repo/skills/detecting-port-scanning-with-fail2ban/SKILL.md` | Add fail2ban to nginx |

### Zero Trust Network
| Skill | Path | Use When |
|---|---|---|
| Zero Trust Architecture | `repo/skills/implementing-zero-trust-network-access/SKILL.md` | Plan network hardening |
| Microsegmentation | `repo/skills/configuring-microsegmentation-for-zero-trust/SKILL.md` | Segment plaza ↔ backend |

### Monitoring & Detection
| Skill | Path | Use When |
|---|---|---|
| SIEM Use Cases | `repo/skills/implementing-siem-use-cases-for-detection/SKILL.md` | Set up security monitoring |
| Audit Log Analysis | `repo/skills/analyzing-windows-event-logs-in-splunk/SKILL.md` | Review audit_logs table |
| Anomaly Detection | `repo/skills/detecting-anomalous-authentication-patterns/SKILL.md` | Detect unusual login patterns |
| Insider Threat Detection | `repo/skills/detecting-insider-threat-behaviors/SKILL.md` | Monitor operator activities |

## Quick Audit Checklist

Run this as a security review checklist:

```
1. [ ] JWT: Verify signing algorithm, expiration, secret strength
2. [ ] CORS: Verify whitelist matches production origins only
3. [ ] Rate Limiting: Test auth endpoints (10 req/15 min)
4. [ ] SQL Injection: Verify Prisma parameterized queries
5. [ ] XSS: Test all portal input fields
6. [ ] Docker: Check container isolation, no privileged mode
7. [ ] Nginx: Verify security headers (CSP, HSTS, X-Frame)
8. [ ] PostgreSQL: Verify no default credentials, restrict network
9. [ ] HTTPS: Verify TLS termination at nginx
10. [ ] Financial Data: Verify encryption, access logging
```

## Usage

Reference these skills when performing security reviews:

```
Use the tollgate-security-audit skill to perform a security audit on the backend API.
```
