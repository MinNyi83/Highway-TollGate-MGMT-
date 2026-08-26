import { PrismaClient, ViolationStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function getViolations() {
  return prisma.violation.findMany({
    include: {
      vehicle: true,
      event: {
        include: {
          plaza: true,
          rfidTag: true,
          photos: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getViolationById(id: string) {
  return prisma.violation.findUnique({
    where: { id },
    include: {
      vehicle: true,
      event: {
        include: {
          plaza: true,
          rfidTag: true,
          photos: true,
          transaction: true,
        },
      },
    },
  });
}

export async function updateViolationStatus(id: string, status: ViolationStatus) {
  return prisma.violation.update({
    where: { id },
    data: { status },
  });
}
