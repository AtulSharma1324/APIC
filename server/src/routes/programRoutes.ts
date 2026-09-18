import { Router } from 'express';
import { getPrograms, getProgramById, createProgram, updateProgram, deleteProgram } from '../controllers/programController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getPrograms);
router.get('/:id', getProgramById);
router.post('/', authenticateToken, requireAdmin, createProgram);
router.put('/:id', authenticateToken, requireAdmin, updateProgram);
router.delete('/:id', authenticateToken, requireAdmin, deleteProgram);

export default router;
