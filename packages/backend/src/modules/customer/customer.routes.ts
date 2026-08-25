import { Router, Request, Response } from 'express';
import { PrismaClient, CustomerType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import { authMiddleware } from '../../middleware/auth';
import { createSMSService } from '../../services/sms.service';

const prisma = new PrismaClient();
const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerType: user.customerType,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      email, password, name, customerType = 'INDIVIDUAL',
      phone, nrcNumber, drivingLicense,
      companyName, companyRegNo, companyAddress, fleetManagerName,
      smsProvider, smsEnabled,
    } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }

    if (customerType === 'INDIVIDUAL' && !nrcNumber) {
      res.status(400).json({ error: 'NRC number is required for individual customers' });
      return;
    }

    if (customerType === 'ENTERPRISE' && (!companyName || !companyRegNo)) {
      res.status(400).json({ error: 'Company name and registration number are required for enterprise customers' });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        role: 'VIEWER',
        customerType: customerType as CustomerType,
        phone,
        nrcNumber,
        drivingLicense,
        companyName,
        companyRegNo,
        companyAddress,
        fleetManagerName,
        smsProvider,
        smsEnabled: smsEnabled || false,
      },
    });

    const account = await prisma.account.create({
      data: {
        userId: user.id,
        customerType: customerType as CustomerType,
        balance: 0,
        creditLimit: customerType === 'ENTERPRISE' ? 1000 : 0,
        paymentTerms: customerType === 'ENTERPRISE' ? 30 : null,
      },
    });

    const token = generateToken({ userId: user.id, email: user.email, role: user.role });

    if (smsEnabled && smsProvider && phone) {
      const sms = createSMSService(smsProvider, { apiKey: process.env.SMS_API_KEY || '' });
      await sms.sendSMS({
        to: phone,
        message: `Welcome to TollGate, ${name}! Your ${customerType.toLowerCase()} account has been created.`,
        userId: user.id,
      });
    }

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerType: user.customerType,
      },
      account: {
        id: account.id,
        balance: account.balance,
        creditLimit: account.creditLimit,
        paymentTerms: account.paymentTerms,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        customerType: true,
        phone: true,
        nrcNumber: true,
        drivingLicense: true,
        companyName: true,
        companyRegNo: true,
        companyAddress: true,
        fleetManagerName: true,
        smsProvider: true,
        smsEnabled: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const {
      name, phone, nrcNumber, drivingLicense,
      companyName, companyRegNo, companyAddress, fleetManagerName,
      smsProvider, smsEnabled,
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        name, phone, nrcNumber, drivingLicense,
        companyName, companyRegNo, companyAddress, fleetManagerName,
        smsProvider, smsEnabled,
      },
      select: {
        id: true,
        email: true,
        name: true,
        customerType: true,
        phone: true,
        nrcNumber: true,
        drivingLicense: true,
        companyName: true,
        companyRegNo: true,
        companyAddress: true,
        fleetManagerName: true,
        smsProvider: true,
        smsEnabled: true,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/send-sms', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { phone, message, provider } = req.body;
    if (!phone || !message) {
      res.status(400).json({ error: 'Phone and message are required' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    const smsProvider = provider || user?.smsProvider || 'mpt';

    const sms = createSMSService(smsProvider, {
      apiKey: process.env.SMS_API_KEY || '',
      senderId: 'TollGate',
    });

    const result = await sms.sendSMS({
      to: phone,
      message,
      userId: req.user!.userId,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send SMS' });
  }
});

router.get('/sms-history', authMiddleware, async (req: Request, res: Response) => {
  try {
    const logs = await prisma.sMSLog.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
