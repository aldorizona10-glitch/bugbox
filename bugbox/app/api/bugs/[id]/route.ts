import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { bugs, comments, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try { await requireUser(); } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const bugRows = await db
    .select({
      id: bugs.id,
      title: bugs.title,
      description: bugs.description,
      status: bugs.status,
      priority: bugs.priority,
      createdAt: bugs.createdAt,
      updatedAt: bugs.updatedAt,
      createdBy: bugs.createdBy,
      authorName: users.name,
    })
    .from(bugs)
    .leftJoin(users, eq(bugs.createdBy, users.id))
    .where(eq(bugs.id, id));

  if (bugRows.length === 0) {
    return NextResponse.json({ error: 'Bug not found' }, { status: 404 });
  }

  const commentRows = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      authorName: users.name,
    })
    .from(comments)
    .leftJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.bugId, id));

  return NextResponse.json({ bug: bugRows[0], comments: commentRows });
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let body: any;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const patch: Record<string, any> = {};
  if (typeof body?.title === 'string') {
    const title = body.title.trim();
    if (!title) return NextResponse.json({ error: 'Title cannot be empty' }, { status: 400 });
    patch.title = title;
  }
  if (typeof body?.description === 'string') patch.description = body.description.trim();
  if (['open', 'in_progress', 'resolved', 'closed'].includes(body?.status)) patch.status = body.status;
  if (['low', 'medium', 'high', 'critical'].includes(body?.priority)) patch.priority = body.priority;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const updated = await db.update(bugs).set(patch).where(eq(bugs.id, id)).returning();
  if (updated.length === 0) {
    return NextResponse.json({ error: 'Bug not found' }, { status: 404 });
  }

  return NextResponse.json({ bug: updated[0] });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try { await requireUser(); } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const deleted = await db.delete(bugs).where(eq(bugs.id, id)).returning();
  if (deleted.length === 0) {
    return NextResponse.json({ error: 'Bug not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
