'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, ArrowRight, Tag, Layers } from 'lucide-react';
import { Article, Collection } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setArticles([]);
      setCollections([]);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setArticles([]);
      setCollections([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [artRes, colRes] = await Promise.all([
          fetch(`/api/articles?search=${encodeURIComponent(query.trim())}&limit=8`),
          fetch(`/api/collections`),
        ]);
        const artData = await artRes.json();
        const colData = await colRes.json();

        // Sort exact Article Number matches to the top
        const qUpper = query.trim().toUpperCase();
        const sortedArticles = (artData.articles || []).sort((a: Article, b: Article) => {
          const aExact = a.article_number.toUpperCase() === qUpper;
          const bExact = b.article_number.toUpperCase() === qUpper;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          const aStarts = a.article_number.toUpperCase().startsWith(qUpper);
          const bStarts = b.article_number.toUpperCase().startsWith(qUpper);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        });

        const filteredCollections = (colData.collections || []).filter((c: Collection) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          (c.description && c.description.toLowerCase().includes(query.toLowerCase()))
        );

        setArticles(sortedArticles);
        setCollections(filteredCollections);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const isExactArticleMatch = articles.length > 0 && articles[0].article_number.toUpperCase() === query.trim().toUpperCase();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1512]/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4 pb-12">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-xl shadow-2xl border border-[#E5DED5] overflow-hidden z-10 transition-all">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E5DED5] flex items-center gap-3 bg-[#FFFDF9]">
          <Search size={22} className="text-[#C5A880] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Article Number (e.g., EF-HB-001) or bag model..."
            className="w-full bg-transparent text-[#1C1512] placeholder-[#8C827A] text-base sm:text-lg focus:outline-none font-medium tracking-wide"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#8C827A] hover:text-[#1C1512] text-xs font-semibold uppercase tracking-wider p-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5E524B] hover:text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {loading && (
            <div className="text-center py-8 text-[#5E524B] text-sm animate-pulse tracking-wide font-medium">
              Searching EFBY Catalogue...
            </div>
          )}

          {!loading && query.trim().length >= 2 && articles.length === 0 && collections.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[#1C1512] font-semibold text-base mb-1">No matching articles or collections found</p>
              <p className="text-xs text-[#5E524B] max-w-sm mx-auto">
                Please verify the Article Number or try searching for a collection name such as &ldquo;Handbags&rdquo; or &ldquo;Backpacks&rdquo;.
              </p>
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="py-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#8C827A] mb-3">Popular Searches & Quick Jumps</p>
              <div className="flex flex-wrap gap-2">
                {['EF-HB-001', 'EF-SB-014', 'EF-OB-022', 'Handbags', 'School Bags', 'Trending'].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[#EFE9E1] text-[#1C1512] hover:bg-[#1C1512] hover:text-[#FAF7F2] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exact Match Priority Badge */}
          {isExactArticleMatch && (
            <div className="bg-[#FAF0E6] border border-[#C5A880]/40 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-[#D9383A]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1512]">
                  Exact Article Number Match: <span className="text-[#D9383A]">{articles[0].article_number}</span>
                </span>
              </div>
              <Link
                href={`/articles/${articles[0].slug}`}
                onClick={onClose}
                className="text-xs font-bold uppercase tracking-wider text-[#1C1512] hover:text-[#D9383A] flex items-center gap-1"
              >
                <span>View Full Article</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Articles Section */}
          {articles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E5DED5] pb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C827A]">
                  Articles ({articles.length})
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A]">
                  Filtered by Article Number / Model
                </span>
              </div>

              <div className="divide-y divide-[#E5DED5]">
                {articles.map((art) => (
                  <Link
                    key={art.id}
                    href={`/articles/${art.slug}`}
                    onClick={onClose}
                    className="py-3 flex items-center gap-4 group hover:bg-[#FFFDF9] px-2 rounded-lg transition-colors"
                  >
                    <div className="relative w-14 h-16 rounded overflow-hidden bg-[#EFE9E1] flex-shrink-0 border border-[#E5DED5]">
                      <Image
                        src={art.main_image}
                        alt={art.model_name || art.article_number}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tracking-[0.14em] uppercase text-[#D9383A] bg-[#FAF0E6] px-2 py-0.5 rounded">
                          ARTICLE NO. {art.article_number}
                        </span>
                        {art.trending && (
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C5A880] border border-[#C5A880]/50 px-1.5 py-0.2 rounded">
                            Trending
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-[#1C1512] mt-1 group-hover:text-[#D9383A] transition-colors truncate">
                        {art.model_name || 'Standard Model'}
                      </h4>
                      <p className="text-xs text-[#5E524B] truncate">
                        Collection: {art.collection_name || 'General Carry'}
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-[#8C827A] group-hover:text-[#D9383A] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Collections Section */}
          {collections.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-[#E5DED5] pb-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8C827A]">
                  Collections ({collections.length})
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#8C827A]">
                  Browse Categories
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {collections.map((col) => (
                  <Link
                    key={col.id}
                    href={`/collections/${col.slug}`}
                    onClick={onClose}
                    className="p-3 rounded-lg border border-[#E5DED5] hover:border-[#1C1512] hover:bg-[#FFFDF9] transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Layers size={16} className="text-[#C5A880]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#1C1512] group-hover:text-[#D9383A] transition-colors">
                        {col.name}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-[#8C827A] group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#EFE9E1]/60 border-t border-[#E5DED5] text-[11px] text-[#5E524B] flex items-center justify-between px-6">
          <span>Tip: Enter any Article Number for direct matching</span>
          <span className="hidden sm:inline">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}
