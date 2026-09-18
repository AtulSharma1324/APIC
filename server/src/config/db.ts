import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;
let useFallbackStore = false;

if (process.env.DATABASE_URL && process.env.DATABASE_URL !== 'postgresql://postgres:postgres@localhost:5432/academic_db') {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('supabase') || process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    });
  } catch (err) {
    console.warn('⚠️ Warning: Failed to initialize PostgreSQL pool. Falling back to memory store.');
    useFallbackStore = true;
  }
} else {
  // Check if local postgres URL is specified
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/academic_db',
    ssl: false,
  });
}

export const query = async (text: string, params?: any[]) => {
  if (pool) {
    try {
      const res = await pool.query(text, params);
      return res;
    } catch (error: any) {
      // Log warning for any connection/db issue and always throw so controllers fall back to memory store
      console.warn(`⚠️ Database query failed (${error.code || error.message}). Falling back to memory store.`);
      throw error;
    }
  }
  throw new Error('Database pool unavailable — using memory store fallback');
};

export { pool };
