import { Router } from 'express';
import { authenticate, isAdmin } from '../auth/auth.middleware';
import { getAllUsers, getUserById, updateUser, deleteUser } from './user.controller';

const router = Router();

router.get('/', authenticate, isAdmin, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, isAdmin, deleteUser);

export default router;