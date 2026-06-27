// Hand-written migration — creates tables idempotently via @libsql/client.
// Run with: npm run db:migrate
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL ?? 'file:./bugbox.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bug_id INTEGER NOT NULL REFERENCES bugs(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    author_id INTEGER NOT NULL REFERENCES users(id),
    created_at INTEGER NOT NULL
  )`,
];

for (const sql of statements) {
  await client.execute(sql);
}

// Indexes for common queries
try {
  await client.execute('CREATE INDEX IF NOT EXISTS idx_bugs_status ON bugs(status)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_bugs_created_by ON bugs(created_by)');
  await client.execute('CREATE INDEX IF NOT EXISTS idx_comments_bug_id ON comments(bug_id)');
} catch (e) {
  // best-effort
}

console.log('✓ migrations applied to', url.startsWith('file:') ? 'local file' : 'remote Turso DB');
await client.close();
