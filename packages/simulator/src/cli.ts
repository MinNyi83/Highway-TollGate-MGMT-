#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('tollgate-simulator')
  .description('TollGate vehicle passage simulator')
  .version('1.0.0');

program
  .command('simulate')
  .description('Simulate vehicle passages through toll plazas')
  .option('-p, --plaza <name>', 'Target plaza name')
  .option('-c, --count <number>', 'Number of passages to simulate', '10')
  .option('-i, --interval <ms>', 'Interval between passages in ms', '1000')
  .action((options) => {
    console.log(chalk.blue('Starting simulation...'));
    console.log(`Plaza: ${options.plaza || 'All'}`);
    console.log(`Count: ${options.count}`);
    console.log(`Interval: ${options.interval}ms`);
  });

program
  .command('status')
  .description('Show current simulation state')
  .action(() => {
    console.log(chalk.yellow('No active simulation'));
  });

program
  .command('config')
  .description('Show or update configuration')
  .option('-s, --set <key=value>', 'Set a config value')
  .action((options) => {
    if (options.set) {
      console.log(chalk.green(`Setting: ${options.set}`));
    } else {
      console.log(chalk.cyan('Current configuration:'));
      console.log('  API URL: http://localhost:3000');
    }
  });

program.parse();
