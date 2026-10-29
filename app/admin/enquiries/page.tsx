import React from 'react';
import { getEnquiries } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import EnquiryManager from '@/components/admin/EnquiryManager';

export const revalidate = 0;

export default async function AdminEnquiriesPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const enquiries = getEnquiries();
  return <EnquiryManager initialEnquiries={enquiries} />;
}
