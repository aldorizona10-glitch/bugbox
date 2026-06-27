import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <h2>Sign in to <span style={{ color: 'var(--accent)' }}>Bug</span>Box</h2>
      <form action="/api/auth?action=login" method="post">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign in</button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-dim)' }}>
        No account? <Link href="/register">Register</Link>. Demo: <code>demo@bugbox.dev</code> / <code>demo1234</code>.
      </p>
    </div>
  );
}
