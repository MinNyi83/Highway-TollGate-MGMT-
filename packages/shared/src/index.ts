export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

export enum VehicleClass {
  MOTORCYCLE = 'MOTORCYCLE',
  SEDAN = 'SEDAN',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  BUS = 'BUS',
}

export enum TransactionType {
  DEBIT = 'DEBIT',
  TOPUP = 'TOPUP',
  REFUND = 'REFUND',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

export enum ViolationType {
  NO_RFID = 'NO_RFID',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  RFID_ANPR_MISMATCH = 'RFID_ANPR_MISMATCH',
  UNREGISTERED_VEHICLE = 'UNREGISTERED_VEHICLE',
}

export enum ViolationStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  ESCALATED = 'ESCALATED',
  DISMISSED = 'DISMISSED',
}

export enum TollEventStatus {
  ENTRY = 'ENTRY',
  EXIT = 'EXIT',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Account {
  id: string;
  userId: string;
  balance: number;
  status: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vehicleClass: VehicleClass;
  status: string;
}

export interface TollPlaza {
  id: string;
  name: string;
  locationLat: number;
  locationLng: number;
  lanes: number;
  status: string;
}

export interface TollRate {
  id: string;
  plazaId: string;
  vehicleClass: VehicleClass;
  rateAmount: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface TollEvent {
  id: string;
  vehicleId: string;
  plazaId: string;
  rfidTagId?: string;
  anprPlate?: string;
  entryTime: string;
  exitTime?: string;
  status: TollEventStatus;
  vehicle?: Vehicle;
  plaza?: TollPlaza;
}

export interface Transaction {
  id: string;
  accountId: string;
  eventId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}

export interface Violation {
  id: string;
  vehicleId: string;
  eventId: string;
  violationType: ViolationType;
  status: ViolationStatus;
  fineAmount: number;
  dueDate: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: string; email: string; name: string; role: string };
  token: string;
}

export interface CreateVehicleRequest {
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  vehicleClass: VehicleClass;
}

export interface TollEventEntryRequest {
  vehicleId: string;
  plazaId: string;
  rfidTagId?: string;
  anprPlate?: string;
}

export interface TollEventExitRequest {
  anprPlate?: string;
}

export interface TopUpRequest {
  amount: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
