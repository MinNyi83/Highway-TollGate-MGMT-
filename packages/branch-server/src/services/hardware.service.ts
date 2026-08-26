import { Server as SocketIOServer } from 'socket.io';
import { logger } from '../utils/logger';

interface RFIDScanData {
  tagUid: string;
  readerId: string;
  laneId: number;
  timestamp: string;
}

interface ANPRDetectionData {
  plateNumber: string;
  cameraId: string;
  laneId: number;
  confidence: number;
  timestamp: string;
  imageUrl?: string;
}

interface HardwareEvent {
  type: 'rfid_scan' | 'anpr_detection';
  data: RFIDScanData | ANPRDetectionData;
  processed: boolean;
  eventId?: string;
}

export class HardwareService {
  private io: SocketIOServer;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private deviceStatuses: Map<string, { status: string; lastSeen: Date }> =
    new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  async handleRFIDScan(data: RFIDScanData): Promise<HardwareEvent> {
    logger.info('RFID scan detected:', data);

    // Emit to connected clients
    this.io.emit('hardware:rfid-scan', {
      type: 'rfid_scan',
      data,
      timestamp: new Date().toISOString(),
    });

    // Update device status
    this.updateDeviceStatus(`rfid-${data.readerId}`, 'ONLINE');

    return {
      type: 'rfid_scan',
      data,
      processed: true,
    };
  }

  async handleANPRDetection(data: ANPRDetectionData): Promise<HardwareEvent> {
    logger.info('ANPR detection:', data);

    // Emit to connected clients
    this.io.emit('hardware:anpr-detection', {
      type: 'anpr_detection',
      data,
      timestamp: new Date().toISOString(),
    });

    // Update device status
    this.updateDeviceStatus(`anpr-${data.cameraId}`, 'ONLINE');

    return {
      type: 'anpr_detection',
      data,
      processed: true,
    };
  }

  private updateDeviceStatus(deviceId: string, status: string): void {
    this.deviceStatuses.set(deviceId, {
      status,
      lastSeen: new Date(),
    });
  }

  startMonitoring(): void {
    // Check device health every 30 seconds
    this.monitoringInterval = setInterval(() => {
      const now = new Date();
      const THRESHOLD = 60000; // 1 minute

      this.deviceStatuses.forEach((status, deviceId) => {
        const timeSinceLastSeen = now.getTime() - status.lastSeen.getTime();

        if (timeSinceLastSeen > THRESHOLD) {
          logger.warn(`Device ${deviceId} may be offline (no heartbeat for ${timeSinceLastSeen}ms)`);
          this.io.emit('hardware:device-offline', {
            deviceId,
            lastSeen: status.lastSeen.toISOString(),
          });
        }
      });
    }, 30000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  getDeviceStatuses(): Map<string, { status: string; lastSeen: Date }> {
    return this.deviceStatuses;
  }
}
