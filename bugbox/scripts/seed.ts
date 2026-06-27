// Seeds a demo user + sample bugs so the deployed app is non-empty.
// Run with: npm run db:seed  (uses DIRECT_URL for DDL/DML)
import { Pool } from 'pg';
import { randomBytes, scryptSync } from 'crypto';

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!connectionString) {
  console.error('✗ DIRECT_URL (or DATABASE_URL) must be set. See .env.example.');
  process.exit(1);
}

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function main() {
  const pool = new Pool({ connectionString, max: 1 });
  const client = await pool.connect();

  try {
    const email = 'demo@bugbox.dev';
    const password = 'demo1234';
    const name = 'Demo User';

    let userId: number;
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length === 0) {
      const res = await client.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id',
        [email, hashPassword(password), name],
      );
      userId = res.rows[0].id;
    } else {
      userId = existing.rows[0].id;
    }

    const samples: Array<[string, string, string, string]> = [
      ['Login page shows no error on empty submit', 'When the login form is submitted with both fields empty, no validation message appears.', 'open', 'high'],
      ['Filter dropdown does not persist across reload', 'Selecting a status filter then reloading the page resets it to All.', 'in_progress', 'medium'],
      ['Dark mode toggle missing on mobile', 'The theme switcher is not visible at widths below 480px.', 'open', 'low'],
      ['Comment timestamps show raw epoch', 'Comments render their createdAt as a number instead of a formatted date.', 'resolved', 'medium'],
      ['Critical: CSRF token leaks in error response', 'The error JSON includes the session token when a 401 fires.', 'open', 'critical'],
    ];

    let inserted = 0;
    for (const [title, desc, status, priority] of samples) {
      const dup = await client.query('SELECT id FROM bugs WHERE title = $1', [title]);
      if (dup.rows.length > 0) continue;
      await client.query(
        `INSERT INTO bugs (title, description, status, priority, created_by)
         VALUES ($1, $2, $3, $4, $5)`,
        [title, desc, status, priority, userId],
      );
      inserted++;
    }

    console.log(`✓ seed complete: demo user ${email} / password ${password}; inserted ${inserted} new bugs`);
  } catch (e) {
    console.error('✗ seed failed:', e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
