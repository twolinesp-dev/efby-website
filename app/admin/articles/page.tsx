import React from 'react';
import { getArticles, getCollections } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ArticleCatalogueManager from '@/components/admin/ArticleCatalogueManager';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const articles = getArticles({ includeUnpublished: true });
  const collections = getCollections(true);

  return (
    <ArticleCatalogueManager
      initialArticles={articles}
      collections={collections}
    />
  );
}
