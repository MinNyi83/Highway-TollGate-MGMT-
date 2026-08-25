import { PrismaClient, CustomerType } from '@prisma/client';

const prisma = new PrismaClient();

export interface FleetStats {
  totalVehicles: number;
  activeVehicles: number;
  totalTrips: number;
  totalRevenue: number;
  totalViolations: number;
  averageTripLength: number;
  vehiclesByClass: Record<string, number>;
  tripsByPlaza: Record<string, number>;
  revenueByVehicle: Array<{ plateNumber: string; revenue: number }>;
  recentTrips: Array<{
    id: string;
    vehiclePlate: string;
    plazaName: string;
    mileMarker: number | null;
    entryTime: Date;
    exitTime: Date | null;
    status: string;
    tollAmount: number;
  }>;
}

export async function getFleetStats(accountId: string): Promise<FleetStats> {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      rfidTags: {
        include: {
          vehicle: true,
        },
      },
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const vehicleIds = account.rfidTags.map((tag) => tag.vehicleId);
  const rfidTagIds = account.rfidTags.map((tag) => tag.id);

  const [totalVehicles, activeVehicles, tollEvents, violations, transactions] = await Promise.all([
    prisma.vehicle.count({
      where: { id: { in: vehicleIds } },
    }),
    prisma.vehicle.count({
      where: { id: { in: vehicleIds }, status: 'ACTIVE' },
    }),
    prisma.tollEvent.findMany({
      where: { vehicleId: { in: vehicleIds } },
      include: {
        vehicle: true,
        plaza: true,
        transaction: true,
      },
      orderBy: { entryTime: 'desc' },
      take: 100,
    }),
    prisma.violation.findMany({
      where: { vehicleId: { in: vehicleIds } },
    }),
    prisma.transaction.findMany({
      where: {
        accountId,
        type: 'DEBIT',
        status: 'COMPLETED',
      },
    }),
  ]);

  const totalTrips = tollEvents.filter((e) => e.status === 'COMPLETED').length;
  const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalViolations = violations.length;

  // Calculate average trip length (distance between plazas)
  const tripDistances = tollEvents
    .filter((e) => e.status === 'COMPLETED' && e.plaza.mileMarker !== null)
    .map((e) => Number(e.plaza.mileMarker));
  const averageTripLength = tripDistances.length > 0
    ? tripDistances.reduce((sum, d) => sum + d, 0) / tripDistances.length
    : 0;

  // Vehicles by class
  const vehiclesByClass: Record<string, number> = {};
  account.rfidTags.forEach((tag) => {
    const cls = tag.vehicle.vehicleClass;
    vehiclesByClass[cls] = (vehiclesByClass[cls] || 0) + 1;
  });

  // Trips by plaza
  const tripsByPlaza: Record<string, number> = {};
  tollEvents.forEach((e) => {
    const name = e.plaza.name;
    tripsByPlaza[name] = (tripsByPlaza[name] || 0) + 1;
  });

  // Revenue by vehicle
  const revenueByVehicle: Record<string, number> = {};
  tollEvents.forEach((e) => {
    if (e.transaction && e.transaction.status === 'COMPLETED') {
      const plate = e.vehicle.plateNumber;
      revenueByVehicle[plate] = (revenueByVehicle[plate] || 0) + Number(e.transaction.amount);
    }
  });
  const revenueByVehicleArray = Object.entries(revenueByVehicle)
    .map(([plateNumber, revenue]) => ({ plateNumber, revenue }))
    .sort((a, b) => b.revenue - a.revenue);

  // Recent trips
  const recentTrips = tollEvents.slice(0, 20).map((e) => ({
    id: e.id,
    vehiclePlate: e.vehicle.plateNumber,
    plazaName: e.plaza.name,
    mileMarker: e.plaza.mileMarker,
    entryTime: e.entryTime,
    exitTime: e.exitTime,
    status: e.status,
    tollAmount: e.transaction ? Number(e.transaction.amount) : 0,
  }));

  return {
    totalVehicles,
    activeVehicles,
    totalTrips,
    totalRevenue,
    totalViolations,
    averageTripLength,
    vehiclesByClass,
    tripsByPlaza,
    revenueByVehicle: revenueByVehicleArray,
    recentTrips,
  };
}

export async function getFleetVehicles(accountId: string) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      rfidTags: {
        include: {
          vehicle: {
            include: {
              rfidTags: true,
              tollEvents: {
                orderBy: { entryTime: 'desc' },
                take: 1,
                include: { plaza: true },
              },
              violations: {
                where: { status: 'PENDING' },
              },
            },
          },
        },
      },
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  return account.rfidTags.map((tag) => ({
    id: tag.vehicle.id,
    plateNumber: tag.vehicle.plateNumber,
    make: tag.vehicle.make,
    model: tag.vehicle.model,
    year: tag.vehicle.year,
    color: tag.vehicle.color,
    vehicleClass: tag.vehicle.vehicleClass,
    status: tag.vehicle.status,
    rfidTag: {
      id: tag.id,
      tagUid: tag.tagUid,
      status: tag.status,
    },
    lastTrip: tag.vehicle.tollEvents[0] ? {
      plazaName: tag.vehicle.tollEvents[0].plaza.name,
      mileMarker: tag.vehicle.tollEvents[0].plaza.mileMarker,
      entryTime: tag.vehicle.tollEvents[0].entryTime,
      status: tag.vehicle.tollEvents[0].status,
    } : null,
    pendingViolations: tag.vehicle.violations.length,
    totalTrips: tag.vehicle.tollEvents.length,
  }));
}

export async function getFleetTripHistory(
  accountId: string,
  options: {
    vehicleId?: string;
    plazaId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      rfidTags: true,
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const vehicleIds = account.rfidTags.map((tag) => tag.vehicleId);
  const where: any = { vehicleId: { in: vehicleIds } };

  if (options.vehicleId) {
    where.vehicleId = options.vehicleId;
  }
  if (options.plazaId) {
    where.plazaId = options.plazaId;
  }
  if (options.startDate || options.endDate) {
    where.entryTime = {};
    if (options.startDate) where.entryTime.gte = new Date(options.startDate);
    if (options.endDate) where.entryTime.lte = new Date(options.endDate);
  }

  const page = options.page || 1;
  const limit = options.limit || 50;
  const skip = (page - 1) * limit;

  const [events, total] = await Promise.all([
    prisma.tollEvent.findMany({
      where,
      include: {
        vehicle: true,
        plaza: true,
        transaction: true,
        violation: true,
      },
      orderBy: { entryTime: 'desc' },
      skip,
      take: limit,
    }),
    prisma.tollEvent.count({ where }),
  ]);

  return {
    events: events.map((e) => ({
      id: e.id,
      vehiclePlate: e.vehicle.plateNumber,
      vehicleClass: e.vehicle.vehicleClass,
      plazaName: e.plaza.name,
      mileMarker: e.plaza.mileMarker,
      entryTime: e.entryTime,
      exitTime: e.exitTime,
      status: e.status,
      tollAmount: e.transaction ? Number(e.transaction.amount) : 0,
      violation: e.violation ? {
        type: e.violation.violationType,
        fineAmount: Number(e.violation.fineAmount),
        status: e.violation.status,
      } : null,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getFleetSpendingReport(
  accountId: string,
  options: {
    period: 'daily' | 'weekly' | 'monthly';
    startDate?: string;
    endDate?: string;
  }
) {
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    include: {
      rfidTags: true,
    },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const vehicleIds = account.rfidTags.map((tag) => tag.vehicleId);

  const startDate = options.startDate ? new Date(options.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = options.endDate ? new Date(options.endDate) : new Date();

  const transactions = await prisma.transaction.findMany({
    where: {
      accountId,
      type: 'DEBIT',
      status: 'COMPLETED',
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
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by period
  const spendingByPeriod: Record<string, number> = {};
  const spendingByVehicle: Record<string, number> = {};
  const spendingByPlaza: Record<string, number> = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt);
    let key: string;

    if (options.period === 'daily') {
      key = date.toISOString().split('T')[0];
    } else if (options.period === 'weekly') {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      key = weekStart.toISOString().split('T')[0];
    } else {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    spendingByPeriod[key] = (spendingByPeriod[key] || 0) + Number(t.amount);

    if (t.event) {
      const plate = t.event.vehicle.plateNumber;
      spendingByVehicle[plate] = (spendingByVehicle[plate] || 0) + Number(t.amount);

      const plaza = t.event.plaza.name;
      spendingByPlaza[plaza] = (spendingByPlaza[plaza] || 0) + Number(t.amount);
    }
  });

  return {
    period: options.period,
    totalSpending: transactions.reduce((sum, t) => sum + Number(t.amount), 0),
    transactionCount: transactions.length,
    spendingByPeriod: Object.entries(spendingByPeriod).map(([date, amount]) => ({ date, amount })),
    spendingByVehicle: Object.entries(spendingByVehicle)
      .map(([plate, amount]) => ({ plateNumber: plate, amount }))
      .sort((a, b) => b.amount - a.amount),
    spendingByPlaza: Object.entries(spendingByPlaza)
      .map(([plaza, amount]) => ({ plazaName: plaza, amount }))
      .sort((a, b) => b.amount - a.amount),
  };
}
