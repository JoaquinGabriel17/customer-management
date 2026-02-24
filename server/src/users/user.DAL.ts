import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const safeSelect = {
  id: true, name: true, email: true,
  role: true, createdAt: true, updatedAt: true
};

export const getAllUsers = async (): Promise<any[]> => {
  return await prisma.user.findMany({ select: safeSelect });
}

export const getUserById = async (id: number): Promise<any | null> => {
  return await prisma.user.findUnique({
    where: { id },
    select: safeSelect
  });
}

export const updateUser = async (id: number, name: string, email: string): Promise<any> => {
  return await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
      select: safeSelect
    });
};

export const deleteUser = async (id: number): Promise<void> => {
  await prisma.user.delete({ where: { id: Number(id) } });
};