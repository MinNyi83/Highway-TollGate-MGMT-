import { PrismaClient } from '@prisma/client';

export async function setupTollProcessor(prisma: PrismaClient) {
  // Ensure default rates exist
  const rates = await prisma.tollRate.count();
  if (rates === 0) {
    const defaultRates = [
      { vehicleClass: 'MOTORCYCLE', rateAmount: 300 },
      { vehicleClass: 'SEDAN', rateAmount: 1000 },
      { vehicleClass: 'SUV', rateAmount: 1500 },
      { vehicleClass: 'VAN', rateAmount: 1500 },
      { vehicleClass: 'TRUCK_2AXLE', rateAmount: 2000 },
      { vehicleClass: 'TRUCK_3AXLE', rateAmount: 3000 },
      { vehicleClass: 'BUS_SMALL', rateAmount: 2500 },
      { vehicleClass: 'BUS_LARGE', rateAmount: 4000 },
      { vehicleClass: 'TRAILER', rateAmount: 5000 },
    ];

    for (const rate of defaultRates) {
      await prisma.tollRate.create({ data: rate });
    }
    console.log('Created default toll rates');
  }
}

export async function calculateToll(prisma: PrismaClient, vehicleClass: string): Promise<number> {
  const rate = await prisma.tollRate.findFirst({
    where: { vehicleClass, active: true },
  });
  return rate?.rateAmount || 0;
}
