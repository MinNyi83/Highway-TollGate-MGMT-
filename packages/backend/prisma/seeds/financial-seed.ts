import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL },
  },
});

const MYANMAR_REGIONS = [
  { name: 'Yangon Region', nameMyanmar: 'ရန်ကုန်တိုင်းဒေသကြီး', code: 'YGN', type: 'REGION' as const },
  { name: 'Mandalay Region', nameMyanmar: 'မန္တလေးတိုင်းဒေသကြီး', code: 'MDY', type: 'REGION' as const },
  { name: 'Bago Region', nameMyanmar: 'ပဲခူးတိုင်းဒေသကြီး', code: 'BGO', type: 'REGION' as const },
  { name: 'Ayeyarwady Region', nameMyanmar: 'ဧရာဝတီတိုင်းဒေသကြီး', code: 'AYW', type: 'REGION' as const },
  { name: 'Sagaing Region', nameMyanmar: 'စစ်ကိုင်းတိုင်းဒေသကြီး', code: 'SGG', type: 'REGION' as const },
  { name: 'Tanintharyi Region', nameMyanmar: 'တနင်္လာတိုင်းဒေသကြီး', code: 'TNI', type: 'REGION' as const },
  { name: 'Magway Region', nameMyanmar: 'မကွေးတိုင်းဒေသကြီး', code: 'MGW', type: 'REGION' as const },
  { name: 'Nay Pyi Taw', nameMyanmar: 'နေပြည်တော်', code: 'NPT', type: 'UNION_TERRITORY' as const },
  { name: 'Kachin State', nameMyanmar: 'ကချင်ပြည်နယ်', code: 'KCN', type: 'STATE' as const },
  { name: 'Kayah State', nameMyanmar: 'ကယားပြည်နယ်', code: 'KYH', type: 'STATE' as const },
  { name: 'Kayin State', nameMyanmar: 'ကရင်ပြည်နယ်', code: 'KYN', type: 'STATE' as const },
  { name: 'Mon State', nameMyanmar: 'မွန်ပြည်နယ်', code: 'MNE', type: 'STATE' as const },
  { name: 'Rakhine State', nameMyanmar: 'ရခိုင်ပြည်နယ်', code: 'RKH', type: 'STATE' as const },
  { name: 'Shan State', nameMyanmar: 'ရှမ်းပြည်နယ်', code: 'SHN', type: 'STATE' as const },
  { name: 'Chin State', nameMyanmar: 'ချင်းပြည်နယ်', code: 'CHN', type: 'STATE' as const },
];

const PLAZA_REGION_MAP: Record<string, string> = {
  '0 Mile Plaza': 'YGN',
  '39 Mile Plaza': 'BGO',
  '115 Mile Plaza': 'BGO',
  '200 Mile Plaza': 'MDY',
};

async function main() {
  console.log('🌱 Seeding financial data...');

  // 1. Create regions
  const regions: Record<string, string> = {};
  for (const r of MYANMAR_REGIONS) {
    const region = await prisma.region.upsert({
      where: { code: r.code },
      update: { name: r.name, nameMyanmar: r.nameMyanmar, type: r.type },
      create: r,
    });
    regions[r.code] = region.id;
  }
  console.log(`  ✅ ${MYANMAR_REGIONS.length} regions created`);

  // 2. Assign plazas to regions
  const plazas = await prisma.tollPlaza.findMany();
  for (const plaza of plazas) {
    const regionCode = PLAZA_REGION_MAP[plaza.name];
    if (regionCode && regions[regionCode]) {
      await prisma.tollPlaza.update({
        where: { id: plaza.id },
        data: { regionId: regions[regionCode] },
      });
    }
  }
  console.log(`  ✅ ${plazas.length} plazas assigned to regions`);

  // 3. Assign vehicles to regions (round-robin for sample data)
  const vehicles = await prisma.vehicle.findMany();
  const regionCodes = Object.keys(regions);
  for (let i = 0; i < vehicles.length; i++) {
    const regionCode = regionCodes[i % regionCodes.length];
    await prisma.vehicle.update({
      where: { id: vehicles[i].id },
      data: { regionId: regions[regionCode] },
    });
  }
  console.log(`  ✅ ${vehicles.length} vehicles assigned to regions`);

  // 4. Create financial staff accounts
  const finPassword = await bcrypt.hash('password123', 10);

  const finAdmin = await prisma.user.upsert({
    where: { email: 'fin.admin@tollgate.com' },
    update: {},
    create: {
      email: 'fin.admin@tollgate.com',
      passwordHash: finPassword,
      name: 'Daw Thin Thin Aye',
      role: 'FINANCIAL_ADMIN',
      customerType: 'INDIVIDUAL',
    },
  });

  const finManager = await prisma.user.upsert({
    where: { email: 'fin.manager@tollgate.com' },
    update: {},
    create: {
      email: 'fin.manager@tollgate.com',
      passwordHash: finPassword,
      name: 'U Kyaw Zin Aung',
      role: 'FINANCIAL_MANAGER',
      customerType: 'INDIVIDUAL',
    },
  });

  const finViewer = await prisma.user.upsert({
    where: { email: 'fin.viewer@tollgate.com' },
    update: {},
    create: {
      email: 'fin.viewer@tollgate.com',
      passwordHash: finPassword,
      name: 'Daw Mya Mya Nwe',
      role: 'FINANCIAL_VIEWER',
      customerType: 'INDIVIDUAL',
    },
  });

  // Create accounts for financial staff
  for (const user of [finAdmin, finManager, finViewer]) {
    await prisma.account.upsert({
      where: { accountNumber: `FIN-${user.role}-${user.id.slice(0, 8)}` },
      update: {},
      create: {
        userId: user.id,
        accountNumber: `FIN-${user.role}-${user.id.slice(0, 8)}`,
        customerType: 'INDIVIDUAL',
        balance: 0,
        creditLimit: 0,
        status: 'ACTIVE',
        regionId: regions['NPT'],
      },
    });
  }
  console.log(`  ✅ 3 financial staff accounts created`);

  // ============================================================================
  // IMPORTANT: Financial Distinction
  // - Toll Revenue = Actual charges deducted from customer wallets at plaza (INCOME)
  // - Wallet Deposits = Customer loaded money into wallet (COMPANY LIABILITY - not revenue)
  // - Only DEBIT transactions (toll charges) count as revenue
  // - TOPUP transactions are customer deposits held for future usage
  // ============================================================================

  // 5. Generate sample daily collection statements for last 7 days
  // Each record = actual toll revenue earned at a plaza (DEBIT transactions only)
  const today = new Date();
  const activePlazas = plazas.filter(p => p.status === 'ACTIVE' && p.regionId);

  for (let daysAgo = 1; daysAgo <= 7; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    for (const plaza of activePlazas) {
      const baseRevenue = plaza.mileMarker === 0 ? 4500000 :
                          plaza.mileMarker === 39 ? 3600000 :
                          plaza.mileMarker === 115 ? 2700000 : 1800000;
      const variance = Math.floor(Math.random() * 500000) - 250000;
      const totalRevenue = baseRevenue + variance;
      const totalTrips = Math.floor(totalRevenue / 3000) + Math.floor(Math.random() * 200);
      const rfidTrips = Math.floor(totalTrips * 0.75);
      const cashTrips = totalTrips - rfidTrips;
      const violationFines = Math.floor(Math.random() * 50000) + 10000;

      await prisma.dailyCollection.upsert({
        where: { collectionDate_plazaId: { collectionDate: date, plazaId: plaza.id } },
        update: {},
        create: {
          collectionDate: date,
          plazaId: plaza.id,
          regionId: plaza.regionId!,
          totalTrips,
          totalRevenue,
          rfidTrips,
          cashTrips,
          violationFines,
          transferStatus: daysAgo > 1 ? 'CONFIRMED' : 'PENDING',
          bankName: daysAgo > 1 ? 'KBZ Corporate Bank' : undefined,
          depositRef: daysAgo > 1 ? `KBZ-DEP-${Date.now().toString(36).toUpperCase()}` : undefined,
          transferredAt: daysAgo > 1 ? date : undefined,
          confirmedAt: daysAgo > 1 ? date : undefined,
        },
      });
    }
  }
  console.log(`  ✅ 7 days of daily collection statements generated (toll revenue only)`);

  // 6. Generate sample revenue remittance records for last 7 days
  // Revenue remittance = actual toll revenue transferred from plaza to HQ treasury account
  for (let daysAgo = 1; daysAgo <= 7; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    date.setHours(0, 0, 0, 0);

    for (const plaza of activePlazas) {
      const baseRevenue = plaza.mileMarker === 0 ? 4500000 :
                          plaza.mileMarker === 39 ? 3600000 :
                          plaza.mileMarker === 115 ? 2700000 : 1800000;
      const variance = Math.floor(Math.random() * 500000) - 250000;
      const amount = baseRevenue + variance;
      const tripCount = Math.floor(amount / 3000);

      await prisma.revenueTransfer.upsert({
        where: { transferDate_plazaId: { transferDate: date, plazaId: plaza.id } },
        update: {},
        create: {
          transferDate: date,
          plazaId: plaza.id,
          regionId: plaza.regionId!,
          amount,
          tripCount,
          status: daysAgo > 1 ? 'CONFIRMED' : 'PENDING',
          bankName: daysAgo > 1 ? 'KBZ Corporate Bank' : undefined,
          depositRef: daysAgo > 1 ? `KBZ-DEP-${Date.now().toString(36).toUpperCase()}` : undefined,
          transferredAt: daysAgo > 1 ? date : undefined,
          confirmedAt: daysAgo > 1 ? date : undefined,
        },
      });
    }
  }
  console.log(`  ✅ 7 days of revenue transfers generated`);

  // 7. Generate sample monthly reconciliation for current fiscal year
  const currentYear = today.getFullYear();
  const fiscalYear = today.getMonth() >= 3 ? currentYear : currentYear - 1;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const activeRegionIds = Object.values(regions).slice(0, 3); // YGN, MDY, BGO

  for (const regionId of activeRegionIds) {
    for (let m = 4; m <= 12; m++) {
      const quarter = m <= 6 ? 'Q1' : m <= 9 ? 'Q2' : 'Q3';
      const baseRevenue = 50000000 + Math.floor(Math.random() * 20000000);
      const totalTrips = Math.floor(baseRevenue / 3000);
      const settled = m < today.getMonth() + 1 ? baseRevenue : 0;

      await prisma.monthlyReconciliation.upsert({
        where: { fiscalYear_month_regionId: { fiscalYear, month: m, regionId } },
        update: {},
        create: {
          fiscalYear,
          fiscalQuarter: quarter as any,
          month: m,
          monthName: monthNames[m - 1],
          regionId,
          totalRevenue: baseRevenue,
          totalTrips,
          totalSettled: settled,
          outstanding: baseRevenue - settled,
          fineRevenue: Math.floor(Math.random() * 500000) + 100000,
          status: m < today.getMonth() ? 'APPROVED' : 'DRAFT',
        },
      });
    }
  }
  console.log(`  ✅ Monthly reconciliation records generated`);

  console.log('✅ Financial seed completed');
  console.log(`   Regions: ${MYANMAR_REGIONS.length}`);
  console.log(`   Financial staff: fin.admin@tollgate.com, fin.manager@tollgate.com, fin.viewer@tollgate.com`);
  console.log(`   Password: password123`);
}

main()
  .catch((e) => {
    console.error('❌ Financial seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
