import { NextResponse } from 'next/server';
import { getArticles, saveArticle, checkArticleNumberExists } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionSlug = searchParams.get('collection') || undefined;
    const trending = searchParams.get('trending') === 'true';
    const newArrival = searchParams.get('new_arrival') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const search = searchParams.get('search') || undefined;
    const sort = (searchParams.get('sort') as any) || undefined;
    const colour = searchParams.get('colour') || undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    
    // Check if user requested unpublished items and is authenticated admin
    const wantUnpublished = searchParams.get('include_unpublished') === 'true';
    const isAuth = wantUnpublished ? await isAuthenticatedAdmin() : false;

    const articles = getArticles({
      collectionSlug,
      trendingOnly: trending,
      newArrivalOnly: newArrival,
      featuredOnly: featured,
      search,
      sort,
      colour,
      limit,
      includeUnpublished: isAuth,
    });

    return NextResponse.json({ articles });
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
    const result = saveArticle(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, article: result.article });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
