import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

async function migrate() {
  console.log('🚀 Running database migrations...');
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  if (!pool) {
    console.error('❌ Database connection pool is not configured.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('✅ Database migration completed successfully!');
  } catch (err) {
    console.error('❌ Database migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
