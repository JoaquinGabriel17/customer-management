import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError.utils';


export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

  // En desarrollo queremos ver todo el stack trace, en producción no.
  if (process.env.ENV === 'development') {
    res.status(statusCode).json({
      status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  } else {
    // Producción: No filtramos detalles sensibles
    res.status(statusCode).json({
      status,
      message: err.isOperational ? err.message : 'Something went very wrong!'
    });
  }
};