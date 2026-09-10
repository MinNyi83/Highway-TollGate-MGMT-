export interface IntegrationAdapter {
  name: string;
  type: 'erp' | 'accounting' | 'banking' | 'government';
  status: 'active' | 'inactive' | 'error';
  config: Record<string, any>;
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  sync(data: any): Promise<any>;
  testConnection(): Promise<boolean>;
}

export interface WebhookEvent {
  id: string;
  event: string;
  payload: any;
  timestamp: Date;
  status: 'pending' | 'sent' | 'failed';
  retries: number;
  maxRetries: number;
}

export interface IntegrationConfig {
  apiKey?: string;
  baseUrl?: string;
  webhookUrl?: string;
  timeout?: number;
  retryAttempts?: number;
  syncInterval?: number;
}

export class BaseAdapter implements IntegrationAdapter {
  name: string;
  type: 'erp' | 'accounting' | 'banking' | 'government';
  status: 'active' | 'inactive' | 'error' = 'inactive';
  config: Record<string, any>;

  constructor(name: string, type: 'erp' | 'accounting' | 'banking' | 'government', config: Record<string, any> = {}) {
    this.name = name;
    this.type = type;
    this.config = config;
  }

  async connect(): Promise<boolean> {
    try {
      const connected = await this.testConnection();
      this.status = connected ? 'active' : 'error';
      return connected;
    } catch {
      this.status = 'error';
      return false;
    }
  }

  async disconnect(): Promise<void> {
    this.status = 'inactive';
  }

  async sync(_data: any): Promise<any> {
    throw new Error('sync not implemented');
  }

  async testConnection(): Promise<boolean> {
    return true;
  }
}
