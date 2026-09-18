import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const specializationId = req.query.specializationId ? parseInt(req.query.specializationId as string, 10) : null;
    const semesterId = req.query.semesterId ? parseInt(req.query.semesterId as string, 10) : null;
    const programId = req.query.programId ? parseInt(req.query.programId as string, 10) : null;

    let list: any[] = [];

    try {
      let sql = `
        SELECT sub.*, sp.name as specialization_name, sp.program_id, p.name as program_name, sem.semester_number, sem.name as semester_name,
               syl.file_url as syllabus_url, syl.file_name as syllabus_file_name, syl.version as syllabus_version
        FROM subjects sub
        LEFT JOIN specializations sp ON sub.specialization_id = sp.id
        LEFT JOIN programs p ON sp.program_id = p.id
        LEFT JOIN semesters sem ON sub.semester_id = sem.id
        LEFT JOIN syllabus syl ON syl.subject_id = sub.id
        WHERE sub.status = 'ACTIVE'
      `;
      const params: any[] = [];

      if (specializationId) {
        params.push(specializationId);
        sql += ` AND sub.specialization_id = $${params.length}`;
      }
      if (semesterId) {
        params.push(semesterId);
        sql += ` AND sub.semester_id = $${params.length}`;
      }
      if (programId) {
        params.push(programId);
        sql += ` AND sp.program_id = $${params.length}`;
      }

      sql += ` ORDER BY sub.course_code ASC`;

      const dbRes = await dbQuery(sql, params);
      list = dbRes ? dbRes.rows : [];
    } catch {
      let filtered = memoryStore.subjects.filter(s => s.status === 'ACTIVE');

      if (specializationId) {
        filtered = filtered.filter(s => s.specialization_id === specializationId);
      }
      if (semesterId) {
        filtered = filtered.filter(s => s.semester_id === semesterId);
      }

      list = filtered.map(sub => {
        const spec = memoryStore.specializations.find(sp => sp.id === sub.specialization_id);
        const prog = spec ? memoryStore.programs.find(p => p.id === spec.program_id) : null;
        const sem = memoryStore.semesters.find(sm => sm.id === sub.semester_id);
        const syl = memoryStore.syllabus.find(sy => sy.subject_id === sub.id);

        if (programId && prog && prog.id !== programId) {
          return null;
        }

        return {
          ...sub,
          specialization_name: spec ? spec.name : 'N/A',
          program_id: prog ? prog.id : null,
          program_name: prog ? prog.name : 'N/A',
          semester_number: sem ? sem.semester_number : 1,
          semester_name: sem ? sem.name : 'N/A',
          syllabus_url: syl ? syl.file_url : null,
          syllabus_file_name: syl ? syl.file_name : null,
          syllabus_version: syl ? syl.version : null
        };
      }).filter(Boolean);
    }

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch subjects' });
  }
};

export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    let subject: any = null;
    let syllabus: any = null;
    let caRule: any = null;

    try {
      const subRes = await dbQuery(
        `SELECT sub.*, sp.name as specialization_name, sp.program_id, p.name as program_name, sem.semester_number, sem.name as semester_name
         FROM subjects sub
         LEFT JOIN specializations sp ON sub.specialization_id = sp.id
         LEFT JOIN programs p ON sp.program_id = p.id
         LEFT JOIN semesters sem ON sub.semester_id = sem.id
         WHERE sub.id = $1`,
        [id]
      );
      if (subRes && subRes.rows.length > 0) {
        subject = subRes.rows[0];
        const sylRes = await dbQuery(`SELECT * FROM syllabus WHERE subject_id = $1`, [id]);
        if (sylRes && sylRes.rows.length > 0) syllabus = sylRes.rows[0];

        const caRes = await dbQuery(
          `SELECT * FROM ca_rules WHERE program_id = $1 AND semester_id = $2`,
          [subject.program_id, subject.semester_id]
        );
        if (caRes && caRes.rows.length > 0) caRule = caRes.rows[0];
      }
    } catch {
      const foundSub = memoryStore.subjects.find(s => s.id === id);
      if (foundSub) {
        const spec = memoryStore.specializations.find(sp => sp.id === foundSub.specialization_id);
        const prog = spec ? memoryStore.programs.find(p => p.id === spec.program_id) : null;
        const sem = memoryStore.semesters.find(sm => sm.id === foundSub.semester_id);
        const foundSyl = memoryStore.syllabus.find(sy => sy.subject_id === foundSub.id);
        const foundCa = prog && sem ? memoryStore.caRules.find(ca => ca.program_id === prog.id && ca.semester_id === sem.id) : null;

        subject = {
          ...foundSub,
          specialization_name: spec ? spec.name : 'N/A',
          program_id: prog ? prog.id : null,
          program_name: prog ? prog.name : 'N/A',
          semester_number: sem ? sem.semester_number : 1,
          semester_name: sem ? sem.name : 'N/A'
        };
        syllabus = foundSyl || null;
        caRule = foundCa || null;
      }
    }

    if (!subject) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.json({
      success: true,
      data: {
        ...subject,
        syllabus,
        caRule
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch subject details' });
  }
};

export const createSubject = async (req: Request, res: Response) => {
  try {
    const { specializationId, semesterId, courseCode, name, subjectType, credits, description } = req.body;

    if (!courseCode || !name || !credits) {
      return res.status(400).json({ success: false, message: 'Course code, subject name, and credits are required' });
    }

    const numCredits = parseFloat(credits);
    if (isNaN(numCredits) || numCredits <= 0) {
      return res.status(400).json({ success: false, message: 'Credits must be a valid positive number' });
    }

    let newSub: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO subjects (specialization_id, semester_id, course_code, name, subject_type, credits, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [specializationId || null, semesterId || null, courseCode.toUpperCase(), name, subjectType || 'Core', numCredits, description || '']
      );
      if (dbRes && dbRes.rows.length > 0) newSub = dbRes.rows[0];
    } catch {
      const id = memoryStore.subjects.length + 1;
      newSub = {
        id,
        specialization_id: specializationId || 1,
        semester_id: semesterId || 1,
        course_code: courseCode.toUpperCase(),
        name,
        subject_type: subjectType || 'Core',
        credits: numCredits,
        description: description || '',
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      memoryStore.subjects.push(newSub);
    }

    res.status(201).json({ success: true, data: newSub });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create subject' });
  }
};

export const updateSubject = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { specializationId, semesterId, courseCode, name, subjectType, credits, description, status } = req.body;

    let updated: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE subjects SET specialization_id = COALESCE($1, specialization_id), 
         semester_id = COALESCE($2, semester_id), course_code = COALESCE($3, course_code), 
         name = COALESCE($4, name), subject_type = COALESCE($5, subject_type), 
         credits = COALESCE($6, credits), description = COALESCE($7, description), 
         status = COALESCE($8, status), updated_at = CURRENT_TIMESTAMP 
         WHERE id = $9 RETURNING *`,
        [specializationId, semesterId, courseCode ? courseCode.toUpperCase() : null, name, subjectType, credits ? parseFloat(credits) : null, description, status, id]
      );
      if (dbRes && dbRes.rows.length > 0) updated = dbRes.rows[0];
    } catch {
      const idx = memoryStore.subjects.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.subjects[idx] = {
          ...memoryStore.subjects[idx],
          specialization_id: specializationId ?? memoryStore.subjects[idx].specialization_id,
          semester_id: semesterId ?? memoryStore.subjects[idx].semester_id,
          course_code: courseCode ? courseCode.toUpperCase() : memoryStore.subjects[idx].course_code,
          name: name ?? memoryStore.subjects[idx].name,
          subject_type: subjectType ?? memoryStore.subjects[idx].subject_type,
          credits: credits ? parseFloat(credits) : memoryStore.subjects[idx].credits,
          description: description ?? memoryStore.subjects[idx].description,
          status: status ?? memoryStore.subjects[idx].status,
          updated_at: new Date().toISOString()
        };
        updated = memoryStore.subjects[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update subject' });
  }
};

export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    try {
      await dbQuery(`DELETE FROM subjects WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.subjects.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.subjects.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'Subject deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete subject' });
  }
};
