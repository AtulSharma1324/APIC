import { Router } from 'express';
import { getUsers } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', authenticateToken, requireAdmin, getUsers);

export default router;
