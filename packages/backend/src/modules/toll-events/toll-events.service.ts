import { PrismaClient, TollEventStatus } from '@prisma/client';
import { createTransaction } from '../transactions/transactions.service';
import { cache, invalidateCache } from '../../services/cache.service';

const prisma = new PrismaClient();

export interface CreateEntryEventInput {
  vehicleId: string;
  plazaId: string;
  rfidTagId?: string;
  anprPlate?: string;
}

export interface CompleteExitEventInput {
  eventId: string;
  anprPlate?: string;
}

export async function createEntryEvent(input: CreateEntryEventInput) {
  const event = await prisma.tollEvent.create({
    data: {
      vehicleId: input.vehicleId,
      plazaId: input.plazaId,
      rfidTagId: input.rfidTagId,
      anprPlate: input.anprPlate,
      status: TollEventStatus.ENTRY,
    },
    include: {
      vehicle: true,
      plaza: true,
    },
  });

  invalidateCache('toll-events:*');
  return event;
}

export async function completeExitEvent(input: CompleteExitEventInput) {
  const event = await prisma.tollEvent.findUnique({
    where: { id: input.eventId },
    include: {
      vehicle: {
        include: {
          rfidTags: true,
        },
      },
    },
  });

  if (!event) {
    throw new Error('Toll event not found');
  }

  if (event.status !== TollEventStatus.ENTRY) {
    throw new Error('Event is not in ENTRY status');
  }

  // Cross-verification: Check if ANPR plate matches vehicle plate
  if (input.anprPlate && event.vehicle.plateNumber !== input.anprPlate) {
    // Create violation for mismatch
    await prisma.violation.create({
      data: {
        vehicleId: event.vehicleId,
        eventId: event.id,
        violationType: 'RFID_ANPR_MISMATCH',
        fineAmount: 500,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });
  }

  // Complete the event
  const updatedEvent = await prisma.tollEvent.update({
    where: { id: input.eventId },
    data: {
      exitTime: new Date(),
      status: TollEventStatus.COMPLETED,
    },
    include: {
      vehicle: true,
      plaza: true,
    },
  });

  invalidateCache('toll-events:*');

  try {
    await createTransaction(event.id);
  } catch (error) {
    console.error(`Failed to create transaction for event ${event.id}:`, error);
  }

  return updatedEvent;
}

export async function getTollEvents() {
  const cacheKey = 'toll-events:list';
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const events = await prisma.tollEvent.findMany({
    include: {
      vehicle: true,
      plaza: true,
      rfidTag: true,
    },
    orderBy: {
      entryTime: 'desc',
    },
    take: 100,
  });

  cache.set(cacheKey, events, 30000);
  return events;
}

export async function getTollEventById(id: string) {
  const cacheKey = `toll-events:${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  const event = await prisma.tollEvent.findUnique({
    where: { id },
    include: {
      vehicle: true,
      plaza: true,
      rfidTag: true,
      transaction: true,
      violation: true,
    },
  });

  if (event) {
    cache.set(cacheKey, event, 60000);
  }
  return event;
}
