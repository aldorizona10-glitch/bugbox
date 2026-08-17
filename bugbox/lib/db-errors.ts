/**
 * Tell "the database is unreachable" apart from "the query was wrong".
 *
 * The hosted demo runs on a free Postgres tier that suspends after a period of
 * inactivity. When that happens every query throws a connection-level error,
 * and reporting it as a generic 500 leaves a visitor staring at "Server error"
 * with no idea the database is simply asleep.
 */

// Postgres / libpq connection-level failures.
const CONNECTION_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'ECONNRESET',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'EAI_AGAIN',
  'EPIPE',
  '08000', // connection_exception
  '08003', // connection_does_not_exist
  '08006', // connection_failure
  '08001', // sqlclient_unable_to_establish_sqlconnection
  '08004', // sqlserver_rejected_establishment_of_sqlconnection
  '57P01', // admin_shutdown
  '57P02', // crash_shutdown
  '57P03', // cannot_connect_now
  '53300', // too_many_connections
  // Supabase's pooler answers XX000 (internal_error) when the project behind
  // it is suspended or gone: the pooler is up, the database is not.
  'XX000',
]);

const CONNECTION_HINTS = [
  'connect econnrefused',
  'connection terminated',
  'connection closed',
  'timeout expired',
  'getaddrinfo',
  'server closed the connection',
  'terminating connection',
];

export function isConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const code = (err as { code?: unknown }).code;
  if (typeof code === 'string' && CONNECTION_CODES.has(code)) return true;
  const message = String((err as { message?: unknown }).message ?? '').toLowerCase();
  return CONNECTION_HINTS.some((hint) => message.includes(hint));
}

/** Message shown to a visitor when the demo database is not answering. */
export const DB_ASLEEP_MESSAGE =
  'The demo database is unavailable right now, so sign-in is disabled. This ' +
  'deployment runs on a free Postgres tier that suspends after a period of ' +
  'inactivity. Nothing is wrong with the application itself: browse the source ' +
  'or check /api/health for the current database status.';
