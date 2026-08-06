import 'server-only';
import { cookies } from 'next/headers';
import { createHmac } from 'crypto';

const COOKIE_NAME = 'two_hundred_staff_session';

function getSecret() {
  const secret = process.env.STAFF_SESSION_SECRET;
  if (!secret) {
    throw new Error('STAFF_SESSION_SECRET is missing from environment variables.');
  }
  return secret;
}

function signSession(payload: string): string {
  const secret = getSecret();
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export async function createStaffSession(password: string): Promise<boolean> {
  const correctPassword = process.env.STAFF_DASHBOARD_PASSWORD;
  
  if (!correctPassword) {
    throw new Error('STAFF_DASHBOARD_PASSWORD is missing from environment variables.');
  }

  if (password !== correctPassword) {
    return false;
  }

  // Create a payload (e.g. timestamp of creation)
  const timestamp = Date.now().toString();
  const signature = signSession(timestamp);
  
  // Combine payload and signature: payload.signature
  const sessionValue = `${timestamp}.${signature}`;

  // Set secure HTTP-only cookie
  cookies().set({
    name: COOKIE_NAME,
    value: sessionValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    // Set a reasonable expiry for staff (e.g., 24 hours)
    maxAge: 60 * 60 * 24,
  });

  return true;
}

export async function verifyStaffSession(): Promise<boolean> {
  const sessionCookie = cookies().get(COOKIE_NAME);
  
  if (!sessionCookie || !sessionCookie.value) {
    return false;
  }

  const [timestamp, signature] = sessionCookie.value.split('.');
  
  if (!timestamp || !signature) {
    return false;
  }

  const expectedSignature = signSession(timestamp);
  
  if (signature !== expectedSignature) {
    return false;
  }

  // Optional: Check if the session is too old (e.g., older than 24 hours)
  const sessionAge = Date.now() - parseInt(timestamp, 10);
  if (sessionAge > 24 * 60 * 60 * 1000) {
    return false; // Expired
  }

  return true;
}

export async function clearStaffSession() {
  cookies().delete(COOKIE_NAME);
}
