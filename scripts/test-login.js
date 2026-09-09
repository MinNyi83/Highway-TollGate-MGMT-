const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: { url: 'postgresql://postgres:postgres@customer-db:5432/tollgate_customer' },
    },
  });

  try {
    const user = await prisma.user.findUnique({
      where: { email: 'ko.min@personal.com' },
    });
    console.log('User found:', JSON.stringify(user, null, 2));

    if (user) {
      const bcrypt = require('bcryptjs');
      const match = await bcrypt.compare('password123', user.passwordHash);
      console.log('Password match:', match);
    } else {
      console.log('User not found!');
    }
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
