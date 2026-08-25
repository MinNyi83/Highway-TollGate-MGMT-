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

export class KBZPayProvider implements PaymentProvider {
  name = 'KBZPay';
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  async createPayment(request: CreatePaymentRequest): Promise<PaymentResponse> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = {
        appid: this.config.appId,
        merch_code: this.config.merchantId,
        req_time: timestamp,
        trade_type: 'QR',
        total_amount: request.amount.toString(),
        currency: request.currency || 'MMK',
        title: request.description,
        order_no: request.orderId,
        notify_url: this.config.notifyUrl || '',
      };

      // Generate signature
      const signData = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
        .join('&');
      const signature = generateSignature(signData, this.config.secretKey);

      const response = await fetch(`${this.config.apiUrl}/payment/gateway/precreate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`,
        },
        body: JSON.stringify({ ...payload, sign: signature }),
      });

      const data: any = await response.json();

      if (data.status === 'SUCCESS' || data.return_code === 'SUCCESS') {
        return {
          success: true,
          transactionId: data.trade_no || data.order_no,
          qrCode: data.qr_code,
          deepLink: data.deep_link,
          message: 'Payment created successfully',
          rawResponse: data,
        };
      }

      return {
        success: false,
        message: data.return_msg || data.message || 'Payment creation failed',
        rawResponse: data,
      };
    } catch (error) {
      return {
        success: false,
        message: `KBZPay API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  async queryStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = {
        appid: this.config.appId,
        merch_code: this.config.merchantId,
        order_no: transactionId,
        req_time: timestamp,
      };

      const signData = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
        .join('&');
      const signature = generateSignature(signData, this.config.secretKey);

      const response = await fetch(`${this.config.apiUrl}/payment/gateway/queryorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`,
        },
        body: JSON.stringify({ ...payload, sign: signature }),
      });

      const data: any = await response.json();

      if (data.trade_status === 'SUCCESS') {
        return {
          status: 'completed',
          transactionId,
          amount: parseFloat(data.total_amount),
          rawResponse: data,
        };
      }

      if (data.trade_status === 'REFUND' || data.trade_status === 'CLOSED') {
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
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const payload = {
        appid: this.config.appId,
        merch_code: this.config.merchantId,
        trade_no: request.transactionId,
        req_time: timestamp,
        refund_amount: request.amount.toString(),
        refund_reason: request.reason || 'Customer request',
      };

      const signData = Object.keys(payload)
        .sort()
        .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
        .join('&');
      const signature = generateSignature(signData, this.config.secretKey);

      const response = await fetch(`${this.config.apiUrl}/payment/gateway/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.secretKey}`,
        },
        body: JSON.stringify({ ...payload, sign: signature }),
      });

      const data: any = await response.json();

      if (data.return_code === 'SUCCESS') {
        return {
          success: true,
          refundId: data.refund_no,
          message: 'Refund processed successfully',
        };
      }

      return {
        success: false,
        message: data.return_msg || 'Refund failed',
      };
    } catch (error) {
      return {
        success: false,
        message: `KBZPay refund error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  }

  verifyCallback(payload: any, signature: string): boolean {
    try {
      const signData = Object.keys(payload)
        .filter((key) => key !== 'sign')
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
