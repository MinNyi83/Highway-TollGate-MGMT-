import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL || process.env.CUSTOMER_DATABASE_URL },
  },
});

async function main() {
  console.log('🌱 Seeding customer database...');

  // Create admin user
  const adminHash = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tollgate.com' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      email: 'admin@tollgate.com',
      passwordHash: adminHash,
      name: 'System Admin',
      role: 'SUPER_ADMIN',
      customerType: 'INDIVIDUAL',
    },
  });

  // Create customer user
  const customerHash = await bcrypt.hash('password123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'ko.min@personal.com' },
    update: {},
    create: {
      email: 'ko.min@personal.com',
      passwordHash: customerHash,
      name: 'Ko Min',
      role: 'CUSTOMER',
      customerType: 'INDIVIDUAL',
      phone: '+959123456789',
      nrcNumber: '12/abc(N)123456',
      drivingLicense: 'DL-123456',
    },
  });

  // Create enterprise user
  const enterprise = await prisma.user.upsert({
    where: { email: 'fleet@transportco.com' },
    update: {},
    create: {
      email: 'fleet@transportco.com',
      passwordHash: customerHash,
      name: 'Transport Co Fleet',
      role: 'CUSTOMER',
      customerType: 'ENTERPRISE',
      phone: '+959876543210',
      companyName: 'Transport Co Ltd',
      companyRegNo: 'REG-2024-001',
      companyAddress: 'Yangon, Myanmar',
      fleetManagerName: 'U Aung',
    },
  });

  // Create accounts
  const adminAccount = await prisma.account.upsert({
    where: { accountNumber: 'ACC-ADMIN-001' },
    update: {},
    create: {
      userId: admin.id,
      accountNumber: 'ACC-ADMIN-001',
      customerType: 'INDIVIDUAL',
      balance: 0,
      creditLimit: 0,
      status: 'ACTIVE',
    },
  });

  const customerAccount = await prisma.account.upsert({
    where: { accountNumber: 'ACC-CUST-001' },
    update: {},
    create: {
      userId: customer.id,
      accountNumber: 'ACC-CUST-001',
      customerType: 'INDIVIDUAL',
      balance: 150000,
      creditLimit: 50000,
      status: 'ACTIVE',
    },
  });

  const enterpriseAccount = await prisma.account.upsert({
    where: { accountNumber: 'ACC-ENT-001' },
    update: {},
    create: {
      userId: enterprise.id,
      accountNumber: 'ACC-ENT-001',
      customerType: 'ENTERPRISE',
      balance: 500000,
      creditLimit: 200000,
      paymentTerms: 30,
      status: 'ACTIVE',
    },
  });

  // Create RFID tags
  await prisma.rFIDTag.upsert({
    where: { tagUid: 'RFID-001-ADMIN' },
    update: {},
    create: {
      tagUid: 'RFID-001-ADMIN',
      vehicleId: 'veh-admin-001',
      accountId: adminAccount.id,
      status: 'ACTIVE',
    },
  });

  await prisma.rFIDTag.upsert({
    where: { tagUid: 'RFID-002-CUSTOMER' },
    update: {},
    create: {
      tagUid: 'RFID-002-CUSTOMER',
      vehicleId: 'veh-customer-001',
      accountId: customerAccount.id,
      status: 'ACTIVE',
    },
  });

  await prisma.rFIDTag.upsert({
    where: { tagUid: 'RFID-003-ENT-1' },
    update: {},
    create: {
      tagUid: 'RFID-003-ENT-1',
      vehicleId: 'veh-ent-001',
      accountId: enterpriseAccount.id,
      status: 'ACTIVE',
    },
  });

  await prisma.rFIDTag.upsert({
    where: { tagUid: 'RFID-004-ENT-2' },
    update: {},
    create: {
      tagUid: 'RFID-004-ENT-2',
      vehicleId: 'veh-ent-002',
      accountId: enterpriseAccount.id,
      status: 'ACTIVE',
    },
  });

  // Create promo codes
  await prisma.promoCode.upsert({
    where: { code: 'WELCOME2026' },
    update: {},
    create: {
      code: 'WELCOME2026',
      type: 'PERCENTAGE',
      value: 10,
      maxUses: 100,
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-12-31'),
      active: true,
    },
  });

  // Create loyalty points
  await prisma.loyaltyPoints.upsert({
    where: { id: 'loyalty-customer-001' },
    update: {},
    create: {
      id: 'loyalty-customer-001',
      accountId: customerAccount.id,
      points: 500,
      earned: 500,
      redeemed: 0,
    },
  });

  // Create notifications
  await prisma.notification.create({
    data: {
      userId: customer.id,
      type: 'WELCOME',
      title: 'Welcome to TollGate',
      message: 'Your account has been created successfully.',
      read: false,
    },
  });

  console.log('✅ Customer database seeded');
  console.log(`   Users: admin, customer, enterprise`);
  console.log(`   Accounts: ${adminAccount.accountNumber}, ${customerAccount.accountNumber}, ${enterpriseAccount.accountNumber}`);
  console.log(`   RFID Tags: 4 created`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
