import Link from 'next/link';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function NewBugPage() {
  const session = await getSession();
  if (!session.userId) redirect('/login');

  return (
    <div className="shell">
      <header className="site">
        <h1><span className="mark">Bug</span>Box</h1>
        <nav><Link href="/" className="btn btn-ghost">← Back</Link></nav>
      </header>
      <main style={{ marginTop: 24, maxWidth: 640 }}>
        <h2 className="section-title">Report a new bug</h2>
        <form action="/api/bugs" method="post" className="card">
          <div className="field">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" type="text" required placeholder="Short summary of the defect" />
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" placeholder="Steps to reproduce, expected vs actual…" />
          </div>
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create bug</button>
        </form>
      </main>
    </div>
  );
}
