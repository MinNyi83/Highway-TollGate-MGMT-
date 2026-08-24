import { PrismaClient, TollEventStatus } from '@prisma/client';

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

  return updatedEvent;
}

export async function getTollEvents() {
  return prisma.tollEvent.findMany({
    include: {
      vehicle: true,
      plaza: true,
      rfidTag: true,
    },
    orderBy: {
      entryTime: 'desc',
    },
  });
}

export async function getTollEventById(id: string) {
  return prisma.tollEvent.findUnique({
    where: { id },
    include: {
      vehicle: true,
      plaza: true,
      rfidTag: true,
      transaction: true,
      violation: true,
    },
  });
}
