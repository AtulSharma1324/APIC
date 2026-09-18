import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const programId = req.query.programId ? parseInt(req.query.programId as string, 10) : null;
    let list: any[] = [];

    try {
      if (programId) {
        const dbRes = await dbQuery(
          `SELECT s.*, p.name as program_name FROM specializations s 
           JOIN programs p ON s.program_id = p.id 
           WHERE s.program_id = $1 AND s.status = 'ACTIVE' ORDER BY s.id ASC`,
          [programId]
        );
        list = dbRes ? dbRes.rows : [];
      } else {
        const dbRes = await dbQuery(
          `SELECT s.*, p.name as program_name FROM specializations s 
           JOIN programs p ON s.program_id = p.id 
           WHERE s.status = 'ACTIVE' ORDER BY s.id ASC`
        );
        list = dbRes ? dbRes.rows : [];
      }
    } catch {
      let filtered = memoryStore.specializations.filter(s => s.status === 'ACTIVE');
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
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch specializations' });
  }
};

export const createSpecialization = async (req: Request, res: Response) => {
  try {
    const { programId, code, name, description } = req.body;

    if (!programId || !code || !name) {
      return res.status(400).json({ success: false, message: 'Program ID, code, and name are required' });
    }

    let newSpec: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO specializations (program_id, code, name, description) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [programId, code, name, description || '']
      );
      if (dbRes && dbRes.rows.length > 0) newSpec = dbRes.rows[0];
    } catch {
      const id = memoryStore.specializations.length + 1;
      newSpec = {
        id,
        program_id: programId,
        code,
        name,
        description: description || '',
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      memoryStore.specializations.push(newSpec);
    }

    res.status(201).json({ success: true, data: newSpec });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create specialization' });
  }
};

export const updateSpecialization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { programId, code, name, description, status } = req.body;

    let updatedSpec: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE specializations SET program_id = COALESCE($1, program_id), code = COALESCE($2, code), 
         name = COALESCE($3, name), description = COALESCE($4, description), status = COALESCE($5, status), 
         updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
        [programId, code, name, description, status, id]
      );
      if (dbRes && dbRes.rows.length > 0) updatedSpec = dbRes.rows[0];
    } catch {
      const idx = memoryStore.specializations.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.specializations[idx] = {
          ...memoryStore.specializations[idx],
          program_id: programId ?? memoryStore.specializations[idx].program_id,
          code: code ?? memoryStore.specializations[idx].code,
          name: name ?? memoryStore.specializations[idx].name,
          description: description ?? memoryStore.specializations[idx].description,
          status: status ?? memoryStore.specializations[idx].status,
          updated_at: new Date().toISOString()
        };
        updatedSpec = memoryStore.specializations[idx];
      }
    }

    if (!updatedSpec) {
      return res.status(404).json({ success: false, message: 'Specialization not found' });
    }

    res.json({ success: true, data: updatedSpec });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update specialization' });
  }
};

export const deleteSpecialization = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);

    try {
      await dbQuery(`DELETE FROM specializations WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.specializations.findIndex(s => s.id === id);
      if (idx !== -1) {
        memoryStore.specializations.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'Specialization deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete specialization' });
  }
};
