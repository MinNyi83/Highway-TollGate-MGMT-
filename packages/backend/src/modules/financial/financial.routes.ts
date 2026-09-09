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
