import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface SMSConfig {
  provider: 'twilio' | 'vonage' | 'custom';
  apiKey: string;
  apiSecret: string;
  fromNumber: string;
  apiUrl?: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
}

interface NotificationPayload {
  userId: string;
  type: 'TOLL_DEDUCTION' | 'LOW_BALANCE' | 'VIOLATION' | 'TOPUP_SUCCESS' | 'ACCOUNT_CREATED' | 'PASSWORD_RESET' | 'GENERAL';
  title: string;
  message: string;
  data?: any;
  channels: ('sms' | 'email' | 'push' | 'in_app')[];
}

interface SMSMessage {
  to: string;
  message: string;
}

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export class NotificationService {
  private prisma: PrismaClient;
  private smsConfig: SMSConfig | null = null;
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.initializeSMS();
    this.initializeEmail();
  }

  private initializeSMS(): void {
    const provider = process.env.SMS_PROVIDER as 'twilio' | 'vonage' | 'custom';
    
    if (provider) {
      this.smsConfig = {
        provider,
        apiKey: process.env.SMS_API_KEY || '',
        apiSecret: process.env.SMS_API_SECRET || '',
        fromNumber: process.env.SMS_FROM_NUMBER || '',
        apiUrl: process.env.SMS_API_URL,
      };
      logger.info(`SMS service initialized with provider: ${provider}`);
    }
  }

  private initializeEmail(): void {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '587');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.emailTransporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      logger.info('Email service initialized');
    }
  }

  async sendNotification(payload: NotificationPayload): Promise<void> {
    const { userId, type, title, message, data, channels } = payload;

    // Get user contact info
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true },
    });

    if (!user) {
      logger.error(`User not found: ${userId}`);
      return;
    }

    // Create in-app notification
    if (channels.includes('in_app')) {
      await this.createInAppNotification(userId, type, title, message, data);
    }

    // Send SMS
    if (channels.includes('sms') && user.phone) {
      await this.sendSMS(user.phone, message);
    }

    // Send Email
    if (channels.includes('email') && user.email) {
      await this.sendEmail(user.email, title, this.generateEmailTemplate(title, message, data));
    }

    // Send Push notification (placeholder)
    if (channels.includes('push')) {
      await this.sendPushNotification(userId, title, message, data);
    }
  }

  async sendTollDeductionNotification(
    userId: string,
    amount: number,
    plazaName: string,
    plateNumber: string,
    balance: number
  ): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'TOLL_DEDUCTION',
      title: 'Toll Deduction',
      message: `MMK ${amount} deducted for using ${plazaName}. Vehicle: ${plateNumber}. Balance: MMK ${balance}`,
      data: { amount, plazaName, plateNumber, balance },
      channels: ['sms', 'email', 'in_app'],
    });
  }

  async sendLowBalanceNotification(userId: string, balance: number): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'LOW_BALANCE',
      title: 'Low Balance Warning',
      message: `Your account balance is low: MMK ${balance}. Please top up to continue using toll services.`,
      data: { balance },
      channels: ['sms', 'in_app'],
    });
  }

  async sendViolationNotification(
    userId: string,
    violationType: string,
    fineAmount: number,
    plateNumber: string
  ): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'VIOLATION',
      title: 'Traffic Violation',
      message: `Violation detected: ${violationType}. Fine: MMK ${fineAmount}. Vehicle: ${plateNumber}. Please pay within 30 days.`,
      data: { violationType, fineAmount, plateNumber },
      channels: ['sms', 'email', 'in_app'],
    });
  }

  async sendTopUpSuccessNotification(
    userId: string,
    amount: number,
    paymentMethod: string,
    newBalance: number
  ): Promise<void> {
    await this.sendNotification({
      userId,
      type: 'TOPUP_SUCCESS',
      title: 'Top-up Successful',
      message: `MMK ${amount} added to your account via ${paymentMethod}. New balance: MMK ${newBalance}`,
      data: { amount, paymentMethod, newBalance },
      channels: ['sms', 'email', 'in_app'],
    });
  }

  private async createInAppNotification(
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    try {
      await this.prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          data: data ? JSON.stringify(data) : null,
        },
      });
    } catch (error) {
      logger.error('Failed to create in-app notification:', error);
    }
  }

  private async sendSMS(phoneNumber: string, message: string): Promise<void> {
    if (!this.smsConfig) {
      logger.warn('SMS service not configured');
      return;
    }

    try {
      const phone = this.formatPhoneNumber(phoneNumber);

      switch (this.smsConfig.provider) {
        case 'twilio':
          await this.sendTwilioSMS(phone, message);
          break;
        case 'vonage':
          await this.sendVonageSMS(phone, message);
          break;
        case 'custom':
          await this.sendCustomSMS(phone, message);
          break;
      }

      logger.info(`SMS sent to ${phone}`);
    } catch (error) {
      logger.error('Failed to send SMS:', error);
    }
  }

  private async sendTwilioSMS(to: string, message: string): Promise<void> {
    const accountSid = this.smsConfig!.apiKey;
    const authToken = this.smsConfig!.apiSecret;
    const from = this.smsConfig!.fromNumber;

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const data = new URLSearchParams({
      To: to,
      From: from,
      Body: message,
    });

    await axios.post(url, data, {
      auth: { username: accountSid, password: authToken },
    });
  }

  private async sendVonageSMS(to: string, message: string): Promise<void> {
    const url = this.smsConfig!.apiUrl || 'https://rest.nexmo.com/sms/json';
    
    await axios.post(url, {
      api_key: this.smsConfig!.apiKey,
      api_secret: this.smsConfig!.apiSecret,
      from: this.smsConfig!.fromNumber,
      to,
      text: message,
    });
  }

  private async sendCustomSMS(to: string, message: string): Promise<void> {
    if (!this.smsConfig!.apiUrl) {
      throw new Error('Custom SMS API URL not configured');
    }

    await axios.post(
      this.smsConfig!.apiUrl,
      {
        to,
        message,
        from: this.smsConfig!.fromNumber,
      },
      {
        headers: {
          Authorization: `Bearer ${this.smsConfig!.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    if (!this.emailTransporter) {
      logger.warn('Email service not configured');
      return;
    }

    try {
      await this.emailTransporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@tollgate.com',
        to,
        subject,
        html,
      });

      logger.info(`Email sent to ${to}`);
    } catch (error) {
      logger.error('Failed to send email:', error);
    }
  }

  private generateEmailTemplate(title: string, message: string, data?: any): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
          .amount { font-size: 24px; font-weight: bold; color: #059669; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>TollGate Management System</h1>
          </div>
          <div class="content">
            <h2>${title}</h2>
            <p>${message}</p>
            ${data ? `<pre>${JSON.stringify(data, null, 2)}</pre>` : ''}
          </div>
          <div class="footer">
            <p>This is an automated message from TollGate Management System.</p>
            <p>If you have any questions, please contact support@tollgate.com</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async sendPushNotification(
    userId: string,
    title: string,
    message: string,
    data?: any
  ): Promise<void> {
    // Placeholder for push notification service (Firebase, OneSignal, etc.)
    logger.info(`Push notification to ${userId}: ${title}`);
  }

  private formatPhoneNumber(phone: string): string {
    // Remove spaces and dashes
    let formatted = phone.replace(/[\s-]/g, '');
    
    // Add country code if missing (Myanmar +95)
    if (!formatted.startsWith('+')) {
      if (formatted.startsWith('0')) {
        formatted = '+95' + formatted.substring(1);
      } else {
        formatted = '+95' + formatted;
      }
    }

    return formatted;
  }

  async getNotifications(userId: string, limit: number = 50): Promise<any[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.prisma.notification.updateMany({
      where: { userId, readAt: null },
      data: { readAt: new Date() },
    });
  }

  async deleteOldNotifications(daysOld: number = 90): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    await this.prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
      },
    });
  }
}
