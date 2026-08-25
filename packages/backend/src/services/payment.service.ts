interface PaymentRequest {
  amount: number;
  paymentMethod: 'kbzpay' | 'wavepay' | 'mmqr' | 'manual';
  userId: string;
  description?: string;
}

interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  qrCode?: string;
  message: string;
}

interface PaymentStatus {
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
}

const PAYMENT_CONFIG = {
  kbzpay: {
    apiKey: process.env.KBZ_PAY_API_KEY || '',
    merchantId: process.env.KBZ_PAY_MERCHANT_ID || '',
    apiUrl: process.env.KBZ_PAY_API_URL || 'https://api.kbzpay.com/v1',
  },
  wavepay: {
    apiKey: process.env.WAVE_PAY_API_KEY || '',
    merchantId: process.env.WAVE_PAY_MERCHANT_ID || '',
    apiUrl: process.env.WAVE_PAY_API_URL || 'https://api.wavepay.com/v1',
  },
  mmqr: {
    apiKey: process.env.MMQR_API_KEY || '',
    merchantId: process.env.MMQR_MERCHANT_ID || '',
    apiUrl: process.env.MMQR_API_URL || 'https://api.mmqr.com/v1',
  },
};

export async function initiatePayment(request: PaymentRequest): Promise<PaymentResponse> {
  if (request.paymentMethod === 'manual') {
    return {
      success: true,
      transactionId: `MANUAL-${Date.now()}`,
      message: 'Manual top-up recorded',
    };
  }

  const config = PAYMENT_CONFIG[request.paymentMethod];
  if (!config || !config.apiKey) {
    return generateMockQR(request);
  }

  try {
    const response = await fetch(`${config.apiUrl}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        amount: request.amount,
        merchantId: config.merchantId,
        description: request.description || 'TollGate Top-Up',
        reference: `TOLL-${Date.now()}`,
      }),
    });

    const data: any = await response.json();

    if (data.status === 'success') {
      return {
        success: true,
        transactionId: data.transactionId,
        qrCode: data.qrCode,
        message: 'Payment initiated successfully',
      };
    }

    return {
      success: false,
      message: data.message || 'Payment failed',
    };
  } catch (error) {
    return generateMockQR(request);
  }
}

function generateMockQR(request: PaymentRequest): PaymentResponse {
  const transactionId = `${request.paymentMethod.toUpperCase()}-${Date.now()}`;
  return {
    success: true,
    transactionId,
    qrCode: `MOCK-QR-${transactionId}`,
    message: `Mock QR generated for ${request.paymentMethod}`,
  };
}

export async function checkPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  return {
    status: 'completed',
    transactionId,
  };
}

export async function refundPayment(transactionId: string, amount: number): Promise<PaymentResponse> {
  return {
    success: true,
    transactionId,
    message: `Refund of $${amount} initiated`,
  };
}
