import axios, { AxiosInstance } from 'axios';

export interface ZKTecoConfig {
  ipAddress: string;
  port?: number;
  username: string;
  password: string;
  useHttps?: boolean;
}

export interface ZKTecoDevice {
  serialNumber: string;
  model: string;
  firmware: string;
  status: 'online' | 'offline';
}

export interface ZKTecoAttendanceRecord {
  userId: string;
  timestamp: Date;
  verifyType: 'fingerprint' | 'face' | 'card' | 'password';
  inOut: 'in' | 'out';
}

export interface ZKTecoFaceRecord {
  userId: string;
  userName: string;
  faceData: string;
  enrollIndex: number;
}

export class ZKTecoClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(private config: ZKTecoConfig) {
    const protocol = config.useHttps ? 'https' : 'http';
    this.client = axios.create({
      baseURL: `${protocol}://${config.ipAddress}:${config.port || 80}`,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  private async authenticate(): Promise<void> {
    try {
      const response = await this.client.post('/api/token', {
        username: this.config.username,
        password: this.config.password,
      });
      this.token = response.data.token;
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    } catch (error) {
      throw new Error(`ZKTeco authentication failed: ${error}`);
    }
  }

  private async ensureAuth(): Promise<void> {
    if (!this.token) await this.authenticate();
  }

  async getDeviceInfo(): Promise<ZKTecoDevice> {
    await this.ensureAuth();
    try {
      const response = await this.client.get('/api/device/info');
      return {
        serialNumber: response.data.serialNumber,
        model: response.data.model,
        firmware: response.data.firmware,
        status: 'online',
      };
    } catch {
      return { serialNumber: 'unknown', model: 'unknown', firmware: 'unknown', status: 'offline' };
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.getDeviceInfo();
      return true;
    } catch {
      return false;
    }
  }

  async getAttendanceRecords(startTime?: Date, endTime?: Date): Promise<ZKTecoAttendanceRecord[]> {
    await this.ensureAuth();
    try {
      const params: any = {};
      if (startTime) params.start = startTime.toISOString();
      if (endTime) params.end = endTime.toISOString();
      const response = await this.client.get('/api/attendance/records', { params });
      return response.data.records || [];
    } catch {
      return [];
    }
  }

  async getFaceRecords(): Promise<ZKTecoFaceRecord[]> {
    await this.ensureAuth();
    try {
      const response = await this.client.get('/api/face/records');
      return response.data.records || [];
    } catch {
      return [];
    }
  }

  async enrollFace(userId: string, faceData: string): Promise<boolean> {
    await this.ensureAuth();
    try {
      await this.client.post('/api/face/enroll', { userId, faceData });
      return true;
    } catch {
      return false;
    }
  }

  async openDoor(doorId: number = 1): Promise<boolean> {
    await this.ensureAuth();
    try {
      await this.client.post(`/api/door/${doorId}/open`);
      return true;
    } catch {
      return false;
    }
  }

  async setDoorState(doorId: number, state: 'open' | 'close' | 'normal'): Promise<boolean> {
    await this.ensureAuth();
    try {
      await this.client.post(`/api/door/${doorId}/state`, { state });
      return true;
    } catch {
      return false;
    }
  }

  async reboot(): Promise<boolean> {
    await this.ensureAuth();
    try {
      await this.client.post('/api/device/reboot');
      return true;
    } catch {
      return false;
    }
  }

  async getLogs(page: number = 1, limit: number = 50): Promise<any[]> {
    await this.ensureAuth();
    try {
      const response = await this.client.get('/api/logs', { params: { page, limit } });
      return response.data.logs || [];
    } catch {
      return [];
    }
  }
}

export function createZKTecoClient(config: ZKTecoConfig): ZKTecoClient {
  return new ZKTecoClient(config);
}
