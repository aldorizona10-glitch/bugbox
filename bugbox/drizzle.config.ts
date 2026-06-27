import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    // Migrations use the direct connection (port 5432) to avoid pg_bouncer
    // limitations with DDL. Falls back to DATABASE_URL if DIRECT_URL unset.
    url: (process.env.DIRECT_URL ?? process.env.DATABASE_URL) as string,
  },
});
