import { NextResponse } from 'next/server';
import { getCollections, saveCollection } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wantHidden = searchParams.get('include_hidden') === 'true';
    const isAuth = wantHidden ? await isAuthenticatedAdmin() : false;

    const collections = getCollections(isAuth);
    return NextResponse.json({ collections });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Administrator credentials required.' }, { status: 401 });
    }

    const body = await request.json();
    const result = saveCollection(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, collection: result.collection });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
