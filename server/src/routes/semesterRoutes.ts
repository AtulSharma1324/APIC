import { Router } from 'express';
import { getSemesters, createSemester, updateSemester, deleteSemester } from '../controllers/semesterController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getSemesters);
router.post('/', authenticateToken, requireAdmin, createSemester);
router.put('/:id', authenticateToken, requireAdmin, updateSemester);
router.delete('/:id', authenticateToken, requireAdmin, deleteSemester);

export default router;
