import { NextResponse } from 'next/server';
import { createEnquiry, getEnquiries, updateEnquiryStatus } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = createEnquiry(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Your enquiry for this EFBY article has been received. Our team will contact you promptly.',
      enquiryId: result.enquiryId 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized. Administrator credentials required to view enquiries.' }, { status: 401 });
    }

    const enquiries = getEnquiries();
    return NextResponse.json({ enquiries });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const isAuth = await isAuthenticatedAdmin();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { id, status, notes } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Enquiry ID and status are required' }, { status: 400 });
    }

    const ok = updateEnquiryStatus(id, status, notes);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
