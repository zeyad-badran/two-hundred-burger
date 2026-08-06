import 'server-only';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const COOKIE_NAME = 'two_hundred_owner_admin_session';

function getSecret() {
  const secret = process.env.OWNER_SESSION_SECRET;
  if (!secret) {
    throw new Error('OWNER_SESSION_SECRET is missing from environment variables.');
  }
  return secret;
}

function signSession(payload: string): string {
  const secret = getSecret();
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export async function createAdminSession() {
  const timestamp = Date.now().toString();
  const signature = signSession(timestamp);
  const sessionValue = `${timestamp}.${signature}`;

  cookies().set({
    name: COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function verifyAdminSession() {
  const sessionCookie = cookies().get(COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) return null;

  const [timestamp, signature] = sessionCookie.value.split('.');
  
  if (!timestamp || !signature) return null;

  const expectedSignature = signSession(timestamp);
  
  if (signature !== expectedSignature) return null;

  const sessionAge = Date.now() - parseInt(timestamp, 10);
  if (sessionAge > 24 * 60 * 60 * 1000) return null; // Expired

  return { role: 'owner_admin' };
}

export function clearAdminSession() {
  cookies().delete(COOKIE_NAME);
}
