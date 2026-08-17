import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';
import { isConnectionError, DB_ASLEEP_MESSAGE } from '@/lib/db-errors';

export const dynamic = 'force-dynamic';

// Parse body from either JSON or form-encoded POST (HTML forms submit as
// application/x-www-form-urlencoded, fetch/API clients submit as JSON).
async function parseBody(request: Request): Promise<Record<string, any>> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    try { return await request.json(); } catch { return {}; }
  }
  // Form-encoded fallback
  const text = await request.text();
  const params = new URLSearchParams(text);
  const obj: Record<string, any> = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

// A browser submitting the HTML form should land back on the page with a
// readable message. Only API clients should ever receive raw JSON.
function wantsJson(request: Request): boolean {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) return true;
  const accept = request.headers.get('accept') ?? '';
  return accept.includes('application/json') && !accept.includes('text/html');
}

function fail(
  request: Request,
  message: string,
  status: number,
  page: 'login' | 'register',
): Response {
  if (wantsJson(request)) {
    return NextResponse.json({ error: message }, { status });
  }
  const url = new URL(`/${page}`, request.url);
  url.searchParams.set('error', message);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // login | register | logout

  const session = await getSession();

  // Logout — clears the session.
  if (action === 'logout') {
    session.destroy();
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const body = await parseBody(request);

  const email = (body?.email ?? '').toString().trim().toLowerCase();
  const password = (body?.password ?? '').toString();
  const name = (body?.name ?? '').toString().trim();

  const page = action === 'register' ? 'register' : 'login';

  if (!email || !password) {
    return fail(request, 'Email and password are required', 400, page);
  }

  try {
    if (action === 'register') {
      if (!name) return fail(request, 'Name is required', 400, 'register');
      if (password.length < 8) {
        return fail(request, 'Password must be at least 8 characters', 400, 'register');
      }
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return fail(request, 'An account with that email already exists', 409, 'register');
      }
      const [created] = await db
        .insert(users)
        .values({ email, name, passwordHash: hashPassword(password) })
        .returning();
      session.userId = created.id;
      session.email = created.email;
      session.name = created.name;
      await session.save();
      // Redirect to dashboard after successful registration
      return NextResponse.redirect(new URL('/', request.url));
    }

    if (action === 'login') {
      const rows = await db.select().from(users).where(eq(users.email, email));
      if (rows.length === 0 || !verifyPassword(password, rows[0].passwordHash)) {
        return fail(request, 'Invalid email or password', 401, 'login');
      }
      const u = rows[0];
      session.userId = u.id;
      session.email = u.email;
      session.name = u.name;
      await session.save();
      // Redirect to dashboard after successful login
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (err) {
    // A suspended free-tier database is the common cause here, and it is not a
    // bug in the app. Say so, and use 503 so it is not mistaken for a crash.
    if (isConnectionError(err)) {
      console.error('Auth failed: database unreachable.', err);
      return fail(request, DB_ASLEEP_MESSAGE, 503, page);
    }
    console.error('Auth error:', err);
    return fail(request, 'Server error during authentication', 500, page);
  }

  return NextResponse.json(
    { error: 'Unknown action. Use ?action=login|register|logout' },
    { status: 400 },
  );
}
