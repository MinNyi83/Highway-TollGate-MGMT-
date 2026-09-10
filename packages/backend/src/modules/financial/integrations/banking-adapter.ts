import { BaseAdapter, IntegrationConfig } from './base-adapter';

export interface BankingConfig extends IntegrationConfig {
  bank: 'cbm' | 'kbz' | 'ayeyarwady' | 'uab' | 'aya';
  accountNumber: string;
  swiftCode?: string;
}

export class BankingAdapter extends BaseAdapter {
  private bankConfig: BankingConfig;

  constructor(config: BankingConfig) {
    super(`Banking-${config.bank.toUpperCase()}`, 'banking', config as Record<string, any>);
    this.bankConfig = config;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`Testing connection to ${this.bankConfig.bank.toUpperCase()}...`);
      return true;
    } catch {
      return false;
    }
  }

  async sync(data: any): Promise<any> {
    const { bank, accountNumber } = this.bankConfig;

    switch (bank) {
      case 'cbm':
        return this.syncToCBM(data, accountNumber);
      case 'kbz':
        return this.syncToKBZ(data, accountNumber);
      case 'ayeyarwady':
        return this.syncToAyeyarwady(data, accountNumber);
      case 'uab':
        return this.syncToUAB(data, accountNumber);
      case 'aya':
        return this.syncToAYA(data, accountNumber);
      default:
        throw new Error(`Unknown bank: ${bank}`);
    }
  }

  private async syncToCBM(data: any, accountNumber: string) {
    const payload = {
      cbmTransferRequest: {
        sourceAccount: accountNumber,
        currency: 'MMK',
        transactions: (data.transactions || []).map((t: any) => ({
          destinationAccount: t.destinationAccount || '',
          amount: t.amount,
          reference: `TOLL-${Date.now()}`,
          description: t.description,
          valueDate: new Date().toISOString().split('T')[0],
        })),
      },
    };

    return { success: true, system: 'Central Bank of Myanmar', payload, timestamp: new Date().toISOString() };
  }

  private async syncToKBZ(data: any, accountNumber: string) {
    const payload = {
      kbzPayRequest: {
        merchantId: this.config.merchantId || '',
        accountNumber,
        amount: data.totalAmount || 0,
        currency: 'MMK',
        description: 'Toll Revenue Collection',
        referenceNo: `KBZ-${Date.now()}`,
        transactions: (data.transactions || []).map((t: any) => ({
          amount: t.amount,
          description: t.description,
          reference: `KBZ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        })),
      },
    };

    return { success: true, system: 'KBZ Bank', payload, timestamp: new Date().toISOString() };
  }

  private async syncToAyeyarwady(data: any, accountNumber: string) {
    const payload = {
      ayeyarwadyRequest: {
        sourceAccount: accountNumber,
        totalAmount: data.totalAmount || 0,
        currency: 'MMK',
        batchId: `AYA-${Date.now()}`,
        transactions: (data.transactions || []).map((t: any) => ({
          destinationAccount: t.destinationAccount || '',
          amount: t.amount,
          reference: t.description,
        })),
      },
    };

    return { success: true, system: 'Ayeyarwady Bank', payload, timestamp: new Date().toISOString() };
  }

  private async syncToUAB(data: any, accountNumber: string) {
    const payload = {
      uabTransfer: {
        sourceAccount: accountNumber,
        currency: 'MMK',
        batchReference: `UAB-${Date.now()}`,
        transactions: (data.transactions || []).map((t: any) => ({
          destinationAccount: t.destinationAccount || '',
          amount: t.amount,
          description: t.description,
          valueDate: new Date().toISOString().split('T')[0],
        })),
      },
    };

    return { success: true, system: 'UAB Bank', payload, timestamp: new Date().toISOString() };
  }

  private async syncToAYA(data: any, accountNumber: string) {
    const payload = {
      ayaPayRequest: {
        merchantAccount: accountNumber,
        totalAmount: data.totalAmount || 0,
        currency: 'MMK',
        transactions: (data.transactions || []).map((t: any) => ({
          amount: t.amount,
          description: t.description,
          reference: `AYA-${Date.now()}`,
        })),
      },
    };

    return { success: true, system: 'AYA Bank', payload, timestamp: new Date().toISOString() };
  }
}
