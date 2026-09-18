import { Request, Response } from 'express';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';

export const getCARules = async (req: Request, res: Response) => {
  try {
    const programId = req.query.programId ? parseInt(req.query.programId as string, 10) : null;
    const semesterId = req.query.semesterId ? parseInt(req.query.semesterId as string, 10) : null;

    let list: any[] = [];

    try {
      let sql = `
        SELECT ca.*, p.name as program_name, p.code as program_code, sem.semester_number, sem.name as semester_name
        FROM ca_rules ca
        JOIN programs p ON ca.program_id = p.id
        JOIN semesters sem ON ca.semester_id = sem.id
        WHERE 1=1
      `;
      const params: any[] = [];

      if (programId) {
        params.push(programId);
        sql += ` AND ca.program_id = $${params.length}`;
      }
      if (semesterId) {
        params.push(semesterId);
        sql += ` AND ca.semester_id = $${params.length}`;
      }

      sql += ` ORDER BY ca.program_id ASC, ca.semester_id ASC`;

      const dbRes = await dbQuery(sql, params);
      list = dbRes ? dbRes.rows : [];
    } catch {
      let filtered = memoryStore.caRules;

      if (programId) {
        filtered = filtered.filter(ca => ca.program_id === programId);
      }
      if (semesterId) {
        filtered = filtered.filter(ca => ca.semester_id === semesterId);
      }

      list = filtered.map(ca => {
        const prog = memoryStore.programs.find(p => p.id === ca.program_id);
        const sem = memoryStore.semesters.find(s => s.id === ca.semester_id);
        return {
          ...ca,
          program_name: prog ? prog.name : 'N/A',
          program_code: prog ? prog.code : 'N/A',
          semester_number: sem ? sem.semester_number : 1,
          semester_name: sem ? sem.name : 'N/A'
        };
      });
    }

    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch CA rules' });
  }
};

export const createCARule = async (req: Request, res: Response) => {
  try {
    const { programId, semesterId, totalCa, requiredCa, bestOf, weightagePercentage, description } = req.body;

    if (!programId || !semesterId) {
      return res.status(400).json({ success: false, message: 'Program ID and Semester ID are required' });
    }

    let newCa: any = null;
    try {
      const dbRes = await dbQuery(
        `INSERT INTO ca_rules (program_id, semester_id, total_ca, required_ca, best_of, weightage_percentage, description) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [programId, semesterId, totalCa || 4, requiredCa || 3, bestOf || 3, weightagePercentage || 30.00, description || '']
      );
      if (dbRes && dbRes.rows.length > 0) newCa = dbRes.rows[0];
    } catch {
      const id = memoryStore.caRules.length + 1;
      newCa = {
        id,
        program_id: programId,
        semester_id: semesterId,
        total_ca: totalCa || 4,
        required_ca: requiredCa || 3,
        best_of: bestOf || 3,
        weightage_percentage: weightagePercentage || 30.00,
        description: description || '',
        created_at: new Date().toISOString()
      };
      memoryStore.caRules.push(newCa);
    }

    res.status(201).json({ success: true, data: newCa });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to create CA rule' });
  }
};

export const updateCARule = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { programId, semesterId, totalCa, requiredCa, bestOf, weightagePercentage, description } = req.body;

    let updated: any = null;
    try {
      const dbRes = await dbQuery(
        `UPDATE ca_rules SET program_id = COALESCE($1, program_id), semester_id = COALESCE($2, semester_id), 
         total_ca = COALESCE($3, total_ca), required_ca = COALESCE($4, required_ca), 
         best_of = COALESCE($5, best_of), weightage_percentage = COALESCE($6, weightage_percentage), 
         description = COALESCE($7, description), updated_at = CURRENT_TIMESTAMP 
         WHERE id = $8 RETURNING *`,
        [programId, semesterId, totalCa, requiredCa, bestOf, weightagePercentage, description, id]
      );
      if (dbRes && dbRes.rows.length > 0) updated = dbRes.rows[0];
    } catch {
      const idx = memoryStore.caRules.findIndex(ca => ca.id === id);
      if (idx !== -1) {
        memoryStore.caRules[idx] = {
          ...memoryStore.caRules[idx],
          program_id: programId ?? memoryStore.caRules[idx].program_id,
          semester_id: semesterId ?? memoryStore.caRules[idx].semester_id,
          total_ca: totalCa ?? memoryStore.caRules[idx].total_ca,
          required_ca: requiredCa ?? memoryStore.caRules[idx].required_ca,
          best_of: bestOf ?? memoryStore.caRules[idx].best_of,
          weightage_percentage: weightagePercentage ?? memoryStore.caRules[idx].weightage_percentage,
          description: description ?? memoryStore.caRules[idx].description,
          updated_at: new Date().toISOString()
        };
        updated = memoryStore.caRules[idx];
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'CA rule not found' });
    }

    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update CA rule' });
  }
};

export const deleteCARule = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    try {
      await dbQuery(`DELETE FROM ca_rules WHERE id = $1`, [id]);
    } catch {
      const idx = memoryStore.caRules.findIndex(ca => ca.id === id);
      if (idx !== -1) {
        memoryStore.caRules.splice(idx, 1);
      }
    }

    res.json({ success: true, message: 'CA rule deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to delete CA rule' });
  }
};
