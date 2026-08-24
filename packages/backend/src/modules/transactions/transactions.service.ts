import { PrismaClient, TransactionStatus, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export async function createTransaction(eventId: string) {
  const event = await prisma.tollEvent.findUnique({
    where: { id: eventId },
    include: {
      vehicle: {
        include: {
          rfidTags: {
            include: {
              account: true,
            },
          },
        },
      },
      plaza: {
        include: {
          tollRates: {
            where: {
              effectiveFrom: { lte: new Date() },
              OR: [
                { effectiveTo: null },
                { effectiveTo: { gte: new Date() } },
              ],
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new Error('Toll event not found');
  }

  if (event.status !== 'COMPLETED') {
    throw new Error('Event is not completed');
  }

  // Find the matching toll rate
  const rate = event.plaza.tollRates.find(
    (r) => r.vehicleClass === event.vehicle.vehicleClass
  );

  if (!rate) {
    throw new Error('No toll rate found for this vehicle class');
  }

  // Find the RFID tag with an account
  const rfidTag = event.vehicle.rfidTags.find((tag) => tag.accountId);

  if (!rfidTag) {
    throw new Error('No RFID tag with linked account found');
  }

  // Auto-deduct from account
  const account = rfidTag.account;

  if (account.balance < rate.rateAmount) {
    // Insufficient balance - create pending transaction
    const transaction = await prisma.transaction.create({
      data: {
        eventId,
        accountId: account.id,
        amount: rate.rateAmount,
        type: TransactionType.DEBIT,
        status: TransactionStatus.PENDING,
      },
    });
    return transaction;
  }

  // Sufficient balance - process transaction
  const transaction = await prisma.transaction.create({
    data: {
      eventId,
      accountId: account.id,
      amount: rate.rateAmount,
      type: TransactionType.DEBIT,
      status: TransactionStatus.COMPLETED,
    },
  });

  // Deduct from account
  await prisma.account.update({
    where: { id: account.id },
    data: {
      balance: {
        decrement: rate.rateAmount,
      },
    },
  });

  return transaction;
}

export async function getTransactions() {
  return prisma.transaction.findMany({
    include: {
      event: {
        include: {
          vehicle: true,
          plaza: true,
        },
      },
      account: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getTransactionById(id: string) {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      event: {
        include: {
          vehicle: true,
          plaza: true,
        },
      },
      account: true,
    },
  });
}
