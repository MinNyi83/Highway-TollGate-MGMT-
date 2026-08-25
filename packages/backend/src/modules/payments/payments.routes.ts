import { Router, Request, Response } from 'express';
import { authMiddleware } from '../../middleware/auth';
import {
  initiateTopUp,
  handlePaymentCallback,
  checkPaymentStatus,
  refundPayment,
  getPaymentMethods,
} from '../../services/payment/payment.service';

const router = Router();

router.post('/topup', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { amount, paymentMethod, description } = req.body;
    if (!amount || amount <= 0) {
      res.status(400).json({ error: 'Invalid amount' });
      return;
    }

    const result = await initiateTopUp({
      userId,
      amount: parseFloat(amount),
      paymentMethod: paymentMethod || 'manual',
      description,
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/status/:transactionId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const status = await checkPaymentStatus(req.params.transactionId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/refund', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { transactionId, amount, reason } = req.body;
    if (!transactionId || !amount) {
      res.status(400).json({ error: 'Transaction ID and amount are required' });
      return;
    }

    const result = await refundPayment(transactionId, parseFloat(amount), reason);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/methods', authMiddleware, async (req: Request, res: Response) => {
  try {
    const methods = getPaymentMethods();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Callback endpoints (no auth required - called by payment providers)
router.post('/kbzpay/callback', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string || '';
    const result = await handlePaymentCallback('kbzpay', req.body, signature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/wavepay/callback', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string || '';
    const result = await handlePaymentCallback('wavepay', req.body, signature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/mmqr/callback', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string || '';
    const result = await handlePaymentCallback('mmqr', req.body, signature);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
