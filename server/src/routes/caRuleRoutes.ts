import { Router } from 'express';
import { getCARules, createCARule, updateCARule, deleteCARule } from '../controllers/caRuleController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/', getCARules);
router.post('/', authenticateToken, requireAdmin, createCARule);
router.put('/:id', authenticateToken, requireAdmin, updateCARule);
router.delete('/:id', authenticateToken, requireAdmin, deleteCARule);

export default router;
