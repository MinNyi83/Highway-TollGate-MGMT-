export interface Vehicle {
  plateNumber: string;
  rfidTag: string;
  vehicleClass: 'SEDAN' | 'SUV' | 'TRUCK' | 'BUS';
  make: string;
  model: string;
}

const VEHICLE_CLASSES: Vehicle['vehicleClass'][] = ['SEDAN', 'SUV', 'TRUCK', 'BUS'];
const MAKES = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda'];
const MODELS = ['Camry', 'Civic', 'Focus', 'Malibu', 'Altima', 'Elantra', 'Forte', '3'];

function generatePlateNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const plate = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
  const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  return `${plate}-${numbers}`;
}

function generateRfidTag(): string {
  return Array.from({ length: 12 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export function generateVehicle(): Vehicle {
  return {
    plateNumber: generatePlateNumber(),
    rfidTag: generateRfidTag(),
    vehicleClass: VEHICLE_CLASSES[Math.floor(Math.random() * VEHICLE_CLASSES.length)],
    make: MAKES[Math.floor(Math.random() * MAKES.length)],
    model: MODELS[Math.floor(Math.random() * MODELS.length)],
  };
}

export function generateVehiclePool(size: number): Vehicle[] {
  return Array.from({ length: size }, () => generateVehicle());
}
