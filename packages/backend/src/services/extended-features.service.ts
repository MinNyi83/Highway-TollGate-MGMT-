import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// ==================== LOYALTY & DISCOUNT SYSTEM ====================

interface LoyaltyReward {
  id: string;
  name: string;
  type: 'POINTS' | 'DISCOUNT' | 'CASHBACK' | 'FREE_PASS';
  value: number;
  minTrips: number;
  minSpending: number;
  validDays: number;
}

interface PromoCode {
  id: string;
  code: string;
  type: 'PERCENTAGE' | 'FIXED' | 'FREE_TRIPS';
  value: number;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validTo: Date;
  active: boolean;
}

export class LoyaltyService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async calculatePoints(accountId: string, amount: number): Promise<number> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) return 0;

    // 1 point per 100 MMK spent
    const basePoints = Math.floor(amount / 100);

    // Bonus points for enterprise customers
    const bonusMultiplier = account.customerType === 'ENTERPRISE' ? 1.5 : 1;

    return Math.floor(basePoints * bonusMultiplier);
  }

  async applyDiscount(
    accountId: string,
    amount: number,
    promoCode?: string
  ): Promise<{ finalAmount: number; discount: number; appliedPromo?: string }> {
    let discount = 0;
    let appliedPromo: string | undefined;

    // Check for promo code
    if (promoCode) {
      const promo = await this.prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          active: true,
          validFrom: { lte: new Date() },
          validTo: { gte: new Date() },
        },
      });

      if (promo && promo.usedCount < promo.maxUses) {
        switch (promo.type) {
          case 'PERCENTAGE':
            discount = amount * (promo.value / 100);
            break;
          case 'FIXED':
            discount = Math.min(promo.value, amount);
            break;
          case 'FREE_TRIPS':
            discount = amount; // Free trip
            break;
        }

        // Update usage count
        await this.prisma.promoCode.update({
          where: { id: promo.id },
          data: { usedCount: { increment: 1 } },
        });

        appliedPromo = promo.code;
      }
    }

    // Check for loyalty rewards
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (account) {
      const trips = await this.prisma.tollEvent.count({
        where: {
          vehicle: { accountId },
          status: 'COMPLETED',
        },
      });

      // Apply loyalty discount based on trips
      if (trips >= 100) {
        discount = Math.max(discount, amount * 0.1); // 10% discount
      } else if (trips >= 50) {
        discount = Math.max(discount, amount * 0.05); // 5% discount
      }
    }

    const finalAmount = Math.max(0, amount - discount);

    return {
      finalAmount: Math.round(finalAmount),
      discount: Math.round(discount),
      appliedPromo,
    };
  }

  async createPromoCode(
    code: string,
    type: 'PERCENTAGE' | 'FIXED' | 'FREE_TRIPS',
    value: number,
    maxUses: number,
    validDays: number
  ): Promise<any> {
    return this.prisma.promoCode.create({
      data: {
        code,
        type,
        value,
        maxUses,
        validFrom: new Date(),
        validTo: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000),
      },
    });
  }
}

// ==================== CREDIT SYSTEM ====================

interface CreditAccount {
  accountId: string;
  creditLimit: number;
  currentCredit: number;
  paymentTerms: number; // days
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

export class CreditService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async canUseCredit(accountId: string, amount: number): Promise<boolean> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) return false;
    if (account.customerType !== 'ENTERPRISE') return false;

    const creditLimit = Number(account.creditLimit);
    const balance = Number(account.balance);

    // Allow negative balance up to credit limit
    return balance - amount >= -creditLimit;
  }

  async recordCreditTransaction(
    accountId: string,
    amount: number,
    eventId: string
  ): Promise<any> {
    const canUse = await this.canUseCredit(accountId, amount);
    if (!canUse) {
      throw new Error('Credit limit exceeded');
    }

    // Create transaction with negative balance allowed
    const transaction = await this.prisma.transaction.create({
      data: {
        accountId,
        eventId,
        amount,
        type: 'DEBIT',
        status: 'COMPLETED',
        paymentMethod: 'credit',
      },
    });

    // Update balance (can go negative for enterprise)
    await this.prisma.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });

    return transaction;
  }

  async getCreditStatus(accountId: string): Promise<{
    creditLimit: number;
    currentBalance: number;
    availableCredit: number;
    overdueDays: number;
  }> {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new Error('Account not found');
    }

    const creditLimit = Number(account.creditLimit);
    const balance = Number(account.balance);
    const availableCredit = creditLimit + balance;

    // Calculate overdue days (simplified)
    const overdueDays = balance < 0 ? 30 : 0; // Placeholder

    return {
      creditLimit,
      currentBalance: balance,
      availableCredit,
      overdueDays,
    };
  }

  async setCreditLimit(accountId: string, limit: number): Promise<void> {
    await this.prisma.account.update({
      where: { id: accountId },
      data: { creditLimit: limit },
    });
  }
}

// ==================== WEBHOOK SUPPORT ====================

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  secret: string;
  active: boolean;
  retryCount: number;
}

export class WebhookService {
  private prisma: PrismaClient;
  private webhooks: Map<string, WebhookConfig> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async registerWebhook(
    url: string,
    events: string[],
    secret: string
  ): Promise<WebhookConfig> {
    const config: WebhookConfig = {
      id: `wh_${Date.now()}`,
      url,
      events,
      secret,
      active: true,
      retryCount: 3,
    };

    this.webhooks.set(config.id, config);
    return config;
  }

  async triggerWebhook(event: string, payload: any): Promise<void> {
    for (const [id, config] of this.webhooks) {
      if (config.active && config.events.includes(event)) {
        try {
          await this.sendWebhook(config, event, payload);
        } catch (error) {
          logger.error(`Webhook ${id} failed:`, error);
        }
      }
    }
  }

  private async sendWebhook(
    config: WebhookConfig,
    event: string,
    payload: any
  ): Promise<void> {
    const response = await fetch(config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Event': event,
        'X-Webhook-Secret': config.secret,
      },
      body: JSON.stringify({ event, payload, timestamp: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }
  }

  async getWebhooks(): Promise<WebhookConfig[]> {
    return Array.from(this.webhooks.values());
  }

  async deleteWebhook(id: string): Promise<void> {
    this.webhooks.delete(id);
  }
}

// ==================== GPS TRACKING ====================

interface GPSLocation {
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: Date;
}

export class GPSTrackingService {
  private prisma: PrismaClient;
  private locations: Map<string, GPSLocation> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async updateLocation(
    vehicleId: string,
    latitude: number,
    longitude: number,
    speed: number,
    heading: number
  ): Promise<void> {
    const location: GPSLocation = {
      vehicleId,
      latitude,
      longitude,
      speed,
      heading,
      timestamp: new Date(),
    };

    this.locations.set(vehicleId, location);
  }

  async getVehicleLocation(vehicleId: string): Promise<GPSLocation | null> {
    return this.locations.get(vehicleId) || null;
  }

  async getAllLocations(): Promise<GPSLocation[]> {
    return Array.from(this.locations.values());
  }

  async getVehicleTrail(
    vehicleId: string,
    startTime: Date,
    endTime: Date
  ): Promise<GPSLocation[]> {
    // Placeholder - would query historical data
    return [];
  }
}

// ==================== ADVANCED ANALYTICS ====================

interface AnalyticsData {
  revenue: { date: string; amount: number }[];
  trips: { date: string; count: number }[];
  peakHours: { hour: number; count: number }[];
  topPlazas: { name: string; revenue: number; trips: number }[];
  vehicleClasses: { class: string; count: number; percentage: number }[];
}

export class AnalyticsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<AnalyticsData> {
    const [revenue, trips, peakHours, topPlazas, vehicleClasses] =
      await Promise.all([
        this.getRevenueAnalytics(startDate, endDate),
        this.getTripsAnalytics(startDate, endDate),
        this.getPeakHoursAnalytics(startDate, endDate),
        this.getTopPlazasAnalytics(startDate, endDate),
        this.getVehicleClassAnalytics(startDate, endDate),
      ]);

    return {
      revenue,
      trips,
      peakHours,
      topPlazas,
      vehicleClasses,
    };
  }

  private async getRevenueAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; amount: number }[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        type: 'DEBIT',
      },
    });

    const byDate = new Map<string, number>();
    transactions.forEach((t) => {
      const date = t.createdAt.toISOString().split('T')[0];
      byDate.set(date, (byDate.get(date) || 0) + Number(t.amount));
    });

    return Array.from(byDate.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));
  }

  private async getTripsAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{ date: string; count: number }[]> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
        status: 'COMPLETED',
      },
    });

    const byDate = new Map<string, number>();
    events.forEach((e) => {
      const date = e.entryTime.toISOString().split('T')[0];
      byDate.set(date, (byDate.get(date) || 0) + 1);
    });

    return Array.from(byDate.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }

  private async getPeakHoursAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{ hour: number; count: number }[]> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
      },
    });

    const hourCounts = new Array(24).fill(0);
    events.forEach((e) => {
      hourCounts[e.entryTime.getHours()]++;
    });

    return hourCounts.map((count, hour) => ({ hour, count }));
  }

  private async getTopPlazasAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{ name: string; revenue: number; trips: number }[]> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
        status: 'COMPLETED',
      },
      include: { plaza: true },
    });

    const plazaData = new Map<
      string,
      { name: string; revenue: number; trips: number }
    >();

    events.forEach((e) => {
      const name = e.plaza?.name || 'Unknown';
      const existing = plazaData.get(name) || { name, revenue: 0, trips: 0 };
      existing.trips++;
      existing.revenue += Number(e.amount || 0);
      plazaData.set(name, existing);
    });

    return Array.from(plazaData.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }

  private async getVehicleClassAnalytics(
    startDate: Date,
    endDate: Date
  ): Promise<{ class: string; count: number; percentage: number }[]> {
    const events = await this.prisma.tollEvent.findMany({
      where: {
        entryTime: { gte: startDate, lte: endDate },
      },
      include: { vehicle: true },
    });

    const classCounts = new Map<string, number>();
    events.forEach((e) => {
      const vc = e.vehicle?.vehicleClass || 'Unknown';
      classCounts.set(vc, (classCounts.get(vc) || 0) + 1);
    });

    const total = events.length;
    return Array.from(classCounts.entries()).map(([cls, count]) => ({
      class: cls,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }
}

// ==================== RECEIPT GENERATION ====================

export class ReceiptService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateReceipt(transactionId: string): Promise<{
    receiptNumber: string;
    date: string;
    details: any;
    qrCode: string;
  }> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        account: { include: { user: true } },
        event: { include: { plaza: true, vehicle: true } },
      },
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    const receiptNumber = `RCP-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 6)
      .toUpperCase()}`;

    return {
      receiptNumber,
      date: transaction.createdAt.toISOString(),
      details: {
        type: transaction.type,
        amount: transaction.amount,
        status: transaction.status,
        paymentMethod: transaction.paymentMethod,
        customerName: transaction.account.user.name,
        accountNumber: transaction.account.accountNumber,
        vehicle: transaction.event?.vehicle?.plateNumber,
        plaza: transaction.event?.plaza?.name,
      },
      qrCode: `tollgate://receipt/${receiptNumber}`,
    };
  }
}

// ==================== VEHICLE PHOTO CAPTURE ====================

export class PhotoCaptureService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async capturePhoto(
    eventId: string,
    photoType: 'ENTRY' | 'EXIT',
    photoUrl: string,
    metadata?: any
  ): Promise<void> {
    // Store photo reference
    logger.info(`Photo captured for event ${eventId}: ${photoType}`);

    // In production, would store in cloud storage (S3, R2, etc.)
    // and save reference to database
  }

  async getEventPhotos(eventId: string): Promise<any[]> {
    // Placeholder - would query photo storage
    return [];
  }
}

// ==================== MULTI-TENANT ====================

interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: any;
  status: 'ACTIVE' | 'SUSPENDED';
}

export class MultiTenantService {
  private prisma: PrismaClient;
  private tenants: Map<string, Tenant> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.initializeDefaultTenant();
  }

  private initializeDefaultTenant(): void {
    this.tenants.set('default', {
      id: 'default',
      name: 'TollGate Myanmar',
      domain: 'tollgate.com',
      settings: {
        currency: 'MMK',
        language: 'my',
        timezone: 'Asia/Yangon',
      },
      status: 'ACTIVE',
    });
  }

  async createTenant(
    name: string,
    domain: string,
    settings: any
  ): Promise<Tenant> {
    const tenant: Tenant = {
      id: `tenant_${Date.now()}`,
      name,
      domain,
      settings,
      status: 'ACTIVE',
    };

    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  async getTenant(domain: string): Promise<Tenant | undefined> {
    return Array.from(this.tenants.values()).find(
      (t) => t.domain === domain
    );
  }

  async updateTenantSettings(
    tenantId: string,
    settings: any
  ): Promise<void> {
    const tenant = this.tenants.get(tenantId);
    if (tenant) {
      tenant.settings = { ...tenant.settings, ...settings };
      this.tenants.set(tenantId, tenant);
    }
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }
}
