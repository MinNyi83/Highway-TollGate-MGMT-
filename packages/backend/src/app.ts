import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/toll-plazas', tollPlazasRoutes);
app.use('/api/toll-events', tollEventsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/violations', violationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/device-status', deviceStatusRoutes);

export default app;
