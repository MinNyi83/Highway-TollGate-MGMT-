import { Router, Request, Response } from 'express';
import {
  getRegions,
  getRegionSummary,
  getDailyCollections,
  generateDailyCollection,
  getRevenueByRegion,
  getRevenueByPlaza,
  getFiscalYearSummary,
  getTopupByRegion,
  getTopupSummary,
  getVehiclesByRegion,
  getTollUsageByPlaza,
  getSettlements,
  confirmSettlement,
  batchConfirmSettlement,
  getReconciliations,
  submitReconciliation,
  approveReconciliation,
  rejectReconciliation,
  getReceipts,
  getFiscalYearExcel,
} from './financial.service';
import { authMiddleware } from '../../middleware/auth';
import ExcelJS from 'exceljs';

const router = Router();

async function logFinancialAudit(action: string, entityType: string, entityId: string | null, performedBy: string, details: any, ipAddress?: string) {
  try {
    const { hqPrisma } = await import('../../config/database');
    await hqPrisma.financialAuditLog.create({
      data: { action, entityType, entityId, performedBy, details: details || {}, ipAddress },
    });
  } catch {}
}

router.get('/regions', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const regions = await getRegions();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
});

router.get('/regions/:id/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const summary = await getRegionSummary(req.params.id);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch region summary' });
  }
});

router.get('/daily-collection', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, regionId, plazaId } = req.query;
    const collections = await getDailyCollections(
      date as string | undefined,
      regionId as string | undefined,
      plazaId as string | undefined
    );
    res.json(collections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch daily collections' });
  }
});

router.post('/daily-collection/generate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    if (!date) {
      res.status(400).json({ error: 'date is required' });
      return;
    }
    const results = await generateDailyCollection(date);
    res.status(201).json({ success: true, generated: results.length, collections: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate daily collections' });
  }
});

router.get('/revenue/by-region', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }
    const data = await getRevenueByRegion(startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue by region' });
  }
});

router.get('/revenue/by-plaza', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { regionId, startDate, endDate } = req.query;
    if (!regionId || !startDate || !endDate) {
      res.status(400).json({ error: 'regionId, startDate, and endDate are required' });
      return;
    }
    const data = await getRevenueByPlaza(regionId as string, startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue by plaza' });
  }
});

router.get('/revenue/fiscal-year', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, regionId } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }
    const data = await getFiscalYearSummary(
      parseInt(fiscalYear as string, 10),
      regionId as string | undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fiscal year revenue' });
  }
});

router.get('/revenue/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    const { hqPrisma: prisma } = await import('../../config/database');
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'DEBIT',
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end },
      },
      include: {
        event: { include: { plaza: true, vehicle: true } },
        account: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Revenue');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Transaction ID', key: 'id', width: 36 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Vehicle', key: 'vehicle', width: 25 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Gate Code', key: 'gateCode', width: 12 },
      { header: 'Vehicle Class', key: 'vehicleClass', width: 15 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Account Holder', key: 'account', width: 20 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    transactions.forEach((t) => {
      sheet.addRow({
        date: t.createdAt.toISOString(),
        id: t.id,
        plate: t.event?.vehicle?.plateNumber || '',
        vehicle: `${t.event?.vehicle?.make || ''} ${t.event?.vehicle?.model || ''}`,
        plaza: t.event?.plaza?.name || '',
        gateCode: t.event?.plaza?.gateCode || '',
        vehicleClass: t.event?.vehicle?.vehicleClass || '',
        amount: Number(t.amount),
        account: t.account?.user?.name || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate revenue Excel' });
  }
});

router.get('/topup/by-region', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }
    const data = await getTopupByRegion(startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposits by region' });
  }
});

router.get('/topup/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }
    const data = await getTopupSummary(startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposit summary' });
  }
});

router.get('/topup/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    const { hqPrisma: prisma } = await import('../../config/database');
    const transactions = await prisma.transaction.findMany({
      where: {
        type: 'TOPUP',
        status: 'COMPLETED',
        createdAt: { gte: start, lte: end },
      },
      include: {
        account: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Wallet Deposits');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Transaction ID', key: 'id', width: 36 },
      { header: 'Account Holder', key: 'account', width: 25 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Payment Method', key: 'method', width: 15 },
      { header: 'Description', key: 'desc', width: 30 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF70AD47' } };

    transactions.forEach((t) => {
      sheet.addRow({
        date: t.createdAt.toISOString(),
        id: t.id,
        account: t.account?.user?.name || '',
        amount: Number(t.amount),
        method: t.paymentMethod || '',
        desc: t.description || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=wallet-deposits-report.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate deposits Excel' });
  }
});

router.get('/vehicles/by-region', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { regionId, status } = req.query;
    const data = await getVehiclesByRegion(
      regionId as string | undefined,
      status as string | undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vehicle counts' });
  }
});

router.get('/toll-usage/:plazaId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'startDate and endDate are required' });
      return;
    }
    const data = await getTollUsageByPlaza(req.params.plazaId, startDate as string, endDate as string);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch toll usage report' });
  }
});

router.get('/settlement', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, regionId, status } = req.query;
    const data = await getSettlements(
      startDate as string | undefined,
      endDate as string | undefined,
      regionId as string | undefined,
      status as string | undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settlements' });
  }
});

router.post('/settlement/confirm', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { transferId, bankName, depositRef } = req.body;
    if (!transferId || !bankName || !depositRef) {
      res.status(400).json({ error: 'transferId, bankName, and depositRef are required' });
      return;
    }
    const result = await confirmSettlement(transferId, bankName, depositRef);
    await logFinancialAudit('CONFIRM_SETTLEMENT', 'SETTLEMENT', transferId, (req as any).user?.userId || 'system', { bankName, depositRef }, req.ip);
    res.json({ success: true, settlement: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm settlement' });
  }
});

router.post('/settlement/batch', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, plazaIds } = req.body;
    if (!date || !Array.isArray(plazaIds) || plazaIds.length === 0) {
      res.status(400).json({ error: 'date and plazaIds array are required' });
      return;
    }
    const results = await batchConfirmSettlement(date, plazaIds);
    await logFinancialAudit('BATCH_CONFIRM_SETTLEMENT', 'SETTLEMENT', null, (req as any).user?.userId || 'system', { date, plazaIds, count: results.length }, req.ip);
    res.json({ success: true, confirmed: results.length, settlements: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to batch confirm settlements' });
  }
});

router.get('/reconciliation', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, month, regionId, status } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }
    const data = await getReconciliations(
      parseInt(fiscalYear as string, 10),
      month ? parseInt(month as string, 10) : undefined,
      regionId as string | undefined,
      status as string | undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reconciliations' });
  }
});

router.post('/reconciliation/submit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, submittedBy } = req.body;
    if (!id || !submittedBy) {
      res.status(400).json({ error: 'id and submittedBy are required' });
      return;
    }
    const result = await submitReconciliation(id, submittedBy);
    await logFinancialAudit('SUBMIT_RECONCILIATION', 'RECONCILIATION', id, submittedBy, { submittedBy }, req.ip);
    res.json({ success: true, reconciliation: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit reconciliation' });
  }
});

router.post('/reconciliation/approve', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, approvedBy, notes } = req.body;
    if (!id || !approvedBy) {
      res.status(400).json({ error: 'id and approvedBy are required' });
      return;
    }
    const result = await approveReconciliation(id, approvedBy, notes);
    await logFinancialAudit('APPROVE_RECONCILIATION', 'RECONCILIATION', id, approvedBy, { approvedBy, notes }, req.ip);
    res.json({ success: true, reconciliation: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve reconciliation' });
  }
});

router.post('/reconciliation/reject', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id, approvedBy, reason } = req.body;
    if (!id || !approvedBy || !reason) {
      res.status(400).json({ error: 'id, approvedBy, and reason are required' });
      return;
    }
    const result = await rejectReconciliation(id, approvedBy, reason);
    await logFinancialAudit('REJECT_RECONCILIATION', 'RECONCILIATION', id, approvedBy, { approvedBy, reason }, req.ip);
    res.json({ success: true, reconciliation: result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject reconciliation' });
  }
});

router.get('/receipts', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, regionId, plazaId, page, limit } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }
    const data = await getReceipts(
      parseInt(fiscalYear as string, 10),
      regionId as string | undefined,
      plazaId as string | undefined,
      page ? parseInt(page as string, 10) : 1,
      limit ? parseInt(limit as string, 10) : 50
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

router.get('/receipts/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, regionId, plazaId } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }

    const where: any = { fiscalYear: parseInt(fiscalYear as string, 10) };
    if (regionId) where.regionId = regionId;
    if (plazaId) where.plazaId = plazaId;

    const { hqPrisma: prisma } = await import('../../config/database');
    const receipts = await prisma.officialReceipt.findMany({
      where,
      include: {
        account: { include: { user: true } },
        region: true,
        plaza: true,
        transaction: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Official Receipts');
    sheet.columns = [
      { header: 'Receipt Number', key: 'receiptNumber', width: 25 },
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Account Holder', key: 'account', width: 25 },
      { header: 'Region', key: 'region', width: 20 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Fiscal Year', key: 'fy', width: 12 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    receipts.forEach((r) => {
      sheet.addRow({
        receiptNumber: r.receiptNumber,
        date: r.issuedAt.toISOString(),
        account: r.account?.user?.name || '',
        region: r.region?.name || '',
        plaza: r.plaza?.name || '',
        amount: Number(r.amount),
        fy: r.fiscalYear,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=official-receipts.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate receipts Excel' });
  }
});

router.get('/fiscal-year/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, regionId } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }
    const data = await getFiscalYearSummary(
      parseInt(fiscalYear as string, 10),
      regionId as string | undefined
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fiscal year summary' });
  }
});

router.get('/fiscal-year/excel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { fiscalYear, regionId } = req.query;
    if (!fiscalYear) {
      res.status(400).json({ error: 'fiscalYear is required' });
      return;
    }

    const data = await getFiscalYearExcel(
      parseInt(fiscalYear as string, 10),
      regionId as string | undefined
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Fiscal Year Revenue');
    sheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Transaction ID', key: 'id', width: 36 },
      { header: 'Plate Number', key: 'plate', width: 15 },
      { header: 'Plaza', key: 'plaza', width: 20 },
      { header: 'Gate Code', key: 'gateCode', width: 12 },
      { header: 'Vehicle Class', key: 'vehicleClass', width: 15 },
      { header: 'Amount (MMK)', key: 'amount', width: 15 },
      { header: 'Account Holder', key: 'account', width: 20 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };

    data.forEach((row) => {
      sheet.addRow({
        date: row.date.toISOString(),
        id: row.transactionId,
        plate: row.plateNumber,
        plaza: row.plazaName,
        gateCode: row.gateCode,
        vehicleClass: row.vehicleClass,
        amount: row.amount,
        account: row.accountHolder,
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=fiscal-year-revenue.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate fiscal year Excel' });
  }
});

// Audit logs
router.get('/audit-logs', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const logs = await hqPrisma.financialAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// Comparison reports (MoM, YoY)
router.get('/comparison', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const currentYearData = await hqPrisma.monthlyReconciliation.findMany({
      where: { fiscalYear: currentYear },
      orderBy: { month: 'asc' },
    });
    const lastYearData = await hqPrisma.monthlyReconciliation.findMany({
      where: { fiscalYear: lastYear },
      orderBy: { month: 'asc' },
    });
    
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const comparison = monthNames.map((name, i) => {
      const current = currentYearData.find(d => d.month === i + 1);
      const previous = lastYearData.find(d => d.month === i + 1);
      return {
        month: name,
        currentRevenue: Number(current?.totalRevenue || 0),
        previousRevenue: Number(previous?.totalRevenue || 0),
        growth: current && previous 
          ? ((Number(current.totalRevenue) - Number(previous.totalRevenue)) / Number(previous.totalRevenue) * 100).toFixed(1)
          : '0',
      };
    });
    
    res.json(comparison);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comparison data' });
  }
});

// Plaza Performance Comparison
router.get('/plaza-performance', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const events = await (hqPrisma.tollEvent as any).groupBy({
      by: ['plazaId'],
      where: { entryTime: { gte: start, lte: end } },
      _count: { id: true },
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const plazas = await hqPrisma.tollPlaza.findMany({
      select: { id: true, name: true, mileMarker: true },
    });

    const plazaMap = Object.fromEntries(plazas.map(p => [p.id, p]));

    const performance = events.map(e => ({
      plazaId: e.plazaId,
      plazaName: plazaMap[e.plazaId]?.name || 'Unknown',
      mileMarker: plazaMap[e.plazaId]?.mileMarker || 0,
      totalTrips: e._count.id,
      totalRevenue: Number(e._sum.amount || 0),
      avgPerTrip: e._count.id > 0 ? Number(e._sum.amount || 0) / e._count.id : 0,
    }));

    res.json(performance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plaza performance' });
  }
});

// Violation Analytics
router.get('/violations', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const violations = await hqPrisma.violation.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { event: { include: { plaza: { include: { region: true } } } } },
    });

    const byTypeMap = new Map<string, { count: number; totalFine: number }>();
    const byRegionMap = new Map<string, { count: number; totalFine: number }>();

    for (const v of violations) {
      const type = v.violationType;
      const regionName = v.event?.plaza?.region?.name || 'Unknown';
      const fine = Number(v.fineAmount);

      if (!byTypeMap.has(type)) byTypeMap.set(type, { count: 0, totalFine: 0 });
      const typeEntry = byTypeMap.get(type)!;
      typeEntry.count++;
      typeEntry.totalFine += fine;

      if (!byRegionMap.has(regionName)) byRegionMap.set(regionName, { count: 0, totalFine: 0 });
      const regionEntry = byRegionMap.get(regionName)!;
      regionEntry.count++;
      regionEntry.totalFine += fine;
    }

    const totalViolations = violations.length;
    const totalFines = violations.reduce((sum, v) => sum + Number(v.fineAmount), 0);

    res.json({
      summary: { totalViolations, totalFines },
      byType: Array.from(byTypeMap.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        totalFine: data.totalFine,
        percentage: totalViolations > 0 ? ((data.count / totalViolations) * 100).toFixed(1) : '0',
      })).sort((a, b) => b.count - a.count),
      byRegion: Array.from(byRegionMap.entries()).map(([regionName, data]) => ({
        regionName,
        count: data.count,
        totalFine: data.totalFine,
      })).sort((a, b) => b.count - a.count),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch violation analytics' });
  }
});

// Revenue Forecast (simple linear projection)
router.get('/forecast', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const months = parseInt(req.query.months as string) || 6;

    const historical = await hqPrisma.monthlyReconciliation.findMany({
      orderBy: [{ fiscalYear: 'asc' }, { month: 'asc' }],
      take: 24,
    });

    if (historical.length < 2) {
      res.json({ forecast: [], historical: [] });
      return;
    }

    const values = historical.map(h => Number(h.totalRevenue));
    const n = values.length;
    const avg = values.reduce((a, b) => a + b, 0) / n;
    const trend = (values[n - 1] - values[0]) / n;

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const lastDate = historical[historical.length - 1];
    let forecastMonth = lastDate.month;
    let forecastYear = lastDate.fiscalYear;

    const forecast = [];
    for (let i = 1; i <= months; i++) {
      forecastMonth++;
      if (forecastMonth > 12) { forecastMonth = 1; forecastYear++; }
      forecast.push({
        month: monthNames[forecastMonth - 1],
        year: forecastYear,
        projected: Math.max(0, Math.round(avg + trend * (n + i))),
        confidence: Math.max(50, 95 - i * 8),
      });
    }

    res.json({
      forecast,
      historical: historical.map(h => ({
        month: monthNames[h.month - 1],
        year: h.fiscalYear,
        actual: Number(h.totalRevenue),
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
});

// Revenue Heatmap (hourly/daily patterns)
router.get('/heatmap', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { days } = req.query;
    const numDays = parseInt(days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);

    const events = await hqPrisma.tollEvent.findMany({
      where: { entryTime: { gte: startDate } },
      select: { entryTime: true, amount: true },
    });

    const hourlyByDay = Array.from({ length: 7 }, () => Array(24).fill(0));
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (const event of events) {
      const day = event.entryTime.getDay();
      const hour = event.entryTime.getHours();
      hourlyByDay[day][hour] += Number(event.amount || 0);
    }

    const heatmap = dayNames.map((day, dayIndex) => ({
      day,
      dayIndex,
      hours: hourlyByDay[dayIndex].map((revenue, hour) => ({
        hour,
        revenue: Math.round(revenue),
        label: `${hour}:00`,
      })),
    }));

    const totalRevenue = events.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const peakHour = events.length > 0 ? (() => {
      const hourCounts = Array(24).fill(0);
      events.forEach(e => hourCounts[e.entryTime.getHours()]++);
      return hourCounts.indexOf(Math.max(...hourCounts));
    })() : 0;

    const peakDay = events.length > 0 ? (() => {
      const dayCounts = Array(7).fill(0);
      events.forEach(e => dayCounts[e.entryTime.getDay()]++);
      return dayNames[dayCounts.indexOf(Math.max(...dayCounts))];
    })() : 'N/A';

    res.json({ heatmap, totalRevenue, peakHour, peakDay, totalEvents: events.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate heatmap' });
  }
});

// Transaction Search
router.get('/transactions', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { plate, plazaId, startDate, endDate, page = '1', limit = '50' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (plate) where.anprPlate = { contains: plate as string, mode: 'insensitive' };
    if (plazaId) where.plazaId = plazaId as string;
    if (startDate || endDate) {
      where.entryTime = {};
      if (startDate) where.entryTime.gte = new Date(startDate as string);
      if (endDate) where.entryTime.lte = new Date(endDate as string);
    }

    const [transactions, total] = await Promise.all([
      hqPrisma.tollEvent.findMany({
        where,
        include: { vehicle: true, plaza: true },
        orderBy: { entryTime: 'desc' },
        skip,
        take: limitNum,
      }),
      hqPrisma.tollEvent.count({ where }),
    ]);

    res.json({
      data: transactions.map(t => ({
        id: t.id,
        plate: t.anprPlate,
        vehicleClass: t.vehicle?.vehicleClass,
        plaza: t.plaza?.name,
        entryTime: t.entryTime,
        exitTime: t.exitTime,
        amount: Number(t.amount || 0),
        status: t.status,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to search transactions' });
  }
});

// Settlement Pipeline
router.get('/settlement-pipeline', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');

    const [pending, confirmed, allTime] = await Promise.all([
      hqPrisma.revenueTransfer.count({ where: { status: 'PENDING' } }),
      hqPrisma.revenueTransfer.count({ where: { status: 'CONFIRMED' } }),
      hqPrisma.revenueTransfer.count(),
    ]);

    const totalPending = await hqPrisma.revenueTransfer.aggregate({
      where: { status: 'PENDING' },
      _sum: { amount: true },
    });

    const totalConfirmed = await hqPrisma.revenueTransfer.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: { amount: true },
    });

    const recentTransfers = await hqPrisma.revenueTransfer.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const byStatus = [
      { status: 'PENDING', count: pending, amount: Number(totalPending._sum.amount || 0) },
      { status: 'CONFIRMED', count: confirmed, amount: Number(totalConfirmed._sum.amount || 0) },
    ];

    res.json({
      summary: { pending, confirmed, total: allTime },
      byStatus,
      recentTransfers: recentTransfers.map(t => ({
        id: t.id,
        amount: Number(t.amount || 0),
        status: t.status,
        createdAt: t.createdAt,
        confirmedAt: t.confirmedAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settlement pipeline' });
  }
});

// Wallet Analytics
router.get('/wallet-analytics', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');

    const accounts = await hqPrisma.account.findMany({
      select: { id: true, balance: true, customerType: true, userId: true },
    });

    const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);
    const avgBalance = accounts.length > 0 ? totalBalance / accounts.length : 0;

    const byType = new Map<string, { count: number; totalBalance: number }>();
    for (const acc of accounts) {
      const type = acc.customerType || 'INDIVIDUAL';
      if (!byType.has(type)) byType.set(type, { count: 0, totalBalance: 0 });
      const entry = byType.get(type)!;
      entry.count++;
      entry.totalBalance += Number(acc.balance || 0);
    }

    res.json({
      summary: {
        totalAccounts: accounts.length,
        totalBalance,
        avgBalance,
      },
      byType: Array.from(byType.entries()).map(([type, data]) => ({
        type,
        count: data.count,
        totalBalance: data.totalBalance,
      })),
      topUpTrend: [],
      recentTopUps: [],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch wallet analytics' });
  }
});

// Revenue by Vehicle Type
router.get('/revenue-by-vehicle', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const events = await hqPrisma.tollEvent.findMany({
      where: { entryTime: { gte: start, lte: end } },
      include: { vehicle: true },
    });

    const byVehicle = new Map<string, { trips: number; revenue: number }>();
    for (const event of events) {
      const vehicleClass = event.vehicle?.vehicleClass || 'UNKNOWN';
      if (!byVehicle.has(vehicleClass)) byVehicle.set(vehicleClass, { trips: 0, revenue: 0 });
      const entry = byVehicle.get(vehicleClass)!;
      entry.trips++;
      entry.revenue += Number(event.amount || 0);
    }

    const totalRevenue = events.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const result = Array.from(byVehicle.entries())
      .map(([type, data]) => ({
        vehicleType: type,
        trips: data.trips,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : '0',
        avgPerTrip: data.trips > 0 ? data.revenue / data.trips : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json({ vehicleTypes: result, totalRevenue, totalTrips: events.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue by vehicle type' });
  }
});

// Customer Spending Dashboard
router.get('/customer-spending', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const events = await hqPrisma.tollEvent.findMany({
      where: { entryTime: { gte: start, lte: end } },
      include: { vehicle: true },
    });

    const byVehicle = new Map<string, { trips: number; totalSpent: number }>();
    for (const event of events) {
      const plate = event.anprPlate || 'UNKNOWN';
      if (!byVehicle.has(plate)) byVehicle.set(plate, { trips: 0, totalSpent: 0 });
      const entry = byVehicle.get(plate)!;
      entry.trips++;
      entry.totalSpent += Number(event.amount || 0);
    }

    const customers = Array.from(byVehicle.entries())
      .map(([plate, data]) => ({
        plate,
        trips: data.trips,
        totalSpent: data.totalSpent,
        avgPerTrip: data.trips > 0 ? data.totalSpent / data.trips : 0,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent);

    const top10 = customers.slice(0, 10);
    const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgSpendPerCustomer = customers.length > 0 ? totalSpent / customers.length : 0;

    res.json({
      summary: {
        totalCustomers: customers.length,
        totalSpent,
        avgSpendPerCustomer,
      },
      top10,
      allCustomers: customers,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customer spending' });
  }
});

// Revenue by Payment Method
router.get('/revenue-by-payment', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const transactions = await hqPrisma.transaction.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { event: true },
    });

    const byMethod = new Map<string, { count: number; revenue: number }>();
    for (const t of transactions) {
      const method = t.type || 'UNKNOWN';
      if (!byMethod.has(method)) byMethod.set(method, { count: 0, revenue: 0 });
      const entry = byMethod.get(method)!;
      entry.count++;
      entry.revenue += Number(t.amount || 0);
    }

    const totalRevenue = transactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const result = Array.from(byMethod.entries())
      .map(([method, data]) => ({
        method,
        count: data.count,
        revenue: data.revenue,
        percentage: totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : '0',
      }))
      .sort((a, b) => b.revenue - a.revenue);

    res.json({ methods: result, totalRevenue, totalTransactions: transactions.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue by payment method' });
  }
});

// Customer Loyalty Analytics
router.get('/loyalty-analytics', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');

    const loyaltyPoints = await hqPrisma.loyaltyPoints.findMany({
      select: { id: true, points: true, accountId: true, createdAt: true },
    });

    const totalPoints = loyaltyPoints.reduce((sum, l) => sum + (l.points || 0), 0);
    const avgPoints = loyaltyPoints.length > 0 ? totalPoints / loyaltyPoints.length : 0;

    const byAccount = new Map<string, number>();
    for (const l of loyaltyPoints) {
      byAccount.set(l.accountId, (byAccount.get(l.accountId) || 0) + (l.points || 0));
    }

    const topAccounts = Array.from(byAccount.entries())
      .map(([accountId, points]) => ({ accountId, points }))
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);

    res.json({
      summary: {
        totalAccounts: byAccount.size,
        totalPoints,
        avgPoints,
      },
      topAccounts,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch loyalty analytics' });
  }
});

// Financial Reports Generator
router.get('/reports/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const { startDate, endDate, regionId } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
    const end = endDate ? new Date(endDate as string) : new Date();

    const where: any = { entryTime: { gte: start, lte: end } };
    if (regionId) {
      where.plaza = { regionId: regionId as string };
    }

    const [events, violations, transactions] = await Promise.all([
      hqPrisma.tollEvent.findMany({ where, include: { plaza: true } }),
      hqPrisma.violation.findMany({ where: { createdAt: { gte: start, lte: end } } }),
      hqPrisma.transaction.findMany({ where: { createdAt: { gte: start, lte: end } } }),
    ]);

    const totalRevenue = events.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const totalFines = violations.reduce((sum, v) => sum + Number(v.fineAmount || 0), 0);
    const totalTransactions = transactions.length;

    const byRegion = new Map<string, { trips: number; revenue: number }>();
    for (const event of events) {
      const region = event.plaza?.name || 'Unknown';
      if (!byRegion.has(region)) byRegion.set(region, { trips: 0, revenue: 0 });
      const entry = byRegion.get(region)!;
      entry.trips++;
      entry.revenue += Number(event.amount || 0);
    }

    res.json({
      period: { start, end },
      summary: {
        totalRevenue,
        totalFines,
        totalTransactions,
        totalTrips: events.length,
      },
      byRegion: Array.from(byRegion.entries()).map(([region, data]) => ({
        region,
        trips: data.trips,
        revenue: data.revenue,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate financial report' });
  }
});

// Financial Alerts
router.get('/alerts', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const alerts = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayEvents = await hqPrisma.tollEvent.count({
      where: { entryTime: { gte: today } },
    });
    const yesterdayEvents = await hqPrisma.tollEvent.count({
      where: { entryTime: { gte: yesterday, lt: today } },
    });

    if (yesterdayEvents > 0) {
      const change = ((todayEvents - yesterdayEvents) / yesterdayEvents * 100).toFixed(1);
      if (Number(change) < -20) {
        alerts.push({ level: 'warning', message: `Traffic dropped ${change}% from yesterday`, metric: todayEvents, baseline: yesterdayEvents });
      }
    }

    const todayRevenue = await hqPrisma.tollEvent.aggregate({
      where: { entryTime: { gte: today }, amount: { gt: 0 } },
      _sum: { amount: true },
    });
    const yesterdayRevenue = await hqPrisma.tollEvent.aggregate({
      where: { entryTime: { gte: yesterday, lt: today }, amount: { gt: 0 } },
      _sum: { amount: true },
    });

    const todayRev = Number(todayRevenue._sum.amount || 0);
    const yesterdayRev = Number(yesterdayRevenue._sum.amount || 0);
    if (yesterdayRev > 0) {
      const revChange = ((todayRev - yesterdayRev) / yesterdayRev * 100).toFixed(1);
      if (Number(revChange) < -20) {
        alerts.push({ level: 'danger', message: `Revenue dropped ${revChange}% from yesterday`, metric: todayRev, baseline: yesterdayRev });
      }
      if (Number(revChange) > 20) {
        alerts.push({ level: 'success', message: `Revenue up ${revChange}% from yesterday`, metric: todayRev, baseline: yesterdayRev });
      }
    }

    const unsettled = await hqPrisma.revenueTransfer.count({
      where: { status: 'PENDING' },
    });
    if (unsettled > 5) {
      alerts.push({ level: 'warning', message: `${unsettled} unsettled transfers pending`, metric: unsettled });
    }

    const unapproved = await hqPrisma.monthlyReconciliation.count({
      where: { status: 'SUBMITTED' },
    });
    if (unapproved > 3) {
      alerts.push({ level: 'info', message: `${unapproved} reconciliations awaiting approval`, metric: unapproved });
    }

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Dashboard KPI endpoints
router.get('/plazas', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const plazas = await hqPrisma.tollPlaza.findMany({
      select: { id: true, name: true, mileMarker: true, status: true, regionId: true },
    });
    res.json(plazas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plazas' });
  }
});

router.get('/dashboard/kpi', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const totalRevenue = await hqPrisma.dailyCollection.aggregate({ _sum: { totalRevenue: true } });
    const totalTrips = await hqPrisma.dailyCollection.aggregate({ _sum: { totalTrips: true } });
    const violationCount = await hqPrisma.violation.count();
    const totalDeposits = await hqPrisma.dailyCollection.aggregate({ _sum: { totalRevenue: true } });
    res.json({
      totalRevenue: Number(totalRevenue._sum.totalRevenue || 0),
      walletDeposits: Number(totalDeposits._sum.totalRevenue || 0) * 0.6,
      totalTrips: Number(totalTrips._sum.totalTrips || 0),
      violationCount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard KPI' });
  }
});

router.get('/dashboard/revenue-by-region', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const collections = await hqPrisma.dailyCollection.groupBy({
      by: ['regionId'],
      _sum: { totalRevenue: true },
    });
    const regions = await hqPrisma.region.findMany();
    const regionMap = Object.fromEntries(regions.map(r => [r.id, r.name]));
    const data = collections.map(c => ({
      region: regionMap[c.regionId] || 'Unknown',
      revenue: Number(c._sum.totalRevenue || 0),
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue by region' });
  }
});

router.get('/dashboard/deposits-by-region', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const collections = await hqPrisma.dailyCollection.groupBy({
      by: ['regionId'],
      _sum: { totalRevenue: true },
    });
    const regions = await hqPrisma.region.findMany();
    const regionMap = Object.fromEntries(regions.map(r => [r.id, r.name]));
    const data = collections.map(c => ({
      region: regionMap[c.regionId] || 'Unknown',
      deposits: Number(c._sum.totalRevenue || 0) * 0.6,
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deposits by region' });
  }
});

router.get('/dashboard/monthly-trend', authMiddleware, async (_req: Request, res: Response) => {
  try {
    const { hqPrisma } = await import('../../config/database');
    const collections = await hqPrisma.dailyCollection.groupBy({
      by: ['collectionDate'],
      _sum: { totalRevenue: true },
      orderBy: { collectionDate: 'asc' },
    });
    const monthlyData: Record<string, { revenue: number; deposits: number }> = {};
    collections.forEach(c => {
      const month = c.collectionDate.toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { revenue: 0, deposits: 0 };
      monthlyData[month].revenue += Number(c._sum.totalRevenue || 0);
      monthlyData[month].deposits += Number(c._sum.totalRevenue || 0) * 0.6;
    });
    const data = Object.entries(monthlyData).map(([month, values]) => ({
      month,
      revenue: values.revenue,
      deposits: values.deposits,
    }));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch monthly trend' });
  }
});

export default router;
