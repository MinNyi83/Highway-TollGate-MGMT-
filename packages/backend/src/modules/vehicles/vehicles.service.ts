import { PrismaClient, VehicleClass, VehicleStatus } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateVehicleInput {
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vehicleClass: VehicleClass;
  vehiclePhoto?: string;
  wheelTaxCard?: string;
  rfidTagUid?: string;
}

export interface UpdateVehicleInput {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  vehicleClass?: VehicleClass;
  status?: VehicleStatus;
  vehiclePhoto?: string;
  wheelTaxCard?: string;
}

export interface BindRfidInput {
  tagUid: string;
  accountId: string;
}

export async function getVehicles() {
  return prisma.vehicle.findMany({
    include: {
      rfidTags: true,
    },
  });
}

export async function getVehicleById(id: string) {
  return prisma.vehicle.findUnique({
    where: { id },
    include: {
      rfidTags: true,
    },
  });
}

export async function createVehicle(input: CreateVehicleInput) {
  const { rfidTagUid, ...vehicleData } = input;
  const vehicle = await prisma.vehicle.create({
    data: vehicleData,
  });

  if (rfidTagUid) {
    await prisma.rFIDTag.create({
      data: {
        tagUid: rfidTagUid,
        vehicleId: vehicle.id,
        accountId: vehicle.id,
      },
    });
  }

  return vehicle;
}

export async function updateVehicle(id: string, input: UpdateVehicleInput) {
  return prisma.vehicle.update({
    where: { id },
    data: input,
  });
}

export async function bindRfidTag(vehicleId: string, input: BindRfidInput) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  const existingTag = await prisma.rFIDTag.findUnique({
    where: { tagUid: input.tagUid },
  });

  if (existingTag) {
    throw new Error('RFID tag already bound to another vehicle');
  }

  return prisma.rFIDTag.create({
    data: {
      tagUid: input.tagUid,
      vehicleId,
      accountId: input.accountId,
    },
  });
}

export async function unbindRfidTag(vehicleId: string, tagId: string) {
  const tag = await prisma.rFIDTag.findFirst({
    where: {
      id: tagId,
      vehicleId,
    },
  });

  if (!tag) {
    throw new Error('RFID tag not found for this vehicle');
  }

  return prisma.rFIDTag.delete({
    where: { id: tagId },
  });
}
