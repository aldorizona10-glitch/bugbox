// Hand-written migration — creates tables idempotently via pg.
// Run with: npm run db:migrate  (uses DIRECT_URL for DDL)
import { Pool } from 'pg';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('✗ DIRECT_URL (or DATABASE_URL) must be set. See .env.example.');
  process.exit(1);
}

const pool = new Pool({ connectionString, max: 1 });

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS bugs (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    bug_id INTEGER NOT NULL REFERENCES bugs(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status)`,
  `CREATE INDEX IF NOT EXISTS idx_bugs_created_by ON bugs(created_by)`,
  `CREATE INDEX IF NOT EXISTS idx_comments_bug_id ON comments(bug_id)`,
  `CREATE INDEX IF NOT EXISTS idx_bugs_title ON bugs USING gin (to_tsvector('simple', title))`,
];

const client = await pool.connect();
try {
  for (const sql of statements) {
    await client.query(sql);
  }
  console.log('✓ migrations applied to Supabase Postgres');
} catch (e) {
  console.error('✗ migration failed:', e);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
