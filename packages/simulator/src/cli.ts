#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { login, healthCheck, getVehicles, getTollPlazas } from './api/client';
import { getRoutesForPlazas, TollPlaza, Vehicle } from './generators/vehiclePool';
import { startContinuous, stopContinuous, getStats, displayStats as displayContinuousStats } from './simulation/continuous';
import { startHoliday, stopHoliday } from './simulation/holiday-sim';
import { HOLIDAY_CONFIGS, TRAFFIC_WAVES, HolidayType } from './simulation/holiday';

const program = new Command();

program
  .name('tollgate-simulator')
  .description('TollGate multi-vehicle, multi-plaza toll simulator')
  .version('1.0.0');

program
  .command('simulate')
  .description('Simulate vehicle passages through toll plazas')
  .option('-e, --email <email>', 'Admin email for authentication', 'admin@tollgate.com')
  .option('-p, --password <password>', 'Admin password', 'admin123')
  .option('-c, --count <number>', 'Number of vehicles to simulate', '5')
  .option('-i, --interval <ms>', 'Interval between vehicles in ms', '3000')
  .option('-d, --delay <ms>', 'Entry-to-exit delay in ms', '1500')
  .option('-r, --route <name>', 'Route name: full, short, medium, direct, return', 'full')
  .option('-s, --scenario <type>', 'Scenario: normal, no-rfid, anpr-mismatch, insufficient-balance', 'normal')
  .option('--api <url>', 'Backend API URL', 'http://localhost:3000')
  .action(async (options) => {
    console.log(chalk.bold.blue('=== TollGate Multi-Vehicle Simulator ===\n'));

    // Check health
    console.log(chalk.gray('Checking API health...'));
    const healthy = await healthCheck();
    if (!healthy) {
      console.error(chalk.red('Cannot connect to API. Is the backend running?'));
      process.exit(1);
    }
    console.log(chalk.green('API is healthy\n'));

    // Login
    console.log(chalk.gray('Authenticating...'));
    try {
      await login(options.email, options.password);
      console.log(chalk.green('Authenticated successfully\n'));
    } catch (error) {
      console.error(chalk.red('Authentication failed. Check credentials.'));
      process.exit(1);
    }

    // Fetch vehicles
    console.log(chalk.gray('Fetching vehicles...'));
    let vehicles: Vehicle[];
    try {
      const rawVehicles = await getVehicles();
      vehicles = rawVehicles
        .filter((v: any) => v.rfidTags && v.rfidTags.length > 0)
        .map((v: any) => ({
          id: v.id,
          plateNumber: v.plateNumber,
          rfidTagId: v.rfidTags[0].id,
          vehicleClass: v.vehicleClass,
          make: v.make,
          model: v.model,
        }));
      console.log(chalk.green(`Found ${vehicles.length} vehicles with RFID tags\n`));
    } catch (error) {
      console.error(chalk.red('Failed to fetch vehicles'));
      process.exit(1);
    }

    // Fetch plazas
    console.log(chalk.gray('Fetching toll plazas...'));
    let plazas: TollPlaza[];
    try {
      const rawPlazas = await getTollPlazas();
      plazas = rawPlazas.map((p: any) => ({
        id: p.id,
        name: p.name,
        gateCode: p.gateCode || null,
        mileMarker: p.mileMarker,
        lanes: p.lanes,
        status: p.status,
      }));
      plazas.sort((a, b) => (a.mileMarker || 0) - (b.mileMarker || 0));
      console.log(chalk.green(`Found ${plazas.length} toll plazas\n`));
    } catch (error) {
      console.error(chalk.red('Failed to fetch toll plazas'));
      process.exit(1);
    }

    // Get route
    const routes = getRoutesForPlazas(plazas);
    const routeName = options.route.toLowerCase();
    const routeMap: Record<string, number> = {
      full: 0, short: 1, medium: 2, direct: 3, return: 4,
    };
    const routeIndex = routeMap[routeName] ?? 0;
    const selectedRoute = routes[routeIndex];

    console.log(chalk.cyan(`Route: ${selectedRoute.name}`));
    console.log(chalk.gray(`  ${selectedRoute.description}\n`));

    // Select vehicles
    const count = Math.min(parseInt(options.count), vehicles.length);
    const selectedVehicles = vehicles.slice(0, count);

    console.log(chalk.cyan(`Simulating ${selectedVehicles.length} vehicles:`));
    selectedVehicles.forEach((v) => {
      console.log(chalk.gray(`  - ${v.plateNumber} (${v.make} ${v.model})`));
    });
    console.log('');

    // Start simulation
    startContinuous({
      vehicles: selectedVehicles,
      route: selectedRoute.plazas.map((id) => plazas.find((p) => p.id === id)!).filter(Boolean),
      interval: parseInt(options.interval),
      count: parseInt(options.count),
      scenario: options.scenario as any,
      entryDelay: parseInt(options.delay),
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n\nReceived interrupt signal...'));
      stopContinuous();
      process.exit(0);
    });

    process.on('SIGTERM', () => {
      stopContinuous();
      process.exit(0);
    });
  });

program
  .command('holiday')
  .description('Simulate holiday traffic patterns')
  .option('-e, --email <email>', 'Admin email', 'admin@tollgate.com')
  .option('-p, --password <password>', 'Admin password', 'admin123')
  .option('-t, --type <type>', 'Holiday type: thingyan, thadingyut, weekend, independence-day, normal-day', 'weekend')
  .option('-c, --count <number>', 'Total vehicles to simulate', '50')
  .option('-r, --route <name>', 'Route: full, short, medium, direct, return', 'full')
  .option('--api <url>', 'Backend API URL', 'http://localhost:3000')
  .action(async (options) => {
    console.log(chalk.bold.magenta('=== Holiday Traffic Simulator ===\n'));

    const healthy = await healthCheck();
    if (!healthy) {
      console.error(chalk.red('Cannot connect to API.'));
      process.exit(1);
    }
    console.log(chalk.green('API is healthy\n'));

    try {
      await login(options.email, options.password);
      console.log(chalk.green('Authenticated\n'));
    } catch {
      console.error(chalk.red('Authentication failed.'));
      process.exit(1);
    }

    const rawVehicles = await getVehicles();
    const vehicles: Vehicle[] = rawVehicles
      .filter((v: any) => v.rfidTags?.length > 0)
      .map((v: any) => ({
        id: v.id, plateNumber: v.plateNumber, rfidTagId: v.rfidTags[0].id,
        vehicleClass: v.vehicleClass, make: v.make, model: v.model,
      }));
    console.log(chalk.green(`${vehicles.length} vehicles with RFID tags\n`));

    const rawPlazas = await getTollPlazas();
    const plazas: TollPlaza[] = rawPlazas.map((p: any) => ({
      id: p.id, name: p.name, gateCode: p.gateCode || null,
      mileMarker: p.mileMarker, lanes: p.lanes, status: p.status,
    }));
    plazas.sort((a, b) => (a.mileMarker || 0) - (b.mileMarker || 0));

    const routes = getRoutesForPlazas(plazas);
    const routeMap: Record<string, number> = { full: 0, short: 1, medium: 2, direct: 3, return: 4 };
    const selectedRoute = routes[routeMap[options.route] ?? 0];
    const routePlazas = selectedRoute.plazas.map((id) => plazas.find((p) => p.id === id)!).filter(Boolean);

    const holidayType = options.type as HolidayType;
    const config = HOLIDAY_CONFIGS[holidayType] || HOLIDAY_CONFIGS['normal-day'];

    console.log(chalk.magenta(`Holiday: ${config.name}`));
    console.log(chalk.gray(`  ${config.description}`));
    console.log(chalk.cyan(`  Vehicle multiplier: ${config.vehicleMultiplier}x`));
    console.log(chalk.cyan(`  Congestion: ${config.congestionLevel}`));
    console.log(chalk.cyan(`  Violation rate: ${(config.violationRate * 100).toFixed(0)}%`));
    console.log(chalk.cyan(`  Route: ${selectedRoute.name}`));
    console.log(chalk.cyan(`  Target: ${options.count} vehicles\n`));

    console.log(chalk.yellow('Traffic Waves:'));
    TRAFFIC_WAVES.forEach((w) => console.log(chalk.gray(`  ${w.label}`)));
    console.log('');

    startHoliday({
      vehicles,
      plazas: routePlazas,
      holidayType,
      count: parseInt(options.count),
    });

    process.on('SIGINT', () => { stopHoliday(); process.exit(0); });
    process.on('SIGTERM', () => { stopHoliday(); process.exit(0); });
  });

program
  .command('status')
  .description('Show current simulation state')
  .action(() => {
    const stats = getStats();
    if (stats.totalPassages === 0) {
      console.log(chalk.yellow('No simulation data available'));
    } else {
      displayContinuousStats();
    }
  });

program
  .command('routes')
  .description('Show available routes')
  .option('--api <url>', 'Backend API URL', 'http://localhost:3000')
  .action(async (options) => {
    console.log(chalk.bold.blue('=== Available Routes ===\n'));

    try {
      const rawPlazas = await getTollPlazas();
      const plazas: TollPlaza[] = rawPlazas.map((p: any) => ({
        id: p.id,
        name: p.name,
        gateCode: p.gateCode || null,
        mileMarker: p.mileMarker,
        lanes: p.lanes,
        status: p.status,
      }));
      plazas.sort((a, b) => (a.mileMarker || 0) - (b.mileMarker || 0));

      console.log(chalk.cyan('Toll Plazas:'));
      plazas.forEach((p) => {
        console.log(chalk.gray(`  ${p.gateCode || p.name} - ${p.name} (${p.mileMarker ?? '?'} Mile) [${p.lanes} lanes]`));
      });
      console.log('');

      const routes = getRoutesForPlazas(plazas);
      console.log(chalk.cyan('Routes:'));
      routes.forEach((route, i) => {
        console.log(chalk.white(`  ${i + 1}. ${route.name}`));
        console.log(chalk.gray(`     ${route.description}`));
      });
    } catch (error) {
      console.error(chalk.red('Failed to fetch routes. Is the API running?'));
    }
  });

program
  .command('vehicles')
  .description('Show available vehicles')
  .option('--api <url>', 'Backend API URL', 'http://localhost:3000')
  .action(async (options) => {
    console.log(chalk.bold.blue('=== Available Vehicles ===\n'));

    try {
      const rawVehicles = await getVehicles();
      const vehicles = rawVehicles.filter((v: any) => v.rfidTags && v.rfidTags.length > 0);

      console.log(chalk.cyan(`Found ${vehicles.length} vehicles with RFID tags:\n`));
      vehicles.forEach((v: any) => {
        console.log(chalk.white(`  ${v.plateNumber}`));
        console.log(chalk.gray(`    ${v.make} ${v.model} (${v.vehicleClass})`));
        console.log(chalk.gray(`    RFID: ${v.rfidTags[0].tagUid}`));
      });
    } catch (error) {
      console.error(chalk.red('Failed to fetch vehicles. Is the API running?'));
    }
  });

program.parse();
