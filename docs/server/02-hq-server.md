# HQ Server Installation Guide

## TollGate RFID Pass — Central Server Setup

---

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         HQ SERVER (Central)                                 │
│                     192.168.100.101 (Kali Linux)                            │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       DOCKER CONTAINERS                             │   │
│  │                                                                     │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐   │   │
│  │  │  backend   │  │  frontend  │  │  customer  │  │  financial │   │   │
│  │  │  :3000     │  │  :80       │  │  portal    │  │  portal    │   │   │
│  │  │            │  │            │  │  :8080     │  │  :8081     │   │   │
│  │  │  Express   │  │  Nginx     │  │            │  │            │   │   │
│  │  │  + Prisma  │  │  + React   │  │  Nginx     │  │  Nginx     │   │   │
│  │  │  + Socket  │  │  + Vite    │  │  + React   │  │  + React   │   │   │
│  │  └─────┬──────┘  └────────────┘  └────────────┘  └────────────┘   │   │
│  │        │                                                           │   │
│  │        │  Database Connections                                     │   │
│  │        │                                                           │   │
│  │  ┌─────┼───────────────────────────────────────────────────────┐   │   │
│  │  │     │         DATABASE CONTAINERS                           │   │   │
│  │  │     │                                                       │   │   │
│  │  │  ┌──┴──────┐  ┌──────────────┐  ┌──────────────┐          │   │   │
│  │  │  │ db      │  │ customer-db  │  │ plaza-db     │          │   │   │
│  │  │  │ :5432   │  │ :5433        │  │ :5434        │          │   │   │
│  │  │  │         │  │              │  │              │          │   │   │
│  │  │  │ HQ DB   │  │ Customer DB  │  │ Plaza DB     │          │   │   │
│  │  │  │ 27+ tbl │  │ users, wallets│  │ sync, config │          │   │   │
│  │  │  └─────────┘  └──────────────┘  └──────────────┘          │   │   │
│  │  └────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       NETWORK                                       │   │
│  │                                                                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │   │
│  │  │ Ethernet     │  │ WiFi         │  │ VPN          │             │   │
│  │  │ eth0         │  │ wlan0        │  │ WireGuard    │             │   │
│  │  │ 192.168.     │  │ (backup)     │  │ (plaza       │             │   │
│  │  │ 100.101      │  │              │  │  connection) │             │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Network Topology — Full System

```
                              ┌──────────────────────┐
                              │      INTERNET        │
                              │   (Public IP/VPN)    │
                              └──────────┬───────────┘
                                         │
                              ┌──────────┴───────────┐
                              │    HQ SERVER         │
                              │  192.168.100.101     │
                              │                      │
                              │  ┌────────────────┐  │
                              │  │   Nginx        │  │
                              │  │   Reverse Proxy│  │
                              │  │   :80, :443    │  │
                              │  └───────┬────────┘  │
                              │          │           │
                              │  ┌───────┴────────┐  │
                              │  │   Docker       │  │
                              │  │   Compose      │  │
                              │  │                │  │
                              │  │  backend :3000 │  │
                              │  │  frontend :80  │  │
                              │  │  customer :8080│  │
                              │  │  financial:8081│  │
                              │  │  db :5432      │  │
                              │  │  cdb :5433     │  │
                              │  │  pdb :5434     │  │
                              │  └────────────────┘  │
                              └──────────┬───────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
    ┌─────────┴─────────┐    ┌───────────┴──────────┐    ┌─────────┴─────────┐
    │  PLAZA 01 (RPi)   │    │  PLAZA 02 (RPi)      │    │  PLAZA N (RPi)    │
    │  192.168.1.10     │    │  192.168.2.10         │    │  192.168.N.10      │
    │  :4000            │    │  :4000                │    │  :4000             │
    │                   │    │                       │    │                    │
    │  ┌─────────────┐  │    │  ┌─────────────┐      │    │  ┌─────────────┐  │
    │  │ Lane 1A     │  │    │  │ Lane 1A     │      │    │  │ Lane 1A     │  │
    │  │ Lane 1B     │  │    │  │ Lane 1B     │      │    │  │ Lane 1B     │  │
    │  │ Lane 2A     │  │    │  │ Lane 2A     │      │    │  │ Lane 2A     │  │
    │  │ Lane 2B     │  │    │  │ Lane 2B     │      │    │  │ Lane 2B     │  │
    │  └─────────────┘  │    │  └─────────────┘      │    │  └─────────────┘  │
    └───────────────────┘    └───────────────────────┘    └───────────────────┘
```

---

## 3. Server Specifications

### 3.1 Hardware Requirements

| Component | Minimum | Recommended | Production |
|-----------|---------|-------------|------------|
| CPU | 4 cores | 8 cores | 16 cores |
| RAM | 8GB | 16GB | 32GB |
| Storage | 256GB SSD | 512GB NVMe | 1TB NVMe RAID |
| Network | 1 Gbps | 1 Gbps | 10 Gbps |
| OS | Ubuntu 22.04 | Kali Linux | Kali Linux |

### 3.2 Current Production Specs

| Parameter | Value |
|-----------|-------|
| OS | Kali Linux (2024.1) |
| IP Address | 192.168.100.101 |
| SSH User | nyimin |
| SSH Port | 22 |
| Deploy Dir | ~/TollGate-RFID |
| Docker Version | 24.x |
| Docker Compose | v2.x |

---

## 4. Installation Steps

### 4.1 System Preparation

```bash
# SSH into server
ssh nyimin@192.168.100.101

# Fix DNS if needed
echo 1512 | sudo -S sh -c 'echo nameserver 8.8.8.8 > /etc/resolv.conf'

# Update system
echo 1512 | sudo -S apt update && echo 1512 | sudo -S apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
echo 1512 | sudo -S sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo 1512 | sudo -S apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version
```

### 4.2 Deploy Application

```bash
# Clone repository
cd ~
git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
cd TollGate-RFID

# Configure environment (if needed)
# Edit docker-compose.yml for production settings

# Build and start all containers
echo 1512 | sudo -S docker compose up -d --build

# Check status
echo 1512 | sudo -S docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

### 4.3 Database Setup

```bash
# Run Prisma migrations
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 \
  sh -c 'cd packages/backend && npx prisma migrate deploy'

# Seed production data
echo 1512 | sudo -S docker exec tollgate-rfid-backend-1 \
  sh -c 'cd packages/backend && node prisma/seed.js'

# Verify databases
echo 1512 | sudo -S docker exec tollgate-rfid-db-1 \
  psql -U postgres -d tollgate -c '\dt'
```

### 4.4 Nginx Configuration (if custom domain)

```bash
# Install Nginx (if not using Docker nginx)
echo 1512 | sudo -S apt install nginx -y

# Create site configuration
sudo cat > /etc/nginx/sites-available/tollgate << 'EOF'
server {
    listen 80;
    server_name tollgate.example.com;

    # Admin Hub
    location / {
        proxy_pass http://localhost:80;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # Customer Portal
    location /customer {
        proxy_pass http://localhost:8080;
    }

    # Financial Portal
    location /financial {
        proxy_pass http://localhost:8081;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/tollgate /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## 5. Container Port Map

| Container | Port | Protocol | External Access |
|-----------|------|----------|-----------------|
| backend | 3000 | HTTP | API, Swagger |
| frontend | 80 | HTTP | Admin Hub |
| customer-portal | 8080 | HTTP | Customer Portal |
| financial-portal | 8081 | HTTP | Financial Portal |
| db | 5432 | TCP | HQ Database |
| customer-db | 5433 | TCP | Customer Database |
| plaza-db | 5434 | TCP | Plaza Database |

---

## 6. Health Monitoring

### 6.1 Health Endpoints

```bash
# Full health check
curl -s http://localhost:3000/api/health | python3 -m json.tool

# Liveness probe
curl -s http://localhost:3000/api/health/live

# Readiness probe
curl -s http://localhost:3000/api/health/ready

# Detailed metrics (auth required)
curl -s http://localhost:3000/api/health/metrics \
  -H "Authorization: Bearer <token>"

# Backup database
curl -s http://localhost:3000/api/health/backup \
  -H "Authorization: Bearer <token>" -o backup.json
```

### 6.2 Docker Health Checks

```bash
# Check all container health
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'

# View logs
docker logs tollgate-rfid-backend-1 --tail 50
docker logs tollgate-rfid-frontend-1 --tail 50

# Restart single service
echo 1512 | sudo -S docker compose restart backend

# Rebuild single service
echo 1512 | sudo -S docker compose up -d --build backend
```

---

## 7. Backup & Recovery

### 7.1 Database Backup

```bash
# Backup HQ database
docker exec tollgate-rfid-db-1 pg_dump -U postgres tollgate > backup_hq_$(date +%Y%m%d).sql

# Backup Customer database
docker exec tollgate-rfid-customer-db-1 pg_dump -U postgres tollgate_customer > backup_customer_$(date +%Y%m%d).sql

# Backup Plaza database
docker exec tollgate-rfid-plaza-db-1 pg_dump -U postgres tollgate_plaza > backup_plaza_$(date +%Y%m%d).sql
```

### 7.2 Automated Backup Script

```bash
#!/bin/bash
# /opt/tollgate-backup.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup all databases
docker exec tollgate-rfid-db-1 pg_dump -U postgres tollgate | gzip > $BACKUP_DIR/hq_$DATE.sql.gz
docker exec tollgate-rfid-customer-db-1 pg_dump -U postgres tollgate_customer | gzip > $BACKUP_DIR/customer_$DATE.sql.gz
docker exec tollgate-rfid-plaza-db-1 pg_dump -U postgres tollgate_plaza | gzip > $BACKUP_DIR/plaza_$DATE.sql.gz

# Keep last 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

---

## 8. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Container won't start | Port conflict | Check `docker ps`, change port |
| DB connection refused | Container not healthy | Wait for health check, restart |
| Prisma client outdated | Schema changed | Run `npx prisma generate` |
| Migration not applied | Pending migrations | Run `npx prisma migrate deploy` |
| DNS resolution fails | Network config | Fix resolv.conf |
| Frontend 404 on reload | Nginx SPA fallback | Add `try_files` directive |
| Rate limit 429 error | In-memory limiter | Restart backend or use reset endpoint |
| Build fails (network) | DNS issue | Fix DNS before build |

---

## 9. Bill of Materials

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| Server (Dell/HP, 16GB, 512GB SSD) | 1 | 5,000,000 | 5,000,000 |
| UPS (1500VA) | 1 | 800,000 | 800,000 |
| Network Switch (GbE, 16-port) | 1 | 500,000 | 500,000 |
| Ethernet Cables (Cat6, 50m) | 5 | 200,000 | 1,000,000 |
| Rack Mount Kit | 1 | 300,000 | 300,000 |
| **Total** | | | **7,600,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
