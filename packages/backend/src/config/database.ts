import { PrismaClient } from '@prisma/client';
import { PrismaClient as HrPrismaClient } from '../generated/hr-client';

// ── HQ Database (default) ──
// Vehicles, TollEvents, TollPlazas, Violations, Devices, AuditLogs
const hqDbUrl = process.env.DATABASE_URL;

// ── Customer Portal Database ──
// Users, Accounts, Wallets, Transactions, Notifications, Loyalty
const customerDbUrl = process.env.CUSTOMER_DATABASE_URL;

// ── Plaza Sync Database ──
// SyncQueue, PlazaConfig, LocalTollEvents, DeviceStatus
const plazaDbUrl = process.env.PLAZA_DATABASE_URL;

// ── HR Database ──
// Employees, Departments, Attendance, Leave, Payroll, Performance, Training
const hrDbUrl = process.env.HR_DATABASE_URL;

// HQ Prisma Client (default - vehicles, toll plazas, events, violations)
export const hqPrisma = new PrismaClient({
  datasources: {
    db: {
      url: hqDbUrl,
    },
  },
});

// Customer Portal Prisma Client (accounts, wallets, transactions, notifications)
export const customerPrisma = new PrismaClient({
  datasources: {
    db: {
      url: customerDbUrl,
    },
  },
});

// Plaza Sync Prisma Client (sync queue, plaza config, local events)
export const plazaPrisma = new PrismaClient({
  datasources: {
    db: {
      url: plazaDbUrl,
    },
  },
});

// HR Prisma Client (employees, departments, attendance, leave, payroll)
export const hrPrisma = new HrPrismaClient({
  datasources: {
    db: {
      url: hrDbUrl,
    },
  },
});

// Default export for backward compatibility (uses HQ database)
const prisma = hqPrisma;
export default prisma;

// Connect all databases on startup
export async function connectDatabases() {
  try {
    await hqPrisma.$connect();
    console.log('✅ HQ database connected');

    if (customerDbUrl) {
      await customerPrisma.$connect();
      console.log('✅ Customer database connected');
    }

    if (plazaDbUrl) {
      await plazaPrisma.$connect();
      console.log('✅ Plaza database connected');
    }

    if (hrDbUrl) {
      await hrPrisma.$connect();
      console.log('✅ HR database connected');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

// Disconnect all databases on shutdown
export async function disconnectDatabases() {
  await hqPrisma.$disconnect();
  await customerPrisma.$disconnect();
  await plazaPrisma.$disconnect();
  await hrPrisma.$disconnect();
}
