@echo off
REM ============================================
REM TollGate RFID - Multi-Database Setup
REM ============================================
REM This script creates migrations for all 3 databases:
REM   1. HQ Database (tollgate) - vehicles, events, violations
REM   2. Customer Database (tollgate_customer) - users, accounts, wallets
REM   3. Plaza Database (tollgate_plaza) - sync queue, plaza config
REM ============================================

echo.
echo ========================================
echo  TollGate Multi-Database Setup
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

REM Start all databases
echo [1/6] Starting databases...
docker compose up -d db customer-db plaza-db
timeout /t 5 /nobreak >nul

REM Wait for databases to be healthy
echo [2/6] Waiting for databases to be healthy...
:wait_db
docker compose exec -T db pg_isready -U postgres -d tollgate >nul 2>&1
if %errorlevel% neq 0 (
    echo       Waiting for HQ database...
    timeout /t 2 /nobreak >nul
    goto wait_db
)
:wait_customer
docker compose exec -T customer-db pg_isready -U postgres -d tollgate_customer >nul 2>&1
if %errorlevel% neq 0 (
    echo       Waiting for Customer database...
    timeout /t 2 /nobreak >nul
    goto wait_customer
)
:wait_plaza
docker compose exec -T plaza-db pg_isready -U postgres -d tollgate_plaza >nul 2>&1
if %errorlevel% neq 0 (
    echo       Waiting for Plaza database...
    timeout /t 2 /nobreak >nul
    goto wait_plaza
)
echo       All databases ready!

REM Generate Prisma clients
echo [3/6] Generating Prisma clients...
cd packages\backend

REM Generate HQ client
echo       Generating HQ client...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tollgate
npx prisma generate

REM Generate Customer client
echo       Generating Customer client...
set CUSTOMER_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/tollgate_customer
npx prisma generate

REM Generate Plaza client
echo       Generating Plaza client...
set PLAZA_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/tollgate_plaza
npx prisma generate

REM Run migrations
echo [4/6] Running migrations...

echo       Migrating HQ database...
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tollgate
npx prisma migrate deploy

echo       Migrating Customer database...
set CUSTOMER_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/tollgate_customer
npx prisma migrate deploy

echo       Migrating Plaza database...
set PLAZA_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/tollgate_plaza
npx prisma migrate deploy

REM Seed databases
echo [5/6] Seeding databases...
echo       Seeding customer database...
set CUSTOMER_DATABASE_URL=postgresql://postgres:postgres@localhost:5433/tollgate_customer
npx tsx prisma/seeds/customer-seed.ts

echo       Seeding plaza database...
set PLAZA_DATABASE_URL=postgresql://postgres:postgres@localhost:5434/tollgate_plaza
npx tsx prisma/seeds/plaza-seed.ts

cd ..\..

REM Build and start all services
echo [6/6] Building and starting services...
docker compose up -d --build

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo  HQ Database:      localhost:5432/tollgate
echo  Customer Database: localhost:5433/tollgate_customer
echo  Plaza Database:    localhost:5434/tollgate_plaza
echo.
echo  Backend API:       http://localhost:3000
echo  Admin Dashboard:   http://localhost:80
echo  Customer Portal:   http://localhost:8080
echo  Portainer:         http://localhost:9000
echo.
echo  Health Check:      curl http://localhost:3000/api/health
echo.
pause
