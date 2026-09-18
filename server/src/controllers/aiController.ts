import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { answerAcademicQuery } from '../services/aiService';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const handleAIChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, contextInfo } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, message: 'Message query string is required' });
    }

    const aiResult = await answerAcademicQuery(message, contextInfo);

    // Optionally log conversation in background
    try {
      const userId = req.user ? req.user.id : null;
      const sourcesText = aiResult.sources.join(', ');
      await dbQuery(
        `INSERT INTO ai_conversations (user_id, query, response, sources_used) VALUES ($1, $2, $3, $4)`,
        [userId, message, aiResult.text, sourcesText]
      );
    } catch {
      memoryStore.aiConversations.push({
        id: memoryStore.aiConversations.length + 1,
        user_id: req.user?.id,
        query: message,
        response: aiResult.text,
        sources_used: aiResult.sources.join(', '),
        created_at: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: {
        text: aiResult.text,
        sources: aiResult.sources
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'AI Assistant service unavailable' });
  }
};
