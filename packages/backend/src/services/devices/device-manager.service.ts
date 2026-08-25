import { PrismaClient, DeviceType } from '@prisma/client';
import { createZKTecoClient, ZKTecoClient } from './zkteco.service';
import { createHikvisionClient, HikvisionClient } from './hikvision.service';
import { createIPCameraService, IPCameraService } from './ipcamera.service';
import { createTollHardwareService, TollHardwareService } from './toll-hardware.service';

const prisma = new PrismaClient();

interface DeviceConfig {
  id: string;
  plazaId: string;
  deviceType: DeviceType;
  ipAddress: string;
  port: number;
  username?: string;
  password?: string;
  apiUrl?: string;
  apiKey?: string;
  metadata?: any;
}

class DeviceManager {
  private zkClients: Map<string, ZKTecoClient> = new Map();
  private hkClients: Map<string, HikvisionClient> = new Map();
  private cameraService: IPCameraService;
  private hwServices: Map<string, TollHardwareService> = new Map();

  constructor() {
    this.cameraService = createIPCameraService();
  }

  async initializeDevice(config: DeviceConfig): Promise<any> {
    const { id, deviceType, ipAddress, port, username, password } = config;

    switch (deviceType) {
      case 'RFID_READER': {
        const client = createZKTecoClient({
          ipAddress,
          port,
          username: username || 'admin',
          password: password || 'admin',
        });
        this.zkClients.set(id, client);
        return client;
      }
      case 'ANPR_CAMERA': {
        const client = createHikvisionClient({
          ipAddress,
          port,
          username: username || 'admin',
          password: password || 'admin123',
        });
        this.hkClients.set(id, client);
        return client;
      }
      case 'BARRIER_GATE':
      case 'LANE_CONTROLLER':
      case 'TICKET_DISPENSER':
      case 'LED_SIGN':
      case 'INTERCOM': {
        const hwService = createTollHardwareService({
          type: deviceType.toLowerCase().replace('_', '') as any,
          connectionType: 'serial',
          port: config.metadata?.serialPort || 'COM1',
          baudRate: config.metadata?.baudRate || 9600,
          ipAddress,
          tcpPort: port,
        });
        this.hwServices.set(id, hwService);
        return hwService;
      }
      default:
        return null;
    }
  }

  async testDeviceConnection(config: DeviceConfig): Promise<{ online: boolean; message: string }> {
    try {
      switch (config.deviceType) {
        case 'RFID_READER': {
          const client = createZKTecoClient({
            ipAddress: config.ipAddress,
            port: config.port,
            username: config.username || 'admin',
            password: config.password || 'admin',
          });
          const online = await client.testConnection();
          return { online, message: online ? 'Connected' : 'Connection failed' };
        }
        case 'ANPR_CAMERA': {
          const client = createHikvisionClient({
            ipAddress: config.ipAddress,
            port: config.port,
            username: config.username || 'admin',
            password: config.password || 'admin123',
          });
          const online = await client.testConnection();
          return { online, message: online ? 'Connected' : 'Connection failed' };
        }
        case 'BARRIER_GATE':
        case 'LANE_CONTROLLER': {
          const hwService = createTollHardwareService({
            type: config.deviceType.toLowerCase().replace('_', '') as any,
            connectionType: config.metadata?.connectionType || 'serial',
            port: config.metadata?.serialPort || 'COM1',
            baudRate: config.metadata?.baudRate || 9600,
            ipAddress: config.ipAddress,
            tcpPort: config.port,
          });
          const online = await hwService.connect();
          return { online, message: online ? 'Connected' : 'Connection failed' };
        }
        default:
          return { online: false, message: 'Unknown device type' };
      }
    } catch (error) {
      return { online: false, message: `Error: ${error}` };
    }
  }

  async getDeviceStatus(deviceId: string) {
    const device = await prisma.deviceStatus.findUnique({ where: { id: deviceId } });
    if (!device) return null;

    const config: DeviceConfig = {
      id: device.id,
      plazaId: device.plazaId,
      deviceType: device.deviceType,
      ipAddress: device.ipAddress || '',
      port: device.port || 0,
      username: (device.metadata as any)?.username,
      password: (device.metadata as any)?.password,
    };

    const result = await this.testDeviceConnection(config);
    await prisma.deviceStatus.update({
      where: { id: deviceId },
      data: {
        status: result.online ? 'ONLINE' : 'OFFLINE',
        lastHeartbeat: new Date(),
      },
    });
    return result;
  }

  getZKTecoClient(deviceId: string): ZKTecoClient | undefined {
    return this.zkClients.get(deviceId);
  }

  getHikvisionClient(deviceId: string): HikvisionClient | undefined {
    return this.hkClients.get(deviceId);
  }

  getHardwareService(deviceId: string): TollHardwareService | undefined {
    return this.hwServices.get(deviceId);
  }
}

export const deviceManager = new DeviceManager();
