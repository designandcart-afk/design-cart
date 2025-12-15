// API route for email verification
import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    const isVerified = await authService.verifyEmail(token);

    if (isVerified) {
      return NextResponse.json({
        message: 'Email verified successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email' },
      { status: 500 }
    );
  }
}