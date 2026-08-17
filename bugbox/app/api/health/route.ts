import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { isConnectionError } from '@/lib/db-errors';

export const dynamic = 'force-dynamic';

/**
 * Cheap status probe, so "is the demo down?" can be answered without reading
 * function logs. 200 when the database answers, 503 when it does not.
 */
export async function GET() {
  const started = Date.now();
  try {
    await pool.query('SELECT 1');
    return NextResponse.json({ status: 'ok', database: 'reachable', ms: Date.now() - started });
  } catch (err) {
    const reason = isConnectionError(err) ? 'unreachable' : 'error';
    console.error('Health check failed:', err);
    return NextResponse.json(
      {
        status: 'degraded',
        database: reason,
        detail:
          reason === 'unreachable'
            ? 'The database is not accepting connections. On a free tier this usually means the project is suspended.'
            : 'The database returned an unexpected error.',
        ms: Date.now() - started,
      },
      { status: 503 },
    );
  }
}
