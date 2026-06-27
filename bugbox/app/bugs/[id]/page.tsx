import Link from 'next/link';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { bugs, comments, users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

function fmtDate(d: Date | string | number) {
  const date = new Date(d);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

export default async function BugDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.userId) redirect('/login');

  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  const bugRows = await db
    .select({
      id: bugs.id,
      title: bugs.title,
      description: bugs.description,
      status: bugs.status,
      priority: bugs.priority,
      createdAt: bugs.createdAt,
      updatedAt: bugs.updatedAt,
      authorName: users.name,
    })
    .from(bugs)
    .leftJoin(users, eq(bugs.createdBy, users.id))
    .where(eq(bugs.id, id));

  if (bugRows.length === 0) notFound();
  const bug = bugRows[0];

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

  return (
    <div className="shell">
      <header className="site">
        <h1><span className="mark">Bug</span>Box</h1>
        <nav><Link href="/" className="btn btn-ghost">← All bugs</Link></nav>
      </header>

      <main style={{ marginTop: 24 }}>
        <div className="detail-grid">
          <div>
            <h2 className="section-title">
              <span style={{ color: 'var(--ink-faint)' }}>#{bug.id}</span>
              <span>{bug.title}</span>
            </h2>

            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span className={`badge badge-${bug.status}`}>{bug.status.replace('_', ' ')}</span>
                <span className={`badge badge-${bug.priority}`}>{bug.priority}</span>
              </div>
              <div style={{ color: 'var(--ink-dim)', fontSize: 13, marginBottom: 12 }}>
                Reported by {bug.authorName ?? 'unknown'} · {fmtDate(bug.createdAt)} · updated {fmtDate(bug.updatedAt)}
              </div>
              {bug.description ? (
                <div style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                  {bug.description}
                </div>
              ) : (
                <div style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>No description provided.</div>
              )}
            </div>

            <form action={`/api/bugs/${id}/comments`} method="post" className="card">
              <div className="section-title" style={{ fontSize: 15 }}>Add a comment</div>
              <div className="field">
                <textarea name="body" required placeholder="Add context, reproduction notes, or a fix update…" />
              </div>
              <button type="submit" className="btn">Post comment</button>
            </form>
          </div>

          <div>
            <div className="card">
              <div className="section-title" style={{ fontSize: 15 }}>Update status</div>
              <form action={`/api/bugs/${id}`} method="post">
                <input type="hidden" name="_method" value="patch" />
                <div className="field">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" defaultValue={bug.status}>
                    <option value="open">Open</option>
                    <option value="in_progress">In progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="priority">Priority</label>
                  <select id="priority" name="priority" defaultValue={bug.priority}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save changes</button>
              </form>
            </div>
          </div>
        </div>

        <section style={{ marginTop: 28 }}>
          <h3 className="section-title" style={{ fontSize: 16 }}>
            {commentRows.length} comment{commentRows.length === 1 ? '' : 's'}
          </h3>
          {commentRows.length === 0 ? (
            <div className="empty">No comments yet. Be the first to add context.</div>
          ) : (
            commentRows.map((c) => (
              <div key={c.id} className="comment">
                <div><span className="author">{c.authorName ?? 'unknown'}</span> <span className="when">· {fmtDate(c.createdAt)}</span></div>
                <div className="body">{c.body}</div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
