import chalk from 'chalk';
import { createEntryEvent, completeExitEvent } from '../api/client';
import { Vehicle, TollPlaza, generateFakePlate } from '../generators/vehiclePool';

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
}

export async function simulateSinglePassage(
  vehicle: Vehicle,
  plaza: TollPlaza,
  options: PassageOptions
): Promise<PassageResult> {
  const { entryDelay, scenario } = options;
  const startTime = Date.now();

  console.log(chalk.blue(`\n  [${vehicle.plateNumber}] Entering ${plaza.name} (${plaza.mileMarker ?? '?'} Mile)...`));

  const rfidTagId = scenario === 'no-rfid' ? undefined : vehicle.rfidTagId;
  const anprPlate = scenario === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;

  const entryPayload: Record<string, unknown> = {
    vehicleId: vehicle.id,
    plazaId: plaza.id,
  };
  if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
  if (anprPlate) entryPayload.anprPlate = anprPlate;

  const entryEvent = await createEntryEvent(entryPayload as any);
  console.log(chalk.green(`  [${vehicle.plateNumber}] Entry recorded: ${entryEvent.id}`));

  await new Promise((resolve) => setTimeout(resolve, entryDelay));

  const exitPayload: Record<string, unknown> = {};
  if (scenario === 'anpr-mismatch') {
    exitPayload.anprPlate = generateFakePlate();
  } else if (anprPlate) {
    exitPayload.anprPlate = anprPlate;
  }

  const exitEvent = await completeExitEvent(entryEvent.id, exitPayload as any);
  console.log(chalk.green(`  [${vehicle.plateNumber}] Exit recorded`));

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
    tollAmount: 0,
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
