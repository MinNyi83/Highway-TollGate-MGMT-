import axios from 'axios';
import chalk from 'chalk';
import { generateVehicle } from '../generators/vehiclePool';

const API_URL = process.env.API_URL || 'http://localhost:3000';

export interface PassageResult {
  vehicle: ReturnType<typeof generateVehicle>;
  entryEvent: any;
  exitEvent: any;
  duration: number;
}

export async function simulateSinglePassage(
  plazaId: string,
  options: { entryDelay?: number } = {}
): Promise<PassageResult> {
  const vehicle = generateVehicle();
  const entryDelay = options.entryDelay || 5000;

  console.log(chalk.blue(`\nSimulating passage for ${vehicle.plateNumber}...`));

  const entryResponse = await axios.post(`${API_URL}/api/toll-events/entry`, {
    vehiclePlateNumber: vehicle.plateNumber,
    rfidTag: vehicle.rfidTag,
    plazaId,
    vehicleClass: vehicle.vehicleClass,
    anprPlateNumber: vehicle.plateNumber,
  });

  console.log(chalk.green(`  Entry recorded: ${entryResponse.data.id}`));

  await new Promise((resolve) => setTimeout(resolve, entryDelay));

  const exitResponse = await axios.put(`${API_URL}/api/toll-events/${entryResponse.data.id}/exit`, {
    plazaId,
    anprPlateNumber: vehicle.plateNumber,
  });

  console.log(chalk.green(`  Exit recorded: ${exitResponse.data.id}`));

  return {
    vehicle,
    entryEvent: entryResponse.data,
    exitEvent: exitResponse.data,
    duration: entryDelay,
  };
}
