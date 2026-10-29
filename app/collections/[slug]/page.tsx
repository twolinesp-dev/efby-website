import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Compass, Sparkles } from 'lucide-react';
import { getCollectionBySlug, getArticles, getSiteSettings } from '@/lib/catalogue';
import CollectionArticleGrid from '@/components/CollectionArticleGrid';

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) {
    return {
      title: 'Collection Not Found | EFBY',
    };
  }
  return {
    title: `${collection.name} Collection | EFBY Bag Catalogue`,
    description: collection.description || `Browse EFBY ${collection.name} models, specifications, and certified Article Numbers.`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  // Get articles for this collection
  const articles = getArticles({ collectionSlug: collection.slug });
  const settings = getSiteSettings();

  return (
    <div className="py-8 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
        <Link href="/" className="hover:text-[#1C1512] transition-colors">Home</Link>
        <span>/</span>
        <Link href="/collections" className="hover:text-[#1C1512] transition-colors">Collections</Link>
        <span>/</span>
        <span className="text-[#1C1512] font-bold">{collection.name}</span>
      </nav>

      {/* Editorial Collection Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-[#1C1512] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 border border-[#2A211D] shadow-xl">
        {collection.cover_image && (
          <div className="absolute inset-0 z-0">
            <Image
              src={collection.cover_image}
              alt={collection.name}
              fill
              className="object-cover object-center opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1C1512] via-[#1C1512]/80 to-[#1C1512]/60" />
          </div>
        )}

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-[11px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm">
            <Compass size={13} />
            <span>Collection Line</span>
            <span>•</span>
            <span>{articles.length} {articles.length === 1 ? 'Article' : 'Articles'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            {collection.name}
          </h1>

          {collection.description && (
            <p className="text-sm sm:text-base text-[#CBBFB3] leading-relaxed max-w-xl">
              {collection.description}
            </p>
          )}

          <div className="pt-2 text-xs text-[#E8DFD5] flex items-center gap-4">
            <span>Browse individual bag models below.</span>
            <span>•</span>
            <span>Every model has a unique <strong>Article Number</strong>.</span>
          </div>
        </div>
      </div>

      {/* Article Grid with Filtering & Sorting */}
      <CollectionArticleGrid initialArticles={articles} showPrice={settings.global_price_display} />
    </div>
  );
}
