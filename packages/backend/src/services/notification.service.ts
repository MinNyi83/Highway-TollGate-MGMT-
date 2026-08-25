import { PrismaClient } from '@prisma/client';
import { broadcastNotification, broadcastBalanceUpdate, broadcastToAdmins } from '../websocket/gateway';
import { sendViolationEmail, sendLowBalanceEmail, sendTopUpConfirmationEmail } from './email.service';

const prisma = new PrismaClient();

export async function notifyViolation(userId: string, violation: any) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: 'VIOLATION',
      message: `Violation: ${violation.violationType} - Fine: $${violation.fineAmount}`,
    },
  });

  broadcastNotification(userId, notification);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) sendViolationEmail(user.email, violation);
}

export async function notifyBalanceLow(userId: string, balance: number) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: 'LOW_BALANCE',
      message: `Low balance warning: $${balance} remaining`,
    },
  });

  broadcastNotification(userId, notification);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) sendLowBalanceEmail(user.email, balance);
}

export async function notifyTopUp(userId: string, amount: number, method: string) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: 'TOPUP',
      message: `Top-up of $${amount} via ${method} successful`,
    },
  });

  broadcastNotification(userId, notification);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) sendTopUpConfirmationEmail(user.email, amount, method);
}

export async function notifyTollEvent(userId: string, event: any) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type: 'TOLL_EVENT',
      message: `Toll event at ${event.plaza?.name || 'unknown plaza'} - $${event.transaction?.amount || 0}`,
    },
  });

  broadcastNotification(userId, notification);
}

export async function broadcastNewTollEvent(event: any) {
  broadcastToAdmins('new-toll-event', event);
}

export async function broadcastDeviceAlert(plazaId: string, device: any) {
  broadcastToAdmins('device-alert', { plazaId, device });
}
