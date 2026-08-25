import { PrismaClient, UserRole, AccountStatus, VehicleClass, VehicleStatus, RFIDTagStatus, TollPlazaStatus, TollEventStatus, TransactionType, TransactionStatus, ViolationType, ViolationStatus, CustomerType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('password123', 10);

  console.log('Seeding database...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.sMSLog.deleteMany();
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

  // Create admin/operator users
  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@tollgate.com',
        passwordHash,
        name: 'System Admin',
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'operator1@tollgate.com',
        passwordHash,
        name: 'John Operator',
        role: UserRole.OPERATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'operator2@tollgate.com',
        passwordHash,
        name: 'Jane Operator',
        role: UserRole.OPERATOR,
      },
    }),
    prisma.user.create({
      data: {
        email: 'viewer@tollgate.com',
        passwordHash,
        name: 'Bob Viewer',
        role: UserRole.VIEWER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'manager@tollgate.com',
        passwordHash,
        name: 'Alice Manager',
        role: UserRole.ADMIN,
      },
    }),
  ]);

  // Create enterprise customer
  const enterpriseUser = await prisma.user.create({
    data: {
      email: 'fleet@transportco.com',
      passwordHash,
      name: 'TransportCo Fleet',
      role: UserRole.VIEWER,
      customerType: CustomerType.ENTERPRISE,
      phone: '09-976543210',
      companyName: 'TransportCo Myanmar',
      companyRegNo: 'REG-2024-001',
      companyAddress: 'No. 123, Pyay Road, Yangon',
      fleetManagerName: 'U Myint Thein',
      smsEnabled: true,
      smsProvider: 'mpt',
    },
  });

  // Create individual customers
  const individualUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ko.min@personal.com',
        passwordHash,
        name: 'Ko Min',
        role: UserRole.VIEWER,
        customerType: CustomerType.INDIVIDUAL,
        phone: '09-123456789',
        nrcNumber: '12/ABM(N)123456',
        drivingLicense: 'DL-2024-001',
        smsEnabled: true,
        smsProvider: 'mpt',
      },
    }),
    prisma.user.create({
      data: {
        email: 'daw.myint@personal.com',
        passwordHash,
        name: 'Daw Myint',
        role: UserRole.VIEWER,
        customerType: CustomerType.INDIVIDUAL,
        phone: '09-987654321',
        nrcNumber: '8/AYA(N)654321',
        smsEnabled: true,
        smsProvider: 'atom',
      },
    }),
    prisma.user.create({
      data: {
        email: 'aung.myo@personal.com',
        passwordHash,
        name: 'Aung Myo',
        role: UserRole.VIEWER,
        customerType: CustomerType.INDIVIDUAL,
        phone: '09-555123456',
        nrcNumber: '5/YGN(N)111222',
        smsEnabled: false,
      },
    }),
  ]);

  console.log(`Created ${adminUsers.length + 1 + individualUsers.length} users`);

  // Create accounts
  const adminAccounts = await Promise.all(
    adminUsers.map((user, index) =>
      prisma.account.create({
        data: {
          userId: user.id,
          balance: 1000 + index * 500,
          status: AccountStatus.ACTIVE,
        },
      })
    )
  );

  const enterpriseAccount = await prisma.account.create({
    data: {
      userId: enterpriseUser.id,
      customerType: CustomerType.ENTERPRISE,
      balance: 5000,
      creditLimit: 10000,
      paymentTerms: 30,
      status: AccountStatus.ACTIVE,
    },
  });

  const individualAccounts = await Promise.all(
    individualUsers.map((user) =>
      prisma.account.create({
        data: {
          userId: user.id,
          customerType: CustomerType.INDIVIDUAL,
          balance: 2000,
          creditLimit: 0,
          status: AccountStatus.ACTIVE,
        },
      })
    )
  );

  const allAccounts = [...adminAccounts, enterpriseAccount, ...individualAccounts];

  console.log(`Created ${allAccounts.length} accounts`);

  // Create fleet vehicles (for enterprise account)
  const fleetVehicleData = [
    { plateNumber: 'FLEET-001', make: 'Toyota', model: 'HiAce', year: 2023, color: 'White', vehicleClass: VehicleClass.BUS },
    { plateNumber: 'FLEET-002', make: 'Toyota', model: 'HiAce', year: 2022, color: 'White', vehicleClass: VehicleClass.BUS },
    { plateNumber: 'FLEET-003', make: 'Hyundai', model: 'County', year: 2023, color: 'Silver', vehicleClass: VehicleClass.BUS },
    { plateNumber: 'FLEET-004', make: 'Nissan', model: 'Civilian', year: 2021, color: 'Blue', vehicleClass: VehicleClass.BUS },
    { plateNumber: 'FLEET-005', make: 'Hino', model: 'Ranger', year: 2023, color: 'Red', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'FLEET-006', make: 'Isuzu', model: 'Forward', year: 2022, color: 'White', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'FLEET-007', make: 'Mitsubishi', model: 'Fuso', year: 2023, color: 'Green', vehicleClass: VehicleClass.TRUCK },
    { plateNumber: 'FLEET-008', make: 'Toyota', model: 'Corolla', year: 2023, color: 'Black', vehicleClass: VehicleClass.SEDAN },
  ];

  const fleetVehicles = await Promise.all(
    fleetVehicleData.map((v) =>
      prisma.vehicle.create({
        data: { ...v, status: VehicleStatus.ACTIVE },
      })
    )
  );

  // Create individual vehicles
  const individualVehicleData = [
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

  const individualVehicles = await Promise.all(
    individualVehicleData.map((v) =>
      prisma.vehicle.create({
        data: { ...v, status: VehicleStatus.ACTIVE },
      })
    )
  );

  const allVehicles = [...fleetVehicles, ...individualVehicles];

  console.log(`Created ${allVehicles.length} vehicles`);

  // Create RFID tags for fleet vehicles (linked to enterprise account)
  const fleetRfidTags = await Promise.all(
    fleetVehicles.map((vehicle, index) =>
      prisma.rFIDTag.create({
        data: {
          tagUid: `TAGF${String(index + 1).padStart(5, '0')}`,
          vehicleId: vehicle.id,
          accountId: enterpriseAccount.id,
          status: RFIDTagStatus.ACTIVE,
        },
      })
    )
  );

  // Create RFID tags for individual vehicles
  const individualRfidTags = await Promise.all(
    individualVehicles.map((vehicle, index) =>
      prisma.rFIDTag.create({
        data: {
          tagUid: `TAG${String(index + 1).padStart(6, '0')}`,
          vehicleId: vehicle.id,
          accountId: allAccounts[(index % 3) + 5].id,
          status: RFIDTagStatus.ACTIVE,
        },
      })
    )
  );

  const allRfidTags = [...fleetRfidTags, ...individualRfidTags];

  console.log(`Created ${allRfidTags.length} RFID tags`);

  // Create mile-marker toll plazas
  const tollPlazas = await Promise.all([
    prisma.tollPlaza.create({
      data: {
        name: '0 Mile Plaza',
        locationLat: 16.8661,
        locationLng: 96.1951,
        mileMarker: 0,
        lanes: 8,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
    prisma.tollPlaza.create({
      data: {
        name: '39 Mile Plaza',
        locationLat: 17.0661,
        locationLng: 96.3951,
        mileMarker: 39,
        lanes: 6,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
    prisma.tollPlaza.create({
      data: {
        name: '115 Mile Plaza',
        locationLat: 17.4661,
        locationLng: 96.7951,
        mileMarker: 115,
        lanes: 6,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
    prisma.tollPlaza.create({
      data: {
        name: '200 Mile Plaza',
        locationLat: 17.9661,
        locationLng: 97.2951,
        mileMarker: 200,
        lanes: 8,
        status: TollPlazaStatus.ACTIVE,
      },
    }),
  ]);

  console.log(`Created ${tollPlazas.length} toll plazas with mile markers`);

  // Create toll rates (distance-based pricing)
  const ratePromises: Promise<any>[] = [];
  for (const plaza of tollPlazas) {
    const mileFactor = plaza.mileMarker === 0 ? 1 : plaza.mileMarker / 50;
    const rates = [
      { vehicleClass: VehicleClass.MOTORCYCLE, baseRate: 30 },
      { vehicleClass: VehicleClass.SEDAN, baseRate: 80 },
      { vehicleClass: VehicleClass.SUV, baseRate: 120 },
      { vehicleClass: VehicleClass.TRUCK, baseRate: 180 },
      { vehicleClass: VehicleClass.BUS, baseRate: 250 },
    ];
    for (const rate of rates) {
      ratePromises.push(
        prisma.tollRate.create({
          data: {
            plazaId: plaza.id,
            vehicleClass: rate.vehicleClass,
            rateAmount: Math.round(rate.baseRate * mileFactor * 100) / 100,
            effectiveFrom: new Date('2024-01-01'),
          },
        })
      );
    }
  }
  const tollRates = await Promise.all(ratePromises);

  console.log(`Created ${tollRates.length} toll rates`);

  // Create sample toll events (multi-vehicle, multi-plaza journey)
  const journeyEvents = [
    // Ko Min's Camry: 0 Mile -> 39 Mile -> 115 Mile -> 200 Mile
    { vehicleId: individualVehicles[0].id, plazaId: tollPlazas[0].id, rfidTagId: individualRfidTags[0].id, anprPlate: 'ABC-1234', entryTime: new Date('2024-03-15T08:00:00Z'), exitTime: new Date('2024-03-15T08:05:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: individualVehicles[0].id, plazaId: tollPlazas[1].id, rfidTagId: individualRfidTags[0].id, anprPlate: 'ABC-1234', entryTime: new Date('2024-03-15T08:45:00Z'), exitTime: new Date('2024-03-15T08:50:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: individualVehicles[0].id, plazaId: tollPlazas[2].id, rfidTagId: individualRfidTags[0].id, anprPlate: 'ABC-1234', entryTime: new Date('2024-03-15T10:00:00Z'), exitTime: new Date('2024-03-15T10:05:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: individualVehicles[0].id, plazaId: tollPlazas[3].id, rfidTagId: individualRfidTags[0].id, anprPlate: 'ABC-1234', entryTime: new Date('2024-03-15T11:30:00Z'), exitTime: new Date('2024-03-15T11:35:00Z'), status: TollEventStatus.COMPLETED },
    // Daw Myint's Civic: 0 Mile -> 115 Mile
    { vehicleId: individualVehicles[1].id, plazaId: tollPlazas[0].id, rfidTagId: individualRfidTags[1].id, anprPlate: 'DEF-5678', entryTime: new Date('2024-03-15T09:00:00Z'), exitTime: new Date('2024-03-15T09:05:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: individualVehicles[1].id, plazaId: tollPlazas[2].id, rfidTagId: individualRfidTags[1].id, anprPlate: 'DEF-5678', entryTime: new Date('2024-03-15T10:30:00Z'), exitTime: new Date('2024-03-15T10:35:00Z'), status: TollEventStatus.COMPLETED },
    // TransportCo Fleet Bus: 0 Mile -> 39 Mile -> 115 Mile -> 200 Mile (full journey)
    { vehicleId: fleetVehicles[0].id, plazaId: tollPlazas[0].id, rfidTagId: fleetRfidTags[0].id, anprPlate: 'FLEET-001', entryTime: new Date('2024-03-15T07:30:00Z'), exitTime: new Date('2024-03-15T07:35:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: fleetVehicles[0].id, plazaId: tollPlazas[1].id, rfidTagId: fleetRfidTags[0].id, anprPlate: 'FLEET-001', entryTime: new Date('2024-03-15T08:15:00Z'), exitTime: new Date('2024-03-15T08:20:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: fleetVehicles[0].id, plazaId: tollPlazas[2].id, rfidTagId: fleetRfidTags[0].id, anprPlate: 'FLEET-001', entryTime: new Date('2024-03-15T09:30:00Z'), exitTime: new Date('2024-03-15T09:35:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: fleetVehicles[0].id, plazaId: tollPlazas[3].id, rfidTagId: fleetRfidTags[0].id, anprPlate: 'FLEET-001', entryTime: new Date('2024-03-15T11:00:00Z'), exitTime: new Date('2024-03-15T11:05:00Z'), status: TollEventStatus.COMPLETED },
    // TransportCo Fleet Truck: 0 Mile -> 200 Mile (direct)
    { vehicleId: fleetVehicles[4].id, plazaId: tollPlazas[0].id, rfidTagId: fleetRfidTags[4].id, anprPlate: 'FLEET-005', entryTime: new Date('2024-03-15T06:00:00Z'), exitTime: new Date('2024-03-15T06:05:00Z'), status: TollEventStatus.COMPLETED },
    { vehicleId: fleetVehicles[4].id, plazaId: tollPlazas[3].id, rfidTagId: fleetRfidTags[4].id, anprPlate: 'FLEET-005', entryTime: new Date('2024-03-15T09:00:00Z'), exitTime: new Date('2024-03-15T09:05:00Z'), status: TollEventStatus.COMPLETED },
    // ANPR mismatch test
    { vehicleId: individualVehicles[3].id, plazaId: tollPlazas[0].id, rfidTagId: individualRfidTags[3].id, anprPlate: 'FAKE-9999', entryTime: new Date('2024-03-15T12:00:00Z'), exitTime: new Date('2024-03-15T12:05:00Z'), status: TollEventStatus.COMPLETED },
    // Insufficient balance test (vehicle with 0 balance)
    { vehicleId: individualVehicles[4].id, plazaId: tollPlazas[0].id, rfidTagId: individualRfidTags[4].id, anprPlate: 'MNO-7890', entryTime: new Date('2024-03-15T13:00:00Z'), exitTime: new Date('2024-03-15T13:05:00Z'), status: TollEventStatus.COMPLETED },
    // Entry only (still in transit)
    { vehicleId: fleetVehicles[1].id, plazaId: tollPlazas[1].id, rfidTagId: fleetRfidTags[1].id, anprPlate: 'FLEET-002', entryTime: new Date('2024-03-15T14:00:00Z'), status: TollEventStatus.ENTRY },
  ];

  const tollEvents = await Promise.all(
    journeyEvents.map((event) =>
      prisma.tollEvent.create({ data: event as any })
    )
  );

  console.log(`Created ${tollEvents.length} toll events`);

  // Create transactions
  const transactionData = tollEvents
    .filter((e) => e.status === TollEventStatus.COMPLETED)
    .map((event, index) => ({
      accountId: allAccounts[index % allAccounts.length].id,
      eventId: event.id,
      amount: 100 + Math.floor(Math.random() * 400),
      type: TransactionType.DEBIT,
      status: TransactionStatus.COMPLETED,
    }));

  const transactions = await Promise.all(
    transactionData.map((t) => prisma.transaction.create({ data: t }))
  );

  console.log(`Created ${transactions.length} transactions`);

  // Create violations
  const violationData = [
    {
      vehicleId: individualVehicles[3].id,
      eventId: tollEvents[12].id,
      violationType: ViolationType.RFID_ANPR_MISMATCH,
      status: ViolationStatus.PENDING,
      fineAmount: 500,
      dueDate: new Date('2024-04-15'),
    },
    {
      vehicleId: individualVehicles[4].id,
      eventId: tollEvents[13].id,
      violationType: ViolationType.INSUFFICIENT_BALANCE,
      status: ViolationStatus.PENDING,
      fineAmount: 200,
      dueDate: new Date('2024-04-15'),
    },
  ];

  const violations = await Promise.all(
    violationData.map((v) => prisma.violation.create({ data: v as any }))
  );

  console.log(`Created ${violations.length} violations`);

  // Create device statuses for each plaza
  const devicePromises: Promise<any>[] = [];
  for (const plaza of tollPlazas) {
    devicePromises.push(
      prisma.deviceStatus.create({
        data: {
          plazaId: plaza.id,
          deviceType: 'RFID_READER',
          deviceId: `RFID-${plaza.name.replace(/\s/g, '-').toUpperCase()}-001`,
          ipAddress: `192.168.1.${10 + tollPlazas.indexOf(plaza)}`,
          port: 8080,
          lane: 1,
          status: 'ONLINE',
          lastHeartbeat: new Date(),
        },
      })
    );
    devicePromises.push(
      prisma.deviceStatus.create({
        data: {
          plazaId: plaza.id,
          deviceType: 'ANPR_CAMERA',
          deviceId: `ANPR-${plaza.name.replace(/\s/g, '-').toUpperCase()}-001`,
          ipAddress: `192.168.1.${20 + tollPlazas.indexOf(plaza)}`,
          port: 80,
          apiUrl: `http://192.168.1.${20 + tollPlazas.indexOf(plaza)}/ISAPI`,
          lane: 1,
          status: 'ONLINE',
          lastHeartbeat: new Date(),
        },
      })
    );
    devicePromises.push(
      prisma.deviceStatus.create({
        data: {
          plazaId: plaza.id,
          deviceType: 'BARRIER_GATE',
          deviceId: `BARRIER-${plaza.name.replace(/\s/g, '-').toUpperCase()}-001`,
          ipAddress: `192.168.1.${30 + tollPlazas.indexOf(plaza)}`,
          port: 502,
          lane: 1,
          status: 'ONLINE',
          lastHeartbeat: new Date(),
        },
      })
    );
    devicePromises.push(
      prisma.deviceStatus.create({
        data: {
          plazaId: plaza.id,
          deviceType: 'LED_SIGN',
          deviceId: `LED-${plaza.name.replace(/\s/g, '-').toUpperCase()}-001`,
          ipAddress: `192.168.1.${40 + tollPlazas.indexOf(plaza)}`,
          port: 8081,
          lane: 1,
          status: 'ONLINE',
          lastHeartbeat: new Date(),
        },
      })
    );
  }

  const deviceStatuses = await Promise.all(devicePromises);

  console.log(`Created ${deviceStatuses.length} device statuses`);

  console.log('\n=== Seed Summary ===');
  console.log(`Users: ${adminUsers.length + 1 + individualUsers.length}`);
  console.log(`  - Admin/Operators: ${adminUsers.length}`);
  console.log(`  - Enterprise: 1 (fleet@transportco.com / password123)`);
  console.log(`  - Individual: ${individualUsers.length}`);
  console.log(`Accounts: ${allAccounts.length}`);
  console.log(`Vehicles: ${allVehicles.length} (Fleet: ${fleetVehicles.length}, Individual: ${individualVehicles.length})`);
  console.log(`RFID Tags: ${allRfidTags.length}`);
  console.log(`Toll Plazas: ${tollPlazas.length} (Mile markers: 0, 39, 115, 200)`);
  console.log(`Toll Rates: ${tollRates.length}`);
  console.log(`Toll Events: ${tollEvents.length}`);
  console.log(`Transactions: ${transactions.length}`);
  console.log(`Violations: ${violations.length}`);
  console.log(`Device Statuses: ${deviceStatuses.length}`);
  console.log('\n=== Login Credentials ===');
  console.log('Admin: admin@tollgate.com / password123');
  console.log('Enterprise: fleet@transportco.com / password123');
  console.log('Individual: ko.min@personal.com / password123');
  console.log('========================');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
