import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { requireUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bugId = Number(params.id);
  if (!Number.isFinite(bugId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  let body: any;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const commentBody = (body?.body ?? '').toString().trim();
  if (!commentBody) {
    return NextResponse.json({ error: 'Comment body is required' }, { status: 400 });
  }

  const [created] = await db
    .insert(comments)
    .values({ bugId, body: commentBody, authorId: user.id })
    .returning();

  return NextResponse.json({ comment: { ...created, authorName: user.name } }, { status: 201 });
}
