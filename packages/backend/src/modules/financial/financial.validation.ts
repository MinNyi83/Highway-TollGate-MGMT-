import { z } from 'zod';

export const dailyCollectionQuery = z.object({
  date: z.string().optional(),
  regionId: z.string().uuid().optional(),
  plazaId: z.string().uuid().optional(),
});

export const revenueQuery = z.object({
  startDate: z.string().min(1, 'startDate is required'),
  endDate: z.string().min(1, 'endDate is required'),
  regionId: z.string().uuid().optional(),
});

export const topupQuery = z.object({
  startDate: z.string().min(1, 'startDate is required'),
  endDate: z.string().min(1, 'endDate is required'),
  regionId: z.string().uuid().optional(),
});

export const settlementQuery = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  regionId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'TRANSFERRED', 'CONFIRMED', 'DISPUTED']).optional(),
});

export const reconciliationQuery = z.object({
  fiscalYear: z.string().min(1, 'fiscalYear is required'),
  month: z.string().optional(),
  regionId: z.string().uuid().optional(),
  status: z.enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED']).optional(),
});

export const receiptQuery = z.object({
  fiscalYear: z.string().min(1, 'fiscalYear is required'),
  regionId: z.string().uuid().optional(),
  plazaId: z.string().uuid().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export const confirmSettlementBody = z.object({
  transferId: z.string().min(1, 'transferId is required'),
  bankName: z.string().min(1, 'bankName is required'),
  depositRef: z.string().min(1, 'depositRef is required'),
});

export const batchConfirmBody = z.object({
  date: z.string().min(1, 'date is required'),
  plazaIds: z.array(z.string().uuid()).min(1, 'plazaIds must not be empty'),
});

export const submitReconciliationBody = z.object({
  id: z.string().uuid('Invalid reconciliation id'),
  submittedBy: z.string().min(1, 'submittedBy is required'),
});

export const approveReconciliationBody = z.object({
  id: z.string().uuid('Invalid reconciliation id'),
  approvedBy: z.string().min(1, 'approvedBy is required'),
  notes: z.string().optional(),
});

export const rejectReconciliationBody = z.object({
  id: z.string().uuid('Invalid reconciliation id'),
  approvedBy: z.string().min(1, 'approvedBy is required'),
  reason: z.string().min(1, 'reason is required'),
});
