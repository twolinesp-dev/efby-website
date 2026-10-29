import { NextResponse } from 'next/server';
import { loginAdmin, logoutAdmin, isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const ok = await loginAdmin(password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid administrator credentials' }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
