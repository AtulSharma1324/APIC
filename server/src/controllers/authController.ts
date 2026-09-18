import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { query as dbQuery } from '../config/db';
import { memoryStore } from '../services/store';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  studentId: z.string().optional(),
  programId: z.number().optional().nullable(),
  specializationId: z.number().optional().nullable(),
  currentSemester: z.number().optional().default(1),
  role: z.enum(['STUDENT', 'ADMIN']).optional().default('STUDENT')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const register = async (req: Request, res: Response) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message
      });
    }

    const { name, email, password, studentId, programId, specializationId, currentSemester, role } = parseResult.data;

    // Check if user already exists
    let existingUser = null;
    try {
      const dbRes = await dbQuery('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      if (dbRes && dbRes.rows.length > 0) {
        existingUser = dbRes.rows[0];
      }
    } catch {
      // DB unavailable — fall back to memory store
      existingUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const jwtSecret = process.env.JWT_SECRET || 'academic_jwt_secret_key_2026_dev_mode';

    let newUser: any = null;

    try {
      const dbRes = await dbQuery(
        `INSERT INTO users (name, email, password_hash, student_id, role, program_id, specialization_id, current_semester)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, role, student_id, program_id, specialization_id, current_semester, created_at`,
        [name, email.toLowerCase(), passwordHash, studentId || null, role, programId || null, specializationId || null, currentSemester]
      );
      if (dbRes && dbRes.rows.length > 0) {
        newUser = dbRes.rows[0];
      }
    } catch {
      // Memory store fallback
      const id = memoryStore.users.length + 1;
      newUser = {
        id,
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        student_id: studentId || `STU${Date.now().toString().slice(-6)}`,
        role,
        program_id: programId || null,
        specialization_id: specializationId || null,
        current_semester: currentSemester,
        status: 'ACTIVE',
        created_at: new Date().toISOString()
      };
      memoryStore.users.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: parseResult.error.errors[0].message
      });
    }

    const { email, password } = parseResult.data;

    let user: any = null;
    try {
      const dbRes = await dbQuery('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      if (dbRes && dbRes.rows.length > 0) {
        user = dbRes.rows[0];
      }
    } catch {
      // DB unavailable — fall back to memory store
      user = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const jwtSecret = process.env.JWT_SECRET || 'academic_jwt_secret_key_2026_dev_mode';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      jwtSecret,
      { expiresIn: '7d' }
    );

    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Login failed' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    let user: any = null;
    try {
      const dbRes = await dbQuery('SELECT id, name, email, student_id, role, program_id, specialization_id, current_semester, created_at FROM users WHERE id = $1', [req.user.id]);
      if (dbRes && dbRes.rows.length > 0) {
        user = dbRes.rows[0];
      }
    } catch {
      const found = memoryStore.users.find(u => u.id === req.user?.id);
      if (found) {
        const { password_hash, ...rest } = found;
        user = rest;
      }
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to retrieve profile' });
  }
};
