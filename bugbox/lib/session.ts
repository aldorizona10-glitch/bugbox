import { getIronSession, type SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  userId?: number;
  email?: string;
  name?: string;
}

// Resolve the session password lazily — at request time, NOT at module load.
// `next build` collects page data with NODE_ENV=production; if we threw here
// at import time, the build would fail before any env is configured. By
// resolving inside getSession(), the throw only fires on a real request to a
// misconfigured deployment.
function sessionPassword(): string {
  const p = process.env.SESSION_PASSWORD;
  if (!p) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_PASSWORD must be set in production (>=32 chars).');
    }
    // Dev-only fallback. Must be >=32 chars for iron-session.
    return 'bugbox-dev-session-password-must-be-32-chars-min!!';
  }
  return p;
}

// Build a fresh options object per request so the password is resolved lazily.
export function getSessionOptions(): SessionOptions {
  return {
    password: sessionPassword(),
    cookieName: 'bugbox_session',
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    },
  };
}

export async function getSession() {
  'use server';
  return getIronSession<SessionData>(cookies(), getSessionOptions());
}

export async function requireUser(): Promise<{ id: number; name: string; email: string }> {
  const session = await getSession();
  if (!session.userId || !session.email || !session.name) {
    throw new Error('Unauthorized');
  }
  return { id: session.userId, name: session.name, email: session.email };
}
