import { Router } from 'express';
import { getSpecializations, createSpecialization, updateSpecialization, deleteSpecialization } from '../controllers/specializationController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getSpecializations);
router.post('/', authenticateToken, requireAdmin, createSpecialization);
router.put('/:id', authenticateToken, requireAdmin, updateSpecialization);
router.delete('/:id', authenticateToken, requireAdmin, deleteSpecialization);

export default router;
