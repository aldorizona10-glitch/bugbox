import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

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

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  try {
    if (action === 'register') {
      if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });
      if (password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
      }
      const existing = await db.select().from(users).where(eq(users.email, email));
      if (existing.length > 0) {
        return NextResponse.json({ error: 'An account with that email already exists' }, { status: 409 });
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
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
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
    console.error('Auth error:', err);
    return NextResponse.json({ error: 'Server error during authentication' }, { status: 500 });
  }

  return NextResponse.json({ error: 'Unknown action. Use ?action=login|register|logout' }, { status: 400 });
}
