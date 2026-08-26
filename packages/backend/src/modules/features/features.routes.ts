import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { PrismaClient } from '@prisma/client';
import { TwoFactorService } from '../../services/two-factor.service';
import { ReportExportService } from '../../services/report-export.service';
import { BulkOperationsService } from '../../services/bulk-operations.service';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { LoyaltyService, CreditService, WebhookService, AnalyticsService, ReceiptService } from '../../services/extended-features.service';

const router = Router();
const prisma = new PrismaClient();

const twoFactorService = new TwoFactorService(prisma);
const reportExportService = new ReportExportService(prisma);
const bulkOperationsService = new BulkOperationsService(prisma);
const dynamicPricingService = new DynamicPricingService(prisma);
const loyaltyService = new LoyaltyService(prisma);
const creditService = new CreditService(prisma);
const webhookService = new WebhookService(prisma);
const analyticsService = new AnalyticsService(prisma);
const receiptService = new ReceiptService(prisma);

// ==================== TWO-FACTOR AUTHENTICATION ====================

router.post('/2fa/setup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const setup = await twoFactorService.generateSecret(userId, user.email);
    res.json(setup);
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup 2FA' });
  }
});

router.post('/2fa/verify', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;

    if (!userId || !token) {
      res.status(400).json({ error: 'Token required' });
      return;
    }

    const enabled = await twoFactorService.verifyAndEnable(userId, token);
    res.json({ enabled });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify 2FA' });
  }
});

router.post('/2fa/disable', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { token } = req.body;

    if (!userId || !token) {
      res.status(400).json({ error: 'Token required' });
      return;
    }

    const disabled = await twoFactorService.disable(userId, token);
    res.json({ disabled });
  } catch (error) {
    res.status(500).json({ error: 'Failed to disable 2FA' });
  }
});

router.get('/2fa/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const status = await twoFactorService.getStatus(userId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get 2FA status' });
  }
});

router.post('/2fa/backup-codes', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const codes = await twoFactorService.regenerateBackupCodes(userId);
    res.json({ backupCodes: codes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to regenerate backup codes' });
  }
});

// ==================== REPORT EXPORT ====================

router.get('/reports/export', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { format, type, startDate, endDate } = req.query;

    const options = {
      format: (format as 'pdf' | 'excel') || 'pdf',
      type: (type as 'revenue' | 'trips' | 'violations' | 'fleet') || 'revenue',
      startDate: new Date(startDate as string || Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(endDate as string || Date.now()),
    };

    const buffer = await reportExportService.generateReport(options);

    const contentType = format === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf';

    const filename = `${type}-report.${format === 'excel' ? 'xlsx' : 'pdf'}`;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export report' });
  }
});

// ==================== BULK OPERATIONS ====================

router.post('/bulk/import-vehicles', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { csvContent, accountId } = req.body;

    if (!csvContent || !accountId) {
      res.status(400).json({ error: 'CSV content and account ID required' });
      return;
    }

    const result = await bulkOperationsService.importVehiclesFromCSV(csvContent, accountId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to import vehicles' });
  }
});

router.post('/bulk/topup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { topUps, description } = req.body;

    if (!topUps || !Array.isArray(topUps)) {
      res.status(400).json({ error: 'Top-ups array required' });
      return;
    }

    const result = await bulkOperationsService.bulkTopUp(topUps, description);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to process bulk top-up' });
  }
});

router.get('/bulk/template/:type', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const template = await bulkOperationsService.generateCSVTemplate(type as 'vehicles' | 'topup');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-template.csv"`);
    res.send(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

router.get('/bulk/export/:type', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    let csv: string;

    if (type === 'vehicles') {
      csv = await bulkOperationsService.exportVehiclesToCSV();
    } else {
      const { startDate, endDate } = req.query;
      csv = await bulkOperationsService.exportTransactionsToCSV(
        new Date(startDate as string || Date.now() - 30 * 24 * 60 * 60 * 1000),
        new Date(endDate as string || Date.now())
      );
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-export.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// ==================== DYNAMIC PRICING ====================

router.post('/pricing/calculate', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plazaId, vehicleClass, baseRate, timestamp } = req.body;

    if (!plazaId || !vehicleClass || !baseRate) {
      res.status(400).json({ error: 'Plaza ID, vehicle class, and base rate required' });
      return;
    }

    const result = await dynamicPricingService.calculateToll(
      plazaId,
      vehicleClass,
      baseRate,
      timestamp ? new Date(timestamp) : undefined
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

router.get('/pricing/preview', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { plazaId, vehicleClass, baseRate, date } = req.query;

    const result = await dynamicPricingService.getPricingPreview(
      plazaId as string,
      vehicleClass as string,
      parseFloat(baseRate as string),
      new Date(date as string || Date.now())
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pricing preview' });
  }
});

router.get('/pricing/rules', authMiddleware, async (req: Request, res: Response) => {
  try {
    const rules = dynamicPricingService.getPricingRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get pricing rules' });
  }
});

// ==================== LOYALTY & DISCOUNTS ====================

router.post('/loyalty/discount', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { amount, promoCode } = req.body;

    if (!userId || !amount) {
      res.status(400).json({ error: 'Amount required' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user || !user.accounts[0]) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const result = await loyaltyService.applyDiscount(
      user.accounts[0].id,
      amount,
      promoCode
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to apply discount' });
  }
});

router.post('/promo-codes', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { code, type, value, maxUses, validDays } = req.body;

    const promoCode = await loyaltyService.createPromoCode(
      code,
      type,
      value,
      maxUses,
      validDays
    );

    res.json(promoCode);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create promo code' });
  }
});

// ==================== CREDIT SYSTEM ====================

router.get('/credit/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user || !user.accounts[0]) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const status = await creditService.getCreditStatus(user.accounts[0].id);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get credit status' });
  }
});

router.post('/credit/limit', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { accountId, limit } = req.body;

    await creditService.setCreditLimit(accountId, limit);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set credit limit' });
  }
});

// ==================== WEBHOOKS ====================

router.post('/webhooks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { url, events, secret } = req.body;

    const webhook = await webhookService.registerWebhook(url, events, secret);
    res.json(webhook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register webhook' });
  }
});

router.get('/webhooks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const webhooks = await webhookService.getWebhooks();
    res.json(webhooks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get webhooks' });
  }
});

router.delete('/webhooks/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    await webhookService.deleteWebhook(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete webhook' });
  }
});

// ==================== ANALYTICS ====================

router.get('/analytics', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    const analytics = await analyticsService.getAnalytics(
      new Date(startDate as string || Date.now() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate as string || Date.now())
    );

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

// ==================== RECEIPTS ====================

router.get('/receipts/:transactionId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const receipt = await receiptService.generateReceipt(req.params.transactionId);
    res.json(receipt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate receipt' });
  }
});

export default router;
