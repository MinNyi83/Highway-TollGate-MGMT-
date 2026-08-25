import axios, { AxiosInstance } from 'axios';

export interface HikvisionConfig {
  ipAddress: string;
  port?: number;
  username: string;
  password: string;
  useHttps?: boolean;
}

export interface HikvisionDevice {
  serialNumber: string;
  model: string;
  firmwareVersion: string;
  deviceStatus: string;
}

export interface HikvisionANPRResult {
  plateNumber: string;
  confidence: number;
  timestamp: Date;
  cameraId: string;
  imageUrl?: string;
}

export interface HikvisionSnapshot {
  imageUrl: string;
  timestamp: Date;
}

export class HikvisionClient {
  private client: AxiosInstance;

  constructor(private config: HikvisionConfig) {
    const protocol = config.useHttps ? 'https' : 'http';
    this.client = axios.create({
      baseURL: `${protocol}://${config.ipAddress}:${config.port || 80}`,
      timeout: 15000,
      auth: {
        username: config.username,
        password: config.password,
      },
      headers: { 'Content-Type': 'application/xml' },
    });
  }

  async getDeviceInfo(): Promise<HikvisionDevice> {
    try {
      const response = await this.client.get('/ISAPI/System/deviceInfo');
      const xml = response.data;
      const extract = (tag: string) => {
        const match = xml.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
        return match ? match[1] : '';
      };
      return {
        serialNumber: extract('serialNumber'),
        model: extract('model'),
        firmwareVersion: extract('firmwareVersion'),
        deviceStatus: extract('deviceStatus'),
      };
    } catch {
      return { serialNumber: 'unknown', model: 'unknown', firmwareVersion: 'unknown', deviceStatus: 'unknown' };
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

  async getANPRResults(channel: number = 1, startIndex: number = 0): Promise<HikvisionANPRResult[]> {
    try {
      const response = await this.client.get(`/ISAPI/Traffic/channels/${channel}/anpr/picture/confirmed`, {
        params: { 'searchID': Date.now().toString(), startIndex, count: 50 },
      });
      const xml = response.data;
      const results: HikvisionANPRResult[] = [];
      const pictureMatches = xml.match(/<TrafficPicture>/g) || [];
      for (const _ of pictureMatches) {
        const plateMatch = xml.match(/<plateNumber>(.*?)<\/plateNumber>/);
        const timeMatch = xml.match(/<timeStamp>(.*?)<\/timeStamp>/);
        if (plateMatch) {
          results.push({
            plateNumber: plateMatch[1],
            confidence: 95,
            timestamp: timeMatch ? new Date(timeMatch[1]) : new Date(),
            cameraId: `CH${channel}`,
          });
        }
      }
      return results;
    } catch {
      return [];
    }
  }

  async getSnapshot(channel: number = 1): Promise<HikvisionSnapshot | null> {
    try {
      const response = await this.client.get(`/ISAPI/Streaming/channels/${channel}/picture`, {
        responseType: 'arraybuffer',
      });
      const base64 = Buffer.from(response.data).toString('base64');
      return {
        imageUrl: `data:image/jpeg;base64,${base64}`,
        timestamp: new Date(),
      };
    } catch {
      return null;
    }
  }

  async openDoor(doorIndex: number = 1): Promise<boolean> {
    try {
      await this.client.put(`/ISAPI/AccessControl/RemoteControl/door/${doorIndex}`, `<RemoteControlDoor><cmd>open</cmd></RemoteControlDoor>`);
      return true;
    } catch {
      return false;
    }
  }

  async closeDoor(doorIndex: number = 1): Promise<boolean> {
    try {
      await this.client.put(`/ISAPI/AccessControl/RemoteControl/door/${doorIndex}`, `<RemoteControlDoor><cmd>close</cmd></RemoteControlDoor>`);
      return true;
    } catch {
      return false;
    }
  }

  async setLED(hawkEye: number, mode: string): Promise<boolean> {
    try {
      await this.client.put('/ISAPI/AccessControl/RemoteControl/led', `<LED><hawkEye>${hawkEye}</hawkEye><mode>${mode}</mode></LED>`);
      return true;
    } catch {
      return false;
    }
  }

  async getStreamUrl(channel: number = 1, protocol: string = 'rtsp'): Promise<string> {
    const ip = this.config.ipAddress;
    const port = this.config.port || 554;
    if (protocol === 'rtsp') {
      return `rtsp://${this.config.username}:${this.config.password}@${ip}:${port}/Streaming/Channels/${channel}01`;
    }
    return `http://${ip}/Streaming/Channels/${channel}01/httpPreview`;
  }

  async getNVRChannels(): Promise<number[]> {
    try {
      const response = await this.client.get('/ISAPI/Streaming/channels');
      const xml = response.data;
      const channels: number[] = [];
      const matches = xml.match(/<id>(\d+)<\/id>/g) || [];
      for (const match of matches) {
        const num = parseInt(match.replace(/[^0-9]/g, ''));
        if (!isNaN(num)) channels.push(num);
      }
      return channels;
    } catch {
      return [];
    }
  }
}

export function createHikvisionClient(config: HikvisionConfig): HikvisionClient {
  return new HikvisionClient(config);
}
