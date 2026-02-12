import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/lib/mockData';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock authentication
    const user = mockUsers.find((u) => u.email === email);

    if (user && password === 'password123') {
      return NextResponse.json({
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
          },
        },
      });
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
