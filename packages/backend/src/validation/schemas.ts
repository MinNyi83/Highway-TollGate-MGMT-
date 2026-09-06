import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['ADMIN', 'PLAZA_OPERATOR', 'LANE_OPERATOR']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
});

export const createVehicleSchema = z.object({
  plateNumber: z.string()
    .min(1, 'Plate number is required')
    .regex(/^[A-Z0-9-]+$/i, 'Invalid plate number format'),
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  year: z.number()
    .int()
    .min(1900, 'Year must be 1900 or later')
    .max(new Date().getFullYear() + 1, 'Invalid year'),
  color: z.string().max(30).optional(),
  vehicleClass: z.enum(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']),
  rfidTagUid: z.string().min(1).optional(),
});

export const updateVehicleSchema = z.object({
  make: z.string().min(1).max(50).optional(),
  model: z.string().min(1).max(50).optional(),
  year: z.number().int().min(1900).optional(),
  color: z.string().max(30).optional(),
  vehicleClass: z.enum(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const createTollPlazaSchema = z.object({
  name: z.string().min(1, 'Plaza name is required').max(100),
  locationLat: z.number().min(-90).max(90),
  locationLng: z.number().min(-180).max(180),
  lanes: z.number().int().min(1).max(50).optional().default(4),
  status: z.enum(['ONLINE', 'OFFLINE', 'WARNING']).optional(),
});

export const tollEventEntrySchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  plazaId: z.string().uuid('Invalid plaza ID'),
  rfidTagId: z.string().uuid().optional(),
  anprPlate: z.string().optional(),
  laneNumber: z.number().int().min(1).optional(),
});

export const tollEventExitSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  anprPlate: z.string().optional(),
});

export const topUpSchema = z.object({
  amount: z.number()
    .positive('Amount must be positive')
    .min(1000, 'Minimum top-up is 1,000 MMK')
    .max(10000000, 'Maximum top-up is 10,000,000 MMK'),
  paymentMethod: z.enum(['KBZ_PAY', 'WAVE_MONEY', 'MMQR', 'BANK_TRANSFER']).optional(),
});

export const createViolationSchema = z.object({
  vehicleId: z.string().uuid('Invalid vehicle ID'),
  eventId: z.string().uuid('Invalid event ID'),
  violationType: z.enum([
    'NO_ENTRY_RECORD',
    'PLATE_MISMATCH',
    'RFID_MISMATCH',
    'BLACKLISTED',
    'EXPIRED_REGISTRATION',
  ]),
  description: z.string().max(500).optional(),
  evidenceUrl: z.string().url().optional(),
});

export const resolveViolationSchema = z.object({
  status: z.enum(['RESOLVED', 'DISMISSED', 'ESCALATED']),
  resolution: z.string().min(1, 'Resolution is required').max(1000),
  fineAmount: z.number().positive().optional(),
});

export const createNotificationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  title: z.string().min(1).max(200),
  message: z.string().min(1).max(1000),
  type: z.enum(['INFO', 'WARNING', 'ALERT', 'PAYMENT', 'VEHICLE', 'VIOLATION']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
});

export const vehicleSearchSchema = z.object({
  search: z.string().max(100).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  vehicleClass: z.enum(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']).optional(),
  approvalStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export function validate(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: result.error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: z.ZodSchema) {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        code: 'VALIDATION_ERROR',
        details: result.error.issues.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
      return;
    }
    req.query = result.data;
    next();
  };
}
