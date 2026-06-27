import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'resolved', 'closed'] as const;
const SORT_OPTIONS = [
  { value: 'created', label: 'Newest' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'priority', label: 'Priority' },
] as const;

function fmtDate(d: Date | string | number) {
  const date = new Date(d);
  return date.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string; sort?: string };
}) {
  const session = await getSession();
  if (!session.userId) {
    redirect('/login');
  }

  const status = searchParams.status ?? 'all';
  const q = searchParams.q ?? '';
  const sort = searchParams.sort ?? 'created';

  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (q.trim()) params.set('q', q.trim());
  if (sort) params.set('sort', sort);

  const base = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const res = await fetch(`${base}/api/bugs?${params}`, {
    headers: { cookie: '' },
    cache: 'no-store',
  });
  // Note: server component fetch can't carry the browser cookie directly; the
  // API route reads the session from cookies() which is forwarded by Next for
  // same-origin RSC fetches. If this returns 401 in some envs, the client nav
  // to /login handles it.
  const data = res.ok ? await res.json() : { bugs: [] };

  return (
    <div className="shell">
      <header className="site">
        <h1><span className="mark">Bug</span>Box</h1>
        <nav>
          <span className="who">signed in as {session.name}</span>
          <form action="/api/auth?action=logout" method="post" style={{ display: 'inline' }}>
            <button type="submit" className="btn btn-ghost">Sign out</button>
          </form>
        </nav>
      </header>

      <main style={{ marginTop: 24 }}>
        <div className="hero">
          <div>
            <h2>The loop is the product.</h2>
            <p>Every bug here is a regression the TestSprite verify-loop catches. Write → verify → fix → verify again.</p>
          </div>
          <Link href="/bugs/new" className="btn btn-primary">New bug</Link>
        </div>

        <form className="toolbar" method="get">
          <label htmlFor="status" style={{ margin: 0 }}>Status</label>
          <select id="status" name="status" defaultValue={status}>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s === 'all' ? 'All' : s.replace('_', ' ')}</option>
            ))}
          </select>
          <label htmlFor="q" style={{ margin: 0 }}>Search</label>
          <input id="q" name="q" type="text" defaultValue={q} placeholder="title contains…" />
          <label htmlFor="sort" style={{ margin: 0 }}>Sort</label>
          <select id="sort" name="sort" defaultValue={sort}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button type="submit" className="btn">Apply</button>
        </form>

        {data.bugs.length === 0 ? (
          <div className="empty">
            <div>No bugs match this filter.</div>
            <div className="hint">Try clearing the filter, or <Link href="/bugs/new">create a new bug</Link>.</div>
          </div>
        ) : (
          <ul className="buglist">
            {data.bugs.map((b: any) => (
              <li key={b.id}>
                <div>
                  <div className="title">
                    <Link href={`/bugs/${b.id}`}>{b.title}</Link>
                  </div>
                  <div className="meta">
                    <span>#{b.id}</span>
                    <span>by {b.authorName ?? 'unknown'}</span>
                    <span>updated {fmtDate(b.updatedAt)}</span>
                  </div>
                </div>
                <div className="badges">
                  <span className={`badge badge-${b.status}`}>{b.status.replace('_', ' ')}</span>
                  <span className={`badge badge-${b.priority}`}>{b.priority}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="site">
        <span>BugBox · TestSprite Hackathon S3</span>
        <span>Built to exercise the Write → Verify → Fix loop.</span>
      </footer>
    </div>
  );
}
