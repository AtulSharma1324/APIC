import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getPrograms = async (req: Request, res: Response) => {
  try {
    let programs: any[] = [];
    let specializations: any[] = [];

    try {
      const pRes = await dbQuery(`SELECT * FROM programs WHERE status = 'ACTIVE' ORDER BY id ASC`);
      const sRes = await dbQuery(`SELECT * FROM specializations WHERE status = 'ACTIVE' ORDER BY id ASC`);
      programs = pRes ? pRes.rows : [];
      specializations = sRes ? sRes.rows : [];
    } catch {
      programs = memoryStore.programs.filter(p => p.status === 'ACTIVE');
      specializations = memoryStore.specializations.filter(s => s.status === 'ACTIVE');
    }

    const result = programs.map(p => ({
      ...p,
      specializations: specializations.filter(s => s.program_id === p.id)
    }));

    res.json({
      success: true,
      data: result
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch programs' });
  }
};

export const getProgramById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    let program: any = null;
    let specializations: any[] = [];
    let semesters: any[] = [];

    try {
      const pRes = await dbQuery(`SELECT * FROM programs WHERE id = $1`, [id]);
      const sRes = await dbQuery(`SELECT * FROM specializations WHERE program_id = $1 AND status = 'ACTIVE'`, [id]);
      const semRes = await dbQuery(`SELECT * FROM semesters WHERE program_id = $1 ORDER BY semester_number ASC`, [id]);
      if (pRes && pRes.rows.length > 0) program = pRes.rows[0];
      specializations = sRes ? sRes.rows : [];
      semesters = semRes ? semRes.rows : [];
    } catch {
      program = memoryStore.programs.find(p => p.id === id);
      specializations = memoryStore.specializations.filter(s => s.program_id === id && s.status === 'ACTIVE');
      semesters = memoryStore.semesters.filter(sem => sem.program_id === id);
    }

    if (!program) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({
      success: true,
      data: {
        ...program,
        specializations,
        semesters
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch program details' });
  }
};

export const createProgram = async (req: Request, res: Response) => {
  try {
    const { code, name, description, durationYears, totalSemesters } = req.body;

    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'Program code and name are required' });
    }

    let newProg: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO programs (code, name, description, duration_years, total_semesters) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [code, name, description || '', durationYears || 2, totalSemesters || 4]
      );
      if (dbRes && dbRes.rows.length > 0) newProg = dbRes.rows[0];
    } catch {
      const id = memoryStore.programs.length + 1;
      newProg = {
        id,
        code,
        name,
        description: description || '',
        duration_years: durationYears || 2,
        total_semesters: totalSemesters || 4,
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      memoryStore.programs.push(newProg);
    }

    res.status(201).json({ success: true, data: newProg });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create program' });
  }
};

export const updateProgram = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { code, name, description, durationYears, totalSemesters, status } = req.body;

    let updatedProg: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE programs SET code = COALESCE($1, code), name = COALESCE($2, name), 
         description = COALESCE($3, description), duration_years = COALESCE($4, duration_years), 
         total_semesters = COALESCE($5, total_semesters), status = COALESCE($6, status), 
         updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *`,
        [code, name, description, durationYears, totalSemesters, status, id]
      );
      if (dbRes && dbRes.rows.length > 0) updatedProg = dbRes.rows[0];
    } catch {
      const idx = memoryStore.programs.findIndex(p => p.id === id);
      if (idx !== -1) {
        memoryStore.programs[idx] = {
          ...memoryStore.programs[idx],
          code: code ?? memoryStore.programs[idx].code,
          name: name ?? memoryStore.programs[idx].name,
          description: description ?? memoryStore.programs[idx].description,
          duration_years: durationYears ?? memoryStore.programs[idx].duration_years,
          total_semesters: totalSemesters ?? memoryStore.programs[idx].total_semesters,
          status: status ?? memoryStore.programs[idx].status,
          updated_at: new Date().toISOString()
        };
        updatedProg = memoryStore.programs[idx];
      }
    }

    if (!updatedProg) {
      return res.status(404).json({ success: false, message: 'Program not found' });
    }

    res.json({ success: true, data: updatedProg });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update program' });
  }
};

export const deleteProgram = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    try {
      await dbQuery(`DELETE FROM programs WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.programs.findIndex(p => p.id === id);
      if (idx !== -1) {
        memoryStore.programs.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'Program deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete program' });
  }
};
