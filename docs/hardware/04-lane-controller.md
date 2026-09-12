# Lane Controller & Peripherals Installation Guide

## TollGate RFID Pass — Hardware Installation

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TOLL PLAZA — FULL LANE                         │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    OVERHEAD GANTRY                              │   │
│  │                                                                 │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │   │
│  │  │  LED SIGN │  │ANPR CAMERA│  │RFID ANTENNA│  │  SIGNAL   │   │   │
│  │  │           │  │           │  │  (UHF)     │  │  LIGHTS   │   │   │
│  │  │ "Welcome" │  │ [ANPR]    │  │  [Read]    │  │  🔴🟡🟢   │   │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                              │ Wires/PoE                               │
│                              ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                     LANE CONTROLLER                             │   │
│  │                     Raspberry Pi 4                              │   │
│  │                                                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  GPIO    │  │  Serial  │  │ Ethernet │  │  USB     │       │   │
│  │  │  Header  │  │  Port    │  │  Port    │  │  Ports   │       │   │
│  │  │  40-pin  │  │  /dev/   │  │  eth0    │  │  x4      │       │   │
│  │  │          │  │  ttyUSB0 │  │          │  │          │       │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │   │
│  │       │             │             │             │               │   │
│  └───────┼─────────────┼─────────────┼─────────────┼───────────────┘   │
│          │             │             │             │                    │
│          ▼             ▼             ▼             ▼                    │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐          │
│  │Vehicle Loop│ │Barrier Gate│ │ Network    │ │ USB RFID   │          │
│  │Detector    │ │Controller  │ │ Switch     │ │ Reader     │          │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Lane Controller Hardware

### 2.1 Raspberry Pi 4 Specifications

| Parameter | Value |
|-----------|-------|
| Processor | Broadcom BCM2711, Quad-core Cortex-A72 |
| RAM | 4GB / 8GB LPDDR4-3200 |
| Storage | 32GB+ microSD (Class 10 / A2) |
| Network | Gigabit Ethernet, WiFi 5 (802.11ac) |
| GPIO | 40-pin header, 26x GPIO |
| USB | 2x USB 3.0, 2x USB 2.0 |
| Serial | UART on GPIO 14/15, USB-to-Serial adapter |
| Power | USB-C 5V/3A (15W) |
| OS | Raspberry Pi OS Lite (64-bit) |

### 2.2 GPIO Pin Mapping

```
RASPBERRY PI 4 GPIO HEADER (40-PIN)
┌─────────────────────────────────────────────┐
│  3V3  (1) (2)  5V                          │
│  GPIO2 (3) (4)  5V          ┌─────────────┐ │
│  GPIO3 (5) (6)  GND         │  40-Pin     │ │
│  GPIO4 (7) (8)  GPIO14(TX)  │  Header     │ │
│  GND  (9) (10) GPIO15(RX)  │             │ │
│                             │  ┌───────┐  │ │
│  Lane Assignments:          │  │  RP4  │  │ │
│  ┌──────────┬────────────┐  │  │       │  │ │
│  │ GPIO 17  │ Barrier    │  │  └───────┘  │
│  │ GPIO 27  │ Open       │  │             │
│  │ GPIO 22  │ Barrier    │  └─────────────┘
│  │          │ Close      │
│  │ GPIO 5   │ Vehicle    │
│  │          │ Loop Detect│
│  │ GPIO 6   │ LED Red    │
│  │ GPIO 13  │ LED Yellow │
│  │ GPIO 19  │ LED Green  │
│  │ GPIO 26  │ Intercom   │
│  │          │ PTT        │
│  │ GPIO 23  │ Ticket     │
│  │          │ Dispenser  │
│  └──────────┴────────────┘
└─────────────────────────────────────────────┘
```

### 2.3 GPIO Wiring Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    GPIO WIRING DIAGRAM                        │
│                                                              │
│  ┌─────────────┐              ┌─────────────┐               │
│  │ Raspberry Pi│              │  Peripherals│               │
│  │             │              │             │               │
│  │ GPIO 17 ───┼──────────────┼──► BARRIER  │               │
│  │ (Pin 11)   │  3.3V Logic  │    OPEN     │               │
│  │             │              │             │               │
│  │ GPIO 27 ───┼──────────────┼──► BARRIER  │               │
│  │ (Pin 13)   │              │    CLOSE    │               │
│  │             │              │             │               │
│  │ GPIO 5  ───┼──────────────┼──► VEHICLE  │               │
│  │ (Pin 29)   │  Pull-up     │    LOOP     │               │
│  │             │              │    DETECT   │               │
│  │ GPIO 6  ───┼──────────────┼──► LED RED  │               │
│  │ (Pin 31)   │              │             │               │
│  │             │              │             │               │
│  │ GPIO 13 ───┼──────────────┼──► LED YEL  │               │
│  │ (Pin 33)   │              │             │               │
│  │             │              │             │               │
│  │ GPIO 19 ───┼──────────────┼──► LED GRN  │               │
│  │ (Pin 35)   │              │             │               │
│  │             │              │             │               │
│  │ GPIO 26 ───┼──────────────┼──► INTERCOM │               │
│  │ (Pin 37)   │              │    PTT      │               │
│  │             │              │             │               │
│  │ GPIO 23 ───┼──────────────┼──► TICKET   │               │
│  │ (Pin 16)   │              │    DISPENSE │               │
│  │             │              │             │               │
│  │ GND    ────┼──────────────┼──► COMMON   │               │
│  │ (Pin 6,9,  │              │    GND      │               │
│  │  14,20,25, │              │             │               │
│  │  30,34,39) │              │             │               │
│  └─────────────┘              └─────────────┘               │
│                                                              │
│  NOTE: All GPIO outputs are 3.3V max. Use relay modules     │
│        for higher voltage devices (barrier gate, LED sign).  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Vehicle Loop Detector

### 3.1 Installation

```
                    ROAD SURFACE
    ┌─────────────────────────────────────────┐
    │                                         │
    │         ┌───────────────────┐           │
    │         │   SAW CUT (6mm)  │           │
    │         │                   │           │
    │    ┌────┼───────────────────┼────┐      │
    │    │    │   LOOP WIRE       │    │      │
    │    │    │   (tinned copper) │    │      │
    │    │    │                   │    │      │
    │    │    │   ┌───────────┐   │    │      │
    │    │    │   │  2 turns  │   │    │      │
    │    │    │   │  2m x 1m  │   │    │      │
    │    │    │   └───────────┘   │    │      │
    │    │    │                   │    │      │
    │    └────┼───────────────────┼────┘      │
    │         │                   │           │
    │         └─────────┬─────────┘           │
    │                   │                     │
    │                   │ Lead-in wire         │
    │                   │ (shielded pair)      │
    │                   │                     │
    └───────────────────┼─────────────────────┘
                        │
                ┌───────┴───────┐
                │ LOOP DETECTOR │
                │    MODULE     │
                │               │
                │  Freq: 100kHz │
                │  Sensitivity: │
                │  adjustable   │
                └───────┬───────┘
                        │
                        │ Relay Output (NO/NC)
                        │
                ┌───────┴───────┐
                │ LANE CTRL RPi │
                │ GPIO 5        │
                └───────────────┘
```

### 3.2 Detection States

| State | Loop Inductance | Relay Output | RPi GPIO |
|-------|----------------|--------------|----------|
| No Vehicle | Baseline (L0) | OPEN | HIGH |
| Vehicle Present | Increased (L0 + ΔL) | CLOSED | LOW |
| Vehicle Exiting | Decreasing (L0 + ΔL → L0) | OPEN → CLOSED | LOW → HIGH |

---

## 4. LED Signal Lights

### 4.1 Traffic Light Configuration

```
┌─────────────────────────────────────┐
│         TRAFFIC LIGHT               │
│         (Overhead)                  │
│                                     │
│         ┌───────────┐              │
│         │  🔴 RED   │  STOP        │
│         │  (60W LED)│              │
│         ├───────────┤              │
│         │ 🟡 YELLOW │  CAUTION     │
│         │  (40W LED)│              │
│         ├───────────┤              │
│         │  🟢 GREEN │  PROCEED     │
│         │  (60W LED)│              │
│         └───────────┘              │
│                                     │
│         Height: 3.5–4.0m           │
│         Visibility: 200m+          │
│         Power: 150W total          │
│                                     │
└─────────────────────────────────────┘

CONTROL SEQUENCE:
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  Vehicle Detected → Toll Processing → Barrier Control   │
│                                                         │
│  State: CLOSED     → RISING    → OPEN    → FALLING     │
│  LED:   🔴 RED     → 🟡 YELLOW → 🟢 GREEN → 🟡 YELLOW  │
│                                                         │
│  Duration: 0s      → 2–4s     → 5–15s   → 2–4s        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Intercom System

### 5.1 Intercom Wiring

```
┌──────────────┐                    ┌──────────────┐
│  Lane Booth  │                    │  Lane Booth  │
│  (Operator)  │                    │  (Driver)    │
│              │                    │              │
│  ┌────────┐  │    Audio Cable     │  ┌────────┐  │
│  │Master  │◄─┼────────────────────┼─►│Slave   │  │
│  │Station │  │    (2-wire)        │  │Station │  │
│  │        │  │                    │  │        │  │
│  │[PTT]   │  │    Control Cable   │  │[Button]│  │
│  │[Volume]│◄─┼────────────────────┼─►[LED]   │  │
│  │[Power] │  │    (4-wire)        │  │[Speaker│  │
│  └───┬────┘  │                    │  └────────┘  │
│      │       │                    │              │
│      │       │                    │              │
│  ┌───┴────┐  │                    │              │
│  │ RPi    │  │                    │              │
│  │ GPIO26 │  │                    │              │
│  │ (PTT)  │  │                    │              │
│  └────────┘  │                    │              │
└──────────────┘                    └──────────────┘
```

### 5.2 Intercom Commands

| Command | Hex Code | Description |
|---------|----------|-------------|
| Start Call | `[0x03, 0x01]` | Open audio channel |
| End Call | `[0x03, 0x00]` | Close audio channel |
| Ring | `[0x03, 0x02]` | Alert operator |

---

## 6. Ticket Dispenser

### 6.1 Ticket Dispenser Wiring

```
┌──────────────┐                    ┌──────────────┐
│  Lane RPi    │                    │  Ticket      │
│  Controller  │                    │  Dispenser   │
│              │                    │              │
│  GPIO 23 ───┼───────────────────►│  Dispense    │
│  (Pin 16)    │  Serial Command   │  Trigger     │
│              │                    │              │
│  RX      ───┼───────────────────►│  TX          │
│  TX      ◄──┼────────────────────┤  RX          │
│  GND     ───┼────────────────────┤  GND         │
│              │                    │              │
│              │                    │  ┌────────┐  │
│              │                    │  │ Paper  │  │
│              │                    │  │ Roll   │  │
│              │                    │  │ (200+) │  │
│              │                    │  └────────┘  │
│              │                    │              │
│              │                    │  Status:     │
│              │                    │  - Ready     │
│              │                    │  - Paper Low │
│              │                    │  - Jammed    │
└──────────────┘                    └──────────────┘
```

### 6.2 Ticket Data Format

```json
{
  "ticketId": "TK-2026-000001",
  "vehicleClass": "SEDAN",
  "entryTime": "2026-09-12T10:30:00Z",
  "entryPlaza": "0-Mile",
  "plateNumber": "ABC-1234",
  "rfidTagId": "TAG-001",
  "tollRate": 1000,
  "currency": "MMK"
}
```

---

## 7. Software Installation (Lane Controller)

### 7.1 Raspberry Pi OS Setup

```bash
# Flash Raspberry Pi OS Lite (64-bit) to microSD
# Enable SSH, set hostname, configure WiFi

# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3-pip python3-serial \
  python3-rpi.gpio nodejs npm docker.io docker-compose

# Set serial permissions
sudo usermod -a -G dialout $USER
sudo usermod -a -G gpio $USER
```

### 7.2 Plaza Server Installation

```bash
# Clone repository
cd /opt
git clone https://github.com/MinNyi83/Highway-TollGate-MGMT-.git
cd Highway-TollGate-MGMT-/packages/plaza-server

# Configure plaza identity
cat > .env << EOF
PLAZA_ID=plaza-001
PLAZA_NAME=0-Mile Plaza
GATE_CODE=0ML
LANES=4
SERVER_PORT=4000
HQ_URL=http://192.168.100.101:3000
SYNC_TOKEN=tollgate-sync-token-2026

# RFID Configuration
RFID_TYPE=tcp
RFID_TCP_HOST=192.168.1.101
RFID_TCP_PORT=5000

# Database
DATABASE_URL=file:./data/plaza.db
EOF

# Start plaza server
docker compose up -d
```

### 7.3 Lane Controller Service

```bash
# Create systemd service
sudo cat > /etc/systemd/system/lane-controller.service << EOF
[Unit]
Description=TollGate Lane Controller
After=network.target docker.service

[Service]
Type=simple
User=pi
WorkingDirectory=/opt/Highway-TollGate-MGMT-/packages/plaza-server
ExecStart=/usr/bin/node src/lane-controller.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl enable lane-controller
sudo systemctl start lane-controller
```

---

## 8. Testing & Verification

```bash
# Test GPIO outputs
python3 -c "
import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)
GPIO.setup(17, GPIO.OUT)  # Barrier Open
GPIO.setup(27, GPIO.OUT)  # Barrier Close
GPIO.setup(6, GPIO.OUT)   # LED Red
GPIO.setup(13, GPIO.OUT)  # LED Yellow
GPIO.setup(19, GPIO.OUT)  # LED Green

# Test sequence
GPIO.output(6, True); time.sleep(1); GPIO.output(6, False)
GPIO.output(13, True); time.sleep(1); GPIO.output(13, False)
GPIO.output(19, True); time.sleep(1); GPIO.output(19, False)
GPIO.cleanup()
print('GPIO test passed')
"
```

---

## 9. Bill of Materials (per Lane)

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| Raspberry Pi 4 (4GB) | 1 | 350,000 | 350,000 |
| microSD Card (64GB A2) | 1 | 80,000 | 80,000 |
| Power Supply (USB-C 5V/3A) | 1 | 50,000 | 50,000 |
| Case (with cooling fan) | 1 | 60,000 | 60,000 |
| USB-to-Serial Adapter | 1 | 80,000 | 80,000 |
| GPIO Relay Module (8-ch) | 1 | 120,000 | 120,000 |
| Vehicle Loop Detector | 1 | 200,000 | 200,000 |
| LED Traffic Light (3-aspect) | 1 | 400,000 | 400,000 |
| Intercom System | 1 | 300,000 | 300,000 |
| Ticket Dispenser | 1 | 500,000 | 500,000 |
| Ethernet Cable (30m) | 1 | 100,000 | 100,000 |
| Cable Conduit (10m) | 1 | 80,000 | 80,000 |
| **Total per Lane** | | | **2,320,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
