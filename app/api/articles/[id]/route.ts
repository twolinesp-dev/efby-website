import { NextResponse } from 'next/server';
import { getArticleBySlugOrNumber, deleteArticle } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const isAuth = await isAuthenticatedAdmin();
    const article = getArticleBySlugOrNumber(id, isAuth);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    const ok = deleteArticle(id);
    if (!ok) {
      return NextResponse.json({ error: 'Article not found or could not be deleted' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
