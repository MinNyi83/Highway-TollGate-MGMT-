import chalk from 'chalk';
import { simulateSinglePassage } from './passage';

export interface ContinuousOptions {
  plazaId: string;
  interval: number;
  count?: number;
}

let isRunning = false;
let passageCount = 0;
let violationCount = 0;
let totalRevenue = 0;

export function getStats() {
  return { passageCount, violationCount, totalRevenue, isRunning };
}

export async function startContinuous(options: ContinuousOptions) {
  isRunning = true;
  passageCount = 0;
  violationCount = 0;
  totalRevenue = 0;

  console.log(chalk.green('\nStarting continuous simulation...'));
  console.log(`Plaza: ${options.plazaId}`);
  console.log(`Interval: ${options.interval}ms`);
  console.log(`Count: ${options.count || 'Unlimited'}`);

  const runPassage = async () => {
    if (!isRunning) return;

    try {
      const result = await simulateSinglePassage(options.plazaId, {
        entryDelay: Math.min(options.interval / 2, 5000),
      });

      passageCount++;
      if (result.exitEvent.violation) {
        violationCount++;
      }
      totalRevenue += result.exitEvent.tollAmount || 0;

      console.log(chalk.cyan(`\nPassage #${passageCount}: ${result.vehicle.plateNumber}`));
      console.log(`  Revenue: $${result.exitEvent.tollAmount || 0}`);

      if (options.count && passageCount >= options.count) {
        stopContinuous();
        return;
      }

      setTimeout(runPassage, options.interval);
    } catch (error) {
      console.error(chalk.red('Passage failed:'), error);
      setTimeout(runPassage, options.interval);
    }
  };

  runPassage();
}

export function stopContinuous() {
  isRunning = false;
  console.log(chalk.yellow('\nStopping simulation...'));
  console.log(`Total passages: ${passageCount}`);
  console.log(`Violations: ${violationCount}`);
  console.log(`Total revenue: $${totalRevenue}`);
}
