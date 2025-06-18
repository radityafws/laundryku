import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // In a real application, you might want to:
    // 1. Invalidate the token in your database
    // 2. Add the token to a blacklist
    // 3. Log the logout event

    return NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    });

  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}