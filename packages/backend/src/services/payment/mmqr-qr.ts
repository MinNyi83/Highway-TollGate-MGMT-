import QRCode from 'qrcode';

/**
 * MMQR (MyanmarPay) QR Code Generator
 * Based on EMVCo QR Code Specification for Payment Systems
 * following the Myanmar QR Standard (MMQR)
 *
 * Generates QR codes that work with ALL Myanmar wallets:
 * KBZ Pay, Wave Pay, AYA Pay, CB Pay, MPT Money, etc.
 */

// EMVCo Tag IDs
const TAG_PAYLOAD_FORMAT = '00';
const TAG_POINT_OF_INITIATION = '01';
const TAG_MERCHANT_ACCOUNT_INFO = '26';
const TAG_MERCHANT_CATEGORY = '52';
const TAG_TRANSACTION_CURRENCY = '53';
const TAG_TRANSACTION_AMOUNT = '54';
const TAG_COUNTRY_CODE = '58';
const TAG_ADDITIONAL_DATA = '62';
const TAG_CRC = '63';

// MMQR Merchant Account Info Sub-Tags
const TAG_MERCHANT_GUID = '00';
const TAG_MERCHANT_ID = '01';
const TAG_MERCHANT_CATEGORY_CODE = '02';
const TAG_MERCHANT_CHANNEL = '03';

// Constants
const MMQR_GUID = 'MM.COM.MMQR';
const MMK_CURRENCY_CODE = '104';
const COUNTRY_CODE = 'MM';
const CRC_SEED = '6304';

function calculateCRC16CCITT(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function formatTLV(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return tag + length + value;
}

export interface MMQROptions {
  merchantId: string;
  merchantName: string;
  amount: number;
  orderId: string;
  merchantCategoryCode?: string;
}

export function generateMMQRPayload(options: MMQROptions): string {
  const {
    merchantId,
    merchantName,
    amount,
    orderId,
    merchantCategoryCode = '4814', // Money transfer
  } = options;

  // Build Merchant Account Information (Tag 26)
  const merchantInfo = [
    formatTLV(TAG_MERCHANT_GUID, MMQR_GUID),
    formatTLV(TAG_MERCHANT_ID, merchantId),
    formatTLV(TAG_MERCHANT_CATEGORY_CODE, merchantCategoryCode),
    formatTLV(TAG_MERCHANT_CHANNEL, 'TOL'),
  ].join('');

  // Build main payload (without CRC)
  let payload = '';
  payload += formatTLV(TAG_PAYLOAD_FORMAT, '01');
  payload += formatTLV(TAG_POINT_OF_INITIATION, '12'); // Dynamic QR (amount specified)
  payload += formatTLV(TAG_MERCHANT_ACCOUNT_INFO, merchantInfo);
  payload += formatTLV(TAG_MERCHANT_CATEGORY, merchantCategoryCode);
  payload += formatTLV(TAG_TRANSACTION_CURRENCY, MMK_CURRENCY_CODE);
  payload += formatTLV(TAG_TRANSACTION_AMOUNT, amount.toFixed(2));
  payload += formatTLV(TAG_COUNTRY_CODE, COUNTRY_CODE);

  // Additional Data
  const additionalData = formatTLV('05', orderId);
  payload += formatTLV(TAG_ADDITIONAL_DATA, additionalData);

  // Calculate CRC (everything after CRC tag + seed)
  const crcData = payload + CRC_SEED;
  const crc = calculateCRC16CCITT(crcData);
  payload += formatTLV(TAG_CRC, crc);

  return payload;
}

export interface KBZPayQRData {
  appId: string;
  merchantCode: string;
  orderId: string;
  amount: number;
}

export function generateKBZPayPayload(data: KBZPayQRData): string {
  // KBZ Pay uses a specific format for their QR codes
  // This is a simplified version - real KBZ Pay uses their own proprietary format
  const payload = [
    `appid=${data.appId}`,
    `mch_code=${data.merchantCode}`,
    `order_id=${data.orderId}`,
    `amount=${data.amount}`,
    `currency=MMK`,
    `desc=TollGate Top-Up`,
  ].join('&');
  return payload;
}

export interface WavePayQRData {
  merchantId: string;
  orderId: string;
  amount: number;
}

export function generateWavePayPayload(data: WavePayQRData): string {
  // Wave Money uses a payment URL format
  const params = new URLSearchParams({
    merchant_id: data.merchantId,
    order_id: data.orderId,
    amount: data.amount.toString(),
    currency: 'MMK',
    description: 'TollGate Top-Up',
  });
  return `https://payments.wavemoney.io/pay?${params.toString()}`;
}

export async function generateQRCodeBase64(data: string): Promise<string> {
  try {
    const base64 = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return base64;
  } catch (error) {
    console.error('QR code generation failed:', error);
    throw new Error('Failed to generate QR code');
  }
}

// Merchant configuration (should be in env vars in production)
export const MERCHANT_CONFIG = {
  merchantId: process.env.MMQR_MERCHANT_ID || '100000000000001',
  merchantName: process.env.MMQR_MERCHANT_NAME || 'TollGate RFID Pass',
  merchantCategoryCode: process.env.MMQR_MCC || '4814',
  kbzPayAppId: process.env.KBZ_PAY_APP_ID || '',
  kbzPayMerchantCode: process.env.KBZ_PAY_MERCHANT_CODE || '',
  wavePayMerchantId: process.env.WAVE_PAY_MERCHANT_ID || '',
};
