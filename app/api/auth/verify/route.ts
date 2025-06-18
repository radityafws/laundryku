import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { valid: false, message: 'Token tidak ditemukan' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Mock token validation (in production, verify JWT properly)
    if (token.startsWith('mock_jwt_token_')) {
      return NextResponse.json({
        valid: true,
        message: 'Token valid'
      });
    }

    return NextResponse.json(
      { valid: false, message: 'Token tidak valid' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}