import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db';

async function seed() {
  console.log('🌱 Running database seed...');
  const seedPath = path.join(__dirname, 'seed.sql');
  let sql = fs.readFileSync(seedPath, 'utf8');

  if (!pool) {
    console.error('❌ Database connection pool is not configured.');
    process.exit(1);
  }

  // Generate dynamic bcrypt hash for initial admin password
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Replace default hash placeholder with generated hash
  sql = sql.replace(
    /\$2a\$10\$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW/g,
    hashedPassword
  );

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log('✅ Database seed completed successfully!');
    console.log(`🔑 Initial Admin Credentials: Email=${process.env.ADMIN_EMAIL || 'admin@university.edu'}, Password=${adminPassword}`);
  } catch (err) {
    console.error('❌ Database seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
