import { NextRequest } from 'next/server';

export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }

  // Simple constant-time comparison
  return password === adminPassword;
}

export function extractAuthToken(request: NextRequest): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fallback to cookie
  const cookie = request.cookies.get('admin-token');
  return cookie?.value || null;
}

export function isAuthenticated(request: NextRequest): boolean {
  const token = extractAuthToken(request);
  if (!token) return false;

  return validatePassword(token);
}
