import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { comments } from '@/lib/schema';
import { eq } from 'drizzle-orm';
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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  let user;
  try { user = await requireUser(); } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bugId = Number(params.id);
  if (!Number.isFinite(bugId)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  const body = await parseBody(request);

  const commentBody = (body?.body ?? '').toString().trim();
  if (!commentBody) {
    return NextResponse.json({ error: 'Comment body is required' }, { status: 400 });
  }

  try {
    await db
      .insert(comments)
      .values({ bugId, body: commentBody, authorId: user.id })
      .returning();

    // Redirect back to the bug detail page after posting comment from HTML form
    return NextResponse.redirect(new URL(`/bugs/${bugId}`, request.url));
  } catch (err) {
    console.error('Create comment error:', err);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
