import { generatePlateNumber, Vehicle } from '../generators/vehiclePool';

export interface Scenario {
  name: string;
  description: string;
  vehicleClass: Vehicle['vehicleClass'];
  hasRfid: boolean;
  anprMismatch: boolean;
  expectedViolation: boolean;
}

export const SCENARIOS: Record<string, Scenario> = {
  normal: {
    name: 'Normal Passage',
    description: 'RFID + ANPR match, sufficient balance',
    vehicleClass: 'SEDAN',
    hasRfid: true,
    anprMismatch: false,
    expectedViolation: false,
  },
  noRfid: {
    name: 'No RFID',
    description: 'Vehicle without RFID tag',
    vehicleClass: 'SEDAN',
    hasRfid: false,
    anprMismatch: false,
    expectedViolation: true,
  },
  mismatch: {
    name: 'ANPR Mismatch',
    description: 'ANPR plate doesn\'t match vehicle',
    vehicleClass: 'SEDAN',
    hasRfid: true,
    anprMismatch: true,
    expectedViolation: true,
  },
  insufficientBalance: {
    name: 'Insufficient Balance',
    description: 'Account has insufficient funds',
    vehicleClass: 'TRUCK',
    hasRfid: true,
    anprMismatch: false,
    expectedViolation: true,
  },
};

export function getScenario(name: string): Scenario {
  return SCENARIOS[name] || SCENARIOS.normal;
}

export function listScenarios(): Scenario[] {
  return Object.values(SCENARIOS);
}
