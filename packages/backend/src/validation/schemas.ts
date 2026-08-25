import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createVehicleSchema = z.object({
  plateNumber: z.string().min(1),
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number(),
  vehicleClass: z.enum(['MOTORCYCLE', 'SEDAN', 'SUV', 'TRUCK', 'BUS']),
});

export const createTollPlazaSchema = z.object({
  name: z.string().min(1),
  locationLat: z.number(),
  locationLng: z.number(),
  lanes: z.number().optional(),
});

export const tollEventEntrySchema = z.object({
  vehicleId: z.string().uuid(),
  plazaId: z.string().uuid(),
  rfidTagId: z.string().uuid().optional(),
  anprPlate: z.string().optional(),
});

export const tollEventExitSchema = z.object({
  anprPlate: z.string().optional(),
});

export const topUpSchema = z.object({
  amount: z.number().positive(),
});
