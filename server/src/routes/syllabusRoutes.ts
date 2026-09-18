import { Router } from 'express';
import { getSyllabusList, createSyllabus, updateSyllabus, deleteSyllabus } from '../controllers/syllabusController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getSyllabusList);
router.post('/', authenticateToken, requireAdmin, createSyllabus);
router.put('/:id', authenticateToken, requireAdmin, updateSyllabus);
router.delete('/:id', authenticateToken, requireAdmin, deleteSyllabus);

export default router;
