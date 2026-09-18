import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getAdminDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let totalPrograms = 0;
    let totalSpecializations = 0;
    let totalSubjects = 0;
    let totalSyllabus = 0;
    let totalStudents = 0;
    let recentSubjects: any[] = [];
    let recentSyllabus: any[] = [];

    try {
      const pCount = await dbQuery(`SELECT COUNT(*) FROM programs WHERE status = 'ACTIVE'`);
      const spCount = await dbQuery(`SELECT COUNT(*) FROM specializations WHERE status = 'ACTIVE'`);
      const subCount = await dbQuery(`SELECT COUNT(*) FROM subjects WHERE status = 'ACTIVE'`);
      const sylCount = await dbQuery(`SELECT COUNT(*) FROM syllabus`);
      const uCount = await dbQuery(`SELECT COUNT(*) FROM users WHERE role = 'STUDENT'`);

      totalPrograms = parseInt(pCount?.rows[0].count || '0', 10);
      totalSpecializations = parseInt(spCount?.rows[0].count || '0', 10);
      totalSubjects = parseInt(subCount?.rows[0].count || '0', 10);
      totalSyllabus = parseInt(sylCount?.rows[0].count || '0', 10);
      totalStudents = parseInt(uCount?.rows[0].count || '0', 10);

      const recentSubRes = await dbQuery(`SELECT * FROM subjects ORDER BY id DESC LIMIT 5`);
      recentSubjects = recentSubRes ? recentSubRes.rows : [];

      const recentSylRes = await dbQuery(`
        SELECT syl.*, sub.course_code, sub.name as subject_name 
        FROM syllabus syl JOIN subjects sub ON syl.subject_id = sub.id 
        ORDER BY syl.id DESC LIMIT 5
      `);
      recentSyllabus = recentSylRes ? recentSylRes.rows : [];
    } catch {
      totalPrograms = memoryStore.programs.filter(p => p.status === 'ACTIVE').length;
      totalSpecializations = memoryStore.specializations.filter(s => s.status === 'ACTIVE').length;
      totalSubjects = memoryStore.subjects.filter(s => s.status === 'ACTIVE').length;
      totalSyllabus = memoryStore.syllabus.length;
      totalStudents = memoryStore.users.filter(u => u.role === 'STUDENT').length;

      recentSubjects = memoryStore.subjects.slice(-5).reverse();
      recentSyllabus = memoryStore.syllabus.slice(-5).map(syl => {
        const sub = memoryStore.subjects.find(s => s.id === syl.subject_id);
        return {
          ...syl,
          course_code: sub ? sub.course_code : 'N/A',
          subject_name: sub ? sub.name : 'N/A'
        };
      }).reverse();
    }

    res.json({
      success: true,
      data: {
        stats: {
          totalPrograms,
          totalSpecializations,
          totalSubjects,
          totalSyllabus,
          totalStudents
        },
        recentSubjects,
        recentSyllabus
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch admin stats' });
  }
};

export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let usersList: any[] = [];
    try {
      const dbRes = await dbQuery(
        `SELECT u.id, u.name, u.email, u.student_id, u.role, u.current_semester, u.created_at,
                p.name as program_name, sp.name as specialization_name
         FROM users u
         LEFT JOIN programs p ON u.program_id = p.id
         LEFT JOIN specializations sp ON u.specialization_id = sp.id
         ORDER BY u.id ASC`
      );
      usersList = dbRes ? dbRes.rows : [];
    } catch {
      usersList = memoryStore.users.map(u => {
        const { password_hash, ...rest } = u;
        const prog = memoryStore.programs.find(p => p.id === u.program_id);
        const spec = memoryStore.specializations.find(s => s.id === u.specialization_id);
        return {
          ...rest,
          program_name: prog ? prog.name : 'N/A',
          specialization_name: spec ? spec.name : 'N/A'
        };
      });
    }

    res.json({ success: true, data: usersList });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch users' });
  }
};

export const getAIKnowledgeBase = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let documents: any[] = [];
    let indexedSyllabus: any[] = [];

    try {
      const docRes = await dbQuery(`SELECT * FROM academic_documents ORDER BY id DESC`);
      const sylRes = await dbQuery(`
        SELECT syl.*, sub.course_code, sub.name as subject_name 
        FROM syllabus syl JOIN subjects sub ON syl.subject_id = sub.id 
        ORDER BY syl.id DESC
      `);
      documents = docRes ? docRes.rows : [];
      indexedSyllabus = sylRes ? sylRes.rows : [];
    } catch {
      documents = memoryStore.academicDocuments;
      indexedSyllabus = memoryStore.syllabus.map(syl => {
        const sub = memoryStore.subjects.find(s => s.id === syl.subject_id);
        return {
          ...syl,
          course_code: sub ? sub.course_code : 'N/A',
          subject_name: sub ? sub.name : 'N/A'
        };
      });
    }

    res.json({
      success: true,
      data: {
        documents,
        indexedSyllabus
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch AI knowledge base' });
  }
};
