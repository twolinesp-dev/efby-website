import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlugOrNumber, getArticles, getSiteSettings } from '@/lib/catalogue';
import ArticleDetailView from '@/components/ArticleDetailView';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlugOrNumber(slug);
  if (!article) {
    return {
      title: 'Article Not Found | EFBY Catalogue',
    };
  }
  const title = `ARTICLE NO. ${article.article_number} — ${article.model_name || 'EFBY Bag Model'}`;
  return {
    title: `${title} | EFBY`,
    description: article.short_description || `View full specifications, colours, and enquiry details for EFBY Article Number ${article.article_number}.`,
    openGraph: {
      title,
      description: article.short_description || undefined,
      images: [
        {
          url: article.main_image,
          width: 800,
          height: 1000,
          alt: `EFBY Article ${article.article_number}`,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlugOrNumber(slug);

  if (!article) {
    notFound();
  }

  // Get related articles from the same collection
  let relatedArticles: import('@/lib/types').Article[] = [];
  if (article.collection_slug) {
    relatedArticles = getArticles({ collectionSlug: article.collection_slug })
      .filter((a) => a.id !== article.id)
      .slice(0, 4);
  }

  const settings = getSiteSettings();

  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ArticleDetailView
        article={article}
        relatedArticles={relatedArticles}
        showPrice={settings.global_price_display}
        whatsappNumber={settings.whatsapp_number}
      />
    </div>
  );
}
