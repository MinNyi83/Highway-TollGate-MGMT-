import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SMSConfig {
  provider: 'mpt' | 'atom' | 'u9' | 'mytel';
  apiKey: string;
  apiSecret?: string;
  senderId: string;
  apiUrl?: string;
}

export interface SMSMessage {
  to: string;
  message: string;
  userId?: string;
}

export interface SMSResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const PROVIDER_CONFIGS: Record<string, { apiUrl: string; endpoint: string }> = {
  mpt: {
    apiUrl: 'https://api.mpt.com.mm',
    endpoint: '/sms/v1/send',
  },
  atom: {
    apiUrl: 'https://api.atom.com.mm',
    endpoint: '/sms/send',
  },
  u9: {
    apiUrl: 'https://api.u9.com.mm',
    endpoint: '/sms/v2/send',
  },
  mytel: {
    apiUrl: 'https://api.mytel.com.mm',
    endpoint: '/sms/api/send',
  },
};

export class SMSService {
  private config: SMSConfig;

  constructor(config: SMSConfig) {
    this.config = {
      ...config,
      apiUrl: config.apiUrl || PROVIDER_CONFIGS[config.provider]?.apiUrl || '',
    };
  }

  async sendSMS(message: SMSMessage): Promise<SMSResponse> {
    try {
      let response: any;

      switch (this.config.provider) {
        case 'mpt':
          response = await this.sendMPT(message);
          break;
        case 'atom':
          response = await this.sendAtom(message);
          break;
        case 'u9':
          response = await this.sendU9(message);
          break;
        case 'mytel':
          response = await this.sendMytel(message);
          break;
        default:
          return { success: false, error: 'Unknown provider' };
      }

      if (message.userId) {
        await this.logSMS(message.userId, response);
      }

      return response;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'SMS send failed';
      if (message.userId) {
        await this.logSMS(message.userId, { success: false, error: errorMsg });
      }
      return { success: false, error: errorMsg };
    }
  }

  private async sendMPT(message: SMSMessage): Promise<SMSResponse> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/sms/v1/send`,
        {
          sender: this.config.senderId,
          to: message.to,
          text: message.message,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        messageId: response.data?.messageId || response.data?.id,
      };
    } catch (error) {
      return { success: false, error: 'MPT SMS failed' };
    }
  }

  private async sendAtom(message: SMSMessage): Promise<SMSResponse> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/sms/send`,
        {
          api_key: this.config.apiKey,
          sender_id: this.config.senderId,
          to: message.to,
          message: message.message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        success: true,
        messageId: response.data?.message_id || response.data?.id,
      };
    } catch (error) {
      return { success: false, error: 'Atom SMS failed' };
    }
  }

  private async sendU9(message: SMSMessage): Promise<SMSResponse> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/sms/v2/send`,
        {
          apiKey: this.config.apiKey,
          senderName: this.config.senderId,
          mobile: message.to,
          message: message.message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        success: true,
        messageId: response.data?.transaction_id || response.data?.id,
      };
    } catch (error) {
      return { success: false, error: 'U9 SMS failed' };
    }
  }

  private async sendMytel(message: SMSMessage): Promise<SMSResponse> {
    try {
      const response = await axios.post(
        `${this.config.apiUrl}/sms/api/send`,
        {
          username: this.config.apiKey,
          password: this.config.apiSecret,
          sender: this.config.senderId,
          to: message.to,
          text: message.message,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      return {
        success: true,
        messageId: response.data?.messageId || response.data?.id,
      };
    } catch (error) {
      return { success: false, error: 'Mytel SMS failed' };
    }
  }

  private async logSMS(userId: string, result: SMSResponse): Promise<void> {
    try {
      await prisma.sMSLog.create({
        data: {
          userId,
          provider: this.config.provider,
          phone: '',
          message: '',
          status: result.success ? 'sent' : 'failed',
          externalId: result.messageId,
          error: result.error,
        },
      });
    } catch (error) {
      console.error('Failed to log SMS:', error);
    }
  }
}

export function createSMSService(provider: string, config: Partial<SMSConfig>): SMSService {
  return new SMSService({
    provider: provider as any,
    apiKey: config.apiKey || '',
    apiSecret: config.apiSecret,
    senderId: config.senderId || 'TollGate',
    apiUrl: config.apiUrl,
  });
}

// Pre-configured services
export function createMPTService(apiKey: string): SMSService {
  return createSMSService('mpt', { apiKey, senderId: 'TollGate' });
}

export function createAtomService(apiKey: string): SMSService {
  return createSMSService('atom', { apiKey, senderId: 'TollGate' });
}

export function createU9Service(apiKey: string): SMSService {
  return createSMSService('u9', { apiKey, senderId: 'TollGate' });
}

export function createMytelService(apiKey: string, apiSecret: string): SMSService {
  return createSMSService('mytel', { apiKey, apiSecret, senderId: 'TollGate' });
}
