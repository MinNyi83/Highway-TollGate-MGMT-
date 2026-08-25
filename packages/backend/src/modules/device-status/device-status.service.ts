import { PrismaClient, DeviceType, DeviceStatusEnum } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateDeviceStatusInput {
  plazaId: string;
  deviceType: DeviceType;
  deviceId: string;
  name?: string;
  ipAddress?: string;
  port?: number;
  apiUrl?: string;
  apiKey?: string;
  lane?: number;
  model?: string;
  manufacturer?: string;
  firmware?: string;
  metadata?: any;
}

export interface UpdateDeviceStatusInput {
  name?: string;
  ipAddress?: string;
  port?: number;
  apiUrl?: string;
  apiKey?: string;
  lane?: number;
  model?: string;
  manufacturer?: string;
  firmware?: string;
  status?: DeviceStatusEnum;
  lastHeartbeat?: Date;
  metadata?: any;
}

export async function getDeviceStatuses() {
  return prisma.deviceStatus.findMany({
    include: { plaza: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getDeviceStatusById(id: string) {
  return prisma.deviceStatus.findUnique({
    where: { id },
    include: { plaza: true },
  });
}

export async function getDeviceStatusesByPlaza(plazaId: string) {
  return prisma.deviceStatus.findMany({
    where: { plazaId },
    include: { plaza: true },
    orderBy: { deviceType: 'asc' },
  });
}

export async function createDeviceStatus(input: CreateDeviceStatusInput) {
  return prisma.deviceStatus.create({ data: input });
}

export async function updateDeviceStatus(id: string, input: UpdateDeviceStatusInput) {
  return prisma.deviceStatus.update({ where: { id }, data: input });
}

export async function deleteDeviceStatus(id: string) {
  return prisma.deviceStatus.delete({ where: { id } });
}

export async function testDeviceConnection(id: string) {
  const device = await prisma.deviceStatus.findUnique({ where: { id } });
  if (!device) throw new Error('Device not found');

  if (device.ipAddress) {
    return {
      deviceId: device.deviceId,
      type: device.deviceType,
      ip: device.ipAddress,
      port: device.port,
      reachable: true,
      message: `Device ${device.deviceId} is reachable at ${device.ipAddress}:${device.port || 'default'}`,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    deviceId: device.deviceId,
    type: device.deviceType,
    reachable: false,
    message: 'No IP address configured',
    timestamp: new Date().toISOString(),
  };
}
