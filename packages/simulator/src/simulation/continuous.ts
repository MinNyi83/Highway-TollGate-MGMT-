import chalk from 'chalk';
import { simulateRoute, PassageOptions, PassageResult } from './passage';
import { Vehicle, TollPlaza } from '../generators/vehiclePool';

export interface ContinuousOptions {
  vehicles: Vehicle[];
  route: TollPlaza[];
  interval: number;
  count?: number;
  scenario: 'normal' | 'no-rfid' | 'anpr-mismatch' | 'insufficient-balance';
  entryDelay: number;
}

export interface SimulationStats {
  totalPassages: number;
  successfulPassages: number;
  violations: number;
  errors: number;
  totalRevenue: number;
  vehiclesProcessed: Set<string>;
  plazasVisited: Set<string>;
}

let isRunning = false;
let stats: SimulationStats = {
  totalPassages: 0,
  successfulPassages: 0,
  violations: 0,
  errors: 0,
  totalRevenue: 0,
  vehiclesProcessed: new Set(),
  plazasVisited: new Set(),
};

export function getStats(): SimulationStats {
  return { ...stats };
}

export function resetStats() {
  stats = {
    totalPassages: 0,
    successfulPassages: 0,
    violations: 0,
    errors: 0,
    totalRevenue: 0,
    vehiclesProcessed: new Set(),
    plazasVisited: new Set(),
  };
}

export function getIsRunning(): boolean {
  return isRunning;
}

export async function startContinuous(options: ContinuousOptions) {
  isRunning = true;
  resetStats();

  console.log(chalk.green('\n=== Starting Multi-Vehicle Simulation ==='));
  console.log(chalk.cyan(`Vehicles: ${options.vehicles.length}`));
  console.log(chalk.cyan(`Route: ${options.route.map((p) => `${p.mileMarker ?? '?'} Mile`).join(' -> ')}`));
  console.log(chalk.cyan(`Scenario: ${options.scenario}`));
  console.log(chalk.cyan(`Interval: ${options.interval}ms`));
  console.log(chalk.cyan(`Count: ${options.count || 'Unlimited'}`));
  console.log('');

  let count = 0;
  const passageOptions: PassageOptions = {
    entryDelay: options.entryDelay,
    scenario: options.scenario,
  };

  const runBatch = async () => {
    if (!isRunning) return;

    const vehicle = options.vehicles[count % options.vehicles.length];

    try {
      console.log(chalk.yellow(`\n--- Passage #${count + 1}: ${vehicle.plateNumber} ---`));

      const results = await simulateRoute(vehicle, options.route, passageOptions);

      for (const result of results) {
        stats.totalPassages++;
        stats.vehiclesProcessed.add(result.vehicle.plateNumber);
        stats.plazasVisited.add(result.plaza.name);

        if (result.violation) {
          stats.violations++;
          console.log(chalk.red(`  Violation: ${result.violationType}`));
        } else {
          stats.successfulPassages++;
          stats.totalRevenue += result.tollAmount;
        }

        console.log(chalk.gray(`  Gate: ${result.plaza.gateCode || result.plaza.name} | Lane: ${result.laneNumber} | Dir: ${result.direction} | Amount: ${result.tollAmount} MMK`));
      }

      console.log(chalk.cyan(`  Stats: ${stats.successfulPassages} OK, ${stats.violations} violations, ${stats.totalRevenue} MMK revenue`));

      count++;
      if (options.count && count >= options.count) {
        stopContinuous();
        return;
      }

      setTimeout(runBatch, options.interval);
    } catch (error) {
      stats.errors++;
      console.error(chalk.red(`  Batch failed:`), error instanceof Error ? error.message : error);
      setTimeout(runBatch, options.interval);
    }
  };

  runBatch();
}

export function stopContinuous() {
  isRunning = false;
  console.log(chalk.yellow('\n=== Simulation Stopped ==='));
  displayStats();
}

export function displayStats() {
  console.log(chalk.cyan('\n--- Final Statistics ---'));
  console.log(chalk.white(`Total passages: ${stats.totalPassages}`));
  console.log(chalk.green(`Successful: ${stats.successfulPassages}`));
  console.log(chalk.red(`Violations: ${stats.violations}`));
  console.log(chalk.red(`Errors: ${stats.errors}`));
  console.log(chalk.magenta(`Revenue: ${stats.totalRevenue} MMK`));
  console.log(chalk.white(`Unique vehicles: ${stats.vehiclesProcessed.size}`));
  console.log(chalk.white(`Plazas visited: ${stats.plazasVisited.size}`));
}
