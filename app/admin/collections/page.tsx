import React from 'react';
import { getCollections } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import CollectionManager from '@/components/admin/CollectionManager';

export const revalidate = 0;

export default async function AdminCollectionsPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const collections = getCollections(true);

  return <CollectionManager initialCollections={collections} />;
}
