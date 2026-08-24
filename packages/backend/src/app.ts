import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import healthRoutes from './routes/health';
import authRoutes from './modules/auth/auth.routes';

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

export default app;
