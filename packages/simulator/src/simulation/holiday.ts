import { Vehicle, TollPlaza } from '../generators/vehiclePool';

export type HolidayType = 'thingyan' | 'thadingyut' | 'weekend' | 'independence-day' | 'normal-day';

export interface HolidayConfig {
  name: string;
  description: string;
  vehicleMultiplier: number;
  congestionLevel: 'low' | 'medium' | 'high';
  violationRate: number;
  vehicleMix: { SEDAN: number; SUV: number; TRUCK: number; BUS: number; MOTORCYCLE: number };
}

export const HOLIDAY_CONFIGS: Record<HolidayType, HolidayConfig> = {
  thingyan: {
    name: 'Thingyan (Water Festival)',
    description: 'April 13-16 - Massive exodus from cities, peak traffic',
    vehicleMultiplier: 4,
    congestionLevel: 'high',
    violationRate: 0.25,
    vehicleMix: { SEDAN: 0.25, SUV: 0.35, TRUCK: 0.1, BUS: 0.2, MOTORCYCLE: 0.1 },
  },
  thadingyut: {
    name: 'Thadingyut (Festival of Lights)',
    description: 'October full moon - Moderate holiday traffic',
    vehicleMultiplier: 2,
    congestionLevel: 'medium',
    violationRate: 0.15,
    vehicleMix: { SEDAN: 0.3, SUV: 0.3, TRUCK: 0.15, BUS: 0.15, MOTORCYCLE: 0.1 },
  },
  weekend: {
    name: 'Weekend / Public Holiday',
    description: 'Regular weekend or public holiday traffic',
    vehicleMultiplier: 1.5,
    congestionLevel: 'low',
    violationRate: 0.1,
    vehicleMix: { SEDAN: 0.35, SUV: 0.25, TRUCK: 0.15, BUS: 0.1, MOTORCYCLE: 0.15 },
  },
  'independence-day': {
    name: 'Independence Day / Union Day',
    description: 'January 4 / February 12 - National holiday',
    vehicleMultiplier: 2.5,
    congestionLevel: 'medium',
    violationRate: 0.18,
    vehicleMix: { SEDAN: 0.3, SUV: 0.3, TRUCK: 0.1, BUS: 0.2, MOTORCYCLE: 0.1 },
  },
  'normal-day': {
    name: 'Normal Weekday',
    description: 'Regular weekday traffic pattern',
    vehicleMultiplier: 1,
    congestionLevel: 'low',
    violationRate: 0.05,
    vehicleMix: { SEDAN: 0.35, SUV: 0.2, TRUCK: 0.25, BUS: 0.1, MOTORCYCLE: 0.1 },
  },
};

export type TimeOfDay = 'early-morning' | 'morning-rush' | 'midday' | 'evening-rush' | 'night';

export interface TrafficWave {
  timeOfDay: TimeOfDay;
  label: string;
  intervalMs: number;
  directionBias: 'OUTBOUND' | 'INBOUND' | 'MIXED';
}

export const TRAFFIC_WAVES: TrafficWave[] = [
  { timeOfDay: 'early-morning', label: '5AM-6AM: Early birds', intervalMs: 4000, directionBias: 'OUTBOUND' },
  { timeOfDay: 'morning-rush', label: '6AM-9AM: Morning rush (exiting city)', intervalMs: 1500, directionBias: 'OUTBOUND' },
  { timeOfDay: 'midday', label: '10AM-3PM: Midday steady flow', intervalMs: 2500, directionBias: 'MIXED' },
  { timeOfDay: 'evening-rush', label: '4PM-8PM: Evening rush (returning home)', intervalMs: 1800, directionBias: 'INBOUND' },
  { timeOfDay: 'night', label: '9PM-5AM: Night low traffic', intervalMs: 6000, directionBias: 'MIXED' },
];

export function getHolidayConfig(type: HolidayType): HolidayConfig {
  return HOLIDAY_CONFIGS[type] || HOLIDAY_CONFIGS['normal-day'];
}

export function getRandomVehicleClass(config: HolidayConfig): string {
  const rand = Math.random();
  let cumulative = 0;
  for (const [cls, weight] of Object.entries(config.vehicleMix)) {
    cumulative += weight;
    if (rand <= cumulative) return cls;
  }
  return 'SEDAN';
}

export function getTrafficWave(minute: number): TrafficWave {
  const hour = Math.floor(minute / 60) % 24;
  if (hour >= 5 && hour < 6) return TRAFFIC_WAVES[0];
  if (hour >= 6 && hour < 9) return TRAFFIC_WAVES[1];
  if (hour >= 10 && hour < 15) return TRAFFIC_WAVES[2];
  if (hour >= 16 && hour < 20) return TRAFFIC_WAVES[3];
  return TRAFFIC_WAVES[4];
}

export function getCongestionDelay(congestionLevel: 'low' | 'medium' | 'high'): number {
  switch (congestionLevel) {
    case 'low': return 1500 + Math.random() * 1000;
    case 'medium': return 2500 + Math.random() * 2000;
    case 'high': return 4000 + Math.random() * 3000;
  }
}

export function shouldCreateViolation(violationRate: number): boolean {
  return Math.random() < violationRate;
}

export function pickRandomPlaza(plazas: TollPlaza[]): TollPlaza {
  return plazas[Math.floor(Math.random() * plazas.length)];
}

export function pickDirection(bias: 'OUTBOUND' | 'INBOUND' | 'MIXED'): string {
  if (bias === 'OUTBOUND') return Math.random() < 0.7 ? 'DOWN' : 'UP';
  if (bias === 'INBOUND') return Math.random() < 0.7 ? 'UP' : 'DOWN';
  return Math.random() > 0.5 ? 'UP' : 'DOWN';
}
