import { PrismaClient, VehicleClass, TollPlazaStatus } from '@prisma/client';
import { cache, invalidateCache } from '../../services/cache.service';

const prisma = new PrismaClient();

export interface CreateTollPlazaInput {
  name: string;
  gateCode?: string;
  locationLat: number;
  locationLng: number;
  mileMarker?: number;
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
  const cacheKey = 'toll-plazas:list';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const plazas = await prisma.tollPlaza.findMany({
    include: {
      tollRates: true,
    },
  });

  cache.set(cacheKey, plazas, 300000);
  return plazas;
}

export async function getTollPlazaById(id: string) {
  const cacheKey = `toll-plazas:${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const plaza = await prisma.tollPlaza.findUnique({
    where: { id },
    include: {
      tollRates: true,
    },
  });

  if (plaza) {
    cache.set(cacheKey, plaza, 300000);
  }
  return plaza;
}

export async function createTollPlaza(input: CreateTollPlazaInput) {
  const plaza = await prisma.tollPlaza.create({ data: input });
  invalidateCache('toll-plazas:*');
  return plaza;
}

export async function updateTollPlaza(id: string, input: UpdateTollPlazaInput) {
  const plaza = await prisma.tollPlaza.update({ where: { id }, data: input });
  invalidateCache('toll-plazas:*');
  return plaza;
}

export async function getTollRates(plazaId: string) {
  const cacheKey = `toll-rates:${plazaId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const rates = await prisma.tollRate.findMany({ where: { plazaId } });
  cache.set(cacheKey, rates, 300000);
  return rates;
}

export async function createTollRate(plazaId: string, input: CreateTollRateInput) {
  const plaza = await prisma.tollPlaza.findUnique({ where: { id: plazaId } });
  if (!plaza) throw new Error('Toll plaza not found');

  const rate = await prisma.tollRate.create({
    data: { plazaId, ...input },
  });

  invalidateCache(`toll-rates:${plazaId}`);
  return rate;
}
