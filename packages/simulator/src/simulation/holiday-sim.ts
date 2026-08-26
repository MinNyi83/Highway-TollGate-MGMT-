import chalk from 'chalk';
import { createEntryEvent, completeExitEvent } from '../api/client';
import { Vehicle, TollPlaza, generateFakePlate } from '../generators/vehiclePool';
import { HolidayType, getHolidayConfig, getTrafficWave, getCongestionDelay, shouldCreateViolation, pickRandomPlaza, pickDirection, getRandomVehicleClass, TRAFFIC_WAVES } from './holiday';

const LANE_LETTERS = ['A', 'B', 'C', 'D'];

function pickLane(lanes: number): string {
  const num = Math.floor(Math.random() * lanes) + 1;
  const letter = LANE_LETTERS[Math.floor(Math.random() * LANE_LETTERS.length)];
  return `${num}${letter}`;
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

export interface HolidaySimOptions {
  vehicles: Vehicle[];
  plazas: TollPlaza[];
  holidayType: HolidayType;
  count: number;
}

let isRunning = false;
let stats = {
  total: 0, successful: 0, violations: 0, errors: 0,
  revenue: 0, vehiclesProcessed: new Set<string>(),
  plazasVisited: new Set<string>(), byTimeOfDay: {} as Record<string, number>,
  byVehicleClass: {} as Record<string, number>,
};

export function stopHoliday() {
  isRunning = false;
  console.log(chalk.yellow('\n=== Holiday Simulation Stopped ==='));
  displayHolidayStats();
}

function displayHolidayStats() {
  console.log(chalk.cyan('\n--- Holiday Traffic Statistics ---'));
  console.log(chalk.white(`Total passages: ${stats.total}`));
  console.log(chalk.green(`Successful: ${stats.successful}`));
  console.log(chalk.red(`Violations: ${stats.violations}`));
  console.log(chalk.red(`Errors: ${stats.errors}`));
  console.log(chalk.magenta(`Revenue: ${stats.revenue.toLocaleString()} MMK`));
  console.log(chalk.white(`Unique vehicles: ${stats.vehiclesProcessed.size}`));
  console.log(chalk.white(`Plazas visited: ${stats.plazasVisited.size}`));

  console.log(chalk.cyan('\nBy Time of Day:'));
  for (const [time, count] of Object.entries(stats.byTimeOfDay)) {
    console.log(chalk.gray(`  ${time}: ${count} vehicles`));
  }

  console.log(chalk.cyan('\nBy Vehicle Class:'));
  for (const [cls, count] of Object.entries(stats.byVehicleClass)) {
    console.log(chalk.gray(`  ${cls}: ${count}`));
  }
}

export async function startHoliday(options: HolidaySimOptions) {
  isRunning = true;
  stats = {
    total: 0, successful: 0, violations: 0, errors: 0,
    revenue: 0, vehiclesProcessed: new Set(),
    plazasVisited: new Set(), byTimeOfDay: {}, byVehicleClass: {},
  };

  const config = getHolidayConfig(options.holidayType);
  let minute = 300; // Start at 5 AM
  let count = 0;
  const maxCount = options.count;

  console.log(chalk.green('\n=== Starting Holiday Traffic Simulation ==='));
  console.log(chalk.magenta(`Holiday: ${config.name}`));
  console.log(chalk.cyan(`Target: ${maxCount} vehicles`));
  console.log(chalk.cyan(`Vehicle multiplier: ${config.vehicleMultiplier}x`));
  console.log('');

  const runBatch = async () => {
    if (!isRunning || count >= maxCount) {
      if (isRunning) stopHoliday();
      return;
    }

    const wave = getTrafficWave(minute);
    const adjustedInterval = Math.max(800, wave.intervalMs / config.vehicleMultiplier);

    // Multiple vehicles per batch during high congestion
    const batchSize = config.congestionLevel === 'high' ? Math.ceil(Math.random() * 3) :
                       config.congestionLevel === 'medium' ? (Math.random() > 0.7 ? 2 : 1) : 1;

    for (let i = 0; i < batchSize && count < maxCount; i++) {
      const vehicle = options.vehicles[count % options.vehicles.length];
      const plaza = pickRandomPlaza(options.plazas);
      const direction = pickDirection(wave.directionBias);
      const laneNumber = pickLane(plaza.lanes);
      const violation = shouldCreateViolation(config.violationRate);
      const entryDelay = getCongestionDelay(config.congestionLevel);

      // Simulate time progression
      const hour = Math.floor(minute / 60) % 24;
      const min = minute % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      console.log(chalk.yellow(`[${timeStr}] Passage #${count + 1}: ${vehicle.plateNumber} → ${plaza.gateCode || plaza.name} Lane ${laneNumber} ${direction}`));

      // Track stats
      stats.byTimeOfDay[wave.timeOfDay] = (stats.byTimeOfDay[wave.timeOfDay] || 0) + 1;
      stats.byVehicleClass[vehicle.vehicleClass] = (stats.byVehicleClass[vehicle.vehicleClass] || 0) + 1;

      try {
        const scenario = violation ?
          (Math.random() < 0.5 ? 'no-rfid' : Math.random() < 0.3 ? 'anpr-mismatch' : 'normal') :
          'normal';

        const rfidTagId = scenario === 'no-rfid' ? undefined : vehicle.rfidTagId;
        const anprPlate = scenario === 'anpr-mismatch' ? generateFakePlate() : vehicle.plateNumber;
        const tollAmount = getTollAmount(vehicle.vehicleClass);

        const entryPayload: Record<string, unknown> = {
          vehicleId: vehicle.id, plazaId: plaza.id,
          laneNumber, direction, amount: tollAmount,
        };
        if (rfidTagId) entryPayload.rfidTagId = rfidTagId;
        if (anprPlate) entryPayload.anprPlate = anprPlate;

        const entryEvent = await createEntryEvent(entryPayload as any);

        await new Promise((resolve) => setTimeout(resolve, Math.min(entryDelay, 2000)));

        const exitPayload: Record<string, unknown> = {};
        if (scenario === 'anpr-mismatch') {
          exitPayload.anprPlate = generateFakePlate();
        } else if (anprPlate) {
          exitPayload.anprPlate = anprPlate;
        }

        const exitEvent = await completeExitEvent(entryEvent.id, exitPayload as any);

        stats.total++;
        stats.vehiclesProcessed.add(vehicle.plateNumber);
        stats.plazasVisited.add(plaza.name);

        if (scenario !== 'normal') {
          stats.violations++;
          console.log(chalk.red(`  ⚠ Violation: ${scenario === 'no-rfid' ? 'No RFID' : 'ANPR Mismatch'}`));
        } else {
          stats.successful++;
          stats.revenue += tollAmount;
        }

        console.log(chalk.green(`  ✓ ${tollAmount} MMK | Revenue: ${stats.revenue.toLocaleString()} MMK`));
      } catch (error) {
        stats.errors++;
        console.error(chalk.red(`  ✗ Error: ${error instanceof Error ? error.message : error}`));
      }

      count++;
    }

    // Advance time by 1-3 minutes per batch
    minute += 1 + Math.floor(Math.random() * 3);
    if (minute >= 1440) minute -= 1440;

    if (count < maxCount) {
      setTimeout(runBatch, adjustedInterval);
    } else {
      stopHoliday();
    }
  };

  runBatch();
}
