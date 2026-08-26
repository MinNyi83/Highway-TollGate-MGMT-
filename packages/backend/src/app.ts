import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import accountsRoutes from './modules/accounts/accounts.routes';
import vehiclesRoutes from './modules/vehicles/vehicles.routes';
import tollPlazasRoutes from './modules/toll-plazas/toll-plazas.routes';
import tollEventsRoutes from './modules/toll-events/toll-events.routes';
import transactionsRoutes from './modules/transactions/transactions.routes';
import violationsRoutes from './modules/violations/violations.routes';
import notificationsRoutes from './modules/notifications/notifications.routes';
import deviceStatusRoutes from './modules/device-status/device-status.routes';
import reportsRoutes from './modules/reports/reports.routes';
import auditRoutes from './modules/audit/audit.routes';
import customerAuthRoutes from './modules/customer/customer.routes';
import customerDataRoutes from './modules/customer/customer-data.routes';
import customerVehiclesRoutes from './modules/customer/customer-vehicles.routes';
import fleetRoutes from './modules/fleet/fleet.routes';
import paymentRoutes from './modules/payments/payments.routes';
import featuresRoutes from './modules/features/features.routes';
import { setupSwagger } from './config/swagger';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { authLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(helmet());
app.use(express.json());

setupSwagger(app);

app.use('/api', healthRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/toll-plazas', tollPlazasRoutes);
app.use('/api/toll-events', tollEventsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/violations', violationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/device-status', deviceStatusRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/customer', customerAuthRoutes);
app.use('/api/customer', customerDataRoutes);
app.use('/api/customer', customerVehiclesRoutes);
app.use('/api/fleet', fleetRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/features', featuresRoutes);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(errorHandler);

export default app;
