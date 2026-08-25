import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getTollEventsByDateRange(startDate: Date, endDate: Date) {
  return prisma.tollEvent.findMany({
    where: {
      entryTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      vehicle: true,
      plaza: true,
    },
  });
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date) {
  return prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      event: {
        include: {
          vehicle: true,
          plaza: true,
        },
      },
      account: true,
    },
  });
}

export async function getViolationsByDateRange(startDate: Date, endDate: Date) {
  return prisma.violation.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      vehicle: true,
      event: true,
    },
  });
}

export async function getTollRevenueByPlaza(startDate: Date, endDate: Date) {
  const transactions = await prisma.transaction.findMany({
    where: {
      status: 'COMPLETED',
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      event: {
        include: {
          plaza: true,
        },
      },
    },
  });

  const revenueByPlaza = new Map<string, { plazaName: string; totalRevenue: number; transactionCount: number }>();

  for (const transaction of transactions) {
    if (!transaction.event) continue;
    const plazaId = transaction.event.plaza.id;
    const plazaName = transaction.event.plaza.name;
    const amount = Number(transaction.amount);

    if (!revenueByPlaza.has(plazaId)) {
      revenueByPlaza.set(plazaId, { plazaName, totalRevenue: 0, transactionCount: 0 });
    }

    const data = revenueByPlaza.get(plazaId)!;
    data.totalRevenue += amount;
    data.transactionCount += 1;
  }

  return Array.from(revenueByPlaza.values());
}

export async function getViolationStats() {
  const stats = await prisma.violation.groupBy({
    by: ['violationType'],
    _count: true,
    _sum: {
      fineAmount: true,
    },
  });

  return stats.map((stat) => ({
    violationType: stat.violationType,
    count: stat._count,
    totalFines: Number(stat._sum.fineAmount || 0),
  }));
}
