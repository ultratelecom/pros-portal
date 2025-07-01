import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Cookies } from '@sveltejs/kit';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';

export interface TokenPayload {
  id: string;
  role: 'admin' | 'supervisor';
  type?: 'full' | 'restricted';
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function setAuthCookie(cookies: Cookies, token: string): void {
  cookies.set('auth_token', token, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });
}

export function getAuthToken(cookies: Cookies): string | undefined {
  return cookies.get('auth_token');
}

export function clearAuthCookie(cookies: Cookies): void {
  cookies.delete('auth_token', { path: '/' });
} 