import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bugs, users } from '@/lib/schema';
import { eq, desc, asc, or, like, and, ne } from 'drizzle-orm';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  let user;
  try {
    user = await requireUser();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // open|in_progress|resolved|closed
  const q = searchParams.get('q'); // title search
  const sort = searchParams.get('sort'); // created|updated|priority

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

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const title = (body?.title ?? '').toString().trim();
  const description = (body?.description ?? '').toString().trim();
  const priority = ['low', 'medium', 'high', 'critical'].includes(body?.priority)
    ? body.priority
    : 'medium';

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  const [created] = await db
    .insert(bugs)
    .values({ title, description, priority, createdBy: user.id })
    .returning();

  return NextResponse.json({ bug: created }, { status: 201 });
}
