import { PrismaClient } from '@prisma/client';
import {
  PaymentProvider,
  PaymentConfig,
  CreatePaymentRequest,
  PaymentResponse,
  PaymentStatus,
  RefundRequest,
  RefundResponse,
  generateOrderId,
} from './providers.types';
import { KBZPayProvider } from './kbzpay.provider';
import { WaveMoneyProvider } from './wavemoney.provider';
import { MMQRProvider } from './mmqr.provider';
import {
  generateMMQRPayload,
  generateKBZPayPayload,
  generateWavePayPayload,
  generateQRCodeBase64,
  MERCHANT_CONFIG,
} from './mmqr-qr';

const prisma = new PrismaClient();

interface PaymentProviderConfig {
  kbzpay: PaymentConfig;
  wavepay: PaymentConfig;
  mmqr: PaymentConfig;
}

const providerConfigs: PaymentProviderConfig = {
  kbzpay: {
    merchantId: process.env.KBZ_PAY_MERCHANT_ID || '',
    appId: process.env.KBZ_PAY_APP_ID || '',
    secretKey: process.env.KBZ_PAY_SECRET_KEY || '',
    publicKey: process.env.KBZ_PAY_PUBLIC_KEY || '',
    apiUrl: process.env.KBZ_PAY_API_URL || 'https://api.kbzpay.com',
    notifyUrl: process.env.KBZ_PAY_NOTIFY_URL || 'http://localhost:3000/api/payments/kbzpay/callback',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  },
  wavepay: {
    merchantId: process.env.WAVE_PAY_MERCHANT_ID || '',
    secretKey: process.env.WAVE_PAY_SECRET_KEY || '',
    apiUrl: process.env.WAVE_PAY_API_URL || 'https://testpayments.wavemoney.io:8107',
    notifyUrl: process.env.WAVE_PAY_NOTIFY_URL || 'http://localhost:3000/api/payments/wavepay/callback',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  },
  mmqr: {
    merchantId: process.env.MMQR_MERCHANT_ID || '',
    secretKey: process.env.MMQR_API_KEY || '',
    apiUrl: process.env.MMQR_API_URL || 'https://api.mmqr.com',
    notifyUrl: process.env.MMQR_NOTIFY_URL || 'http://localhost:3000/api/payments/mmqr/callback',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8080',
  },
};

const providers: Record<string, PaymentProvider> = {
  kbzpay: new KBZPayProvider(providerConfigs.kbzpay),
  wavepay: new WaveMoneyProvider(providerConfigs.wavepay),
  mmqr: new MMQRProvider(providerConfigs.mmqr),
};

function isProviderConfigured(method: string): boolean {
  const config = providerConfigs[method as keyof PaymentProviderConfig];
  return !!(config && config.merchantId && config.secretKey);
}

function generateMockQR(method: string, orderId: string, amount: number): PaymentResponse {
  let payload: string;

  switch (method) {
    case 'mmqr':
      payload = generateMMQRPayload({
        merchantId: MERCHANT_CONFIG.merchantId,
        merchantName: MERCHANT_CONFIG.merchantName,
        amount,
        orderId,
        merchantCategoryCode: MERCHANT_CONFIG.merchantCategoryCode,
      });
      break;
    case 'kbzpay':
      payload = generateKBZPayPayload({
        appId: MERCHANT_CONFIG.kbzPayAppId || 'TOLLGATE',
        merchantCode: MERCHANT_CONFIG.kbzPayMerchantCode || MERCHANT_CONFIG.merchantId,
        orderId,
        amount,
      });
      break;
    case 'wavepay':
      payload = generateWavePayPayload({
        merchantId: MERCHANT_CONFIG.wavePayMerchantId || MERCHANT_CONFIG.merchantId,
        orderId,
        amount,
      });
      break;
    default:
      payload = `tollgate-${method}-${orderId}-${amount}`;
  }

  return {
    success: true,
    transactionId: `MOCK-${method.toUpperCase()}-${orderId}`,
    qrCode: payload,
    message: `QR generated for ${method} (Configure API keys for real payments)`,
    rawResponse: { mock: true, method, orderId, amount },
  };
}

export interface TopUpRequest {
  userId: string;
  amount: number;
  paymentMethod: string;
  description?: string;
}

export interface TopUpResponse {
  success: boolean;
  orderId: string;
  transactionId?: string;
  qrCode?: string;
  qrImage?: string;
  deepLink?: string;
  redirectUrl?: string;
  message: string;
  balance?: number;
}

export async function initiateTopUp(request: TopUpRequest): Promise<TopUpResponse> {
  const { userId, amount, paymentMethod, description } = request;

  if (amount <= 0) {
    return { success: false, orderId: '', message: 'Amount must be greater than 0' };
  }

  if (amount > 1000000) {
    return { success: false, orderId: '', message: 'Maximum top-up amount is 1,000,000 MMK' };
  }

  const account = await prisma.account.findFirst({ where: { userId } });
  if (!account) {
    return { success: false, orderId: '', message: 'Account not found' };
  }

  const orderId = generateOrderId();

  // Create pending transaction
  const transaction = await prisma.transaction.create({
    data: {
      accountId: account.id,
      amount,
      type: 'TOPUP',
      status: 'PENDING',
      paymentMethod,
    },
  });

  // Manual top-up (admin approved)
  if (paymentMethod === 'manual') {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
    });

    await prisma.account.update({
      where: { id: account.id },
      data: { balance: { increment: amount } },
    });

    const updatedAccount = await prisma.account.findUnique({ where: { id: account.id } });

    return {
      success: true,
      orderId: transaction.id,
      transactionId: transaction.id,
      message: 'Manual top-up recorded. Balance updated.',
      balance: Number(updatedAccount?.balance || 0),
    };
  }

  // Check if provider is configured
  if (!isProviderConfigured(paymentMethod)) {
    // Generate real MMQR QR code for development/demo
    const mockResponse = generateMockQR(paymentMethod, orderId, amount);

    // Generate actual QR code image
    let qrImage: string | undefined;
    try {
      qrImage = await generateQRCodeBase64(mockResponse.qrCode || '');
    } catch (e) {
      console.error('QR image generation failed:', e);
    }

    // Update transaction with mock ID
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentMethod: `${paymentMethod}_mock` },
    });

    return {
      success: true,
      orderId: transaction.id,
      transactionId: mockResponse.transactionId,
      qrCode: mockResponse.qrCode,
      qrImage,
      message: mockResponse.message,
    };
  }

  // Real payment provider
  const provider = providers[paymentMethod];
  if (!provider) {
    return { success: false, orderId, message: `Unsupported payment method: ${paymentMethod}` };
  }

  const paymentRequest: CreatePaymentRequest = {
    amount,
    currency: 'MMK',
    orderId,
    description: description || `TollGate Top-Up - ${amount} MMK`,
  };

  const paymentResponse = await provider.createPayment(paymentRequest);

  if (paymentResponse.success) {
    // Generate QR image from the QR code string
    let qrImage: string | undefined;
    if (paymentResponse.qrCode) {
      try {
        qrImage = await generateQRCodeBase64(paymentResponse.qrCode);
      } catch (e) {
        console.error('QR image generation failed:', e);
      }
    }

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { paymentMethod: `${paymentMethod}_${provider.name}` },
    });

    return {
      success: true,
      orderId: transaction.id,
      transactionId: paymentResponse.transactionId,
      qrCode: paymentResponse.qrCode,
      qrImage,
      deepLink: paymentResponse.deepLink,
      redirectUrl: paymentResponse.redirectUrl,
      message: paymentResponse.message,
    };
  }

  // Payment failed - mark transaction as failed
  await prisma.transaction.update({
    where: { id: transaction.id },
    data: { status: 'FAILED' },
  });

  return {
    success: false,
    orderId: transaction.id,
    message: paymentResponse.message,
  };
}

export async function handlePaymentCallback(
  provider: string,
  payload: any,
  signature: string
): Promise<{ success: boolean; message: string }> {
  const paymentProvider = providers[provider];
  if (!paymentProvider) {
    return { success: false, message: `Unknown provider: ${provider}` };
  }

  // Verify signature
  if (!paymentProvider.verifyCallback(payload, signature)) {
    return { success: false, message: 'Invalid signature' };
  }

  // Find the transaction
  const orderId = payload.order_id || payload.trade_no || payload.payment_id;
  if (!orderId) {
    return { success: false, message: 'No order ID in callback' };
  }

  const transaction = await prisma.transaction.findFirst({
    where: {
      id: orderId,
      type: 'TOPUP',
      status: 'PENDING',
    },
  });

  if (!transaction) {
    return { success: false, message: 'Transaction not found or already processed' };
  }

  // Check payment status
  const status = await paymentProvider.queryStatus(orderId);

  if (status.status === 'completed') {
    // Complete the transaction
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'COMPLETED' },
    });

    // Update account balance
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: Number(transaction.amount) } },
    });

    return { success: true, message: 'Payment confirmed and balance updated' };
  }

  if (status.status === 'failed') {
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'FAILED' },
    });

    return { success: true, message: 'Payment failed - transaction marked as failed' };
  }

  return { success: true, message: 'Payment still pending' };
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!transaction) {
    return { status: 'failed', transactionId, rawResponse: { error: 'Transaction not found' } };
  }

  if (transaction.status === 'COMPLETED') {
    return { status: 'completed', transactionId, amount: Number(transaction.amount) };
  }

  if (transaction.status === 'FAILED') {
    return { status: 'failed', transactionId };
  }

  // Try to query provider
  const method = transaction.paymentMethod?.split('_')[0];
  const provider = providers[method || ''];
  if (provider && !transaction.paymentMethod?.includes('_mock')) {
    return provider.queryStatus(transactionId);
  }

  return { status: 'pending', transactionId };
}

export async function refundPayment(
  transactionId: string,
  amount: number,
  reason?: string
): Promise<RefundResponse> {
  const transaction = await prisma.transaction.findUnique({ where: { id: transactionId } });
  if (!transaction) {
    return { success: false, message: 'Transaction not found' };
  }

  if (transaction.status !== 'COMPLETED') {
    return { success: false, message: 'Can only refund completed transactions' };
  }

  if (amount > Number(transaction.amount)) {
    return { success: false, message: 'Refund amount exceeds transaction amount' };
  }

  const method = transaction.paymentMethod?.split('_')[0];
  const provider = providers[method || ''];

  if (!provider || transaction.paymentMethod?.includes('_mock')) {
    // Mock refund
    await prisma.transaction.create({
      data: {
        accountId: transaction.accountId,
        amount,
        type: 'REFUND',
        status: 'COMPLETED',
        paymentMethod: `refund_${method || 'mock'}`,
      },
    });

    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { decrement: amount } },
    });

    return { success: true, refundId: `MOCK-REFUND-${Date.now()}`, message: 'Mock refund processed' };
  }

  const refundRequest: RefundRequest = {
    transactionId,
    amount,
    reason,
  };

  const refundResponse = await provider.refund(refundRequest);

  if (refundResponse.success) {
    await prisma.transaction.create({
      data: {
        accountId: transaction.accountId,
        amount,
        type: 'REFUND',
        status: 'COMPLETED',
        paymentMethod: `refund_${method}`,
      },
    });

    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { decrement: amount } },
    });
  }

  return refundResponse;
}

export function getPaymentMethods(): Array<{ id: string; name: string; configured: boolean; icon: string }> {
  return [
    {
      id: 'kbzpay',
      name: 'KBZ Pay',
      configured: isProviderConfigured('kbzpay'),
      icon: '🏦',
    },
    {
      id: 'wavepay',
      name: 'Wave Pay',
      configured: isProviderConfigured('wavepay'),
      icon: '🌊',
    },
    {
      id: 'mmqr',
      name: 'MMQR (All Wallets)',
      configured: isProviderConfigured('mmqr'),
      icon: '📱',
    },
  ];
}
