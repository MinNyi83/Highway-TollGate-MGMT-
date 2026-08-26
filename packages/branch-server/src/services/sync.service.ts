import { PrismaClient } from '@prisma/client';
import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

interface SyncChange {
  tableName: string;
  recordId: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: string;
}

interface SyncStatus {
  isOnline: boolean;
  lastSyncAt: string | null;
  pendingChanges: number;
  syncVersion: number;
}

export class SyncService {
  private prisma: PrismaClient;
  private hqClient: AxiosInstance;
  private isOnline: boolean = false;
  private lastSyncAt: string | null = null;
  private syncVersion: number = 0;
  private syncInterval: NodeJS.Timeout | null = null;
  private readonly SYNC_INTERVAL = 30000; // 30 seconds
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private retryAttempts: number = 0;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    this.hqClient = axios.create({
      baseURL: process.env.HQ_URL || 'http://localhost:3000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Branch-ID': process.env.PLAZA_ID || 'unknown',
      },
    });

    // Add auth interceptor
    this.hqClient.interceptors.request.use(async (config) => {
      const token = await this.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async initialize(): Promise<void> {
    // Load sync version from local config
    const config = await this.prisma.localConfig.findUnique({
      where: { key: 'syncVersion' },
    });

    if (config) {
      this.syncVersion = parseInt(config.value, 10);
    }

    // Check connectivity to HQ
    await this.checkConnectivity();
  }

  async checkConnectivity(): Promise<boolean> {
    try {
      await this.hqClient.get('/api/health');
      this.isOnline = true;
      logger.info('Connected to HQ server');
      return true;
    } catch (error) {
      this.isOnline = false;
      logger.warn('Cannot connect to HQ server, operating in offline mode');
      return false;
    }
  }

  getSyncStatus(): SyncStatus {
    return {
      isOnline: this.isOnline,
      lastSyncAt: this.lastSyncAt,
      pendingChanges: 0, // Will be calculated
      syncVersion: this.syncVersion,
    };
  }

  async forceSync(): Promise<void> {
    if (!this.isOnline) {
      await this.checkConnectivity();
      if (!this.isOnline) {
        throw new Error('Cannot sync: HQ server is unreachable');
      }
    }

    try {
      // Push local changes
      await this.pushChanges();

      // Pull remote changes
      await this.pullChanges();

      this.retryAttempts = 0;
      logger.info('Sync completed successfully');
    } catch (error) {
      this.retryAttempts++;
      logger.error('Sync failed:', error);

      if (this.retryAttempts >= this.MAX_RETRY_ATTEMPTS) {
        logger.error('Max retry attempts reached, will try again later');
        this.retryAttempts = 0;
      }
    }
  }

  async pushChanges(): Promise<void> {
    // Get pending changes from sync queue
    const pendingChanges = await this.prisma.syncQueue.findMany({
      where: { syncedAt: null },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });

    if (pendingChanges.length === 0) {
      return;
    }

    const changes: SyncChange[] = pendingChanges.map((item) => ({
      tableName: item.tableName,
      recordId: item.recordId,
      operation: item.operation as 'INSERT' | 'UPDATE' | 'DELETE',
      payload: JSON.parse(item.payload),
      timestamp: item.createdAt.toISOString(),
    }));

    try {
      const response = await this.hqClient.post('/api/sync/push', {
        changes,
      });

      // Mark as synced
      const ids = pendingChanges.map((item) => item.id);
      await this.prisma.syncQueue.updateMany({
        where: { id: { in: ids } },
        data: { syncedAt: new Date() },
      });

      logger.info(`Pushed ${changes.length} changes to HQ`);
    } catch (error) {
      logger.error('Failed to push changes:', error);
      throw error;
    }
  }

  async pullChanges(): Promise<void> {
    try {
      const response = await this.hqClient.get(
        `/api/sync/pull?since=${this.syncVersion}`
      );

      const { changes, syncVersion } = response.data;

      if (changes && changes.length > 0) {
        await this.applyRemoteChanges(changes);
        this.syncVersion = syncVersion;
        await this.updateSyncVersion();
        logger.info(`Pulled ${changes.length} changes from HQ`);
      }

      this.lastSyncAt = new Date().toISOString();
    } catch (error) {
      logger.error('Failed to pull changes:', error);
      throw error;
    }
  }

  private async applyRemoteChanges(changes: SyncChange[]): Promise<void> {
    for (const change of changes) {
      try {
        switch (change.tableName) {
          case 'Vehicles':
            await this.applyVehicleChange(change);
            break;
          case 'TollPlazas':
            await this.applyTollPlazaChange(change);
            break;
          case 'TollRates':
            await this.applyTollRateChange(change);
            break;
          case 'RFIDTags':
            await this.applyRFIDTagChange(change);
            break;
          default:
            logger.warn(`Unknown table: ${change.tableName}`);
        }
      } catch (error) {
        logger.error(`Failed to apply change for ${change.tableName}:`, error);
      }
    }
  }

  private async applyVehicleChange(change: SyncChange): Promise<void> {
    const { operation, recordId, payload } = change;

    switch (operation) {
      case 'INSERT':
      case 'UPDATE':
        await this.prisma.vehicle.upsert({
          where: { id: recordId },
          create: {
            id: recordId,
            plateNumber: payload.plateNumber,
            make: payload.make,
            model: payload.model,
            year: payload.year,
            color: payload.color,
            vehicleClass: payload.vehicleClass,
            status: payload.status,
            hqVehicleId: payload.hqVehicleId,
            syncVersion: this.syncVersion,
            syncedAt: new Date(),
          },
          update: {
            make: payload.make,
            model: payload.model,
            year: payload.year,
            color: payload.color,
            vehicleClass: payload.vehicleClass,
            status: payload.status,
            syncVersion: this.syncVersion,
            syncedAt: new Date(),
          },
        });
        break;
      case 'DELETE':
        await this.prisma.vehicle.deleteMany({
          where: { id: recordId },
        });
        break;
    }
  }

  private async applyTollPlazaChange(change: SyncChange): Promise<void> {
    const { operation, recordId, payload } = change;

    switch (operation) {
      case 'INSERT':
      case 'UPDATE':
        await this.prisma.tollPlaza.upsert({
          where: { id: recordId },
          create: {
            id: recordId,
            name: payload.name,
            locationLat: payload.locationLat,
            locationLng: payload.locationLng,
            lanes: payload.lanes,
            status: payload.status,
            hqPlazaId: payload.hqPlazaId,
            syncVersion: this.syncVersion,
            syncedAt: new Date(),
          },
          update: {
            name: payload.name,
            locationLat: payload.locationLat,
            locationLng: payload.locationLng,
            lanes: payload.lanes,
            status: payload.status,
            syncVersion: this.syncVersion,
            syncedAt: new Date(),
          },
        });
        break;
      case 'DELETE':
        await this.prisma.tollPlaza.deleteMany({
          where: { id: recordId },
        });
        break;
    }
  }

  private async applyTollRateChange(change: SyncChange): Promise<void> {
    const { operation, recordId, payload } = change;

    switch (operation) {
      case 'INSERT':
      case 'UPDATE':
        await this.prisma.tollRate.upsert({
          where: { id: recordId },
          create: {
            id: recordId,
            plazaId: payload.plazaId,
            vehicleClass: payload.vehicleClass,
            rateAmount: payload.rateAmount,
            effectiveFrom: new Date(payload.effectiveFrom),
            effectiveTo: payload.effectiveTo
              ? new Date(payload.effectiveTo)
              : null,
            syncVersion: this.syncVersion,
          },
          update: {
            vehicleClass: payload.vehicleClass,
            rateAmount: payload.rateAmount,
            effectiveFrom: new Date(payload.effectiveFrom),
            effectiveTo: payload.effectiveTo
              ? new Date(payload.effectiveTo)
              : null,
            syncVersion: this.syncVersion,
          },
        });
        break;
      case 'DELETE':
        await this.prisma.tollRate.deleteMany({
          where: { id: recordId },
        });
        break;
    }
  }

  private async applyRFIDTagChange(change: SyncChange): Promise<void> {
    const { operation, recordId, payload } = change;

    switch (operation) {
      case 'INSERT':
      case 'UPDATE':
        await this.prisma.rFIDTag.upsert({
          where: { id: recordId },
          create: {
            id: recordId,
            tagUid: payload.tagUid,
            vehicleId: payload.vehicleId,
            status: payload.status,
            issuedAt: new Date(payload.issuedAt),
            expiresAt: payload.expiresAt
              ? new Date(payload.expiresAt)
              : null,
            syncVersion: this.syncVersion,
          },
          update: {
            status: payload.status,
            expiresAt: payload.expiresAt
              ? new Date(payload.expiresAt)
              : null,
            syncVersion: this.syncVersion,
          },
        });
        break;
      case 'DELETE':
        await this.prisma.rFIDTag.deleteMany({
          where: { id: recordId },
        });
        break;
    }
  }

  private async updateSyncVersion(): Promise<void> {
    await this.prisma.localConfig.upsert({
      where: { key: 'syncVersion' },
      create: {
        key: 'syncVersion',
        value: this.syncVersion.toString(),
      },
      update: {
        value: this.syncVersion.toString(),
      },
    });
  }

  private async getAuthToken(): Promise<string | null> {
    // TODO: Implement proper token management
    return process.env.HQ_API_KEY || null;
  }

  async addToSyncQueue(
    tableName: string,
    recordId: string,
    operation: 'INSERT' | 'UPDATE' | 'DELETE',
    payload: any
  ): Promise<void> {
    await this.prisma.syncQueue.create({
      data: {
        tableName,
        recordId,
        operation,
        payload: JSON.stringify(payload),
      },
    });
  }

  startPeriodicSync(): void {
    this.syncInterval = setInterval(async () => {
      if (this.isOnline) {
        await this.forceSync();
      } else {
        await this.checkConnectivity();
      }
    }, this.SYNC_INTERVAL);
  }

  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }
}
