import { PrismaClient, UserRole, AccountStatus, VehicleClass, VehicleStatus, RFIDTagStatus, TollPlazaStatus, TollEventStatus, TransactionType, TransactionStatus, ViolationType, ViolationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.deviceStatus.deleteMany();
  await prisma.violation.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.tollEvent.deleteMany();
  await prisma.tollRate.deleteMany();
  await prisma.tollPlaza.deleteMany();
  await prisma.rFIDTag.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleaned existing data');

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@tollgate.com',
        passwordHash: passwordHash,
        name: 'System Admin',
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'operator1@tollgate.com',
        passwordHash: passwordHash,
        name: 'John Operator',
        role: UserRole.OPERATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'operator2@tollgate.com',
        passwordHash: passwordHash,
        name: 'Jane Operator',
        role: UserRole.OPERATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'viewer@tollgate.com',
        passwordHash: passwordHash,
        name: 'Bob Viewer',
        role: UserRole.VIEWER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@tollgate.com',
        passwordHash: passwordHash,
        name: 'Alice Manager',
        role: UserRole.ADMIN,
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create accounts
  const accounts = await Promise.all(
    users.map((user, index) =>
      prisma.account.create({
        data: {
          userId: user.id,
          balance: 1000 + index * 500,
          status: AccountStatus.ACTIVE,
        },
      })
    )
  );

  console.log(`Created ${accounts.length} accounts`);

  // Create vehicles
  const vehicleData = [
    { plateNumber: 'ABC-1234', make: 'Toyota', model: 'Camry', year: 2022, color: 'White', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'DEF-5678', make: 'Honda', model: 'Civic', year: 2023, color: 'Black', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'GHI-9012', make: 'Ford', model: 'Explorer', year: 2021, color: 'Blue', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'JKL-3456', make: 'Chevrolet', model: 'Malibu', year: 2022, color: 'Silver', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'MNO-7890', make: 'BMW', model: 'X5', year: 2023, color: 'Red', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'PQR-1234', make: 'Mercedes', model: 'C-Class', year: 2022, color: 'Gray', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'STU-5678', make: 'Audi', model: 'A4', year: 2023, color: 'White', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'VWX-9012', make: 'Lexus', model: 'RX', year: 2021, color: 'Black', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'YZA-3456', make: 'Hyundai', model: 'Elantra', year: 2022, color: 'Blue', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'BCD-7890', make: 'Kia', model: 'Forte', year: 2023, color: 'Red', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'EFG-1234', make: 'Nissan', model: 'Altima', year: 2022, color: 'Silver', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'HIJ-5678', make: 'Subaru', model: 'Outback', year: 2023, color: 'Green', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'KLM-9012', make: 'Mazda', model: 'CX-5', year: 2021, color: 'White', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'NOP-3456', make: 'Volkswagen', model: 'Jetta', year: 2022, color: 'Black', vehicleClass: VehicleClass.SEDAN },
    { plateNumber: 'QRS-7890', make: 'Toyota', model: 'RAV4', year: 2023, color: 'Blue', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'TUV-1234', make: 'Honda', model: 'CR-V', year: 2022, color: 'Red', vehicleClass: VehicleClass.SUV },
    { plateNumber: 'WXY-5678', make: 'Ford', model: 'F-150', year: 2023, color: 'Gray', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'ZAB-9012', make: 'Chevrolet', model: 'Silverado', year: 2021, color: 'Black', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'CDE-3456', make: 'RAM', model: '1500', year: 2022, color: 'White', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'FGH-7890', make: 'Tesla', model: 'Model 3', year: 2023, color: 'Red', vehicleClass: VehicleClass.SEDAN },
  ];

  const vehicles = await Promise.all(
    vehicleData.map((v) =>
      prisma.vehicle.create({
        data: {
          ...v,
          status: VehicleStatus.ACTIVE,
        },
      })
    )
  );

  console.log(`Created ${vehicles.length} vehicles`);

  // Create RFID tags
  const rfidTags = await Promise.all(
    vehicles.map((vehicle, index) =>
      prisma.rFIDTag.create({
        data: {
          tagUid: `TAG${String(index + 1).padStart(6, '0')}`,
          vehicleId: vehicle.id,
          accountId: accounts[index % accounts.length].id,
          status: RFIDTagStatus.ACTIVE,
        },
      })
    )
  );

  console.log(`Created ${rfidTags.length} RFID tags`);

  // Create toll plazas
  const tollPlazas = await Promise.all([
    prisma.tollPlaza.create({
      data: {
        name: 'Main Plaza',
        locationLat: 14.5995,
        locationLng: 120.9842,
        lanes: 6,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
    prisma.tollPlaza.create({
      data: {
        name: 'North Exit',
        locationLat: 14.6500,
        locationLng: 120.9800,
        lanes: 4,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
    prisma.tollPlaza.create({
      data: {
        name: 'South Entry',
        locationLat: 14.5500,
        locationLng: 120.9900,
        lanes: 4,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
  ]);

  console.log(`Created ${tollPlazas.length} toll plazas`);

  // Create toll rates
  const ratePromises: Promise<any>[] = [];
  for (const plaza of tollPlazas) {
    const rates = [
      { vehicleClass: VehicleClass.MOTORCYCLE, rateAmount: 50 },
      { vehicleClass: VehicleClass.SEDAN, rateAmount: 100 },
      { vehicleClass: VehicleClass.SUV, rateAmount: 150 },
      { vehicleClass: VehicleClass.TRUCK, rateAmount: 200 },
      { vehicleClass: VehicleClass.BUS, rateAmount: 250 },
    ];
    for (const rate of rates) {
      ratePromises.push(
        prisma.tollRate.create({
          data: {
            plazaId: plaza.id,
            vehicleClass: rate.vehicleClass,
            rateAmount: rate.rateAmount,
            effectiveFrom: new Date('2024-01-01'),
          },
        })
      );
    }
  }
  const tollRates = await Promise.all(ratePromises);

  console.log(`Created ${tollRates.length} toll rates`);

  // Create sample toll events
  const tollEvents = await Promise.all([
    prisma.tollEvent.create({
      data: {
        vehicleId: vehicles[0].id,
        plazaId: tollPlazas[0].id,
        rfidTagId: rfidTags[0].id,
        anprPlate: 'ABC-1234',
        entryTime: new Date('2024-03-15T08:30:00Z'),
        exitTime: new Date('2024-03-15T08:45:00Z'),
        status: TollEventStatus.COMPLETED,
      },
    }),
    prisma.tollEvent.create({
      data: {
        vehicleId: vehicles[1].id,
        plazaId: tollPlazas[0].id,
        rfidTagId: rfidTags[1].id,
        anprPlate: 'DEF-5678',
        entryTime: new Date('2024-03-15T09:00:00Z'),
        exitTime: new Date('2024-03-15T09:15:00Z'),
        status: TollEventStatus.COMPLETED,
      },
    }),
    prisma.tollEvent.create({
      data: {
        vehicleId: vehicles[2].id,
        plazaId: tollPlazas[1].id,
        rfidTagId: rfidTags[2].id,
        anprPlate: 'GHI-9012',
        entryTime: new Date('2024-03-15T10:00:00Z'),
        status: TollEventStatus.ENTRY,
      },
    }),
  ]);

  console.log(`Created ${tollEvents.length} toll events`);

  // Create transactions
  const transactions = await Promise.all([
    prisma.transaction.create({
      data: {
        accountId: accounts[0].id,
        eventId: tollEvents[0].id,
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
      },
    }),
    prisma.transaction.create({
      data: {
        accountId: accounts[1].id,
        eventId: tollEvents[1].id,
        amount: 100,
        type: TransactionType.DEBIT,
        status: TransactionStatus.COMPLETED,
      },
    }),
  ]);

  console.log(`Created ${transactions.length} transactions`);

  // Create sample violations
  const violations = await Promise.all([
    prisma.violation.create({
      data: {
        vehicleId: vehicles[3].id,
        eventId: tollEvents[0].id,
        violationType: ViolationType.RFID_ANPR_MISMATCH,
        status: ViolationStatus.PENDING,
        fineAmount: 500,
        dueDate: new Date('2024-04-15'),
      },
    }),
  ]);

  console.log(`Created ${violations.length} violations`);

  // Create device statuses
  const deviceStatuses = await Promise.all([
    prisma.deviceStatus.create({
      data: {
        plazaId: tollPlazas[0].id,
        deviceType: 'RFID_READER',
        deviceId: 'RFID-MAIN-001',
        status: 'ONLINE',
        lastHeartbeat: new Date(),
      },
    }),
    prisma.deviceStatus.create({
      data: {
        plazaId: tollPlazas[0].id,
        deviceType: 'ANPR_CAMERA',
        deviceId: 'ANPR-MAIN-001',
        status: 'ONLINE',
        lastHeartbeat: new Date(),
      },
    }),
  ]);

  console.log(`Created ${deviceStatuses.length} device statuses`);

  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
