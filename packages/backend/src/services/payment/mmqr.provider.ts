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

export class MMQRProvider implements PaymentProvider {
  name = 'MMQR';
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();

      const payload = {
        merchant_id: this.config.merchantId,
        order_id: request.orderId,
        amount: request.amount.toString(),
        currency: request.currency || 'MMK',
        description: request.description,
        timestamp,
      };

      const signData = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
        .join('&');
      const signature = generateSignature(signData, this.config.secretKey);

      const response = await fetch(`${this.config.apiUrl}/qr/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.secretKey,
        },
        body: JSON.stringify({ ...payload, signature }),
      });

      const data: any = await response.json();

      if (data.success || data.qr_code) {
        return {
          success: true,
          transactionId: data.transaction_id || request.orderId,
          qrCode: data.qr_code || data.qr_string,
          message: 'MMQR generated successfully',
          rawResponse: data,
        };
      }

      return {
        success: false,
        message: data.message || 'MMQR generation failed',
        rawResponse: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `MMQR API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async queryStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const response = await fetch(`${this.config.apiUrl}/qr/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.config.secretKey,
        },
      });

      const data: any = await response.json();

      if (data.status === 'COMPLETED' || data.status === 'SUCCESS') {
        return {
          status: 'completed',
          transactionId,
          amount: parseFloat(data.amount),
          rawResponse: data,
        };
      }

      if (data.status === 'FAILED' || data.status === 'EXPIRED') {
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
    try {
      const response = await fetch(`${this.config.apiUrl}/qr/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.secretKey,
        },
        body: JSON.stringify({
          transaction_id: request.transactionId,
          amount: request.amount.toString(),
          reason: request.reason,
        }),
      });

      const data: any = await response.json();

      if (data.success) {
        return {
          success: true,
          refundId: data.refund_id,
          message: 'Refund processed successfully',
        };
      }

      return {
        success: false,
        message: data.message || 'Refund failed',
      };
    } catch (error) {
      return {
        success: false,
        message: `MMQR refund error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  verifyCallback(payload: any, signature: string): boolean {
    try {
      const signData = Object.keys(payload)
        .filter((key) => key !== 'signature')
        .sort()
        .map((key) => `${key}=${payload[key]}`)
        .join('&');
      const expectedSignature = generateSignature(signData, this.config.secretKey);
      return signature === expectedSignature;
    } catch {
      return false;
    }
  }
}
