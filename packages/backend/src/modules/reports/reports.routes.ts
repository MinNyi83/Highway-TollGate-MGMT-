import { Router, Request, Response } from 'express';
import {
  getTollEventsByDateRange,
  getTransactionsByDateRange,
  getViolationsByDateRange,
  getTollRevenueByPlaza,
  getViolationStats,
  getRevenueTransfersOverview,
  confirmRevenueTransfer,
} from './reports.service';
import { authMiddleware } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';

const prisma = new PrismaClient();
const router = Router();

router.get('/events', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const events = await getTollEventsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const transactions = await getTransactionsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/violations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const violations = await getViolationsByDateRange(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(violations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get(['/revenue/transfers', '/revenue-transfers'], async (req: Request, res: Response) => {
  try {
    const data = await getRevenueTransfersOverview();
    res.json(data);
  } catch (error) {
    console.error('Error fetching revenue transfers:', error);
    res.status(500).json({ error: 'Failed to fetch revenue transfers' });
  }
});

router.get('/revenue', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const revenue = await getTollRevenueByPlaza(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json(revenue);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/violations/stats', authMiddleware, async (req: Request, res: Response) => {
  try {
    const stats = await getViolationStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/revenue/csv', authMiddleware, async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { status: 'COMPLETED' },
      include: {
        account: { include: { user: true } },
        event: { include: { vehicle: true, plaza: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'Date,Plate Number,Plaza,Vehicle Make,Vehicle Model,Amount (MMK),Type,Account Holder\n';
    transactions.forEach((t) => {
      csv += `${t.createdAt.toISOString()},${t.event?.vehicle?.plateNumber || ''},${t.event?.plaza?.name || ''},${t.event?.vehicle?.make || ''},${t.event?.vehicle?.model || ''},${t.amount},${t.type},${t.account?.user?.name || ''}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/violations/csv', authMiddleware, async (req: Request, res: Response) => {
  try {
    const violations = await prisma.violation.findMany({
      include: { vehicle: true, event: { include: { plaza: true } } },
      orderBy: { createdAt: 'desc' },
    });

    let csv = 'Date,Plate Number,Vehicle,Plaza,Violation Type,Fine (MMK),Status,Due Date\n';
    violations.forEach((v) => {
      csv += `${v.createdAt.toISOString()},${v.vehicle.plateNumber},${v.vehicle.make} ${v.vehicle.model},${v.event?.plaza?.name || ''},${v.violationType},${v.fineAmount},${v.status},${v.dueDate.toISOString()}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=violations-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

router.get('/transactions/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = { status: 'COMPLETED' };
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        account: { include: { user: true } },
        event: { include: { vehicle: true, plaza: true, rfidTag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Transactions');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Transaction ID', key: 'id', width: 36 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Vehicle', key: 'vehicle', width: 25 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Gate Code', key: 'gateCode', width: 12 },
      { header: 'Lane', key: 'lane', width: 8 },
      { header: 'Direction', key: 'direction', width: 10 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Account Holder', key: 'account', width: 20 },
      { header: 'RFID Tag', key: 'rfid', width: 25 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    transactions.forEach((t) => {
      sheet.addRow({
        date: t.createdAt.toISOString(),
        id: t.id,
        plate: t.event?.vehicle?.plateNumber || '',
        vehicle: `${t.event?.vehicle?.make || ''} ${t.event?.vehicle?.model || ''}`,
        plaza: t.event?.plaza?.name || '',
        gateCode: t.event?.plaza?.gateCode || '',
        lane: t.event?.laneNumber || '',
        direction: t.event?.direction || '',
        amount: Number(t.amount),
        type: t.type,
        status: t.status,
        account: t.account?.user?.name || '',
        rfid: t.event?.rfidTag?.tagUid || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
});

router.get('/violations/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
    }

    const violations = await prisma.violation.findMany({
      where,
      include: {
        vehicle: true,
        event: { include: { plaza: true, rfidTag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Violations');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Violation ID', key: 'id', width: 36 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Vehicle', key: 'vehicle', width: 25 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Lane', key: 'lane', width: 8 },
      { header: 'Violation Type', key: 'type', width: 22 },
      { header: 'Fine (MMK)', key: 'fine', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'RFID Tag', key: 'rfid', width: 25 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC000' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FF000000' } };

    violations.forEach((v) => {
      sheet.addRow({
        date: v.createdAt.toISOString(),
        id: v.id,
        plate: v.vehicle.plateNumber,
        vehicle: `${v.vehicle.make} ${v.vehicle.model}`,
        plaza: v.event?.plaza?.name || '',
        lane: v.event?.laneNumber || '',
        type: v.violationType,
        fine: Number(v.fineAmount),
        status: v.status,
        dueDate: v.dueDate.toISOString(),
        rfid: v.event?.rfidTag?.tagUid || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=violations-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
});

router.get('/events/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = {};
    if (startDate && endDate) {
      where.entryTime = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
    }

    const events = await prisma.tollEvent.findMany({
      where,
      include: {
        vehicle: true,
        plaza: true,
        rfidTag: true,
        transaction: true,
      },
      orderBy: { entryTime: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Toll Events');
    sheet.columns = [
      { header: 'Entry Time', key: 'entryTime', width: 20 },
      { header: 'Exit Time', key: 'exitTime', width: 20 },
      { header: 'Event ID', key: 'id', width: 36 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Vehicle', key: 'vehicle', width: 25 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Gate Code', key: 'gateCode', width: 12 },
      { header: 'Lane', key: 'lane', width: 8 },
      { header: 'Direction', key: 'direction', width: 10 },
      { header: 'ANPR Plate', key: 'anpr', width: 15 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
      { header: 'RFID Tag', key: 'rfid', width: 25 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    events.forEach((e) => {
      sheet.addRow({
        entryTime: e.entryTime.toISOString(),
        exitTime: e.exitTime?.toISOString() || '',
        id: e.id,
        plate: e.vehicle.plateNumber,
        vehicle: `${e.vehicle.make} ${e.vehicle.model}`,
        plaza: e.plaza.name,
        gateCode: e.plaza.gateCode || '',
        lane: e.laneNumber || '',
        direction: e.direction || '',
        anpr: e.anprPlate || '',
        amount: Number(e.amount || e.transaction?.amount || 0),
        status: e.status,
        rfid: e.rfidTag?.tagUid || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=toll-events-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
});

router.get('/revenue/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    const where: any = { status: 'COMPLETED' };
    if (startDate && endDate) {
      where.createdAt = { gte: new Date(startDate as string), lte: new Date(endDate as string) };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        event: { include: { plaza: true, vehicle: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Gate Code', key: 'gateCode', width: 12 },
      { header: 'Vehicle Class', key: 'vehicleClass', width: 15 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Type', key: 'type', width: 12 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    transactions.forEach((t) => {
      sheet.addRow({
        date: t.createdAt.toISOString(),
        plate: t.event?.vehicle?.plateNumber || '',
        plaza: t.event?.plaza?.name || '',
        gateCode: t.event?.plaza?.gateCode || '',
        vehicleClass: t.event?.vehicle?.vehicleClass || '',
        amount: Number(t.amount),
        type: t.type,
        status: t.status,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate Excel report' });
  }
});

router.get('/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const [totalVehicles, totalRevenue, activeViolations, totalEvents] = await Promise.all([
      prisma.vehicle.count(),
      prisma.transaction.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      prisma.violation.count({ where: { status: { not: 'PAID' } } }),
      prisma.tollEvent.count(),
    ]);

    res.json({
      totalVehicles,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeViolations,
      totalEvents,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/revenue/transfers', authMiddleware, async (req: Request, res: Response) => {
  try {
    const data = await getRevenueTransfersOverview();
    res.json(data);
  } catch (error) {
    console.error('Error fetching revenue transfers:', error);
    res.status(500).json({ error: 'Failed to fetch revenue transfers' });
  }
});

router.post('/revenue/transfers/confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, plazaId, plazaName, amount, tripCount, bankName, refNumber, transferredBy, notes } = req.body;
    if (!date || !plazaId) {
      res.status(400).json({ error: 'date and plazaId are required' });
      return;
    }

    const record = await confirmRevenueTransfer({
      date,
      plazaId,
      plazaName,
      amount: Number(amount) || 0,
      tripCount: Number(tripCount) || 0,
      bankName,
      refNumber,
      transferredBy: transferredBy || (req as any).user?.name || 'Authorized Supervisor',
      notes,
    });

    res.json({ success: true, record });
  } catch (error) {
    console.error('Error confirming revenue transfer:', error);
    res.status(500).json({ error: 'Failed to confirm revenue transfer' });
  }
});

router.post('/revenue/transfers/batch-confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, plazaIds, bankName, refNumberPrefix } = req.body;
    if (!date || !Array.isArray(plazaIds) || plazaIds.length === 0) {
      res.status(400).json({ error: 'date and plazaIds array are required' });
      return;
    }

    const overview = await getRevenueTransfersOverview();
    const results = [];

    for (const plazaId of plazaIds) {
      const plazaData = overview.plazas.find((p) => p.plazaId === plazaId);
      const record = await confirmRevenueTransfer({
        date,
        plazaId,
        plazaName: plazaData?.plazaName,
        amount: plazaData?.previousDayRevenue || 0,
        tripCount: plazaData?.previousDayTrips || 0,
        bankName: bankName || 'KBZ Corporate Central Settlement',
        refNumber: `${refNumberPrefix || 'BATCH-DEP'}-${Math.floor(100000 + Math.random() * 900000)}`,
        transferredBy: (req as any).user?.name || 'HQ Treasury Admin',
        notes: 'Batch settlement auto-approved via central console',
      });
      results.push(record);
    }

    res.json({ success: true, count: results.length, records: results });
  } catch (error) {
    console.error('Error in batch revenue transfer:', error);
    res.status(500).json({ error: 'Failed to batch confirm revenue transfers' });
  }
});

export default router;
