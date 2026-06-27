import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bugs, users } from '@/lib/schema';
import { eq, desc, asc, like, and } from 'drizzle-orm';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

async function parseBody(request: Request): Promise<Record<string, any>> {
  const ct = request.headers.get('content-type') ?? '';
  if (ct.includes('application/json')) {
    try { return await request.json(); } catch { return {}; }
  }
  const text = await request.text();
  const params = new URLSearchParams(text);
  const obj: Record<string, any> = {};
  for (const [k, v] of params.entries()) obj[k] = v;
  return obj;
}

export async function GET(request: Request) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const q = searchParams.get('q');
  const sort = searchParams.get('sort');

  const conds = [];
  if (status && status !== 'all') conds.push(eq(bugs.status, status as any));
  if (q && q.trim()) conds.push(like(bugs.title, `%${q.trim()}%`));

  const order =
    sort === 'updated' ? desc(bugs.updatedAt) :
    sort === 'priority' ? asc(bugs.priority) :
    desc(bugs.createdAt);

  const rows = await db
    .select({
      id: bugs.id,
      title: bugs.title,
      status: bugs.status,
      priority: bugs.priority,
      createdAt: bugs.createdAt,
      updatedAt: bugs.updatedAt,
      createdBy: bugs.createdBy,
      authorName: users.name,
    })
    .from(bugs)
    .leftJoin(users, eq(bugs.createdBy, users.id))
    .where(conds.length ? (conds.length === 1 ? conds[0] : and(...conds)) : undefined)
    .orderBy(order);

  return NextResponse.json({ bugs: rows });
}

export async function POST(request: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await parseBody(request);

  const title = (body?.title ?? '').toString().trim();
  const description = (body?.description ?? '').toString().trim();
  const priority = ['low', 'medium', 'high', 'critical'].includes(body?.priority)
    ? body.priority
    : 'medium';

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  try {
    const [created] = await db
      .insert(bugs)
      .values({ title, description, priority, createdBy: user.id })
      .returning();

    // Redirect to the bug detail page after creating from the HTML form
    return NextResponse.redirect(new URL(`/bugs/${created.id}`, request.url));
  } catch (err) {
    console.error('Create bug error:', err);
    return NextResponse.json({ error: 'Failed to create bug' }, { status: 500 });
  }
}
