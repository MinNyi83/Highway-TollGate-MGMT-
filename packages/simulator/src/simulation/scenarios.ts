import { Vehicle, generateVehicle } from '../generators/vehiclePool';

export interface Scenario {
  name: string;
  description: string;
  vehicle: Partial<Vehicle>;
  expectedViolation: boolean;
}

export const SCENARIOS: Record<string, Scenario> = {
  normal: {
    name: 'Normal Passage',
    description: 'RFID + ANPR match, sufficient balance',
    vehicle: generateVehicle(),
    expectedViolation: false,
  },
  noRfid: {
    name: 'No RFID',
    description: 'Vehicle without RFID tag',
    vehicle: { ...generateVehicle(), rfidTag: '' },
    expectedViolation: true,
  },
  mismatch: {
    name: 'ANPR Mismatch',
    description: 'ANPR plate doesn\'t match vehicle',
    vehicle: generateVehicle(),
    expectedViolation: true,
  },
  insufficientBalance: {
    name: 'Insufficient Balance',
    description: 'Account has insufficient funds',
    vehicle: generateVehicle(),
    expectedViolation: true,
  },
};

export function getScenario(name: string): Scenario {
  return SCENARIOS[name] || SCENARIOS.normal;
}

export function listScenarios(): Scenario[] {
  return Object.values(SCENARIOS);
}
