import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL || process.env.PLAZA_DATABASE_URL },
  },
});

async function main() {
  console.log('🌱 Seeding plaza database...');

  // Create plaza configs
  await prisma.plazaConfig.upsert({
    where: { plazaCode: 'PLZ-001' },
    update: {},
    create: {
      plazaCode: 'PLZ-001',
      plazaName: 'Yangon Plaza',
      location: 'Yangon-Mandalay Expressway, km 0',
      lanes: 4,
      status: 'ACTIVE',
    },
  });

  await prisma.plazaConfig.upsert({
    where: { plazaCode: 'PLZ-002' },
    update: {},
    create: {
      plazaCode: 'PLZ-002',
      plazaName: 'Mandalay Plaza',
      location: 'Yangon-Mandalay Expressway, km 350',
      lanes: 4,
      status: 'ACTIVE',
    },
  });

  await prisma.plazaConfig.upsert({
    where: { plazaCode: 'PLZ-003' },
    update: {},
    create: {
      plazaCode: 'PLZ-003',
      plazaName: 'Naypyidaw Plaza',
      location: 'Yangon-Naypyidaw Expressway, km 200',
      lanes: 4,
      status: 'ACTIVE',
    },
  });

  await prisma.plazaConfig.upsert({
    where: { plazaCode: 'PLZ-004' },
    update: {},
    create: {
      plazaCode: 'PLZ-004',
      plazaName: 'Meiktila Plaza',
      location: 'Mandalay-Meiktila Expressway, km 50',
      lanes: 4,
      status: 'ACTIVE',
    },
  });

  // Create sync statuses
  const entityTypes = ['VEHICLE', 'TOLL_EVENT', 'VIOLATION', 'DEVICE_STATUS'];
  for (const entityType of entityTypes) {
    const existing = await prisma.syncStatus.findFirst({ where: { entityType } });
    if (!existing) {
      await prisma.syncStatus.create({
        data: {
          entityType,
          lastSyncAt: null,
          lastSyncId: null,
          recordsSynced: 0,
          status: 'IDLE',
        },
      });
    }
  }

  // Create device configs
  const plazaIds = ['PLZ-001', 'PLZ-002', 'PLZ-003', 'PLZ-004'];
  for (const plazaCode of plazaIds) {
    for (let lane = 1; lane <= 4; lane++) {
      await prisma.deviceConfig.create({
        data: {
          plazaId: plazaCode,
          deviceType: 'RFID_READER',
          deviceId: `RFID-${plazaCode}-L${lane}`,
          name: `RFID Reader Lane ${lane}`,
          ipAddress: `192.168.${plazaCode === 'PLZ-001' ? '10' : plazaCode === 'PLZ-002' ? '20' : plazaCode === 'PLZ-003' ? '30' : '40'}.${lane + 10}`,
          port: 8080,
          lane,
          status: 'ONLINE',
        },
      });

      await prisma.deviceConfig.create({
        data: {
          plazaId: plazaCode,
          deviceType: 'ANPR_CAMERA',
          deviceId: `ANPR-${plazaCode}-L${lane}`,
          name: `ANPR Camera Lane ${lane}`,
          ipAddress: `192.168.${plazaCode === 'PLZ-001' ? '10' : plazaCode === 'PLZ-002' ? '20' : plazaCode === 'PLZ-003' ? '30' : '40'}.${lane + 20}`,
          port: 8081,
          lane,
          status: 'ONLINE',
        },
      });
    }
  }

  console.log('✅ Plaza database seeded');
  console.log(`   Plaza configs: ${plazaIds.length}`);
  console.log(`   Sync statuses: ${entityTypes.length}`);
  console.log(`   Device configs: ${plazaIds.length * 8} (2 devices x 4 lanes x 4 plazas)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
