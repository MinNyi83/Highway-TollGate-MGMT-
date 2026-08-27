import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

export async function setupOfflineQueue(prisma: PrismaClient) {
  // Clean up old completed sync items every hour
  cron.schedule('0 * * * *', async () => {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - 24);

    await prisma.syncQueue.deleteMany({
      where: {
        status: 'COMPLETED',
        createdAt: { lt: cutoff },
      },
    });
  });

  // Retry failed items every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    const failedItems = await prisma.syncQueue.findMany({
      where: {
        status: 'FAILED',
        retries: { lt: 5 },
      },
    });

    for (const item of failedItems) {
      await prisma.syncQueue.update({
        where: { id: item.id },
        data: { status: 'PENDING' },
      });
    }
  });

  // Check connectivity
  cron.schedule('*/10 * * * * *', async () => {
    const config = await prisma.plazaConfig.findFirst();
    if (!config?.hqServerUrl) return;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      await fetch(`${config.hqServerUrl}/api/health`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      await prisma.plazaConfig.updateMany({
        data: { lastSyncAt: new Date() },
      });
    } catch {
      // Offline - that's fine, queue will handle it
    }
  });
}

export async function getQueueStatus(prisma: PrismaClient) {
  const pending = await prisma.syncQueue.count({ where: { status: 'PENDING' } });
  const completed = await prisma.syncQueue.count({ where: { status: 'COMPLETED' } });
  const failed = await prisma.syncQueue.count({ where: { status: 'FAILED' } });

  return { pending, completed, failed, total: pending + completed + failed };
}
