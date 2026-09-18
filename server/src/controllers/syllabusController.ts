import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';
import { uploadSyllabusFile } from '../services/storageService';

export const getSyllabusList = async (req: Request, res: Response) => {
  try {
    const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string, 10) : null;
    const search = req.query.q ? (req.query.q as string).toLowerCase().trim() : null;

    let list: any[] = [];

    try {
      let sql = `
        SELECT syl.*, sub.course_code, sub.name as subject_name, sub.specialization_id, sub.semester_id,
               sp.name as specialization_name, p.name as program_name
        FROM syllabus syl
        JOIN subjects sub ON syl.subject_id = sub.id
        LEFT JOIN specializations sp ON sub.specialization_id = sp.id
        LEFT JOIN programs p ON sp.program_id = p.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (subjectId) {
        params.push(subjectId);
        sql += ` AND syl.subject_id = $${params.length}`;
      }
      if (search) {
        params.push(`%${search}%`);
        sql += ` AND (LOWER(sub.course_code) LIKE $${params.length} OR LOWER(sub.name) LIKE $${params.length} OR LOWER(syl.file_name) LIKE $${params.length})`;
      }

      sql += ` ORDER BY syl.id DESC`;

      const dbRes = await dbQuery(sql, params);
      list = dbRes ? dbRes.rows : [];
    } catch {
      let filtered = memoryStore.syllabus;

      if (subjectId) {
        filtered = filtered.filter(s => s.subject_id === subjectId);
      }

      list = filtered.map(syl => {
        const sub = memoryStore.subjects.find(s => s.id === syl.subject_id);
        const spec = sub ? memoryStore.specializations.find(sp => sp.id === sub.specialization_id) : null;
        const prog = spec ? memoryStore.programs.find(p => p.id === spec.program_id) : null;

        if (search && sub) {
          const matchCode = sub.course_code.toLowerCase().includes(search);
          const matchName = sub.name.toLowerCase().includes(search);
          const matchFile = syl.file_name.toLowerCase().includes(search);
          if (!matchCode && !matchName && !matchFile) return null;
        }

        return {
          ...syl,
          course_code: sub ? sub.course_code : 'N/A',
          subject_name: sub ? sub.name : 'N/A',
          specialization_name: spec ? spec.name : 'N/A',
          program_name: prog ? prog.name : 'N/A'
        };
      }).filter(Boolean);
    }

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch syllabus documents' });
  }
};

export const createSyllabus = async (req: Request, res: Response) => {
  try {
    const { subjectId, fileUrl, fileName, version, description } = req.body;

    if (!subjectId) {
      return res.status(400).json({ success: false, message: 'Subject ID is required' });
    }

    let finalUrl = fileUrl;
    let finalFileName = fileName || `Syllabus_Subject_${subjectId}.pdf`;

    // Handle direct URL or fallback
    if (!finalUrl) {
      finalUrl = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf';
    }

    let newSyl: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO syllabus (subject_id, file_url, file_name, version, description) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [subjectId, finalUrl, finalFileName, version || '1.0', description || '']
      );
      if (dbRes && dbRes.rows.length > 0) newSyl = dbRes.rows[0];
    } catch {
      const id = memoryStore.syllabus.length + 1;
      newSyl = {
        id,
        subject_id: subjectId,
        file_url: finalUrl,
        file_name: finalFileName,
        version: version || '1.0',
        description: description || '',
        uploaded_at: new Date().toISOString()
      };
      memoryStore.syllabus.push(newSyl);
    }

    res.status(201).json({ success: true, data: newSyl });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create syllabus entry' });
  }
};

export const updateSyllabus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { fileUrl, fileName, version, description } = req.body;

    let updated: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE syllabus SET file_url = COALESCE($1, file_url), file_name = COALESCE($2, file_name), 
         version = COALESCE($3, version), description = COALESCE($4, description) 
         WHERE id = $5 RETURNING *`,
        [fileUrl, fileName, version, description, id]
      );
      if (dbRes && dbRes.rows.length > 0) updated = dbRes.rows[0];
    } catch {
      const idx = memoryStore.syllabus.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.syllabus[idx] = {
          ...memoryStore.syllabus[idx],
          file_url: fileUrl ?? memoryStore.syllabus[idx].file_url,
          file_name: fileName ?? memoryStore.syllabus[idx].file_name,
          version: version ?? memoryStore.syllabus[idx].version,
          description: description ?? memoryStore.syllabus[idx].description
        };
        updated = memoryStore.syllabus[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Syllabus entry not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update syllabus entry' });
  }
};

export const deleteSyllabus = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    try {
      await dbQuery(`DELETE FROM syllabus WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.syllabus.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.syllabus.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'Syllabus document deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete syllabus document' });
  }
};
