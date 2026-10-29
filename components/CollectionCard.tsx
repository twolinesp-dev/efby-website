import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Collection } from '@/lib/types';

interface CollectionCardProps {
  collection: Collection;
  featured?: boolean;
}

export default function CollectionCard({ collection, featured = false }: CollectionCardProps) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className={`group relative rounded-2xl overflow-hidden border border-[#E5DED5] bg-[#1C1512] transition-all duration-500 hover:shadow-2xl hover:border-[#1C1512] flex flex-col justify-end ${
        featured ? 'min-h-[420px] sm:min-h-[480px]' : 'min-h-[340px] sm:min-h-[380px]'
      }`}
    >
      {/* Background Cover Image */}
      {collection.cover_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={collection.cover_image}
            alt={collection.name}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-90"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Subtle multi-layer gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#150F0D] via-[#150F0D]/60 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-end space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
            {collection.article_count !== undefined
              ? `${collection.article_count} Available ${collection.article_count === 1 ? 'Article' : 'Articles'}`
              : 'Collection Line'}
          </span>
          {collection.is_featured && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#FAF7F2] bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
              <Sparkles size={11} className="text-[#C5A880]" />
              Featured
            </span>
          )}
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#FAF7F2] group-hover:text-[#FAF7F2] transition-colors leading-tight">
          {collection.name}
        </h3>

        {collection.description && (
          <p className="text-xs sm:text-sm text-[#CBBFB3] line-clamp-2 leading-relaxed">
            {collection.description}
          </p>
        )}

        <div className="pt-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#FAF7F2] group-hover:text-[#D9383A] transition-colors">
          <span>Explore Collection</span>
          <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}
