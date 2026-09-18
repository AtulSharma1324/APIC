import { Request, Response } from 'express';
import { searchAcademicData } from '../services/aiService';

export const searchGlobal = async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q || q.trim() === '') {
      return res.json({
        success: true,
        data: {
          programs: [],
          specializations: [],
          subjects: [],
          syllabus: [],
          caRules: []
        }
      });
    }

    const searchResults = await searchAcademicData(q);

    res.json({
      success: true,
      data: searchResults
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Global search failed' });
  }
};
