import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { logger } from '../utils/logger';

interface TwoFactorSetup {
  secret: string;
  otpauthUrl: string;
  qrCodeUrl: string;
}

interface TwoFactorVerify {
  verified: boolean;
  token?: string;
}

export class TwoFactorService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async generateSecret(userId: string, email: string): Promise<TwoFactorSetup> {
    const secret = speakeasy.generateSecret({
      name: `TollGate (${email})`,
      issuer: 'TollGate Management System',
      length: 20,
    });

    // Store secret temporarily (not enabled yet)
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: secret.base32,
        twoFactorEnabled: false,
      },
    });

    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    return {
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url!,
      qrCodeUrl,
    };
  }

  async verifyAndEnable(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      throw new Error('Two-factor setup not initiated');
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1, // Allow 1 step tolerance
    });

    if (verified) {
      // Generate backup codes
      const backupCodes = this.generateBackupCodes();

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: true,
          twoFactorBackupCodes: JSON.stringify(backupCodes),
        },
      });

      logger.info(`Two-factor enabled for user ${userId}`);
      return true;
    }

    return false;
  }

  async verifyToken(userId: string, token: string): Promise<TwoFactorVerify> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      return { verified: false };
    }

    // Check if it's a backup code
    if (token.length === 8 && token.includes('-')) {
      return this.verifyBackupCode(userId, token);
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (verified) {
      // Generate session token
      const sessionToken = this.generateSessionToken();
      return { verified: true, token: sessionToken };
    }

    return { verified: false };
  }

  async disable(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new Error('Two-factor not enabled');
    }

    // Verify current token before disabling
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret!,
      encoding: 'base32',
      token,
      window: 1,
    });

    if (verified) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null,
          twoFactorBackupCodes: null,
        },
      });

      logger.info(`Two-factor disabled for user ${userId}`);
      return true;
    }

    return false;
  }

  async regenerateBackupCodes(userId: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled) {
      throw new Error('Two-factor not enabled');
    }

    const backupCodes = this.generateBackupCodes();

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorBackupCodes: JSON.stringify(backupCodes),
      },
    });

    return backupCodes;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = speakeasy.generateSecret({ length: 4 }).base32.substring(0, 8);
      codes.push(code.substring(0, 4) + '-' + code.substring(4, 8));
    }
    return codes;
  }

  private async verifyBackupCode(
    userId: string,
    code: string
  ): Promise<TwoFactorVerify> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorBackupCodes) {
      return { verified: false };
    }

    const backupCodes: string[] = JSON.parse(user.twoFactorBackupCodes);
    const codeIndex = backupCodes.indexOf(code);

    if (codeIndex !== -1) {
      // Remove used backup code
      backupCodes.splice(codeIndex, 1);
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorBackupCodes: JSON.stringify(backupCodes),
        },
      });

      const sessionToken = this.generateSessionToken();
      return { verified: true, token: sessionToken };
    }

    return { verified: false };
  }

  private generateSessionToken(): string {
    return speakeasy.generateSecret({ length: 32 }).base32;
  }

  async getStatus(userId: string): Promise<{
    enabled: boolean;
    backupCodesCount: number;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
        twoFactorBackupCodes: true,
      },
    });

    return {
      enabled: user?.twoFactorEnabled || false,
      backupCodesCount: user?.twoFactorBackupCodes
        ? JSON.parse(user.twoFactorBackupCodes).length
        : 0,
    };
  }
}
