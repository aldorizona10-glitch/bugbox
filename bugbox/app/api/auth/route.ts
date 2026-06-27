import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action'); // login | register | logout

  const session = await getSession();

  // Logout — clears the session.
  if (action === 'logout') {
    session.destroy();
    return NextResponse.json({ ok: true });
  }

  let body: any;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const email = (body?.email ?? '').toString().trim().toLowerCase();
  const password = (body?.password ?? '').toString();
  const name = (body?.name ?? '').toString().trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

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
    return NextResponse.json({ user: { id: created.id, email: created.email, name: created.name } }, { status: 201 });
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
    return NextResponse.json({ user: { id: u.id, email: u.email, name: u.name } });
  }

  return NextResponse.json({ error: 'Unknown action. Use ?action=login|register|logout' }, { status: 400 });
}
