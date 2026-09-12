# Barrier Gate Installation Guide

## TollGate RFID Pass — Hardware Installation

---

## 1. Supported Barrier Gates

| Model | Opening Time | Lane Width | Motor Type | Rating |
|-------|-------------|-----------|------------|--------|
| FAAC 640 | 1.5–4s | 3–8m | DC Motor | IP55 |
| FAAC 868 | 1–3s | 3–7m | Electromechanical | IP55 |
| CAME GARD GT8 | 1.5–6s | 3–8m | DC Motor | IP54 |
| BFT GARD GT8 | 1.5–6s | 3–8m | Electromechanical | IP55 |
| Generic Boom Barrier | 2–6s | 3–6m | DC/AC Motor | IP44 |

---

## 2. Barrier Gate Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           TOLL LANE LAYOUT              │
                    │                                         │
    Vehicle ═══════►│  ┌──────┐   ┌──────┐   ┌──────┐       │
    Direction       │  │LOOP  │   │ RFID │   │BARRIER│       │
                    │  │DETECT│   │READER│   │ GATE  │       │
                    │  └──┬───┘   └──┬───┘   └──┬───┘       │
                    │     │         │          │             │
                    │     ▼         ▼          ▼             │
                    │  ┌─────────────────────────────────┐   │
                    │  │        LANE CONTROLLER          │   │
                    │  │        192.168.1.50              │   │
                    │  │                                 │   │
                    │  │  Input:  Vehicle Detected       │   │
                    │  │  Input:  RFID Tag Read          │   │
                    │  │  Output: Barrier Open/Close     │   │
                    │  │  Output: LED Signal             │   │
                    │  └──────────────┬──────────────────┘   │
                    │                 │                      │
                    │                 │  Serial/TCP          │
                    │                 ▼                      │
                    │  ┌─────────────────────────────────┐   │
                    │  │     BARRIER GATE CONTROLLER     │   │
                    │  │                                 │   │
                    │  │  ┌─────────┐  ┌─────────┐      │   │
                    │  │  │ Motor   │  │ Control │      │   │
                    │  │  │ Driver  │  │ Board   │      │   │
                    │  │  └────┬────┘  └────┬────┘      │   │
                    │  │       │            │           │   │
                    │  │       ▼            ▼           │   │
                    │  │  ┌─────────┐  ┌─────────┐      │   │
                    │  │  │ Boom    │  │ Limit   │      │   │
                    │  │  │ Arm     │  │ Switches│      │   │
                    │  │  │ (3–8m)  │  │ (open/  │      │   │
                    │  │  │         │  │  close) │      │   │
                    │  │  └─────────┘  └─────────┘      │   │
                    │  └─────────────────────────────────┘   │
                    └─────────────────────────────────────────┘
```

---

## 3. Control Protocol

### 3.1 Serial Commands (RS232)

| Command | Hex Code | Description |
|---------|----------|-------------|
| Open Barrier | `[0x01, 0x03, 0x00, 0x01, 0x01]` | Raise boom arm |
| Close Barrier | `[0x01, 0x03, 0x00, 0x00, 0x01]` | Lower boom arm |
| Stop | `[0x01, 0x03, 0x00, 0x02, 0x01]` | Emergency stop |
| Get Status | `[0x01, 0x03, 0x00, 0x03, 0x01]` | Query current state |

### 3.2 State Machine

```
                    ┌──────────┐
                    │  CLOSED  │◄──────────────┐
                    │  (Idle)  │               │
                    └────┬─────┘               │
                         │                     │
                    Open Command               │
                         │                     │
                         ▼                     │
                    ┌──────────┐          ┌────┴─────┐
                    │ RISING   │──────►───│  OPEN    │
                    │ (Moving) │ Timeout  │  (Hold)  │
                    └────┬─────┘          └────┬─────┘
                         │                     │
                    Close Command              │
                         │                     │
                         ▼                     │
                    ┌──────────┐               │
                    │ FALLING  │───────────────┘
                    │ (Moving) │ Auto-close timer
                    └──────────┘
                         │
                    Limit Switch (closed)
                         │
                         ▼
                    ┌──────────┐
                    │  CLOSED  │
                    └──────────┘
```

### 3.3 Signal States

| State | LED Signal | Boom Position | Vehicle Action |
|-------|-----------|---------------|----------------|
| CLOSED | 🔴 Red | Horizontal (down) | STOP — wait for toll |
| RISING | 🟡 Yellow | Moving up | PREPARE — tag detected |
| OPEN | 🟢 Green | Vertical (up) | PROCEED — pass through |
| FALLING | 🟡 Yellow | Moving down | HURRY — barrier closing |
| ERROR | 🔴 Red Flashing | Stuck | STOP — call operator |
| MAINTENANCE | 🔴🟡🟢 Cycle | Manual | STOP — maintenance mode |

---

## 4. Wiring Diagram

### 4.1 Serial Connection

```
┌──────────────────┐                    ┌──────────────────┐
│  Lane Controller │                    │  Barrier Gate    │
│  (RPi / MCU)     │                    │  Controller      │
│                  │                    │                  │
│  TX  ────────────┼───────────────────►│ RX               │
│  RX  ◄───────────┼────────────────────┤ TX               │
│  GND ────────────┼────────────────────┤ GND              │
│                  │                    │                  │
│  GPIO 17 ────────┼─── (Optional) ────►│ Enable           │
│  GPIO 27 ────────┼─── (Optional) ────►│ Direction        │
│                  │                    │                  │
│  5V  ────────────┼─── (Optional) ────►│ VCC (logic)      │
└──────────────────┘                    └──────────────────┘
         │                                      │
         │           ┌──────────┐              │
         └───────────┤  Power   ├──────────────┘
                     │  Supply  │
                     │ 24V/5A   │
                     │  (barrier│
                     │   motor) │
                     └──────────┘
```

### 4.2 TCP Connection

```
┌──────────────────┐    Ethernet     ┌──────────────────┐
│  Lane Controller │◄───────────────►│  Barrier Gate    │
│  192.168.1.50    │  TCP Port 5000  │  192.168.1.251   │
│                  │                 │                  │
│  Send: OPEN      │   ──────────►   │  Execute: OPEN   │
│  Send: CLOSE     │   ──────────►   │  Execute: CLOSE  │
│  Recv: STATUS    │   ◄──────────   │  Status: OPEN    │
│  Recv: ERROR     │   ◄──────────   │  Status: ERROR   │
└──────────────────┘                 └──────────────────┘
```

### 4.3 Modbus Connection (Industrial)

```
┌──────────────────┐                    ┌──────────────────┐
│  Lane Controller │                    │  Barrier Gate    │
│  (Modbus Master) │                    │  (Modbus Slave)  │
│                  │    RS-485 Bus      │                  │
│  A+ ─────────────┼──── (Twisted) ────┤ A+               │
│  B- ─────────────┼──── Pair)    ────┤ B-               │
│  GND ────────────┼────────────────────┤ GND              │
│                  │                    │                  │
│  Read Register:  │   ──────────►     │  Slave ID: 1     │
│  Address 0x0000  │   ◄──────────     │  Holding Reg:    │
│  (Status)        │                    │  0x0000 = State  │
│                  │                    │  0x0001 = Error  │
│  Write Register: │   ──────────►     │  0x0002 = Config │
│  Address 0x0002  │                    │                  │
│  (Command)       │                    │                  │
└──────────────────┘                    └──────────────────┘
```

---

## 5. Physical Installation

### 5.1 Mounting Layout

```
                    ┌───────────────────────────────────────┐
                    │           LANE CROSS-SECTION           │
                    │                                       │
                    │   ┌─────────────────────────────┐     │
                    │   │      BOOM ARM (3–8m)        │     │
                    │   │      ┌──────────────────┐   │     │
                    │   │      │  Reflective Tape  │   │     │
                    │   │      │  (Red/White)      │   │     │
                    │   │      └──────────────────┘   │     │
                    │   └──────────┬──────────────────┘     │
                    │              │ Pivot                   │
                    │   ┌──────────┴──────────────────┐     │
                    │   │     BARRIER HOUSING         │     │
                    │   │     ┌──────────────┐        │     │
                    │   │     │  Motor       │        │     │
                    │   │     │  Control     │        │     │
                    │   │     │  Board       │        │     │
                    │   │     └──────────────┘        │     │
                    │   │     Height: 0.8–1.0m        │     │
                    │   └──────────┬──────────────────┘     │
                    │              │ Foundation              │
                    │   ┌──────────┴──────────────────┐     │
                    │   │   CONCRETE FOUNDATION       │     │
                    │   │   400mm x 400mm x 500mm     │     │
                    │   │   Anchor Bolts: 4x M12      │     │
                    │   └─────────────────────────────┘     │
                    │                                       │
                    │   ◄──── Lane Width (3–8m) ────►      │
                    └───────────────────────────────────────┘
```

### 5.2 Clearance Zones

```
                    TOP VIEW
    ┌─────────────────────────────────────────────┐
    │                                             │
    │    ┌──── No Parking Zone ────┐              │
    │    │    (2m x Lane Width)    │              │
    │    │                         │              │
    │    │  ┌─────────────────┐    │              │
    │    │  │ BARRIER GATE    │    │              │
    │    │  │ (Pivot Point)   │    │              │
    │    │  │                 │    │              │
    │    │  │  ═══════════════╪═══►│ Boom Arm     │
    │    │  │                 │    │ Sweep Path   │
    │    │  └─────────────────┘    │              │
    │    │                         │              │
    │    └─────────────────────────┘              │
    │                                             │
    │    Minimum 1.5m clearance from              │
    │    boom arm to any obstruction              │
    │                                             │
    └─────────────────────────────────────────────┘
```

---

## 6. Safety Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| Auto-reverse | Boom reverses on obstacle detection | Photo-eye sensor + safety relay |
| Manual release | Emergency manual operation | Key-operated release lever |
| Battery backup | Operates during power failure | 12V battery, 50 cycles |
| Safety relay | Dual-channel safety circuit | IEC 61508 SIL 2 rated |
| Loop detector | Vehicle presence detection | Inductive loop in road surface |
| Anti-crush | Force limiting on boom | Adjustable torque limit |

---

## 7. Testing & Verification

### 7.1 Basic Function Test

```bash
# Test via TollGate API
curl -X POST http://localhost:3000/api/device-status/test/barrier \
  -H "Authorization: Bearer <token>"

# Test specific device
curl -X POST http://localhost:3000/api/device-status/barrier-001/barrier/open \
  -H "Authorization: Bearer <token>"

curl -X POST http://localhost:3000/api/device-status/barrier-001/barrier/close \
  -H "Authorization: Bearer <token>"
```

### 7.2 Safety Test

```
1. Place obstacle in boom path → verify auto-reverse
2. Cut power → verify battery backup activates
3. Trigger emergency stop → verify immediate halt
4. Test manual release → verify key operation
5. Test loop detector → verify vehicle detection
```

---

## 8. Bill of Materials (per Lane)

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| FAAC 640 Barrier Gate | 1 | 3,500,000 | 3,500,000 |
| Boom Arm (3m, aluminum) | 1 | 300,000 | 300,000 |
| Reflective Tape Kit | 1 | 50,000 | 50,000 |
| Foundation Kit (bolts + template) | 1 | 100,000 | 100,000 |
| Safety Photo-Eye Sensor | 1 | 250,000 | 250,000 |
| Battery Backup Unit | 1 | 400,000 | 400,000 |
| Manual Release Key Set | 1 | 50,000 | 50,000 |
| **Total per Lane** | | | **4,650,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
