import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../errors/AppError.utils';


export interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const authenticate = asyncHandler( (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new AppError('Token requerido', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Token inválido o expirado', 401));
  }
});

export const isAdmin = asyncHandler((req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Acceso denegado', 403));
  }
  next();
});