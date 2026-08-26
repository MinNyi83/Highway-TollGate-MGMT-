import chalk from 'chalk';
import { createEntryEvent, completeExitEvent } from '../api/client';
import { Vehicle, TollPlaza, generateFakePlate } from '../generators/vehiclePool';

const LANE_LETTERS = ['A', 'B', 'C', 'D'];

export interface PassageOptions {
  entryDelay: number;
  scenario: 'normal' | 'no-rfid' | 'anpr-mismatch' | 'insufficient-balance';
}

export interface PassageResult {
  vehicle: Vehicle;
  plaza: TollPlaza;
  entryEvent: any;
  exitEvent: any;
  duration: number;
  violation: boolean;
  violationType?: string;
  tollAmount: number;
  laneNumber: string;
  direction: string;
}

function getTollAmount(vehicleClass: string): number {
  switch (vehicleClass) {
    case 'MOTORCYCLE': return 500;
    case 'SEDAN': return 1000;
    case 'SUV': return 2000;
    case 'TRUCK': return 3000;
    case 'BUS': return 4000;
    default: return 1000;
  }
}

function pickLane(lanes: number): string {
  const num = Math.floor(Math.random() * lanes) + 1;
  const letter = LANE_LETTERS[Math.floor(Math.random() * LANE_LETTERS.length)];
  return `${num}${letter}`;
}

export async function simulateSinglePassage(
  vehicle: Vehicle,
  plaza: TollPlaza,
  options: PassageOptions
): Promise<PassageResult> {
  const { entryDelay, scenario } = options;
  const startTime = Date.now();
  const direction = Math.random() > 0.5 ? 'DOWN' : 'UP';
  const laneNumber = pickLane(plaza.lanes);
  const tollAmount = getTollAmount(vehicle.vehicleClass);

  console.log(chalk.blue(`\n  [${vehicle.plateNumber}] Entering ${plaza.gateCode || plaza.name} (${plaza.mileMarker ?? '?'} Mile) Lane ${laneNumber} ${direction}...`));

  const rfidTagId = scenario === 'no-rfid' ? undefined : vehicle.rfidTagId;
  const anprPlate = scenario === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;

  const entryPayload: Record<string, unknown> = {
    vehicleId: vehicle.id,
    plazaId: plaza.id,
    laneNumber,
    direction,
    amount: tollAmount,
  };
  if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
  if (anprPlate) entryPayload.anprPlate = anprPlate;

  const entryEvent = await createEntryEvent(entryPayload as any);
  console.log(chalk.green(`  [${vehicle.plateNumber}] Entry recorded: ${entryEvent.id} | ${tollAmount} MMK`));

  await new Promise((resolve) => setTimeout(resolve, entryDelay));

  const exitPayload: Record<string, unknown> = {};
  if (scenario === 'anpr-mismatch') {
    exitPayload.anprPlate = generateFakePlate();
  } else if (anprPlate) {
    exitPayload.anprPlate = anprPlate;
  }

  const exitEvent = await completeExitEvent(entryEvent.id, exitPayload as any);
  console.log(chalk.green(`  [${vehicle.plateNumber}] Exit recorded | ${exitEvent.status}`));

  const duration = Date.now() - startTime;
  const violation = scenario === 'no-rfid' || scenario === 'anpr-mismatch' || scenario === 'insufficient-balance';
  const violationType = scenario === 'no-rfid' ? 'NO_RFID'
    : scenario === 'anpr-mismatch' ? 'RFID_ANPR_MISMATCH'
    : scenario === 'insufficient-balance' ? 'INSUFFICIENT_BALANCE'
    : undefined;

  return {
    vehicle,
    plaza,
    entryEvent,
    exitEvent,
    duration,
    violation,
    violationType,
    tollAmount,
    laneNumber,
    direction,
  };
}

export async function simulateRoute(
  vehicle: Vehicle,
  plazas: TollPlaza[],
  options: PassageOptions
): Promise<PassageResult[]> {
  const results: PassageResult[] = [];

  for (const plaza of plazas) {
    try {
      const result = await simulateSinglePassage(vehicle, plaza, options);
      results.push(result);
    } catch (error) {
      console.error(chalk.red(`  [${vehicle.plateNumber}] Failed at ${plaza.name}:`), error instanceof Error ? error.message : error);
    }
  }

  return results;
}
