import { NextResponse } from 'next/server';
import { saveUploadedFile } from '@/lib/storage';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Administrator credentials required to upload assets.' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      const single = formData.get('file') as File;
      if (single) {
        files.push(single);
      } else {
        return NextResponse.json({ error: 'No files provided for upload.' }, { status: 400 });
      }
    }

    const uploadedUrls: string[] = [];
    for (const f of files) {
      const res = await saveUploadedFile(f);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      if (res.url) uploadedUrls.push(res.url);
    }

    return NextResponse.json({ 
      success: true, 
      urls: uploadedUrls,
      url: uploadedUrls[0] 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
