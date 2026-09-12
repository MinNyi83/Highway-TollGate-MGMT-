# RFID Reader Installation Guide

## TollGate RFID Pass — Hardware Installation

---

## 1. Supported RFID Readers

| Model | Type | Protocol | Interface | Range |
|-------|------|----------|-----------|-------|
| ZKTeco UHF300 | UHF RFID | TCP/IP | Ethernet | 3–12m |
| ZKTeco UHF400 | UHF RFID | TCP/IP | Ethernet | 5–15m |
| Impinj Speedway R420 | UHF RFID | TCP/IP | Ethernet | 3–12m |
| Zebra FX9600 | UHF RFID | TCP/IP | Ethernet | 3–12m |
| Generic Serial Reader | LF/HF RFID | RS232 | USB-to-Serial | 0–10cm |
| ZKTeco C3-200 | Access Control | HTTP API | Ethernet | 0–5cm |

---

## 2. Network Topology — RFID Reader per Lane

```
                    ┌─────────────────────────────────────────────────┐
                    │              TOLL PLAZA (per plaza)             │
                    │                                                 │
  ══════════════════╪═════════════════════════════════════════════════╪══════
     LANE 1A        │              LANE 1B            LANE 2A        │
  ┌─────────────────┤   ┌─────────────────────┐  ┌──────────────────┤
  │                 │   │                     │  │                  │
  │  ┌───────────┐  │   │  ┌───────────┐     │  │  ┌───────────┐  │
  │  │  UHF RFID │  │   │  │  UHF RFID │     │  │  │  UHF RFID │  │
  │  │  Reader   │  │   │  │  Reader   │     │  │  │  Reader   │  │
  │  │           │  │   │  │           │     │  │  │           │  │
  │  │ 192.168.  │  │   │  │ 192.168.  │     │  │  │ 192.168.  │  │
  │  │ 1.101     │  │   │  │ 1.102     │     │  │  │ 1.103     │  │
  │  └─────┬─────┘  │   │  └─────┬─────┘     │  │  └─────┬─────┘  │
  │        │        │   │        │             │  │        │        │
  │  ┌─────┴────────┴───┴────────┴─────────────┴──┴────────┴─────┐  │
  │  │              LANE CONTROLLER (RPi / MCU)                  │  │
  │  │              192.168.1.50                                  │  │
  │  └─────────────────────┬─────────────────────────────────────┘  │
  │                        │                                        │
  └────────────────────────┼────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  PLAZA RPi  │
                    │  Server     │
                    │  :4000      │
                    └──────┬──────┘
                           │  Ethernet / VPN
                    ┌──────┴──────┐
                    │  HQ Server  │
                    │  :3000 API  │
                    └─────────────┘
```

---

## 3. RFID Reader Types

### 3.1 TCP/IP RFID Reader (Recommended)

**Connection**: Ethernet cable to dedicated VLAN or LAN

```
┌──────────────┐     Ethernet      ┌──────────────┐
│ UHF RFID     │◄────────────────►│ Network      │
│ Reader       │  10/100 Mbps      │ Switch       │
│ 192.168.1.x  │  Cat5e/Cat6       │              │
└──────────────┘                   └──────┬───────┘
                                          │
                                   ┌──────┴───────┐
                                   │ RPi Plaza    │
                                   │ Server       │
                                   └──────────────┘
```

**Setup Steps**:
1. Connect RFID reader to network switch via Ethernet
2. Assign static IP: `192.168.1.10x` (where x = lane number)
3. Configure reader via web interface (usually `192.168.1.1` default)
4. Set TCP port: `5000` (default)
5. Configure read mode: Auto-read on tag detection
6. Test connectivity: `telnet 192.168.1.101 5000`

**Configuration**:
```env
RFID_TYPE=tcp
RFID_TCP_HOST=192.168.1.101
RFID_TCP_PORT=5000
```

### 3.2 Serial RFID Reader (USB)

**Connection**: USB-to-Serial adapter on Raspberry Pi

```
┌──────────────┐    USB-to-Serial   ┌──────────────┐
│ Serial RFID  │◄──────────────────►│ Raspberry Pi │
│ Reader       │  RS232/USB         │ /dev/ttyUSB0 │
│              │  9600 baud         │              │
└──────────────┘                    └──────────────┘
```

**Setup Steps**:
1. Connect RFID reader to USB-to-Serial adapter
2. Plug USB adapter into Raspberry Pi
3. Verify device: `ls /dev/ttyUSB*`
4. Set permissions: `sudo usermod -a -G dialout $USER`
5. Configure baud rate: `9600` (default)
6. Test: `screen /dev/ttyUSB0 9600`

**Configuration**:
```env
RFID_TYPE=serial
RFID_SERIAL_PORT=/dev/ttyUSB0
RFID_BAUD_RATE=9600
```

### 3.3 ZKTeco Access Control (HTTP API)

**Connection**: Ethernet with HTTP REST API

```
┌──────────────┐     Ethernet      ┌──────────────┐
│ ZKTeco       │◄────────────────►│ Network      │
│ C3-200 /     │  HTTP/HTTPS       │ Switch       │
│ UHF Reader   │  Port 80/443      │              │
└──────────────┘                   └──────┬───────┘
                                          │
                                   ┌──────┴───────┐
                                   │ Backend API  │
                                   │ :3000        │
                                   └──────────────┘
```

**Setup Steps**:
1. Connect ZKTeco device to network
2. Access web interface: `http://<device-ip>`
3. Default credentials: `admin` / `admin`
4. Enable API access in device settings
5. Configure token-based authentication
6. Register device in TollGate backend

---

## 4. Physical Installation

### 4.1 Mounting Position

```
                    ┌──────────────────────────┐
                    │      TOLL LANE (TOP)      │
                    │                          │
     ┌──────────────┼──────────────────────────┼──────────────┐
     │              │                          │              │
     │    ┌─────────┴────────┐    ┌────────────┴──────────┐  │
     │    │  OVERHEAD GANTRY │    │  RFID ANTENNA ARRAY   │  │
     │    │                  │    │  (2x directional)     │  │
     │    │  [LED Sign]      │    │  Height: 5.5–6.0m     │  │
     │    │  [ANPR Camera]   │    │  Tilt: 30–45° down    │  │
     │    └──────────────────┘    └───────────────────────┘  │
     │                                                       │
     │    ┌─────────────────────────────────────────────┐   │
     │    │            ROAD SURFACE                      │   │
     │    │  [Vehicle Loop Detector] ── in ground ──     │   │
     │    │  [RFID Ground Antenna]  ── optional ──       │   │
     │    └─────────────────────────────────────────────┘   │
     │                                                       │
     │    ┌──────────────┐                                  │
     │    │ LANE BOOTH   │  [Barrier Gate]                  │
     │    │ [Intercom]   │  [Ticket Dispenser]              │
     │    └──────────────┘                                  │
     └───────────────────────────────────────────────────────┘
```

### 4.2 Antenna Specifications

| Parameter | Value |
|-----------|-------|
| Frequency | 920–925 MHz (UHF) |
| Polarization | Circular |
| Gain | 8–12 dBi |
| Beam Width | 65° horizontal, 65° vertical |
| Mounting Height | 5.5–6.0 meters |
| Tilt Angle | 30–45° downward |
| Read Range | 3–12 meters (adjustable) |
| Read Rate | >200 tags/second |

### 4.3 Wiring Diagram (Serial)

```
RFID Reader          USB-to-Serial Adapter       Raspberry Pi
┌─────────┐         ┌──────────────────┐         ┌─────────┐
│         │         │                  │         │         │
│  TX  ───┼────────►│ RX           USB ├──┬──────►│ USB     │
│  RX  ◄──┼─────────┤ TX              │  │       │ Port    │
│  GND ───┼─────────┤ GND             │  │       │         │
│  RTS ───┼─────────┤ RTS             │  │       │ /dev/   │
│  CTS ◄──┼─────────┤ CTS             │  │       │ ttyUSB0 │
│         │         │                  │  │       │         │
│  VCC  ──┼── 12V   │                  │  │       └─────────┘
│  GND  ──┼── GND   │                  │  │
└─────────┘         └──────────────────┘  │
                                          │
                              ┌────────────┘
                              │
                         ┌────┴────┐
                         │  Power  │
                         │ Supply  │
                         │ 12V/5A  │
                         └─────────┘
```

---

## 5. Network Configuration

### 5.1 VLAN Setup (Recommended)

```
┌─────────────────────────────────────────────────────┐
│                    NETWORK LAYOUT                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  VLAN 10 — Management (192.168.10.0/24)            │
│  ├── HQ Server: 192.168.10.1                       │
│  ├── Admin Workstations: 192.168.10.100–200        │
│  └── Network Switches: 192.168.10.1–10             │
│                                                     │
│  VLAN 20 — Toll Lane Devices (192.168.20.0/24)     │
│  ├── RFID Readers: 192.168.20.101–120              │
│  ├── ANPR Cameras: 192.168.20.151–170              │
│  ├── Lane Controllers: 192.168.20.201–220          │
│  └── Barrier Gates: 192.168.20.251–270             │
│                                                     │
│  VLAN 30 — Server Farm (192.168.30.0/24)           │
│  ├── Database Servers: 192.168.30.10–20            │
│  ├── Application Servers: 192.168.30.30–40         │
│  └── Storage Servers: 192.168.30.50–60             │
│                                                     │
│  VLAN 40 — Guest/WiFi (192.168.40.0/24)            │
│  └── Guest Access: 192.168.40.100–254              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 5.2 Firewall Rules

```bash
# Allow RFID reader traffic (TCP port 5000)
sudo iptables -A INPUT -p tcp --dport 5000 -s 192.168.20.0/24 -j ACCEPT

# Allow ANPR camera traffic (HTTP port 80)
sudo iptables -A INPUT -p tcp --dport 80 -s 192.168.20.0/24 -j ACCEPT

# Allow RPi sync traffic (port 4000)
sudo iptables -A INPUT -p tcp --dport 4000 -s 192.168.20.0/24 -j ACCEPT

# Block all other traffic from device VLAN
sudo iptables -A INPUT -s 192.168.20.0/24 -j DROP
```

---

## 6. Testing & Verification

### 6.1 Connectivity Test

```bash
# Test RFID reader is reachable
ping 192.168.1.101

# Test TCP port is open
telnet 192.168.1.101 5000

# Test with netcat
nc -zv 192.168.1.101 5000

# Test with nmap
nmap -p 5000 192.168.1.101
```

### 6.2 Read Test

```bash
# Place a known RFID tag in front of the reader
# Check the TollGate backend logs:
docker logs tollgate-rfid-backend-1 --tail 50 | grep rfid

# Or check via API:
curl -s http://localhost:3000/api/device-status | jq '.[] | select(.deviceType=="RFID_READER")'
```

### 6.3 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No read | Wrong frequency band | Check regional frequency settings |
| Intermittent reads | Antenna alignment | Adjust tilt angle, check cables |
| Slow reads | Reader overload | Reduce read power, check firmware |
| Connection refused | Wrong port/IP | Verify TCP settings, check firewall |
| Serial permission denied | User not in dialout group | `sudo usermod -a -G dialout $USER` |
| Device not found | Wrong serial port | Check `ls /dev/ttyUSB*` |

---

## 7. Maintenance Schedule

| Task | Frequency | Details |
|------|-----------|---------|
| Clean antenna | Monthly | Wipe with dry cloth, check for damage |
| Check cable connections | Monthly | Inspect all Ethernet/serial cables |
| Firmware update | Quarterly | Check vendor website for updates |
| Calibration test | Quarterly | Test read range with known tags |
| Full inspection | Annually | Professional inspection and certification |

---

## 8. Bill of Materials (per Lane)

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| UHF RFID Reader | 1 | 2,500,000 | 2,500,000 |
| RFID Antenna (8dBi) | 2 | 500,000 | 1,000,000 |
| Coaxial Cable (LMR-240) | 2 | 150,000 | 300,000 |
| N-Type Connectors | 4 | 25,000 | 100,000 |
| Mounting Bracket | 1 | 200,000 | 200,000 |
| Ethernet Cable (Cat6, 30m) | 1 | 100,000 | 100,000 |
| PoE Injector (if needed) | 1 | 150,000 | 150,000 |
| **Total per Lane** | | | **4,350,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
