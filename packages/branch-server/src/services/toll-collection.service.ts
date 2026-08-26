import { PrismaClient } from '@prisma/client';
import { SyncService } from './sync.service';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

interface EntryInput {
  vehicleId?: string;
  rfidTagUid?: string;
  anprPlate?: string;
  plazaId: string;
  laneId?: number;
}

interface ExitInput {
  eventId: string;
  anprPlate?: string;
}

interface TollEvent {
  id: string;
  vehicleId: string;
  plazaId: string;
  entryTime: Date;
  exitTime?: Date;
  status: string;
  amount?: number;
}

export class TollCollectionService {
  private prisma: PrismaClient;
  private syncService: SyncService;

  constructor(prisma: PrismaClient, syncService: SyncService) {
    this.prisma = prisma;
    this.syncService = syncService;
  }

  async processEntry(input: EntryInput): Promise<TollEvent> {
    logger.info('Processing entry:', input);

    // Find vehicle by RFID tag or plate number
    let vehicle = null;

    if (input.rfidTagUid) {
      const rfidTag = await this.prisma.rFIDTag.findUnique({
        where: { tagUid: input.rfidTagUid },
        include: { vehicle: true },
      });
      vehicle = rfidTag?.vehicle;
    } else if (input.anprPlate) {
      vehicle = await this.prisma.vehicle.findUnique({
        where: { plateNumber: input.anprPlate },
      });
    }

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Create entry event
    const event = await this.prisma.tollEvent.create({
      data: {
        id: uuidv4(),
        vehicleId: vehicle.id,
        plazaId: input.plazaId,
        anprPlate: input.anprPlate,
        status: 'ENTRY',
      },
      include: {
        vehicle: true,
        plaza: true,
      },
    });

    // Add to sync queue
    await this.syncService.addToSyncQueue(
      'TollEvents',
      event.id,
      'INSERT',
      event
    );

    logger.info(`Entry event created: ${event.id}`);
    return event;
  }

  async processExit(input: ExitInput): Promise<TollEvent> {
    logger.info('Processing exit:', input);

    // Find the entry event
    const event = await this.prisma.tollEvent.findUnique({
      where: { id: input.eventId },
      include: {
        vehicle: {
          include: { rfidTags: true },
        },
        plaza: {
          include: { tollRates: true },
        },
      },
    });

    if (!event) {
      throw new Error('Toll event not found');
    }

    if (event.status !== 'ENTRY') {
      throw new Error('Event is not in ENTRY status');
    }

    // Cross-verification: Check if ANPR plate matches vehicle plate
    if (input.anprPlate && event.vehicle.plateNumber !== input.anprPlate) {
      logger.warn(
        `ANPR mismatch: expected ${event.vehicle.plateNumber}, got ${input.anprPlate}`
      );
      // Create violation
      // TODO: Create violation record
    }

    // Calculate toll amount based on vehicle class and plaza rates
    const tollRate = event.plaza.tollRates.find(
      (rate) => rate.vehicleClass === event.vehicle.vehicleClass
    );

    const amount = tollRate?.rateAmount || 0;

    // Complete the exit event
    const updatedEvent = await this.prisma.tollEvent.update({
      where: { id: input.eventId },
      data: {
        exitTime: new Date(),
        status: 'COMPLETED',
        amount,
      },
      include: {
        vehicle: true,
        plaza: true,
      },
    });

    // Add to sync queue
    await this.syncService.addToSyncQueue(
      'TollEvents',
      event.id,
      'UPDATE',
      updatedEvent
    );

    logger.info(`Exit event completed: ${event.id}, amount: ${amount}`);
    return updatedEvent;
  }

  async getTollRate(
    plazaId: string,
    vehicleClass: string
  ): Promise<number> {
    const tollRate = await this.prisma.tollRate.findFirst({
      where: {
        plazaId,
        vehicleClass,
        effectiveFrom: { lte: new Date() },
        OR: [
          { effectiveTo: null },
          { effectiveTo: { gte: new Date() } },
        ],
      },
    });

    return tollRate?.rateAmount || 0;
  }
}
