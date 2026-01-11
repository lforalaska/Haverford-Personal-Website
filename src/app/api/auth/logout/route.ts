import { NextResponse } from 'next/server';
import type { AuthResponse } from '@/types/auth';

export async function POST() {
  const response = NextResponse.json<AuthResponse>({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete('admin-token');

  return response;
}
