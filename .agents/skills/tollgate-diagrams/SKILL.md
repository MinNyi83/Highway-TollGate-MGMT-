---
name: tollgate-diagrams
description: Generate editorial-quality architecture diagrams, ER models, network topology, data flow, and deployment diagrams for the TollGate RFID highway toll management system. Use when creating or updating PRESENTATION.html, ARCHITECTURE.md, or any system documentation diagrams.
metadata:
  version: "1.0"
  derived-from: diagram-design
---

# TollGate Diagrams

Generate professional diagrams for the TollGate RFID system using the diagram-design skill.

## System Context

The TollGate system consists:
- **6 frontends**: Admin Hub (:80), Customer PWA (:8080), Financial Portal (:8081), HR Portal (:8082), Plaza PWA (:8083), Employee App (:8084)
- **1 backend**: Express + TypeScript + Prisma (port 3000)
- **4 databases**: HQ (:5432), Customer (:5433), Plaza (:5434), HR (:5435)
- **4 plaza sites**: 0 Mile, 39 Mile, 115 Mile, 200 Mile
- **Hardware**: RFID readers, ANPR cameras, barrier gates, Raspberry Pi edge servers

## Diagram Types to Generate

### 1. System Architecture (Layer Stack)
Show all 6 portals, backend, and 4 databases in layered architecture.

### 2. Database Schema (ER/Data Model)
Three separate ERDs:
- HQ DB: vehicles, toll_plazas, toll_rates, toll_events, violations, device_status
- Customer DB: users, accounts, rfid_tags, notifications
- Plaza DB: plaza_config, sync_queue, local_toll_events
- HR DB: employees, departments, attendance, leave, payroll

### 3. Network Topology (Deployment)
Show Kali Linux server with all Docker containers, ports, and inter-container networking.

### 4. Data Flow (Sequence)
RFID tag read → Backend API → Toll event → Violation check → Balance deduction → Receipt.

### 5. Authentication Flow (Sequence)
Login → JWT token → Role-based access → Portal routing.

### 6. Sync Flow (Sequence)
Plaza offline → Local events → Sync queue → Backend sync → Database merge.

### 7. Financial Flow (Swimlane)
Daily collection → Revenue transfer → Monthly reconciliation → Official receipt.

## Style Guide

Use the TollGate brand:
- **Primary**: Navy (#0f151c) + Gold (#b8924e)
- **Secondary**: Violet (#8b5cf6) for HR, Emerald (#10b981) for success
- **Font**: Inter for body, JetBrains Mono for technical

## Usage

```
Use the tollgate-diagrams skill to generate a system architecture diagram for the TollGate project.
```

## Output

All diagrams render as standalone HTML with inline SVG — no external dependencies.
Save to `docs/diagrams/` or embed in PRESENTATION.html.
