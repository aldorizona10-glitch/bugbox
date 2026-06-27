import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <h2>Create a <span style={{ color: 'var(--accent)' }}>Bug</span>Box account</h2>
      <form action="/api/auth?action=register" method="post">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-dim)' }}>
        Already have an account? <Link href="/login">Sign in</Link>.
      </p>
    </div>
  );
}
