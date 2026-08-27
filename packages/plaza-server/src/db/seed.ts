import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding plaza database...');

  // Create default admin
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.localUser.upsert({
    where: { email: 'admin@plaza.local' },
    update: {},
    create: {
      id: 'admin-001',
      email: 'admin@plaza.local',
      passwordHash,
      name: 'Plaza Admin',
      role: 'ADMIN',
    },
  });

  // Create default plaza config
  await prisma.plazaConfig.upsert({
    where: { id: 'plaza-001' },
    update: {},
    create: {
      id: process.env.PLAZA_ID || 'plaza-001',
      name: process.env.PLAZA_NAME || '0 Mile Plaza',
      gateCode: process.env.GATE_CODE || '0MILE',
      mileMarker: parseFloat(process.env.MILE_MARKER || '0'),
      hqServerUrl: process.env.HQ_SERVER_URL || '',
    },
  });

  console.log('Plaza database seeded');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
