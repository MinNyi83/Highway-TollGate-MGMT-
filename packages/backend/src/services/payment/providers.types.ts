import crypto from 'crypto';

export interface PaymentConfig {
  merchantId: string;
  appId?: string;
  secretKey: string;
  publicKey?: string;
  apiUrl: string;
  notifyUrl?: string;
  frontendUrl?: string;
}

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  description: string;
  customerPhone?: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  qrCode?: string;
  deepLink?: string;
  redirectUrl?: string;
  message: string;
  rawResponse?: any;
}

export interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed' | 'expired';
  transactionId: string;
  amount?: number;
  rawResponse?: any;
}

export interface RefundRequest {
  transactionId: string;
  amount: number;
  reason?: string;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  message: string;
}

export interface PaymentProvider {
  name: string;
  createPayment(request: CreatePaymentRequest): Promise<PaymentResponse>;
  queryStatus(transactionId: string): Promise<PaymentStatus>;
  refund(request: RefundRequest): Promise<RefundResponse>;
  verifyCallback(payload: any, signature: string): boolean;
}

export function generateOrderId(): string {
  return `TOLL-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export function generateSignature(data: string, secretKey: string): string {
  return crypto.createHmac('sha256', secretKey).update(data).digest('hex');
}

export function generateTimestamp(): string {
  return Math.floor(Date.now() / 1000).toString();
}
