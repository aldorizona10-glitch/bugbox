import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="shell">
      <header className="site">
        <h1><span className="mark">Bug</span>Box</h1>
        <nav><Link href="/" className="btn btn-ghost">← Home</Link></nav>
      </header>
      <main style={{ marginTop: 48 }}>
        <div className="empty">
          <div>404 — not found.</div>
          <div className="hint">This bug or page doesn't exist (or was deleted).</div>
        </div>
      </main>
    </div>
  );
}
