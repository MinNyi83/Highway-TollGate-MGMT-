import crypto from 'crypto';
import {
  PaymentProvider,
  PaymentConfig,
  CreatePaymentRequest,
  PaymentResponse,
  PaymentStatus,
  RefundRequest,
  RefundResponse,
  generateSignature,
} from './providers.types';

export class WaveMoneyProvider implements PaymentProvider {
  name = 'WaveMoney';
  private config: PaymentConfig;
  private authToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  private async authenticate(): Promise<string> {
    if (this.authToken && Date.now() < this.tokenExpiry) {
      return this.authToken;
    }

    try {
      const response = await fetch(`${this.config.apiUrl}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: this.config.merchantId,
          secret_key: this.config.secretKey,
        }),
      });

      const data: any = await response.json();

      if (data.token) {
        this.authToken = data.token;
        this.tokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
        return data.token;
      }

      throw new Error('Authentication failed');
    } catch (error) {
      throw new Error(`WaveMoney authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const token = await this.authenticate();
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const ttlSeconds = '600';

      // Generate hash per WaveMoney docs:
      // time_to_live_in_seconds + merchant_id + order_id + amount + backend_result_url + merchant_reference_id
      const hashData = `${ttlSeconds}${this.config.merchantId}${request.orderId}${request.amount}${this.config.notifyUrl || ''}${request.orderId}`;
      const hash = crypto.createHmac('sha256', this.config.secretKey).update(hashData).digest('hex');

      const payload = {
        merchant_id: this.config.merchantId,
        order_id: request.orderId,
        amount: request.amount,
        currency: request.currency || 'MMK',
        time_to_live_in_seconds: ttlSeconds,
        payment_description: request.description,
        merchant_name: 'TollGate',
        frontend_result_url: this.config.frontendUrl || '',
        backend_result_url: this.config.notifyUrl || '',
        items: JSON.stringify([{ name: request.description, quantity: '1', price: request.amount.toString() }]),
        hash,
      };

      const response = await fetch(`${this.config.apiUrl}/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: any = await response.json();

      if (data.payment_id) {
        return {
          success: true,
          transactionId: data.payment_id,
          qrCode: data.qr_code,
          deepLink: data.deeplink,
          redirectUrl: data.payment_url,
          message: 'Payment created successfully',
          rawResponse: data,
        };
      }

      return {
        success: false,
        message: data.message || data.error || 'Payment creation failed',
        rawResponse: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `WaveMoney API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async queryStatus(transactionId: string): Promise<PaymentStatus> {
    // WaveMoney uses callback-driven status updates
    // This is a fallback query if needed
    try {
      const token = await this.authenticate();

      const response = await fetch(`${this.config.apiUrl}/payment/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: any = await response.json();

      if (data.status === 'PAYMENT_CONFIRMED') {
        return {
          status: 'completed',
          transactionId,
          amount: data.amount,
          rawResponse: data,
        };
      }

      if (data.status === 'PAYMENT_FAILED' || data.status === 'EXPIRED') {
        return {
          status: 'failed',
          transactionId,
          rawResponse: data,
        };
      }

      return {
        status: 'pending',
        transactionId,
        rawResponse: data,
      };
    } catch (error) {
      return {
        status: 'failed',
        transactionId,
        rawResponse: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }

  async refund(request: RefundRequest): Promise<RefundResponse> {
    // WaveMoney does not support refunds via API
    return {
      success: false,
      message: 'WaveMoney does not support API refunds. Please contact support.',
    };
  }

  verifyCallback(payload: any, signature: string): boolean {
    try {
      // WaveMoney callback verification:
      // time_to_live_in_seconds + merchant_id + order_id + amount + backend_result_url + merchant_reference_id
      const hashData = `${payload.time_to_live_in_seconds || ''}${this.config.merchantId}${payload.order_id}${payload.amount}${this.config.notifyUrl || ''}${payload.merchant_reference_id || payload.order_id}`;
      const expectedHash = crypto.createHmac('sha256', this.config.secretKey).update(hashData).digest('hex');
      return signature === expectedHash;
    } catch {
      return false;
    }
  }
}
