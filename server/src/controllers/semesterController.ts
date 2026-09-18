import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getSemesters = async (req: Request, res: Response) => {
  try {
    const programId = req.query.programId ? parseInt(req.query.programId as string, 10) : null;
    let list: any[] = [];

    try {
      if (programId) {
        const dbRes = await dbQuery(
          `SELECT sem.*, p.name as program_name FROM semesters sem 
           JOIN programs p ON sem.program_id = p.id 
           WHERE sem.program_id = $1 ORDER BY sem.semester_number ASC`,
          [programId]
        );
        list = dbRes ? dbRes.rows : [];
      } else {
        const dbRes = await dbQuery(
          `SELECT sem.*, p.name as program_name FROM semesters sem 
           JOIN programs p ON sem.program_id = p.id 
           ORDER BY sem.program_id ASC, sem.semester_number ASC`
        );
        list = dbRes ? dbRes.rows : [];
      }
    } catch {
      let filtered = memoryStore.semesters;
      if (programId) {
        filtered = filtered.filter(s => s.program_id === programId);
      }
      list = filtered.map(s => {
        const prog = memoryStore.programs.find(p => p.id === s.program_id);
        return {
          ...s,
          program_name: prog ? prog.name : 'N/A'
        };
      });
    }

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch semesters' });
  }
};

export const createSemester = async (req: Request, res: Response) => {
  try {
    const { programId, semesterNumber, name } = req.body;

    if (!programId || !semesterNumber) {
      return res.status(400).json({ success: false, message: 'Program ID and semester number are required' });
    }

    const semName = name || `Semester ${semesterNumber}`;

    let newSem: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO semesters (program_id, semester_number, name) 
         VALUES ($1, $2, $3) RETURNING *`,
        [programId, semesterNumber, semName]
      );
      if (dbRes && dbRes.rows.length > 0) newSem = dbRes.rows[0];
    } catch {
      const id = memoryStore.semesters.length + 1;
      newSem = {
        id,
        program_id: programId,
        semester_number: semesterNumber,
        name: semName,
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      memoryStore.semesters.push(newSem);
    }

    res.status(201).json({ success: true, data: newSem });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create semester' });
  }
};

export const updateSemester = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { programId, semesterNumber, name, status } = req.body;

    let updated: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE semesters SET program_id = COALESCE($1, program_id), 
         semester_number = COALESCE($2, semester_number), name = COALESCE($3, name), 
         status = COALESCE($4, status) WHERE id = $5 RETURNING *`,
        [programId, semesterNumber, name, status, id]
      );
      if (dbRes && dbRes.rows.length > 0) updated = dbRes.rows[0];
    } catch {
      const idx = memoryStore.semesters.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.semesters[idx] = {
          ...memoryStore.semesters[idx],
          program_id: programId ?? memoryStore.semesters[idx].program_id,
          semester_number: semesterNumber ?? memoryStore.semesters[idx].semester_number,
          name: name ?? memoryStore.semesters[idx].name,
          status: status ?? memoryStore.semesters[idx].status
        };
        updated = memoryStore.semesters[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Semester not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update semester' });
  }
};

export const deleteSemester = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    try {
      await dbQuery(`DELETE FROM semesters WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.semesters.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.semesters.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'Semester deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete semester' });
  }
};
