import { PrismaClient, CustomerType } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, TokenPayload } from '../../utils/jwt';

const prisma = new PrismaClient();

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  customerType: CustomerType;
  phone?: string;
  nrcNumber?: string;
  drivingLicense?: string;
  companyName?: string;
  companyRegNo?: string;
  companyAddress?: string;
  fleetManagerName?: string;
  smsProvider?: string;
  smsEnabled?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    customerType: string;
  };
  token: string;
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name,
      customerType: input.customerType || 'INDIVIDUAL',
      phone: input.phone,
      nrcNumber: input.nrcNumber,
      drivingLicense: input.drivingLicense,
      companyName: input.companyName,
      companyRegNo: input.companyRegNo,
      companyAddress: input.companyAddress,
      fleetManagerName: input.fleetManagerName,
      smsProvider: input.smsProvider,
      smsEnabled: input.smsEnabled || false,
    },
  });

  await prisma.account.create({
    data: {
      userId: user.id,
      customerType: input.customerType || 'INDIVIDUAL',
      balance: 0,
      creditLimit: input.customerType === 'ENTERPRISE' ? 1000 : 0,
      paymentTerms: input.customerType === 'ENTERPRISE' ? 30 : null,
    },
  });

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customerType: user.customerType,
    },
    token,
  };
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(input.password, user.passwordHash);

  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      customerType: user.customerType,
    },
    token,
  };
}

export async function refreshToken(userId: string): Promise<{ token: string }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  return { token };
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) throw new Error('Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

export async function forgotPassword(email: string): Promise<{ resetToken: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User not found');

  const resetToken = require('crypto').randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600000);

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry: expires },
  });

  return { resetToken };
}

export async function resetPassword(resetToken: string, newPassword: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      resetToken,
      resetTokenExpiry: { gt: new Date() },
    },
  });

  if (!user) throw new Error('Invalid or expired reset token');

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });
}

export async function updateProfile(userId: string, data: Partial<RegisterInput>): Promise<any> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone,
      nrcNumber: data.nrcNumber,
      drivingLicense: data.drivingLicense,
      companyName: data.companyName,
      companyRegNo: data.companyRegNo,
      companyAddress: data.companyAddress,
      fleetManagerName: data.fleetManagerName,
      smsProvider: data.smsProvider,
      smsEnabled: data.smsEnabled,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    customerType: user.customerType,
    phone: user.phone,
    nrcNumber: user.nrcNumber,
    drivingLicense: user.drivingLicense,
    companyName: user.companyName,
    companyRegNo: user.companyRegNo,
    companyAddress: user.companyAddress,
    fleetManagerName: user.fleetManagerName,
    smsProvider: user.smsProvider,
    smsEnabled: user.smsEnabled,
  };
}
