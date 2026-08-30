# Highway TollGate RFID Management System - Comprehensive User Guide

## Table of Contents

1. [System Overview & Access URLs](#system-overview--access-urls)
2. [HQ Admin Command Hub & Operator Console](#hq-admin-command-hub--operator-console)
   - [Theme Customization (Dark / Light Mode)](#theme-customization-dark--light-mode)
   - [Operator Quick Actions Ribbon](#operator-quick-actions-ribbon)
   - [Real Interactive Geographic Highway Map (Leaflet)](#real-interactive-geographic-highway-map-leaflet)
   - [Instant Booth Dynamic QR Payment](#instant-booth-dynamic-qr-payment)
   - [Myanmar RTAD Wheel Tax AI Scanner & OCR](#myanmar-rtad-wheel-tax-ai-scanner--ocr)
3. [Customer Portal & Progressive Web App (PWA)](#customer-portal--progressive-web-app-pwa)
   - [Dark & Light Theme Switching](#dark--light-theme-switching)
   - [Expressway Trip Planner with Live Mini-Map](#expressway-trip-planner-with-live-mini-map)
   - [One-Click Vehicle Registration via RTAD Card](#one-click-vehicle-registration-via-rtad-card)
   - [Digital Toll Pass (Virtual RFID QR)](#digital-toll-pass-virtual-rfid-qr)
   - [Prepaid Wallet & Dynamic Top-Up](#prepaid-wallet--dynamic-top-up)
4. [Toll Simulator (Canvas Multi-Lane Highway)](#toll-simulator-canvas-multi-lane-highway)
5. [Plaza Edge Server (Offline-First Raspberry Pi)](#plaza-edge-server-offline-first-raspberry-pi)

---

## 1. System Overview & Access URLs

| Portal | Port | Default URL | Purpose |
|---|---|---|---|
| **HQ Admin Command Hub** | `80` | `http://<SERVER_IP>` | Central telemetry, operator ribbon, real highway map, reports |
| **Customer Portal (PWA)** | `8080` | `http://<SERVER_IP>:8080` | Driver digital wallet, virtual RFID pass, trip history & route planner |
| **Central Backend API** | `3000` | `http://<SERVER_IP>:3000` | REST API, WebSocket streams, OCR engine, payment webhooks |
| **Toll Simulator** | `80` | `http://<SERVER_IP>/simulator` | Real-time animated canvas multi-lane simulation |

---

## 2. Default Seed Credentials

| Role | Username / Email | Password | Purpose |
|---|---|---|---|
| **System Admin** | `admin@tollgate.com` | `password123` | Full administrative control |
| **Manager** | `manager@tollgate.com` | `password123` | Operations management |
| **Booth Operator 1** | `operator1@tollgate.com` | `password123` | Lane cashier & barrier control |
| **Auditor / Viewer** | `viewer@tollgate.com` | `password123` | Reports & financial logs |
| **Enterprise Customer** | `fleet@transportco.com` | `password123` | TransportCo Fleet (8 vehicles) |
| **Individual Driver** | `ko.min@personal.com` | `password123` | Customer PWA portal |

---

## 3. Real Geographic GPS Highway Map (Leaflet)

The system features real OpenStreetMap and Satellite Leaflet mapping across all portals:
- **Plaza Nodes & Waypoints**: Plots Yangon (0M), Bago (39M), Phyu (115M), Naypyitaw (201M), Meiktila (285M), and Mandalay (352M).
- **Interactive Layer Switcher**: Switch between CartoDB Dark Mode, Standard Street Map, and Satellite Imagery.
- **Corridor Telemetry**: Displays real-time active lane counts, vehicle throughput, and barrier health.
