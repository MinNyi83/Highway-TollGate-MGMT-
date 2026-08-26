import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { logger } from '../utils/logger';

interface ImportResult {
  success: number;
  failed: number;
  errors: { row: number; message: string }[];
}

interface VehicleImport {
  plateNumber: string;
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vehicleClass: string;
  rfidTag?: string;
}

interface BulkTopUp {
  accountNumber: string;
  amount: number;
  description?: string;
}

export class BulkOperationsService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async importVehiclesFromCSV(
    csvContent: string,
    accountId: string
  ): Promise<ImportResult> {
    const result: ImportResult = { success: 0, failed: 0, errors: [] };
    const rows: VehicleImport[] = [];

    return new Promise((resolve, reject) => {
      const stream = Readable.from(csvContent);

      stream
        .pipe(csv())
        .on('data', (row: VehicleImport) => {
          rows.push(row);
        })
        .on('end', async () => {
          for (let i = 0; i < rows.length; i++) {
            try {
              await this.importVehicle(rows[i], accountId);
              result.success++;
            } catch (error) {
              result.failed++;
              result.errors.push({
                row: i + 1,
                message: error instanceof Error ? error.message : 'Unknown error',
              });
            }
          }
          resolve(result);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private async importVehicle(
    vehicle: VehicleImport,
    accountId: string
  ): Promise<void> {
    // Validate required fields
    if (!vehicle.plateNumber) {
      throw new Error('Plate number is required');
    }

    if (!vehicle.vehicleClass) {
      throw new Error('Vehicle class is required');
    }

    // Check if vehicle already exists
    const existingVehicle = await this.prisma.vehicle.findUnique({
      where: { plateNumber: vehicle.plateNumber },
    });

    if (existingVehicle) {
      throw new Error(`Vehicle ${vehicle.plateNumber} already exists`);
    }

    // Create vehicle
    const newVehicle = await this.prisma.vehicle.create({
      data: {
        plateNumber: vehicle.plateNumber,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        vehicleClass: vehicle.vehicleClass as any,
      },
    });

    // Create RFID tag if provided
    if (vehicle.rfidTag) {
      await this.prisma.rFIDTag.create({
        data: {
          tagUid: vehicle.rfidTag,
          vehicleId: newVehicle.id,
          accountId,
        },
      });
    }

    logger.info(`Vehicle imported: ${vehicle.plateNumber}`);
  }

  async bulkTopUp(
    topUps: BulkTopUp[],
    description?: string
  ): Promise<ImportResult> {
    const result: ImportResult = { success: 0, failed: 0, errors: [] };

    for (let i = 0; i < topUps.length; i++) {
      try {
        await this.processTopUp(topUps[i], description);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          row: i + 1,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return result;
  }

  private async processTopUp(
    topUp: BulkTopUp,
    description?: string
  ): Promise<void> {
    // Find account by number
    const account = await this.prisma.account.findFirst({
      where: { accountNumber: topUp.accountNumber },
    });

    if (!account) {
      throw new Error(`Account not found: ${topUp.accountNumber}`);
    }

    if (topUp.amount <= 0) {
      throw new Error('Amount must be positive');
    }

    // Create transaction
    await this.prisma.transaction.create({
      data: {
        accountId: account.id,
        amount: topUp.amount,
        type: 'TOPUP',
        status: 'COMPLETED',
        paymentMethod: 'bulk_import',
        description: description || 'Bulk top-up',
      },
    });

    // Update account balance
    await this.prisma.account.update({
      where: { id: account.id },
      data: {
        balance: { increment: topUp.amount },
      },
    });

    logger.info(`Bulk top-up: ${topUp.accountNumber} - MMK ${topUp.amount}`);
  }

  async generateCSVTemplate(type: 'vehicles' | 'topup'): Promise<string> {
    switch (type) {
      case 'vehicles':
        return this.generateVehicleCSVTemplate();
      case 'topup':
        return this.generateTopUpCSVTemplate();
      default:
        throw new Error('Invalid template type');
    }
  }

  private generateVehicleCSVTemplate(): string {
    return `plateNumber,make,model,year,color,vehicleClass,rfidTag
ABC-1234,Toyota,Camry,2022,White,SEDAN,TAG000001
DEF-5678,Honda,Civic,2023,Black,SEDAN,TAG000002
GHI-9012,Ford,Explorer,2021,Blue,SUV,TAG000003`;
  }

  private generateTopUpCSVTemplate(): string {
    return `accountNumber,amount,description
TOLL-2024-000001,10000,Initial top-up
TOLL-2024-000002,5000,Bonus credit`;
  }

  async exportVehiclesToCSV(accountId?: string): Promise<string> {
    const where = accountId ? { rfidTags: { some: { accountId } } } : {};

    const vehicles = await this.prisma.vehicle.findMany({
      where,
      include: { rfidTags: true },
    });

    const header = 'plateNumber,make,model,year,color,vehicleClass,rfidTag,status';
    const rows = vehicles.map((v) => {
      const rfidTag = v.rfidTags[0]?.tagUid || '';
      return `${v.plateNumber},${v.make || ''},${v.model || ''},${v.year || ''},${v.color || ''},${v.vehicleClass},${rfidTag},${v.status}`;
    });

    return [header, ...rows].join('\n');
  }

  async exportTransactionsToCSV(
    startDate: Date,
    endDate: Date,
    accountId?: string
  ): Promise<string> {
    const where: any = {
      createdAt: { gte: startDate, lte: endDate },
    };

    if (accountId) {
      where.accountId = accountId;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        account: true,
        event: {
          include: { plaza: true, vehicle: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const header =
      'id,accountNumber,amount,type,status,paymentMethod,date,plaza,vehicle,description';
    const rows = transactions.map((t) => {
      return `${t.id},${t.account.accountNumber},${t.amount},${t.type},${t.status},${t.paymentMethod || ''},${t.createdAt.toISOString()},${t.event?.plaza?.name || ''},${t.event?.vehicle?.plateNumber || ''},${t.description || ''}`;
    });

    return [header, ...rows].join('\n');
  }
}
