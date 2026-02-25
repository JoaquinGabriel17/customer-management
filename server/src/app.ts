import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './auth/auth.routes';
import userRoutes from './users/user.routes';
import { globalErrorHandler } from './errors/errorHandler.middleware';
import { AppError } from './errors/AppError.utils';

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/users', userRoutes);


app.get('/health', (_req, res) => {
  res.json({ status: 'OK', message: 'CRM API running' });
});

// Ruta para manejar 404 (si llega aquí es que ninguna ruta coincidió)
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// EL MANEJADOR GLOBAL
app.use(globalErrorHandler);

export default app; // Exportamos la instancia de la app