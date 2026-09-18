import { Router } from 'express';
import { getSubjects, getSubjectById, createSubject, updateSubject, deleteSubject } from '../controllers/subjectController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getSubjects);
router.get('/:id', getSubjectById);
router.post('/', authenticateToken, requireAdmin, createSubject);
router.put('/:id', authenticateToken, requireAdmin, updateSubject);
router.delete('/:id', authenticateToken, requireAdmin, deleteSubject);

export default router;
