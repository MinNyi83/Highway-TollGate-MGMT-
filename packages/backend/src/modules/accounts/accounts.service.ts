import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAccounts() {
  return prisma.account.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
    },
  });
}

export async function getAccountById(id: string) {
  return prisma.account.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
        },
      },
      rfidTags: true,
    },
  });
}

export async function topUpAccount(id: string, amount: number) {
  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    throw new Error('Account not found');
  }

  const updatedAccount = await prisma.account.update({
    where: { id },
    data: {
      balance: {
        increment: amount,
      },
    },
  });

  await prisma.transaction.create({
    data: {
      accountId: id,
      eventId: `topup-${Date.now()}`,
      amount,
      type: 'TOPUP',
      status: 'COMPLETED',
    },
  });

  return updatedAccount;
}
