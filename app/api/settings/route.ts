import { NextResponse } from 'next/server';
import { getSiteSettings, updateSiteSettings } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const settings = getSiteSettings();
    return NextResponse.json({ settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    updateSiteSettings(body);
    const updated = getSiteSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
