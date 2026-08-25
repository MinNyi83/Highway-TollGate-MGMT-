import chalk from 'chalk';

export interface Stats {
  vehiclesProcessed: number;
  violationsDetected: number;
  totalRevenue: number;
  startTime: Date;
}

let stats: Stats = {
  vehiclesProcessed: 0,
  violationsDetected: 0,
  totalRevenue: 0,
  startTime: new Date(),
};

export function updateStats(data: { violation?: boolean; revenue?: number }) {
  stats.vehiclesProcessed++;
  if (data.violation) stats.violationsDetected++;
  if (data.revenue) stats.totalRevenue += data.revenue;
}

export function getStats(): Stats {
  return { ...stats };
}

export function resetStats() {
  stats = {
    vehiclesProcessed: 0,
    violationsDetected: 0,
    totalRevenue: 0,
    startTime: new Date(),
  };
}

export function displayStats() {
  const elapsed = Math.floor((Date.now() - stats.startTime.getTime()) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  console.clear();
  console.log(chalk.cyan('=== TollGate Simulator Stats ==='));
  console.log(chalk.white(`Vehicles Processed: ${chalk.green(stats.vehiclesProcessed)}`));
  console.log(chalk.white(`Violations Detected: ${chalk.red(stats.violationsDetected)}`));
  console.log(chalk.white(`Total Revenue: ${chalk.yellow(`$${stats.totalRevenue.toFixed(2)}`)}`));
  console.log(chalk.white(`Elapsed Time: ${chalk.blue(`${minutes}m ${seconds}s`)}`));
  console.log(chalk.white(`Rate: ${chalk.blue(`${(stats.vehiclesProcessed / (elapsed || 1) * 60).toFixed(1)} vehicles/min`)}`));
}
