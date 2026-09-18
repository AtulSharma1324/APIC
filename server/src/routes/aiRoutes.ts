import { Router } from 'express';
import { handleAIChat } from '../controllers/aiController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Allow authenticated users to query the AI assistant
router.post('/chat', authenticateToken, handleAIChat);

export default router;
