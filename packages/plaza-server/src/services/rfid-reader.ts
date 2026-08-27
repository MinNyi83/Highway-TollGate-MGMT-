import { PrismaClient } from '@prisma/client';
import { Server as SocketIOServer } from 'socket.io';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import * as net from 'net';
import { v4 as uuid } from 'uuid';

interface RFIDReaderConfig {
  type: 'serial' | 'tcp';
  port?: string;
  baudRate?: number;
  host?: string;
  tcpPort?: number;
}

let activeReaders: (SerialPort | net.Socket)[] = [];

export async function setupRFIDReader(prisma: PrismaClient, io: SocketIOServer) {
  const config: RFIDReaderConfig = {
    type: (process.env.RFID_TYPE as any) || 'serial',
    port: process.env.RFID_SERIAL_PORT || '/dev/ttyUSB0',
    baudRate: parseInt(process.env.RFID_BAUD_RATE || '9600'),
    host: process.env.RFID_TCP_HOST || '192.168.1.100',
    tcpPort: parseInt(process.env.RFID_TCP_PORT || '5000'),
  };

  console.log(`Setting up RFID reader: ${config.type}`);

  if (config.type === 'serial') {
    await setupSerialReader(config, prisma, io);
  } else {
    await setupTCPReader(config, prisma, io);
  }
}

async function setupSerialReader(config: RFIDReaderConfig, prisma: PrismaClient, io: SocketIOServer) {
  try {
    const port = new SerialPort({
      path: config.port || '/dev/ttyUSB0',
      baudRate: config.baudRate || 9600,
    });

    const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

    parser.on('data', async (data: string) => {
      const tagUid = data.trim();
      if (tagUid) {
        await handleTagRead(tagUid, prisma, io);
      }
    });

    port.on('error', (err) => {
      console.error('Serial port error:', err.message);
      updateDeviceStatus(prisma, 'RFID_READER', config.port || 'serial', 'ERROR');
    });

    port.on('open', () => {
      console.log(`Serial RFID reader connected on ${config.port}`);
      updateDeviceStatus(prisma, 'RFID_READER', config.port || 'serial', 'ONLINE');
    });

    activeReaders.push(port);
  } catch (error) {
    console.error('Failed to setup serial reader:', error);
    updateDeviceStatus(prisma, 'RFID_READER', config.port || 'serial', 'OFFLINE');
  }
}

async function setupTCPReader(config: RFIDReaderConfig, prisma: PrismaClient, io: SocketIOServer) {
  const client = new net.Socket();

  const connect = () => {
    client.connect(config.tcpPort || 5000, config.host || '192.168.1.100');
  };

  client.on('connect', () => {
    console.log(`TCP RFID reader connected to ${config.host}:${config.tcpPort}`);
    updateDeviceStatus(prisma, 'RFID_READER', `${config.host}:${config.tcpPort}`, 'ONLINE');
  });

  let buffer = '';
  client.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const tagUid = line.trim();
      if (tagUid) {
        handleTagRead(tagUid, prisma, io);
      }
    }
  });

  client.on('error', (err) => {
    console.error('TCP reader error:', err.message);
    updateDeviceStatus(prisma, 'RFID_READER', `${config.host}:${config.tcpPort}`, 'ERROR');
    setTimeout(connect, 5000);
  });

  client.on('close', () => {
    console.log('TCP reader disconnected, reconnecting...');
    updateDeviceStatus(prisma, 'RFID_READER', `${config.host}:${config.tcpPort}`, 'OFFLINE');
    setTimeout(connect, 3000);
  });

  connect();
  activeReaders.push(client);
}

async function handleTagRead(tagUid: string, prisma: PrismaClient, io: SocketIOServer) {
  console.log(`RFID tag read: ${tagUid}`);

  // Find the tag in local database
  const tag = await prisma.rFIDTag.findUnique({
    where: { tagUid },
    include: { vehicle: true },
  });

  if (!tag) {
    console.log(`Unknown tag: ${tagUid}`);
    io.emit('unknown-tag', { tagUid, timestamp: new Date() });
    return;
  }

  // Check for existing open event (ENTRY without EXIT)
  const openEvent = await prisma.tollEvent.findFirst({
    where: {
      rfidTagId: tag.id,
      status: 'ENTRY',
      exitTime: null,
    },
  });

  if (openEvent) {
    // This is an EXIT event
    const config = await prisma.plazaConfig.findFirst();
    const rates = await prisma.tollRate.findMany({ where: { active: true } });
    const rate = rates.find((r) => r.vehicleClass === tag.vehicle?.vehicleClass);
    const amount = rate?.rateAmount || 0;

    const exitEvent = await prisma.tollEvent.update({
      where: { id: openEvent.id },
      data: {
        exitTime: new Date(),
        amount,
        status: 'COMPLETED',
      },
    });

    console.log(`EXIT: ${tag.vehicle?.plateNumber} - K${amount}`);

    // Add to sync queue
    await addToSyncQueue(prisma, 'TollEvent', exitEvent.id, 'UPDATE', exitEvent);

    io.emit('toll-event', {
      type: 'EXIT',
      vehicle: tag.vehicle,
      amount,
      event: exitEvent,
    });
  } else {
    // This is an ENTRY event
    const entryEvent = await prisma.tollEvent.create({
      data: {
        vehicleId: tag.vehicleId,
        rfidTagId: tag.id,
        laneNumber: '1',
        status: 'ENTRY',
      },
    });

    console.log(`ENTRY: ${tag.vehicle?.plateNumber}`);

    await addToSyncQueue(prisma, 'TollEvent', entryEvent.id, 'CREATE', entryEvent);

    io.emit('toll-event', {
      type: 'ENTRY',
      vehicle: tag.vehicle,
      event: entryEvent,
    });
  }
}

async function addToSyncQueue(prisma: PrismaClient, table: string, recordId: string, action: string, payload: any) {
  await prisma.syncQueue.create({
    data: {
      tableName: table,
      recordId,
      action,
      payload: JSON.stringify(payload),
    },
  });
}

async function updateDeviceStatus(prisma: PrismaClient, deviceType: string, deviceId: string, status: string) {
  await prisma.deviceStatus.upsert({
    where: { id: `${deviceType}-${deviceId}` },
    update: { status, lastHeartbeat: new Date() },
    create: { deviceType, deviceId, status },
  });
}

export function cleanupReaders() {
  for (const reader of activeReaders) {
    if ('close' in reader) {
      reader.close();
    }
  }
}
