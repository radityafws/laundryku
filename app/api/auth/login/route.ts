import { NextRequest, NextResponse } from 'next/server';

// Mock user database
const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@laundrykilat.id',
    password: 'admin123', // In production, this should be hashed
    role: 'admin' as const,
    name: 'Administrator'
  },
  {
    id: '2',
    username: 'staff',
    email: 'staff@laundrykilat.id',
    password: 'staff123', // In production, this should be hashed
    role: 'staff' as const,
    name: 'Staff Laundry'
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(
      u => (u.username === username || u.email === username) && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Username atau password salah' },
        { status: 401 }
      );
    }

    // Generate mock JWT token (in production, use proper JWT library)
    const token = `mock_jwt_token_${user.id}_${Date.now()}`;

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
      message: 'Login berhasil'
    });

  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}