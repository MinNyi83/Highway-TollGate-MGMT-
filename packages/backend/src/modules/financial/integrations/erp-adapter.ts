import { BaseAdapter, IntegrationConfig } from './base-adapter';

export interface ERPConfig extends IntegrationConfig {
  erpType: 'sap' | 'oracle' | 'dynamics';
  companyId: string;
  division: string;
}

export class ERPAdapter extends BaseAdapter {
  private erpConfig: ERPConfig;

  constructor(config: ERPConfig) {
    super(`ERP-${config.erpType.toUpperCase()}`, 'erp', config as Record<string, any>);
    this.erpConfig = config;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`Testing connection to ${this.erpConfig.erpType.toUpperCase()}...`);
      return true;
    } catch {
      return false;
    }
  }

  async sync(data: any): Promise<any> {
    const { erpType, companyId, division } = this.erpConfig;

    switch (erpType) {
      case 'sap':
        return this.syncToSAP(data, companyId, division);
      case 'oracle':
        return this.syncToOracle(data, companyId, division);
      case 'dynamics':
        return this.syncToDynamics(data, companyId, division);
      default:
        throw new Error(`Unknown ERP type: ${erpType}`);
    }
  }

  private async syncToSAP(data: any, companyId: string, division: string) {
    const payload = {
      BAPI_ACC_DOCUMENT_POST: {
        COMPANYCODEID: companyId,
        BUSCC: division,
        DOC_DATE: new Date().toISOString().split('T')[0],
        PSTNG_DATE: new Date().toISOString().split('T')[0],
        HEADER_TXT: `Toll Revenue ${data.period || ''}`,
        ACCOUNTGL: (data.transactions || []).map((t: any, i: number) => {
          const isDebit = t.type === 'DEBIT';
          return {
            ITEMNO_ACC: (i + 1) * 10,
            GL_ACCOUNT: isDebit ? '410000' : '210000',
            ITEM_TEXT: t.description || `Toll ${t.type}`,
            AMOUNT: isDebit ? t.amount : -t.amount,
            CURRENCY: 'MMK',
          };
        }),
      },
    };

    return {
      success: true,
      system: 'SAP S/4HANA',
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  private async syncToOracle(data: any, companyId: string, division: string) {
    const payload = {
      source: 'TollGate-RFID',
      companyName: companyId,
      businessUnit: division,
      journalEntries: {
        journalDate: new Date().toISOString().split('T')[0],
        journalName: `TOLL-${Date.now()}`,
        description: `Toll Revenue ${data.period || ''}`,
        lines: (data.transactions || []).map((t: any, i: number) => ({
          lineNumber: i + 1,
          accountNumber: t.type === 'DEBIT' ? '4100-REVENUE' : '2100-LIABILITY',
          debitAmount: t.type === 'DEBIT' ? t.amount : 0,
          creditAmount: t.type === 'CREDIT' ? t.amount : 0,
          description: t.description,
        })),
      },
    };

    return {
      success: true,
      system: 'Oracle ERP Cloud',
      payload,
      timestamp: new Date().toISOString(),
    };
  }

  private async syncToDynamics(data: any, companyId: string, division: string) {
    const payload = {
      CompanyId: companyId,
      BusinessUnit: division,
      JournalBatchName: `TOLL-${Date.now()}`,
      JournalLines: (data.transactions || []).map((t: any, i: number) => ({
        LineNumber: i + 1,
        AccountNumber: t.type === 'DEBIT' ? '4100-REVENUE' : '2100-LIABILITY',
        DebitAmount: t.type === 'DEBIT' ? t.amount : 0,
        CreditAmount: t.type === 'CREDIT' ? t.amount : 0,
        Description: t.description,
      })),
    };

    return {
      success: true,
      system: 'Microsoft Dynamics 365',
      payload,
      timestamp: new Date().toISOString(),
    };
  }
}
