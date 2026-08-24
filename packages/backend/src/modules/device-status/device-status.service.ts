import { PrismaClient, DeviceType, DeviceStatusEnum } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateDeviceStatusInput {
  plazaId: string;
  deviceType: DeviceType;
  deviceId: string;
  metadata?: any;
}

export interface UpdateDeviceStatusInput {
  status?: DeviceStatusEnum;
  lastHeartbeat?: Date;
  metadata?: any;
}

export async function getDeviceStatuses() {
  return prisma.deviceStatus.findMany({
    include: {
      plaza: true,
    },
    orderBy: {
      lastHeartbeat: 'desc',
    },
  });
}

export async function getDeviceStatusById(id: string) {
  return prisma.deviceStatus.findUnique({
    where: { id },
    include: {
      plaza: true,
    },
  });
}

export async function getDeviceStatusesByPlaza(plazaId: string) {
  return prisma.deviceStatus.findMany({
    where: { plazaId },
    include: {
      plaza: true,
    },
  });
}

export async function createDeviceStatus(input: CreateDeviceStatusInput) {
  return prisma.deviceStatus.create({
    data: input,
  });
}

export async function updateDeviceStatus(id: string, input: UpdateDeviceStatusInput) {
  return prisma.deviceStatus.update({
    where: { id },
    data: input,
  });
}
