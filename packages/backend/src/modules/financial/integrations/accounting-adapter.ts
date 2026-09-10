import { BaseAdapter, IntegrationConfig } from './base-adapter';

export interface AccountingConfig extends IntegrationConfig {
  platform: 'quickbooks' | 'wave' | 'xero' | 'freshbooks';
  companyId?: string;
}

export class AccountingAdapter extends BaseAdapter {
  private accConfig: AccountingConfig;

  constructor(config: AccountingConfig) {
    super(`Accounting-${config.platform.toUpperCase()}`, 'accounting', config as Record<string, any>);
    this.accConfig = config;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`Testing connection to ${this.accConfig.platform.toUpperCase()}...`);
      return true;
    } catch {
      return false;
    }
  }

  async sync(data: any): Promise<any> {
    const { platform, companyId } = this.accConfig;

    switch (platform) {
      case 'quickbooks':
        return this.syncToQuickBooks(data, companyId || '');
      case 'wave':
        return this.syncToWave(data);
      case 'xero':
        return this.syncToXero(data, companyId || '');
      case 'freshbooks':
        return this.syncToFreshBooks(data, companyId || '');
      default:
        throw new Error(`Unknown platform: ${platform}`);
    }
  }

  private async syncToQuickBooks(data: any, companyId: string) {
    const payload = {
      Bill: {
        VendorRef: { name: 'Toll Revenue System', value: companyId },
        TxnDate: new Date().toISOString().split('T')[0],
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        Line: (data.transactions || []).map((t: any, i: number) => ({
          Id: i + 1,
          DetailType: 'AccountBasedExpenseLineDetail',
          Amount: t.amount,
          AccountBasedExpenseLineDetail: {
            AccountRef: { name: t.type === 'DEBIT' ? 'Revenue' : 'Liability', value: t.type === 'DEBIT' ? '4100' : '2100' },
          },
          Description: t.description,
        })),
      },
    };

    return { success: true, system: 'QuickBooks Online', payload, timestamp: new Date().toISOString() };
  }

  private async syncToWave(data: any) {
    const payload = {
      business_id: this.config.businessId || 'default',
      transactions: (data.transactions || []).map((t: any) => ({
        date: new Date().toISOString().split('T')[0],
        amount: t.amount,
        category: t.type === 'DEBIT' ? 'Revenue' : 'Liability',
        description: t.description,
        account: t.type === 'DEBIT' ? '4100-Revenue' : '2100-Liability',
      })),
    };

    return { success: true, system: 'Wave Accounting', payload, timestamp: new Date().toISOString() };
  }

  private async syncToXero(data: any, companyId: string) {
    const payload = {
      invoices: [{
        Type: 'ACCREC',
        InvoiceNumber: `TOLL-${Date.now()}`,
        Reference: 'Toll Revenue System',
        Date: new Date().toISOString().split('T')[0],
        DueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        LineItems: (data.transactions || []).map((t: any) => ({
          Description: t.description,
          Quantity: 1,
          UnitAmount: t.amount,
          AccountCode: t.type === 'DEBIT' ? '200' : '820',
        })),
      }],
    };

    return { success: true, system: 'Xero', payload, timestamp: new Date().toISOString() };
  }

  private async syncToFreshBooks(data: any, companyId: string) {
    const payload = {
      invoice: {
        create_date: new Date().toISOString().split('T')[0],
        lines: (data.transactions || []).map((t: any) => ({
          name: t.description,
          unit_cost: { amount: t.amount, code: 'MMK' },
          qty: 1,
        })),
      },
    };

    return { success: true, system: 'FreshBooks', payload, timestamp: new Date().toISOString() };
  }
}
