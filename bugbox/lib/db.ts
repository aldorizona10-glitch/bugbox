import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

// Supabase Postgres (free tier). The connection string is the pooled
// connection (port 6543 / pg_bouncer) for the runtime app. Migrations use the
// direct connection (DIRECT_URL, port 5432) — see scripts/migrate.ts.
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be set (Supabase pooled connection string).');
}

export const pool = new Pool({
  connectionString,
  // Supabase pg_bouncer (transaction mode) — max clients small for free tier.
  max: 5,
  idleTimeoutMillis: 30_000,
});

export const db = drizzle(pool, { schema });
