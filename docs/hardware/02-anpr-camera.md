# ANPR Camera Installation Guide

## TollGate RFID Pass — Hardware Installation

---

## 1. Supported ANPR Cameras

| Model | Resolution | ANPR Accuracy | Protocol | Night Vision |
|-------|-----------|---------------|----------|--------------|
| Hikvision DS-2CD7A46G0-IZHS | 4MP | >99% | ISAPI/ONVIF | 50m IR |
| Hikvision iDS-2CD7A46G0/P-IZHSY | 4MP | >99% (with AI) | ISAPI/ONVIF | 50m IR |
| Dahua IPC-HFW5442T-ASE | 4MP | >98% | ISAPI/ONVIF | 50m IR |
| Dahua IPC-PDW5442T-A-ASE | 4MP | >98% (with AI) | ISAPI/ONVIF | 50m IR |
| Axis P1448-LE | 4MP | >98% | VAPIX/ONVIF | 50m IR |

---

## 2. Network Topology — ANPR Camera per Lane

```
┌──────────────────────────────────────────────────────────────┐
│                    TOLL PLAZA (per plaza)                     │
│                                                              │
│  LANE 1A              LANE 1B              LANE 2A           │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐  │
│  │ Hikvision      │  │ Hikvision      │  │ Hikvision      │  │
│  │ DS-2CD7A46     │  │ DS-2CD7A46     │  │ DS-2CD7A46     │  │
│  │                │  │                │  │                │  │
│  │ 192.168.1.151  │  │ 192.168.1.152  │  │ 192.168.1.153  │  │
│  │ HTTP :80       │  │ HTTP :80       │  │ HTTP :80       │  │
│  │ RTSP :554      │  │ RTSP :554      │  │ RTSP :554      │  │
│  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘  │
│          │                   │                   │            │
│          │    PoE Switch     │                   │            │
│          └─────────┬─────────┴─────────┬─────────┘            │
│                    │                   │                      │
│            ┌───────┴───────┐   ┌───────┴───────┐             │
│            │ NVR / Storage │   │ Plaza RPi     │             │
│            │ 192.168.1.200 │   │ Server :4000  │             │
│            └───────────────┘   └───────┬───────┘             │
│                                        │                     │
└────────────────────────────────────────┼─────────────────────┘
                                         │ Ethernet/VPN
                                  ┌──────┴──────┐
                                  │ HQ Server   │
                                  │ :3000 API   │
                                  └─────────────┘
```

---

## 3. Camera Architecture

### 3.1 ISAPI Integration (Hikvision)

```
┌──────────────────────┐          ┌──────────────────────┐
│   Hikvision Camera   │          │   Backend API        │
│                      │          │                      │
│   HTTP :80           │◄────────►│   ISAPI Client       │
│   RTSP :554          │  XML     │   :3000              │
│   HTTPS :443         │  JSON    │                      │
│                      │          │   Endpoints:         │
│   ANPR Engine        │          │   /api/device-status │
│   - Plate Detection  │          │   /api/toll-events   │
│   - Character Recog  │          │   /api/vehicles      │
│   - Confidence Score │          │                      │
└──────────────────────┘          └──────────────────────┘
```

### 3.2 RTSP Stream Flow

```
Camera ──RTSP──► NVR/Storage ──RTSP──► Plaza Server ──HTTP──► Backend
   │                                        │
   │  rtsp://user:pass@ip:554/              │  Snapshot capture
   │  Streaming/Channels/101                │  /ISAPI/Streaming/
   │                                        │  channels/1/picture
   └────────────────────────────────────────┘
```

---

## 4. Installation Steps

### 4.1 Physical Mounting

```
        OVERHEAD GANTRY (6m height)
        ┌──────────────────────────────────┐
        │                                  │
        │    ┌──────────────────────┐      │
        │    │    ANPR CAMERA       │      │
        │    │                      │      │
        │    │  ┌────────────────┐  │      │
        │    │  │  [LED Sign]    │  │      │
        │    │  │  [Warning]     │  │      │
        │    │  └────────────────┘  │      │
        │    │                      │      │
        │    │  Height: 5.5–6.5m    │      │
        │    │  Angle: 15–30°       │      │
        │    │  Coverage: 1 lane    │      │
        │    └──────────────────────┘      │
        │                                  │
        └──────────────────────────────────┘
                       │
                       │  Ethernet (PoE)
                       │
                ┌──────┴──────┐
                │ PoE Switch  │
                │ 192.168.1.x │
                └─────────────┘
```

### 4.2 Camera Angle Optimization

```
  SIDE VIEW (Camera → Vehicle Path)
  
         Camera
           │╲
           │  ╲  15–30° downward
           │    ╲
           │      ╲
           │        ╲
  ─────────┼──────────╲─────────────
  Road     │           ╲    Vehicle
  Surface  │            ╲   Path
           │             ╲
           │              ●─── Plate detected here
           │
           │◄─── 3–8m ───►│
           │   (detection zone)
  
  TOP VIEW (Camera Coverage)
  
           Camera FOV (60–90°)
                 ╱╲
                ╱  ╲
               ╱    ╲
              ╱      ╲
             ╱   ●    ╲      ● = Vehicle plate
            ╱  ●   ●   ╲
           ╱ ●    ●    ╲
          ╱─────────────╲
         ╱───────────────╲
        ╱                 ╲
       ╱                   ╲
```

### 4.3 PoE Wiring

```
┌──────────────────┐     Cat6/PoE     ┌──────────────────┐
│ PoE Switch       │◄────────────────►│ Hikvision Camera │
│                  │                  │                  │
│ Port 1: Camera 1│  802.3af (15.4W) │ Power: 12V DC    │
│ Port 2: Camera 2│  or 802.3at (30W)│ via PoE          │
│ Port 3: Camera 3│                  │                  │
│ Port 4: Camera 4│                  │                  │
│                  │                  │                  │
│ Uplink: 1GbE    │                  │ Network: 100Mb   │
│ to Core Switch  │                  │ (sufficient for  │
└──────────────────┘                  │  ANPR snapshots) │
                                      └──────────────────┘
```

---

## 5. Hikvision ISAPI Configuration

### 5.1 Default Credentials

```
Username: admin
Password: admin123 (change on first login!)
```

### 5.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/ISAPI/Traffic/channels/1/anpr/picture/confirmed` | GET | Get ANPR results |
| `/ISAPI/Streaming/channels/1/picture` | GET | Capture snapshot |
| `/ISAPI/Streaming/channels` | GET | List camera channels |
| `/ISAPI/AccessControl/RemoteControl/door/1` | PUT | Open/close barrier |
| `/ISAPI/AccessControl/RemoteControl/led` | PUT | Control LED display |
| `/ISAPI/System/deviceInfo` | GET | Get device info |

### 5.3 RTSP Stream URL Format

```
rtsp://<username>:<password>@<camera-ip>:554/Streaming/Channels/<channel>01

Examples:
  rtsp://admin:admin123@192.168.1.151:554/Streaming/Channels/101
  rtsp://admin:admin123@192.168.1.151:554/Streaming/Channels/201
```

### 5.4 ANPR Configuration

```json
{
  "ANPR": {
    "enable": true,
    "channel": 1,
    "triggerMode": "auto",
    "plateFormat": "Myanmar",
    "plateRegion": "Asia",
    "confidenceThreshold": 0.85,
    "captureInterval": 100,
    "maxPlatesPerSecond": 10,
    "enableColorRecognition": true,
    "enableVehicleType": true,
    "enableVehicleColor": true
  }
}
```

---

## 6. Backend Integration

### 6.1 Device Registration

```bash
# Register Hikvision camera via API
curl -X POST http://localhost:3000/api/device-status \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "plazaId": "plaza-001",
    "deviceType": "ANPR_CAMERA",
    "deviceId": "hik-001",
    "name": "Lane 1A ANPR Camera",
    "ipAddress": "192.168.1.151",
    "port": 80,
    "lane": "1A",
    "model": "DS-2CD7A46G0-IZHS",
    "manufacturer": "Hikvision",
    "metadata": {
      "username": "admin",
      "password": "admin123",
      "rtspUrl": "rtsp://admin:admin123@192.168.1.151:554/Streaming/Channels/101"
    }
  }'
```

### 6.2 ANPR Data Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Camera  │───►│  Plaza   │───►│  Backend │───►│ Database │
│  ANPR    │    │  Server  │    │  API     │    │          │
│  Engine  │    │  :4000   │    │  :3000   │    │  :5432   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
    │               │               │               │
    │  HTTP POST    │  REST API     │  SQL INSERT   │
    │  plate data   │  sync         │  toll_event   │
    │               │               │               │
    ▼               ▼               ▼               ▼
  Plate:         Queue:          Process:        Store:
  ABC-1234       sync_queue      match RFID      toll_events
  Confidence:    (if offline)    check balance   vehicle_photos
  0.98                           open barrier
```

---

## 7. Testing & Verification

### 7.1 Camera Discovery Test

```bash
# Test camera is reachable
ping 192.168.1.151

# Test HTTP API
curl -s http://192.168.1.151/ISAPI/System/deviceInfo \
  -u admin:admin123

# Test snapshot capture
curl -s -o snapshot.jpg \
  http://192.168.1.151/ISAPI/Streaming/channels/1/picture \
  -u admin:admin123

# Test RTSP stream (requires ffplay/ffmpeg)
ffplay rtsp://admin:admin123@192.168.1.151:554/Streaming/Channels/101
```

### 7.2 ANPR Test

```bash
# Test ANPR endpoint via TollGate backend
curl -s http://localhost:3000/api/device-status \
  -H "Authorization: Bearer <token>" | jq '.[] | select(.deviceType=="ANPR_CAMERA")'

# Check ANPR results in database
docker exec tollgate-rfid-db-1 psql -U postgres -d tollgate \
  -c "SELECT * FROM toll_events ORDER BY created_at DESC LIMIT 10;"
```

### 7.3 Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| No snapshot | Wrong credentials | Verify username/password |
| Poor plate recognition | Bad lighting/angle | Adjust camera angle, add IR illumination |
| Low confidence score | Dirty lens/plate | Clean lens, check plate visibility |
| RTSP stream fails | Port blocked | Check firewall, verify port 554 |
| ANPR not triggering | Feature disabled | Enable ANPR in camera settings |
| Delayed recognition | Network latency | Check switch, reduce VLAN hops |

---

## 8. Bill of Materials (per Lane)

| Item | Qty | Unit Cost (MMK) | Total (MMK) |
|------|-----|-----------------|-------------|
| Hikvision ANPR Camera | 1 | 4,500,000 | 4,500,000 |
| PoE Injector (if no PoE switch) | 1 | 150,000 | 150,000 |
| Mounting Bracket (pole mount) | 1 | 200,000 | 200,000 |
| Cat6 Cable (30m, outdoor rated) | 1 | 150,000 | 150,000 |
| Cable Conduit (10m) | 1 | 80,000 | 80,000 |
| Junction Box (outdoor) | 1 | 50,000 | 50,000 |
| **Total per Lane** | | | **5,130,000** |

---

*Document Version: 1.0 — September 2026*
*TollGate RFID Pass — Enterprise Highway OS*
