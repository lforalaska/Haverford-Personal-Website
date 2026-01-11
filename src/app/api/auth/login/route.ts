import { NextRequest, NextResponse } from 'next/server';
import { validatePassword } from '@/lib/auth';
import type { AuthResponse, LoginRequest } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.password) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    const isValid = validatePassword(body.password);

    if (!isValid) {
      return NextResponse.json<AuthResponse>(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      );
    }

    // Set httpOnly cookie for session
    const response = NextResponse.json<AuthResponse>({
      success: true,
      message: 'Authenticated successfully',
    });

    response.cookies.set('admin-token', body.password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<AuthResponse>(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
