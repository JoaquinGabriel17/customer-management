import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../auth/auth.middleware';

const prisma = new PrismaClient();

const safeSelect = {
  id: true, name: true, email: true,
  role: true, createdAt: true, updatedAt: true
};

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({ select: safeSelect });
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: safeSelect
    });
    if (!user) { res.status(404).json({ message: 'Usuario no encontrado' }); return; }
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email },
      select: safeSelect
    });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.json({ message: 'Usuario eliminado' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};