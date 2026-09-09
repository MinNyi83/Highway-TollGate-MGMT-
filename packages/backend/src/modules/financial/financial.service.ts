import { hqPrisma as prisma } from '../../config/database';

function getFiscalYearDates(fiscalYear: number) {
  const start = new Date(fiscalYear, 3, 1);
  const end = new Date(fiscalYear + 1, 2, 31, 23, 59, 59, 999);
  return { start, end };
}

function getFiscalQuarter(month: number): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
  if (month >= 4 && month <= 6) return 'Q1';
  if (month >= 7 && month <= 9) return 'Q2';
  if (month >= 10 && month <= 12) return 'Q3';
  return 'Q4';
}

function getMonthName(month: number): string {
  const names = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return names[month - 1];
}

function getFiscalMonthIndex(month: number): number {
  // Fiscal year starts in April: Apr=1, May=2, ..., Mar=12
  return ((month - 4 + 12) % 12) + 1;
}

export async function getRegions() {
  return prisma.region.findMany({ orderBy: { name: 'asc' } });
}

export async function getRegionSummary(regionId: string) {
  const [vehicleCount, revenueAgg, depositAgg] = await Promise.all([
    prisma.vehicle.count({ where: { regionId } }),
    prisma.transaction.aggregate({
      where: {
        type: 'DEBIT',
        status: 'COMPLETED',
        account: { regionId },
      },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.transaction.aggregate({
      where: {
        type: 'TOPUP',
        status: 'COMPLETED',
        account: { regionId },
      },
      _sum: { amount: true },
    }),
  ]);

  const settledAgg = await prisma.revenueTransfer.aggregate({
    where: { regionId, status: 'CONFIRMED' },
    _sum: { amount: true },
  });

  const totalRevenue = Number(revenueAgg._sum.amount || 0);
  const totalDeposits = Number(depositAgg._sum.amount || 0);
  const totalSettled = Number(settledAgg._sum.amount || 0);

  return {
    regionId,
    vehicleCount,
    totalRevenue,
    totalDeposits,
    totalSettled,
    outstanding: totalRevenue - totalSettled,
    transactionCount: revenueAgg._count,
  };
}

export async function getDailyCollections(date?: string, regionId?: string, plazaId?: string) {
  const where: any = {};
  if (date) {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    where.collectionDate = { gte: start, lte: end };
  }
  if (regionId) where.regionId = regionId;
  if (plazaId) where.plazaId = plazaId;

  return prisma.dailyCollection.findMany({
    where,
    include: { plaza: true, region: true },
    orderBy: { collectionDate: 'desc' },
  });
}

export async function generateDailyCollection(date: string) {
  const d = new Date(date);
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const plazas = await prisma.tollPlaza.findMany({ where: { status: 'ACTIVE' } });
  const results = [];

  for (const plaza of plazas) {
    const existing = await prisma.dailyCollection.findUnique({
      where: { collectionDate_plazaId: { collectionDate: dayStart, plazaId: plaza.id } },
    });
    if (existing) continue;

    const events = await prisma.tollEvent.findMany({
      where: {
        plazaId: plaza.id,
        status: 'COMPLETED',
        entryTime: { gte: dayStart, lte: dayEnd },
      },
      include: { transaction: true },
    });

    const rfidTrips = events.filter((e) => e.rfidTagId).length;
    const cashTrips = events.length - rfidTrips;
    const totalRevenue = events.reduce((sum, e) => sum + Number(e.transaction?.amount || e.amount || 0), 0);

    const violations = await prisma.violation.findMany({
      where: {
        event: { plazaId: plaza.id, entryTime: { gte: dayStart, lte: dayEnd } },
      },
    });
    const violationFines = violations.reduce((sum, v) => sum + Number(v.fineAmount), 0);

    const collection = await prisma.dailyCollection.create({
      data: {
        collectionDate: dayStart,
        plazaId: plaza.id,
        regionId: plaza.regionId!,
        totalTrips: events.length,
        totalRevenue,
        rfidTrips,
        cashTrips,
        violationFines,
      },
    });
    results.push(collection);
  }

  return results;
}

export async function getRevenueByRegion(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const revenue = await prisma.transaction.groupBy({
    by: ['accountId'],
    where: {
      type: 'DEBIT',
      status: 'COMPLETED',
      createdAt: { gte: start, lte: end },
    },
    _sum: { amount: true },
    _count: true,
  });

  const accountIds = revenue.map((r) => r.accountId);
  const accounts = await prisma.account.findMany({
    where: { id: { in: accountIds } },
    select: { id: true, regionId: true },
  });

  const regionMap = new Map<string, { revenue: number; count: number }>();
  for (const r of revenue) {
    const account = accounts.find((a) => a.id === r.accountId);
    const rid = account?.regionId || 'unknown';
    const existing = regionMap.get(rid) || { revenue: 0, count: 0 };
    existing.revenue += Number(r._sum.amount || 0);
    existing.count += r._count;
    regionMap.set(rid, existing);
  }

  const regions = await prisma.region.findMany();
  const regionNameMap = new Map(regions.map((r) => [r.id, r.name]));

  return Array.from(regionMap.entries()).map(([regionId, data]) => ({
    regionId,
    regionName: regionNameMap.get(regionId) || 'Unknown',
    totalRevenue: data.revenue,
    transactionCount: data.count,
  }));
}

export async function getRevenueByPlaza(regionId: string, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const plazas = await prisma.tollPlaza.findMany({
    where: { regionId },
    select: { id: true, name: true, gateCode: true },
  });

  const results = [];
  for (const plaza of plazas) {
    const agg = await prisma.transaction.aggregate({
      where: {
        type: 'DEBIT',
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end },
        event: { plazaId: plaza.id },
      },
      _sum: { amount: true },
      _count: true,
    });

    results.push({
      plazaId: plaza.id,
      plazaName: plaza.name,
      gateCode: plaza.gateCode,
      totalRevenue: Number(agg._sum.amount || 0),
      transactionCount: agg._count,
    });
  }

  return results;
}

export async function getFiscalYearSummary(fiscalYear: number, regionId?: string) {
  const { start, end } = getFiscalYearDates(fiscalYear);

  const months = [];
  for (let m = 0; m < 12; m++) {
    const monthDate = new Date(fiscalYear, 3 + m, 1);
    const monthNum = monthDate.getMonth() + 1;
    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

    const where: any = {
      type: 'DEBIT',
      status: 'COMPLETED',
      createdAt: { gte: monthStart, lte: monthEnd },
    };
    if (regionId) {
      where.account = { regionId };
    }

    const agg = await prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    });

    const topupWhere: any = {
      type: 'TOPUP',
      status: 'COMPLETED',
      createdAt: { gte: monthStart, lte: monthEnd },
    };
    if (regionId) {
      topupWhere.account = { regionId };
    }

    const topupAgg = await prisma.transaction.aggregate({
      where: topupWhere,
      _sum: { amount: true },
    });

    months.push({
      month: monthNum,
      monthName: getMonthName(monthNum),
      fiscalMonthIndex: getFiscalMonthIndex(monthNum),
      quarter: getFiscalQuarter(monthNum),
      totalRevenue: Number(agg._sum.amount || 0),
      transactionCount: agg._count,
      totalDeposits: Number(topupAgg._sum.amount || 0),
    });
  }

  const totalRevenue = months.reduce((sum, m) => sum + m.totalRevenue, 0);
  const totalDeposits = months.reduce((sum, m) => sum + m.totalDeposits, 0);
  const totalTransactions = months.reduce((sum, m) => sum + m.transactionCount, 0);

  return {
    fiscalYear,
    regionId: regionId || null,
    months,
    totalRevenue,
    totalDeposits,
    totalTransactions,
  };
}

export async function getTopupByRegion(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const topups = await prisma.transaction.groupBy({
    by: ['accountId'],
    where: {
      type: 'TOPUP',
      status: 'COMPLETED',
      createdAt: { gte: start, lte: end },
    },
    _sum: { amount: true },
    _count: true,
  });

  const accountIds = topups.map((t) => t.accountId);
  const accounts = await prisma.account.findMany({
    where: { id: { in: accountIds } },
    select: { id: true, regionId: true },
  });

  const regionMap = new Map<string, { deposits: number; count: number }>();
  for (const t of topups) {
    const account = accounts.find((a) => a.id === t.accountId);
    const rid = account?.regionId || 'unknown';
    const existing = regionMap.get(rid) || { deposits: 0, count: 0 };
    existing.deposits += Number(t._sum.amount || 0);
    existing.count += t._count;
    regionMap.set(rid, existing);
  }

  const regions = await prisma.region.findMany();
  const regionNameMap = new Map(regions.map((r) => [r.id, r.name]));

  return Array.from(regionMap.entries()).map(([regionId, data]) => ({
    regionId,
    regionName: regionNameMap.get(regionId) || 'Unknown',
    totalDeposits: data.deposits,
    transactionCount: data.count,
  }));
}

export async function getTopupSummary(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const agg = await prisma.transaction.aggregate({
    where: {
      type: 'TOPUP',
      status: 'COMPLETED',
      createdAt: { gte: start, lte: end },
    },
    _sum: { amount: true },
    _count: true,
  });

  const byRegion = await getTopupByRegion(startDate, endDate);

  return {
    totalDeposits: Number(agg._sum.amount || 0),
    transactionCount: agg._count,
    byRegion,
  };
}

export async function getVehiclesByRegion(regionId?: string, status?: string) {
  const where: any = {};
  if (regionId) where.regionId = regionId;
  if (status) where.status = status;

  const grouped = await prisma.vehicle.groupBy({
    by: ['regionId'],
    where,
    _count: true,
  });

  const regions = await prisma.region.findMany();
  const regionNameMap = new Map(regions.map((r) => [r.id, r.name]));

  return grouped.map((g) => ({
    regionId: g.regionId || 'unknown',
    regionName: regionNameMap.get(g.regionId || '') || 'Unknown',
    vehicleCount: g._count,
  }));
}

export async function getTollUsageByPlaza(plazaId: string, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const plaza = await prisma.tollPlaza.findUnique({ where: { id: plazaId } });

  const events = await prisma.tollEvent.findMany({
    where: {
      plazaId,
      status: 'COMPLETED',
      entryTime: { gte: start, lte: end },
    },
    include: { vehicle: true, transaction: true },
  });

  const byClass = new Map<string, { count: number; revenue: number }>();
  for (const e of events) {
    const cls = e.vehicle.vehicleClass;
    const existing = byClass.get(cls) || { count: 0, revenue: 0 };
    existing.count += 1;
    existing.revenue += Number(e.transaction?.amount || e.amount || 0);
    byClass.set(cls, existing);
  }

  return {
    plazaId,
    plazaName: plaza?.name || 'Unknown',
    dateRange: { startDate, endDate },
    totalTrips: events.length,
    totalRevenue: events.reduce((sum, e) => sum + Number(e.transaction?.amount || e.amount || 0), 0),
    byVehicleClass: Array.from(byClass.entries()).map(([vehicleClass, data]) => ({
      vehicleClass,
      trips: data.count,
      revenue: data.revenue,
    })),
  };
}

export async function getSettlements(startDate?: string, endDate?: string, regionId?: string, status?: string) {
  const where: any = {};
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    where.transferDate = { gte: start, lte: end };
  }
  if (regionId) where.regionId = regionId;
  if (status) where.status = status;

  return prisma.revenueTransfer.findMany({
    where,
    include: { plaza: true, region: true },
    orderBy: { transferDate: 'desc' },
  });
}

export async function confirmSettlement(transferId: string, bankName: string, depositRef: string) {
  return prisma.revenueTransfer.update({
    where: { id: transferId },
    data: {
      status: 'CONFIRMED',
      bankName,
      depositRef,
      confirmedAt: new Date(),
      confirmedBy: 'system',
    },
    include: { plaza: true, region: true },
  });
}

export async function batchConfirmSettlement(date: string, plazaIds: string[]) {
  const d = new Date(date);
  const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);

  const results = [];
  for (const plazaId of plazaIds) {
    const transfer = await prisma.revenueTransfer.findFirst({
      where: {
        plazaId,
        transferDate: { gte: dayStart, lte: dayEnd },
        status: { not: 'CONFIRMED' },
      },
    });

    if (transfer) {
      const updated = await prisma.revenueTransfer.update({
        where: { id: transfer.id },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          confirmedBy: 'batch-system',
        },
      });
      results.push(updated);
    }
  }

  return results;
}

export async function getReconciliations(fiscalYear: number, month?: number, regionId?: string, status?: string) {
  const where: any = { fiscalYear };
  if (month) where.month = month;
  if (regionId) where.regionId = regionId;
  if (status) where.status = status;

  return prisma.monthlyReconciliation.findMany({
    where,
    include: { region: true },
    orderBy: [{ month: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function submitReconciliation(id: string, submittedBy: string) {
  return prisma.monthlyReconciliation.update({
    where: { id },
    data: {
      status: 'SUBMITTED',
      submittedBy,
      submittedAt: new Date(),
    },
  });
}

export async function approveReconciliation(id: string, approvedBy: string, notes?: string) {
  return prisma.monthlyReconciliation.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedBy,
      approvedAt: new Date(),
      rejectionReason: null,
    },
  });
}

export async function rejectReconciliation(id: string, approvedBy: string, reason: string) {
  return prisma.monthlyReconciliation.update({
    where: { id },
    data: {
      status: 'REJECTED',
      approvedBy,
      approvedAt: new Date(),
      rejectionReason: reason,
    },
  });
}

export async function getReceipts(fiscalYear: number, regionId?: string, plazaId?: string, page = 1, limit = 50) {
  const where: any = { fiscalYear };
  if (regionId) where.regionId = regionId;
  if (plazaId) where.plazaId = plazaId;

  const skip = (page - 1) * limit;

  const [receipts, total] = await Promise.all([
    prisma.officialReceipt.findMany({
      where,
      include: { account: { include: { user: true } }, region: true, plaza: true },
      orderBy: { issuedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.officialReceipt.count({ where }),
  ]);

  return {
    receipts,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFiscalYearExcel(fiscalYear: number, regionId?: string) {
  const { start, end } = getFiscalYearDates(fiscalYear);

  const transactions = await prisma.transaction.findMany({
    where: {
      type: 'DEBIT',
      status: 'COMPLETED',
      createdAt: { gte: start, lte: end },
      ...(regionId ? { account: { regionId } } : {}),
    },
    include: {
      event: { include: { plaza: true, vehicle: true } },
      account: { include: { user: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  return transactions.map((t) => ({
    date: t.createdAt,
    transactionId: t.id,
    plateNumber: t.event?.vehicle?.plateNumber || '',
    plazaName: t.event?.plaza?.name || '',
    gateCode: t.event?.plaza?.gateCode || '',
    vehicleClass: t.event?.vehicle?.vehicleClass || '',
    amount: Number(t.amount),
    type: t.type,
    status: t.status,
    accountHolder: t.account?.user?.name || '',
  }));
}
