import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from './auth.DAL';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../errors/AppError.utils';

export const register = asyncHandler( async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, email, password } = req.body;
    // Si ya hay un usuario con el email se devuelve error.
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return next(new AppError('El email ya está registrado', 400));  
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword);

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
});

export const login = asyncHandler( async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  
    const user = await findUserByEmail(email);
    if (!user) {
      return next(new AppError('Credenciales inválidas', 401));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return next(new AppError('Credenciales inválidas', 401));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });

});