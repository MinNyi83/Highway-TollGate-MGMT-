import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import cron from 'node-cron';

let syncInterval: cron.ScheduledTask | null = null;

export async function setupSyncEngine(prisma: PrismaClient, io: SocketIOServer) {
  const config = await prisma.plazaConfig.findFirst();
  if (!config?.hqServerUrl) {
    console.log('No HQ server configured, sync disabled');
    return;
  }

  console.log(`Sync engine targeting HQ: ${config.hqServerUrl}`);

  // Sync every 30 seconds when connected
  syncInterval = cron.schedule('*/30 * * * * *', async () => {
    if (!config.syncEnabled) return;
    await syncToHQ(prisma, io, config.hqServerUrl!);
  });

  // Also sync immediately on startup
  await syncToHQ(prisma, io, config.hqServerUrl);

  // Pull updates from HQ every 60 seconds
  cron.schedule('*/60 * * * * *', async () => {
    if (!config.syncEnabled) return;
    await pullFromHQ(prisma, io, config.hqServerUrl!);
  });
}

async function syncToHQ(prisma: PrismaClient, io: SocketIOServer, hqUrl: string) {
  const pendingItems = await prisma.syncQueue.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });

  if (pendingItems.length === 0) return;

  console.log(`Syncing ${pendingItems.length} items to HQ`);

  for (const item of pendingItems) {
    try {
      const response = await fetch(`${hqUrl}/api/sync/push`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Plaza-Id': (await prisma.plazaConfig.findFirst())?.id || '',
          'X-Sync-Token': process.env.SYNC_TOKEN || '',
        },
        body: JSON.stringify({
          table: item.tableName,
          recordId: item.recordId,
          action: item.action,
          payload: JSON.parse(item.payload),
        }),
      });

      if (response.ok) {
        await prisma.syncQueue.update({
          where: { id: item.id },
          data: { status: 'COMPLETED' },
        });

        // Update synced flag on source record
        await markSynced(prisma, item.tableName, item.recordId);
      } else {
        throw new Error(`HQ responded with ${response.status}`);
      }
    } catch (error: any) {
      console.error(`Sync failed for ${item.tableName}/${item.recordId}:`, error.message);

      const newRetries = item.retries + 1;
      await prisma.syncQueue.update({
        where: { id: item.id },
        data: {
          retries: newRetries,
          status: newRetries >= item.maxRetries ? 'FAILED' : 'PENDING',
          error: error.message,
          lastAttemptAt: new Date(),
        },
      });
    }
  }

  io.emit('sync-complete', { count: pendingItems.length, timestamp: new Date() });
}

async function pullFromHQ(prisma: PrismaClient, io: SocketIOServer, hqUrl: string) {
  try {
    const lastSync = (await prisma.plazaConfig.findFirst())?.lastSyncAt;

    const response = await fetch(`${hqUrl}/api/sync/pull`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Plaza-Id': (await prisma.plazaConfig.findFirst())?.id || '',
        'X-Sync-Token': process.env.SYNC_TOKEN || '',
      },
      body: JSON.stringify({
        lastSyncAt: lastSync?.toISOString(),
        tables: ['LocalVehicle', 'RFIDTag', 'TollRate'],
      }),
    });

    if (!response.ok) return;

    const data = await response.json() as { records: any[] };

    if (!data.records || data.records.length === 0) return;

    console.log(`Pulling ${data.records.length} records from HQ`);

    for (const record of data.records) {
      await applyRecord(prisma, record);
    }

    await prisma.plazaConfig.updateMany({
      data: { lastSyncAt: new Date() },
    });

    io.emit('sync-pull', { count: data.records.length, timestamp: new Date() });
  } catch (error: any) {
    console.error('Pull from HQ failed:', error.message);
  }
}

async function applyRecord(prisma: PrismaClient, record: any) {
  const { table, data, action } = record;

  switch (table) {
    case 'Vehicle':
      await prisma.localVehicle.upsert({
        where: { hqId: data.id },
        update: {
          plateNumber: data.plateNumber,
          make: data.make,
          model: data.model,
          year: data.year,
          color: data.color,
          vehicleClass: data.vehicleClass,
          status: data.status,
          synced: true,
        },
        create: {
          hqId: data.id,
          plateNumber: data.plateNumber,
          make: data.make,
          model: data.model,
          year: data.year,
          color: data.color,
          vehicleClass: data.vehicleClass || 'SEDAN',
          status: data.status || 'ACTIVE',
          synced: true,
        },
      });
      break;

    case 'RFIDTag':
      const localVehicle = data.vehicleId
        ? await prisma.localVehicle.findFirst({ where: { hqId: data.vehicleId } })
        : null;

      await prisma.rFIDTag.upsert({
        where: { tagUid: data.tagUid },
        update: {
          hqId: data.id,
          vehicleId: localVehicle?.id,
          status: data.status,
          synced: true,
        },
        create: {
          hqId: data.id,
          tagUid: data.tagUid,
          vehicleId: localVehicle?.id,
          status: data.status || 'ACTIVE',
          synced: true,
        },
      });
      break;

    case 'TollRate':
      if (action === 'DELETE') {
        await prisma.tollRate.deleteMany({ where: { vehicleClass: data.vehicleClass } });
      } else {
        await prisma.tollRate.upsert({
          where: { id: data.id },
          update: {
            rateAmount: data.rateAmount,
            active: data.active,
          },
          create: {
            id: data.id,
            vehicleClass: data.vehicleClass,
            rateAmount: data.rateAmount,
            active: data.active ?? true,
          },
        });
      }
      break;
  }
}

async function markSynced(prisma: PrismaClient, table: string, recordId: string) {
  switch (table) {
    case 'LocalVehicle':
      await prisma.localVehicle.update({ where: { id: recordId }, data: { synced: true } });
      break;
    case 'RFIDTag':
      await prisma.rFIDTag.update({ where: { id: recordId }, data: { synced: true } });
      break;
    case 'TollEvent':
      await prisma.tollEvent.update({ where: { id: recordId }, data: { synced: true } });
      break;
  }
}

export function stopSync() {
  syncInterval?.stop();
}
