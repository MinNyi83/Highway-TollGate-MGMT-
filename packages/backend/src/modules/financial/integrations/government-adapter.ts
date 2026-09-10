import { BaseAdapter, IntegrationConfig } from './base-adapter';

export interface GovernmentConfig extends IntegrationConfig {
  system: 'myco' | 'ird' | 'myanmarTax' | 'customs';
  taxId: string;
  registrationNo: string;
}

export class GovernmentAdapter extends BaseAdapter {
  private govConfig: GovernmentConfig;

  constructor(config: GovernmentConfig) {
    super(`Government-${config.system.toUpperCase()}`, 'government', config as Record<string, any>);
    this.govConfig = config;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log(`Testing connection to ${this.govConfig.system.toUpperCase()}...`);
      return true;
    } catch {
      return false;
    }
  }

  async sync(data: any): Promise<any> {
    const { system, taxId, registrationNo } = this.govConfig;

    switch (system) {
      case 'myco':
        return this.syncToMyCO(data, registrationNo);
      case 'ird':
        return this.syncToIRD(data, taxId);
      case 'myanmarTax':
        return this.syncToMyanmarTax(data, taxId);
      case 'customs':
        return this.syncToCustoms(data, registrationNo);
      default:
        throw new Error(`Unknown system: ${system}`);
    }
  }

  private async syncToMyCO(data: any, registrationNo: string) {
    const payload = {
      mycoFiling: {
        companyRegistrationNo: registrationNo,
        filingType: 'ANNUAL_RETURN',
        filingDate: new Date().toISOString().split('T')[0],
        financialYearEnd: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
        financialData: {
          totalRevenue: data.totalRevenue || 0,
          totalExpenses: data.totalExpenses || 0,
          netProfit: (data.totalRevenue || 0) - (data.totalExpenses || 0),
          totalAssets: data.totalAssets || 0,
          totalLiabilities: data.totalLiabilities || 0,
          totalEquity: data.totalEquity || 0,
        },
      },
    };

    return { success: true, system: 'MyCO (Myanmar Companies)', payload, timestamp: new Date().toISOString() };
  }

  private async syncToIRD(data: any, taxId: string) {
    const payload = {
      irdTaxReturn: {
        taxIdentificationNo: taxId,
        taxPeriod: {
          startDate: data.period?.start || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
          endDate: data.period?.end || new Date().toISOString().split('T')[0],
        },
        incomeDetails: {
          tollRevenue: data.totalRevenue || 0,
          otherIncome: 0,
          totalIncome: data.totalRevenue || 0,
        },
        deductions: {
          operatingExpenses: data.totalExpenses || 0,
          depreciation: 0,
          totalDeductions: data.totalExpenses || 0,
        },
        taxCalculation: {
          taxableIncome: (data.totalRevenue || 0) - (data.totalExpenses || 0),
          corporateTaxRate: 0.22,
          corporateTax: ((data.totalRevenue || 0) - (data.totalExpenses || 0)) * 0.22,
          socialSecurityRate: 0.02,
          socialSecurity: (data.totalRevenue || 0) * 0.02,
          totalTax: ((data.totalRevenue || 0) - (data.totalExpenses || 0)) * 0.22 + (data.totalRevenue || 0) * 0.02,
        },
      },
    };

    return { success: true, system: 'IRD Myanmar (Internal Revenue)', payload, timestamp: new Date().toISOString() };
  }

  private async syncToMyanmarTax(data: any, taxId: string) {
    const payload = {
      myanmarTaxPortal: {
        taxId,
        submissionType: 'QUARTERLY',
        quarter: Math.ceil((new Date().getMonth() + 1) / 3),
        year: new Date().getFullYear(),
        revenue: {
          tollRevenue: data.totalRevenue || 0,
          walletDeposits: data.totalDeposits || 0,
          fines: data.totalFines || 0,
        },
        taxes: {
          corporateTax: data.totalRevenue ? data.totalRevenue * 0.22 : 0,
          commercialTax: data.totalRevenue ? data.totalRevenue * 0.05 : 0,
          incomeTax: data.totalRevenue ? data.totalRevenue * 0.05 : 0,
          socialSecurity: data.totalRevenue ? data.totalRevenue * 0.02 : 0,
          total: data.totalRevenue ? data.totalRevenue * 0.34 : 0,
        },
      },
    };

    return { success: true, system: 'Myanmar Tax Portal', payload, timestamp: new Date().toISOString() };
  }

  private async syncToCustoms(data: any, registrationNo: string) {
    const payload = {
      customsDeclaration: {
        registrationNo,
        declarationType: 'IMPORT_DUTY',
        items: (data.importItems || []).map((item: any) => ({
          description: item.description,
          hsCode: item.hsCode,
          quantity: item.quantity,
          unitValue: item.unitValue,
          totalValue: item.quantity * item.unitValue,
          dutyRate: item.dutyRate || 0.05,
          dutyAmount: item.quantity * item.unitValue * (item.dutyRate || 0.05),
        })),
      },
    };

    return { success: true, system: 'Myanmar Customs', payload, timestamp: new Date().toISOString() };
  }
}
