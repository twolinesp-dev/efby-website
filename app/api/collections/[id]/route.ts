import { NextResponse } from 'next/server';
import { deleteCollection } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Administrator credentials required.' }, { status: 401 });
    }

    const { id } = await params;
    const ok = deleteCollection(id);
    if (!ok) {
      return NextResponse.json({ error: 'Collection not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Collection deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
