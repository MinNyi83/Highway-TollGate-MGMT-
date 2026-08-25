import axios from 'axios';

export interface ONVIFDevice {
  ipAddress: string;
  port: number;
  name: string;
  manufacturer: string;
  model: string;
  firmware: string;
  scopes: string[];
}

export interface RTSPStream {
  channel: number;
  name: string;
  rtspUrl: string;
  httpUrl: string;
  resolution: string;
}

export class IPCameraService {
  private discoveryUrl: string;

  constructor(discoveryUrl?: string) {
    this.discoveryUrl = discoveryUrl || 'http://localhost:8080';
  }

  async discoverDevices(): Promise<ONVIFDevice[]> {
    try {
      const response = await axios.get(`${this.discoveryUrl}/api/cameras/discover`, { timeout: 10000 });
      return response.data.devices || [];
    } catch {
      return [];
    }
  }

  async testConnection(ipAddress: string, port: number, username: string, password: string): Promise<boolean> {
    try {
      const rtspUrl = `rtsp://${username}:${password}@${ipAddress}:${port}/stream1`;
      const response = await axios.get(`http://${ipAddress}:${port || 80}/ISAPI/System/deviceInfo`, {
        auth: { username, password },
        timeout: 5000,
      });
      return response.status === 200;
    } catch {
      return false;
    }
  }

  async getStreamUrl(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
    stream?: number;
  }): Promise<string> {
    const { ipAddress, port = 554, username, password, channel = 1, stream = 0 } = config;
    return `rtsp://${username}:${password}@${ipAddress}:${port}/channel${channel}${stream === 0 ? '01' : '02'}`;
  }

  async getSnapshotUrl(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
  }): Promise<string> {
    const { ipAddress, port = 80, username, password, channel = 1 } = config;
    return `http://${username}:${password}@${ipAddress}:${port}/ISAPI/Streaming/channels/${channel}/picture`;
  }

  async captureSnapshot(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
  }): Promise<string | null> {
    try {
      const url = await this.getSnapshotUrl(config);
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
      return `data:image/jpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    } catch {
      return null;
    }
  }

  async getPTZUrl(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
  }): Promise<string> {
    const { ipAddress, port = 80, channel = 1 } = config;
    return `http://${ipAddress}:${port}/ISAPI/Streaming/channels/${channel}/ptz`;
  }

  async ptzControl(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
    command: 'up' | 'down' | 'left' | 'right' | 'zoomIn' | 'zoomOut' | 'stop' | 'home';
    speed?: number;
  }): Promise<boolean> {
    try {
      const url = await this.getPTZUrl(config);
      await axios.post(url, `<PTZ><command>${config.command}</command><speed>${config.speed || 50}</speed></PTZ>`, {
        auth: { username: config.username, password: config.password },
        headers: { 'Content-Type': 'application/xml' },
        timeout: 5000,
      });
      return true;
    } catch {
      return false;
    }
  }

  async getDeviceCapabilities(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
  }): Promise<string[]> {
    try {
      const capabilities = ['snapshot', 'ptz', 'anpr', 'recording', 'analytics'];
      return capabilities;
    } catch {
      return [];
    }
  }

  generateHLSUrl(config: {
    ipAddress: string;
    port?: number;
    username: string;
    password: string;
    channel?: number;
  }): string {
    const { ipAddress, port = 554, username, password, channel = 1 } = config;
    return `rtsp://${username}:${password}@${ipAddress}:${port}/Streaming/Channels/${channel}01`;
  }

  generateWebRTCUrl(config: {
    ipAddress: string;
    port?: number;
    channel?: number;
  }): string {
    const { ipAddress, port = 80, channel = 1 } = config;
    return `http://${ipAddress}:${port}/Streaming/Channels/${channel}/httpPreview`;
  }
}

export function createIPCameraService(discoveryUrl?: string): IPCameraService {
  return new IPCameraService(discoveryUrl);
}
