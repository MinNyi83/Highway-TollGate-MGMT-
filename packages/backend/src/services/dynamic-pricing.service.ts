import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

interface PricingRule {
  id: string;
  name: string;
  type: 'TIME_BASED' | 'DYNAMIC' | 'SEASONAL' | 'HOLIDAY';
  conditions: any;
  multiplier: number;
  priority: number;
  active: boolean;
}

interface PricingContext {
  plazaId: string;
  vehicleClass: string;
  timestamp: Date;
  dayOfWeek: number;
  hour: number;
  isHoliday: boolean;
  trafficLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK';
}

export class DynamicPricingService {
  private prisma: PrismaClient;
  private pricingRules: Map<string, PricingRule> = new Map();

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.loadPricingRules();
  }

  private async loadPricingRules(): Promise<void> {
    // Load from database or configuration
    // For now, use default rules
    const defaultRules: PricingRule[] = [
      {
        id: 'peak-hour',
        name: 'Peak Hour Surcharge',
        type: 'TIME_BASED',
        conditions: {
          hours: [7, 8, 9, 17, 18, 19],
        },
        multiplier: 1.5,
        priority: 1,
        active: true,
      },
      {
        id: 'off-peak',
        name: 'Off-Peak Discount',
        type: 'TIME_BASED',
        conditions: {
          hours: [22, 23, 0, 1, 2, 3, 4, 5],
        },
        multiplier: 0.8,
        priority: 2,
        active: true,
      },
      {
        id: 'weekend',
        name: 'Weekend Rate',
        type: 'TIME_BASED',
        conditions: {
          days: [0, 6], // Sunday, Saturday
        },
        multiplier: 1.2,
        priority: 3,
        active: true,
      },
      {
        id: 'holiday',
        name: 'Holiday Surcharge',
        type: 'HOLIDAY',
        conditions: {
          holidays: [
            '2024-01-01',
            '2024-01-04',
            '2024-02-12',
            '2024-03-27',
            '2024-04-13',
            '2024-04-14',
            '2024-04-15',
            '2024-05-01',
            '2024-07-19',
            '2024-10-27',
            '2024-12-25',
          ],
        },
        multiplier: 1.3,
        priority: 4,
        active: true,
      },
      {
        id: 'high-traffic',
        name: 'High Traffic Surcharge',
        type: 'DYNAMIC',
        conditions: {
          trafficLevel: ['HIGH', 'PEAK'],
        },
        multiplier: 1.4,
        priority: 5,
        active: true,
      },
    ];

    defaultRules.forEach((rule) => {
      this.pricingRules.set(rule.id, rule);
    });
  }

  async calculateToll(
    plazaId: string,
    vehicleClass: string,
    baseRate: number,
    timestamp?: Date
  ): Promise<{ amount: number; appliedRules: string[] }> {
    const now = timestamp || new Date();
    const context = this.createPricingContext(plazaId, now);
    context.vehicleClass = vehicleClass;

    let finalRate = baseRate;
    const appliedRules: string[] = [];

    // Apply rules in priority order
    const sortedRules = Array.from(this.pricingRules.values())
      .filter((r) => r.active)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (this.ruleApplies(rule, context)) {
        finalRate *= rule.multiplier;
        appliedRules.push(rule.name);
        logger.info(
          `Applied rule: ${rule.name}, multiplier: ${rule.multiplier}`
        );
      }
    }

    // Apply traffic-based dynamic pricing
    const trafficMultiplier = this.getTrafficMultiplier(context.trafficLevel);
    if (trafficMultiplier !== 1) {
      finalRate *= trafficMultiplier;
      appliedRules.push(`Traffic surcharge (${context.trafficLevel})`);
    }

    // Ensure minimum rate
    finalRate = Math.max(finalRate, baseRate * 0.5);

    // Round to nearest MMK
    finalRate = Math.round(finalRate);

    return {
      amount: finalRate,
      appliedRules,
    };
  }

  private createPricingContext(
    plazaId: string,
    timestamp: Date
  ): PricingContext {
    return {
      plazaId,
      vehicleClass: '',
      timestamp,
      dayOfWeek: timestamp.getDay(),
      hour: timestamp.getHours(),
      isHoliday: this.isHoliday(timestamp),
      trafficLevel: this.getTrafficLevel(timestamp),
    };
  }

  private ruleApplies(rule: PricingRule, context: PricingContext): boolean {
    switch (rule.type) {
      case 'TIME_BASED':
        return this.checkTimeBasedRule(rule, context);
      case 'HOLIDAY':
        return this.checkHolidayRule(rule, context);
      case 'DYNAMIC':
        return this.checkDynamicRule(rule, context);
      case 'SEASONAL':
        return this.checkSeasonalRule(rule, context);
      default:
        return false;
    }
  }

  private checkTimeBasedRule(
    rule: PricingRule,
    context: PricingContext
  ): boolean {
    const conditions = rule.conditions;

    if (conditions.hours && conditions.hours.includes(context.hour)) {
      return true;
    }

    if (conditions.days && conditions.days.includes(context.dayOfWeek)) {
      return true;
    }

    return false;
  }

  private checkHolidayRule(
    rule: PricingRule,
    context: PricingContext
  ): boolean {
    if (context.isHoliday) {
      const holidays = rule.conditions.holidays || [];
      const dateStr = context.timestamp.toISOString().split('T')[0];
      return holidays.includes(dateStr);
    }
    return false;
  }

  private checkDynamicRule(
    rule: PricingRule,
    context: PricingContext
  ): boolean {
    const conditions = rule.conditions;

    if (conditions.trafficLevel) {
      return conditions.trafficLevel.includes(context.trafficLevel);
    }

    return false;
  }

  private checkSeasonalRule(
    rule: PricingRule,
    context: PricingContext
  ): boolean {
    const conditions = rule.conditions;
    const month = context.timestamp.getMonth() + 1;

    if (conditions.months && conditions.months.includes(month)) {
      return true;
    }

    return false;
  }

  private isHoliday(date: Date): boolean {
    const myanmarHolidays = [
      { month: 1, day: 4 }, // Independence Day
      { month: 2, day: 12 }, // Union Day
      { month: 3, day: 27 }, // Armed Forces Day
      { month: 4, day: 13 }, // Thingyan
      { month: 4, day: 14 }, // Thingyan
      { month: 4, day: 15 }, // Thingyan
      { month: 5, day: 1 }, // Labour Day
      { month: 7, day: 19 }, // Martyrs' Day
      { month: 10, day: 27 }, // National Day
      { month: 12, day: 25 }, // Christmas
    ];

    return myanmarHolidays.some(
      (h) => h.month === date.getMonth() + 1 && h.day === date.getDate()
    );
  }

  private getTrafficLevel(date: Date): 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK' {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();

    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      if (hour >= 10 && hour <= 16) {
        return 'MEDIUM';
      }
      return 'LOW';
    }

    // Weekday peak hours
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return 'PEAK';
    }

    // Weekday high traffic
    if (hour >= 10 && hour <= 16) {
      return 'HIGH';
    }

    // Night/early morning
    return 'LOW';
  }

  private getTrafficMultiplier(
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK'
  ): number {
    switch (level) {
      case 'LOW':
        return 0.9;
      case 'MEDIUM':
        return 1.0;
      case 'HIGH':
        return 1.2;
      case 'PEAK':
        return 1.5;
      default:
        return 1.0;
    }
  }

  async getPricingPreview(
    plazaId: string,
    vehicleClass: string,
    baseRate: number,
    date: Date
  ): Promise<{
    baseRate: number;
    finalRate: number;
    appliedRules: string[];
    breakdown: any[];
  }> {
    const context = this.createPricingContext(plazaId, date);
    context.vehicleClass = vehicleClass;

    let finalRate = baseRate;
    const appliedRules: string[] = [];
    const breakdown: any[] = [];

    const sortedRules = Array.from(this.pricingRules.values())
      .filter((r) => r.active)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of sortedRules) {
      if (this.ruleApplies(rule, context)) {
        const previousRate = finalRate;
        finalRate *= rule.multiplier;
        appliedRules.push(rule.name);
        breakdown.push({
          rule: rule.name,
          multiplier: rule.multiplier,
          rateBefore: previousRate,
          rateAfter: finalRate,
        });
      }
    }

    const trafficMultiplier = this.getTrafficMultiplier(context.trafficLevel);
    if (trafficMultiplier !== 1) {
      const previousRate = finalRate;
      finalRate *= trafficMultiplier;
      appliedRules.push(`Traffic surcharge (${context.trafficLevel})`);
      breakdown.push({
        rule: `Traffic (${context.trafficLevel})`,
        multiplier: trafficMultiplier,
        rateBefore: previousRate,
        rateAfter: finalRate,
      });
    }

    return {
      baseRate,
      finalRate: Math.round(finalRate),
      appliedRules,
      breakdown,
    };
  }

  addPricingRule(rule: PricingRule): void {
    this.pricingRules.set(rule.id, rule);
  }

  removePricingRule(ruleId: string): void {
    this.pricingRules.delete(ruleId);
  }

  updatePricingRule(ruleId: string, updates: Partial<PricingRule>): void {
    const existing = this.pricingRules.get(ruleId);
    if (existing) {
      this.pricingRules.set(ruleId, { ...existing, ...updates });
    }
  }

  getPricingRules(): PricingRule[] {
    return Array.from(this.pricingRules.values());
  }
}
