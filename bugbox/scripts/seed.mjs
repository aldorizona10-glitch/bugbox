// Seeds a demo user + sample bugs so the deployed app is non-empty.
// Run with: npm run db:seed
import { createClient } from '@libsql/client';
import { scryptSync, randomBytes } from 'crypto';

const url = process.env.TURSO_DATABASE_URL ?? 'file:./bugbox.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const client = createClient({ url, authToken });

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

const email = 'demo@bugbox.dev';
const existing = await client.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
let userId;
if (existing.rows.length === 0) {
  const res = await client.execute({
    sql: 'INSERT INTO users (email, password_hash, name, created_at) VALUES (?, ?, ?, ?)',
    args: [email, hashPassword('demo1234'), 'Demo User', Date.now()],
  });
  userId = Number(res.lastInsertRowid);
} else {
  userId = Number(existing.rows[0].id);
}

const now = Date.now();
const samples = [
  ['Login page shows no error on empty submit', 'When the login form is submitted with both fields empty, no validation message appears.', 'open', 'high'],
  ['Filter dropdown does not persist across reload', 'Selecting a status filter then reloading the page resets it to All.', 'in_progress', 'medium'],
  ['Dark mode toggle missing on mobile', 'The theme switcher is not visible at widths below 480px.', 'open', 'low'],
  ['Comment timestamps show raw epoch', 'Comments render their createdAt as a number instead of a formatted date.', 'resolved', 'medium'],
  ['Critical: CSRF token leaks in error response', 'The error JSON includes the session token when a 401 fires.', 'open', 'critical'],
];

for (const [title, desc, status, priority] of samples) {
  await client.execute({
    sql: `INSERT INTO bugs (title, description, status, priority, created_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [title, desc, status, priority, userId, now, now],
  });
}

console.log(`✓ seed complete: demo user ${email} / password demo1234 with ${samples.length} bugs`);
await client.close();
