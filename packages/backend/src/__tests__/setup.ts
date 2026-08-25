import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "TollEvent" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Transaction" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Violation" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Notification" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "DeviceStatus" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "TollRate" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Vehicle" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "Account" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "TollPlaza" CASCADE`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE`;
});

export { prisma };
