const { PrismaClient } = require('@prisma/client');
async function main() {
  const p = new PrismaClient({
    datasources: { db: { url: process.env.CUSTOMER_DATABASE_URL } },
    log: ['query'],
  });
  const user = await p.user.findUnique({ where: { email: 'ko.min@personal.com' } });
  console.log('USER:', JSON.stringify(user));
  await p.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
