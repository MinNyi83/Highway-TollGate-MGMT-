import { SerialPort } from 'serialport';
import { EventEmitter } from 'events';

export interface TollHardwareConfig {
  type: 'barrier' | 'lane_controller' | 'ticket_dispenser' | 'led_sign' | 'intercom';
  connectionType: 'serial' | 'tcp' | 'modbus';
  port?: string;
  baudRate?: number;
  ipAddress?: string;
  tcpPort?: number;
  slaveId?: number;
}

export interface BarrierGateState {
  isRising: boolean;
  isFalling: boolean;
  isOpen: boolean;
  isClosed: boolean;
  error: boolean;
}

export interface LaneControllerState {
  laneId: number;
  vehicleDetected: boolean;
  rfidReaderActive: boolean;
  anprCameraActive: boolean;
  barrierOpen: boolean;
  ledSignal: 'red' | 'green' | 'yellow' | 'off';
}

export interface TicketInfo {
  ticketId: string;
  vehicleClass: string;
  entryTime: Date;
  entryPlaza: string;
  plateNumber?: string;
}

export class TollHardwareService extends EventEmitter {
  private port: SerialPort | null = null;
  private connected = false;

  constructor(private config: TollHardwareConfig) {
    super();
  }

  async connect(): Promise<boolean> {
    try {
      if (this.config.connectionType === 'serial' && this.config.port) {
        this.port = new SerialPort({
          path: this.config.port,
          baudRate: this.config.baudRate || 9600,
        });
        this.port.on('data', (data: Buffer) => this.handleData(data));
        this.port.on('error', (err: Error) => this.emit('error', err));
        this.connected = true;
      } else if (this.config.connectionType === 'tcp' && this.config.ipAddress) {
        this.connected = true;
      }
      this.emit('connected');
      return this.connected;
    } catch {
      this.connected = false;
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.port?.isOpen) {
      this.port.close();
    }
    this.connected = false;
    this.emit('disconnected');
  }

  isConnected(): boolean {
    return this.connected;
  }

  private handleData(data: Buffer): void {
    this.emit('data', data);
    const command = data.toString('hex');
    if (command.includes('01')) this.emit('vehicle_detected');
    if (command.includes('02')) this.emit('barrier_opened');
    if (command.includes('03')) this.emit('barrier_closed');
  }

  // Barrier Gate Commands
  async openBarrier(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      if (this.config.connectionType === 'serial' && this.port) {
        this.port.write(Buffer.from([0x01, 0x03, 0x00, 0x01, 0x01]));
      }
      this.emit('barrier_opening');
      return true;
    } catch {
      return false;
    }
  }

  async closeBarrier(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      if (this.config.connectionType === 'serial' && this.port) {
        this.port.write(Buffer.from([0x01, 0x03, 0x00, 0x00, 0x01]));
      }
      this.emit('barrier_closing');
      return true;
    } catch {
      return false;
    }
  }

  async getBarrierState(): Promise<BarrierGateState> {
    return {
      isRising: false,
      isFalling: false,
      isOpen: this.connected,
      isClosed: !this.connected,
      error: false,
    };
  }

  // Lane Controller Commands
  async getLaneState(): Promise<LaneControllerState> {
    return {
      laneId: this.config.slaveId || 1,
      vehicleDetected: this.connected,
      rfidReaderActive: this.connected,
      anprCameraActive: this.connected,
      barrierOpen: false,
      ledSignal: 'green',
    };
  }

  async setLEDSignal(signal: 'red' | 'green' | 'yellow' | 'off'): Promise<boolean> {
    if (!this.connected) return false;
    const signalMap = { red: 0x01, green: 0x02, yellow: 0x03, off: 0x00 };
    try {
      if (this.port) {
        this.port.write(Buffer.from([0x01, 0x05, 0x00, signalMap[signal]]));
      }
      return true;
    } catch {
      return false;
    }
  }

  // Ticket Dispenser Commands
  async dispenseTicket(ticketInfo: TicketInfo): Promise<boolean> {
    if (!this.connected) return false;
    try {
      const data = Buffer.from(JSON.stringify(ticketInfo));
      if (this.port) {
        this.port.write(Buffer.concat([Buffer.from([0x02, 0x01]), data]));
      }
      this.emit('ticket_dispensed', ticketInfo);
      return true;
    } catch {
      return false;
    }
  }

  async getTicketStatus(): Promise<{ paperLow: boolean; jammed: boolean; ready: boolean }> {
    return { paperLow: false, jammed: false, ready: this.connected };
  }

  // Intercom Commands
  async startIntercom(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      if (this.port) {
        this.port.write(Buffer.from([0x03, 0x01]));
      }
      return true;
    } catch {
      return false;
    }
  }

  async stopIntercom(): Promise<boolean> {
    if (!this.connected) return false;
    try {
      if (this.port) {
        this.port.write(Buffer.from([0x03, 0x00]));
      }
      return true;
    } catch {
      return false;
    }
  }

  // LED Sign Commands
  async setLEDDisplay(text: string): Promise<boolean> {
    if (!this.connected) return false;
    try {
      const data = Buffer.from(text, 'utf8');
      if (this.port) {
        this.port.write(Buffer.concat([Buffer.from([0x04, 0x01]), data]));
      }
      return true;
    } catch {
      return false;
    }
  }

  // Modbus Support
  async readModbusRegister(address: number, length: number = 1): Promise<number[]> {
    if (this.config.connectionType !== 'modbus') return [];
    try {
      return [0, 0];
    } catch {
      return [];
    }
  }

  async writeModbusRegister(address: number, value: number): Promise<boolean> {
    if (this.config.connectionType !== 'modbus') return false;
    try {
      return true;
    } catch {
      return false;
    }
  }
}

export function createTollHardwareService(config: TollHardwareConfig): TollHardwareService {
  return new TollHardwareService(config);
}
