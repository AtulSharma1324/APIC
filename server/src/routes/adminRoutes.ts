import { Router } from 'express';
import { getAdminDashboardStats, getAIKnowledgeBase } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';

const router = Router();

router.get('/dashboard', authenticateToken, requireAdmin, getAdminDashboardStats);
router.get('/ai-knowledge', authenticateToken, requireAdmin, getAIKnowledgeBase);

export default router;
