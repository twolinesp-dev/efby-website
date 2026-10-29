import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { getCollections, getSiteSettings } from '@/lib/catalogue';
import CollectionCard from '@/components/CollectionCard';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Explore Bag Collections | EFBY Manufacturer Catalogue',
  description: 'Browse all EFBY bag collections: Handbags, School Bags, Travel Bags, Office Briefcases, Backpacks, Sling Bags, and Tote Bags. Discover unique bag models by Article Number.',
};

export default async function CollectionsPage() {
  const collections = getCollections().filter(c => !c.is_hidden);
  const settings = getSiteSettings();

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
          <Link href="/" className="hover:text-[#1C1512] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#1C1512]">Collections</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFE9E1] text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C1512]">
          <Compass size={13} className="text-[#C5A880]" />
          <span>Curated Bag Categories</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1C1512] tracking-tight">
          Explore the EFBY Collections
        </h1>

        <p className="text-base sm:text-lg text-[#5E524B] leading-relaxed">
          Discover thoughtfully selected bags for every journey, occasion, and everyday essential. Select a collection below to view individual bag models and their certified Article Numbers.
        </p>

        {/* Dynamic Special Collection Jumps */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/collections/trending"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1512] text-[#FAF7F2] hover:bg-[#D9383A] text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Flame size={14} className="text-[#D9383A]" />
            <span>Browse Trending Bag Models</span>
          </Link>
          <Link
            href="/collections/newly-launched"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-[#FAF7F2] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Sparkles size={14} className="text-[#C5A880]" />
            <span>Newly Launched Line</span>
          </Link>
        </div>
      </div>

      {/* Editorial Grid of Collection Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4">
        {collections.map((col, index) => (
          <CollectionCard
            key={col.id}
            collection={col}
            featured={index === 0 || index === 3 || index === 6}
          />
        ))}
      </div>

      {/* Reassurance Banner */}
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-lg font-serif font-bold text-[#1C1512]">
            Need a custom model or institutional production?
          </h4>
          <p className="text-xs text-[#5E524B]">
            All collections support custom fabrics, embroidery, dimensions, and dedicated factory Article Numbers.
          </p>
        </div>
        <a
          href={`https://wa.me/${(settings.whatsapp_number || '+919847000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello EFBY, I am enquiring about custom collection manufacturing.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex-shrink-0"
        >
          Factory Enquiry Hotline
        </a>
      </div>
    </div>
  );
}
