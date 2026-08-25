import chalk from 'chalk';
import { SimulationStats } from './continuous';

export function displayStats(stats: SimulationStats) {
  console.clear();
  console.log(chalk.bold.cyan('=== TollGate Simulator ===\n'));
  console.log(chalk.white(`Total Passages:  ${stats.totalPassages}`));
  console.log(chalk.green(`Successful:      ${stats.successfulPassages}`));
  console.log(chalk.red(`Violations:      ${stats.violations}`));
  console.log(chalk.red(`Errors:          ${stats.errors}`));
  console.log(chalk.magenta(`Revenue:         $${stats.totalRevenue.toFixed(2)}`));
  console.log(chalk.white(`Vehicles:        ${stats.vehiclesProcessed.size}`));
  console.log(chalk.white(`Plazas Visited:  ${stats.plazasVisited.size}`));
  console.log('');
}
