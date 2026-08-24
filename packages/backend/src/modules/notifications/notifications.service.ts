import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateNotificationInput {
  userId: string;
  type: string;
  message: string;
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getNotificationById(id: string) {
  return prisma.notification.findUnique({
    where: { id },
  });
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: input,
  });
}

export async function markAsRead(id: string) {
  return prisma.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
