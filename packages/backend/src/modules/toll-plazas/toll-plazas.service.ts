import { PrismaClient, VehicleClass, TollPlazaStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateTollPlazaInput {
  name: string;
  locationLat: number;
  locationLng: number;
  lanes?: number;
}

export interface UpdateTollPlazaInput {
  name?: string;
  locationLat?: number;
  locationLng?: number;
  lanes?: number;
  status?: TollPlazaStatus;
}

export interface CreateTollRateInput {
  vehicleClass: VehicleClass;
  rateAmount: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
}

export async function getTollPlazas() {
  return prisma.tollPlaza.findMany({
    include: {
      tollRates: true,
    },
  });
}

export async function getTollPlazaById(id: string) {
  return prisma.tollPlaza.findUnique({
    where: { id },
    include: {
      tollRates: true,
    },
  });
}

export async function createTollPlaza(input: CreateTollPlazaInput) {
  return prisma.tollPlaza.create({
    data: input,
  });
}

export async function updateTollPlaza(id: string, input: UpdateTollPlazaInput) {
  return prisma.tollPlaza.update({
    where: { id },
    data: input,
  });
}

export async function getTollRates(plazaId: string) {
  return prisma.tollRate.findMany({
    where: { plazaId },
  });
}

export async function createTollRate(plazaId: string, input: CreateTollRateInput) {
  const plaza = await prisma.tollPlaza.findUnique({
    where: { id: plazaId },
  });

  if (!plaza) {
    throw new Error('Toll plaza not found');
  }

  return prisma.tollRate.create({
    data: {
      plazaId,
      ...input,
    },
  });
}
