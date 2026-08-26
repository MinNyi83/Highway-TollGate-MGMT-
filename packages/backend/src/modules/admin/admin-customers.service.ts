import { PrismaClient, UserRole, CustomerType, AccountStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface CreateCustomerInput {
  email: string;
  password: string;
  name: string;
  customerType: 'INDIVIDUAL' | 'ENTERPRISE';
  phone?: string;
  nrcNumber?: string;
  drivingLicense?: string;
  companyName?: string;
  companyRegNo?: string;
  companyAddress?: string;
  fleetManagerName?: string;
}

export interface UpdateCustomerInput {
  name?: string;
  phone?: string;
  nrcNumber?: string;
  drivingLicense?: string;
  customerType?: 'INDIVIDUAL' | 'ENTERPRISE';
  companyName?: string;
  companyRegNo?: string;
  companyAddress?: string;
  fleetManagerName?: string;
}

export async function getCustomers(search?: string) {
  const where: any = {
    role: { in: [UserRole.CUSTOMER, UserRole.ENTERPRISE_ADMIN, UserRole.ENTERPRISE_USER] },
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { companyName: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.user.findMany({
    where,
    include: {
      accounts: {
        include: {
          rfidTags: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getCustomerById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      accounts: {
        include: {
          rfidTags: true,
          transactions: { orderBy: { createdAt: 'desc' }, take: 10 },
        },
      },
      notifications: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
}

export async function createCustomer(input: CreateCustomerInput) {
  const passwordHash = await bcrypt.hash(input.password, 10);
  const role: UserRole = input.customerType === 'ENTERPRISE' ? UserRole.ENTERPRISE_ADMIN : UserRole.CUSTOMER;

  const accountNumber = 'ACC-' + Date.now().toString(36).toUpperCase();

  return prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      role,
      customerType: input.customerType,
      phone: input.phone,
      nrcNumber: input.nrcNumber,
      drivingLicense: input.drivingLicense,
      companyName: input.companyName,
      companyRegNo: input.companyRegNo,
      companyAddress: input.companyAddress,
      fleetManagerName: input.fleetManagerName,
      accounts: {
        create: {
          customerType: input.customerType,
          accountNumber,
          balance: 0,
        },
      },
    },
    include: { accounts: true },
  });
}

export async function updateCustomer(id: string, input: UpdateCustomerInput) {
  const data: any = { ...input };
  if (input.customerType) {
    data.role = input.customerType === 'ENTERPRISE' ? UserRole.ENTERPRISE_ADMIN : UserRole.CUSTOMER;
  }
  return prisma.user.update({ where: { id }, data });
}

export async function deleteCustomer(id: string) {
  await prisma.user.delete({ where: { id } });
}

export async function updateAccountStatus(id: string, status: AccountStatus) {
  const account = await prisma.account.findFirst({ where: { userId: id } });
  if (!account) throw new Error('Account not found');
  return prisma.account.update({ where: { id: account.id }, data: { status } });
}

export async function topUpCustomerBalance(id: string, amount: number) {
  const account = await prisma.account.findFirst({ where: { userId: id } });
  if (!account) throw new Error('Account not found');
  return prisma.account.update({
    where: { id: account.id },
    data: { balance: { increment: amount } },
  });
}

export async function resetCustomerPassword(id: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  return prisma.user.update({ where: { id }, data: { passwordHash } });
}

export async function getCustomerStats() {
  const total = await prisma.user.count({
    where: { role: { in: [UserRole.CUSTOMER, UserRole.ENTERPRISE_ADMIN, UserRole.ENTERPRISE_USER] } },
  });
  const individual = await prisma.user.count({
    where: { role: UserRole.CUSTOMER },
  });
  const enterprise = await prisma.user.count({
    where: { role: { in: [UserRole.ENTERPRISE_ADMIN, UserRole.ENTERPRISE_USER] } },
  });
  const accounts = await prisma.account.findMany({
    where: { user: { role: { in: [UserRole.CUSTOMER, UserRole.ENTERPRISE_ADMIN, UserRole.ENTERPRISE_USER] } } },
  });
  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);
  const activeAccounts = accounts.filter((a) => a.status === 'ACTIVE').length;

  return { total, individual, enterprise, totalBalance, activeAccounts };
}
