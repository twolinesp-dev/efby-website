'use client';

import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Check, RefreshCw, Layers } from 'lucide-react';
import { Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface CollectionArticleGridProps {
  initialArticles: Article[];
  showPrice: boolean;
}

export default function CollectionArticleGrid({ initialArticles, showPrice }: CollectionArticleGridProps) {
  const [selectedColour, setSelectedColour] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [filterTrendingOnly, setFilterTrendingOnly] = useState<boolean>(false);
  const [filterNewOnly, setFilterNewOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Extract all unique colours available in this collection
  const availableColours = useMemo(() => {
    const set = new Set<string>();
    for (const art of initialArticles) {
      if (art.colours) {
        for (const c of art.colours) {
          if (c.name) set.add(c.name);
        }
      }
    }
    return Array.from(set);
  }, [initialArticles]);

  // Extract all unique availability values
  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    for (const art of initialArticles) {
      if (art.availability) set.add(art.availability);
    }
    return Array.from(set);
  }, [initialArticles]);

  // Filter and sort articles
  const filteredArticles = useMemo(() => {
    return initialArticles
      .filter((art) => {
        // Colour filter
        if (selectedColour !== 'all') {
          const hasCol = art.colours?.some(
            (c) => c.name.toLowerCase() === selectedColour.toLowerCase()
          );
          if (!hasCol) return false;
        }

        // Availability filter
        if (selectedAvailability !== 'all') {
          if (art.availability !== selectedAvailability) return false;
        }

        // Trending filter
        if (filterTrendingOnly && !art.trending) return false;

        // New Arrival filter
        if (filterNewOnly && !art.new_arrival) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        }
        if (sortBy === 'article_asc') {
          return a.article_number.localeCompare(b.article_number);
        }
        if (sortBy === 'article_desc') {
          return b.article_number.localeCompare(a.article_number);
        }
        if (sortBy === 'price_asc') {
          const pA = a.sale_price ?? a.price ?? 999999;
          const pB = b.sale_price ?? b.price ?? 999999;
          return pA - pB;
        }
        if (sortBy === 'price_desc') {
          const pA = a.sale_price ?? a.price ?? 0;
          const pB = b.sale_price ?? b.price ?? 0;
          return pB - pA;
        }
        // default featured
        return a.display_order - b.display_order;
      });
  }, [initialArticles, selectedColour, selectedAvailability, filterTrendingOnly, filterNewOnly, sortBy]);

  const hasActiveFilters =
    selectedColour !== 'all' ||
    selectedAvailability !== 'all' ||
    filterTrendingOnly ||
    filterNewOnly;

  const resetFilters = () => {
    setSelectedColour('all');
    setSelectedAvailability('all');
    setFilterTrendingOnly(false);
    setFilterNewOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-8">
      {/* Filter and Sort Toolbar */}
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Quick Filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1C1512] pr-2">
            <SlidersHorizontal size={14} className="text-[#C5A880]" />
            <span>Filter By:</span>
          </div>

          {/* Colour Filter Dropdown */}
          {availableColours.length > 0 && (
            <select
              value={selectedColour}
              onChange={(e) => setSelectedColour(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-[#1C1512] font-medium outline-none focus:border-[#1C1512]"
            >
              <option value="all">All Colours ({availableColours.length})</option>
              {availableColours.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

          {/* Availability Filter Dropdown */}
          {availableStatuses.length > 1 && (
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-[#1C1512] font-medium outline-none focus:border-[#1C1512]"
            >
              <option value="all">Availability</option>
              {availableStatuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          )}

          {/* Trending Tag Toggle */}
          <button
            type="button"
            onClick={() => setFilterTrendingOnly(!filterTrendingOnly)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold tracking-wider uppercase transition-all flex items-center gap-1 ${
              filterTrendingOnly
                ? 'bg-[#1C1512] text-[#FAF7F2] border-[#1C1512]'
                : 'border-[#E5DED5] bg-[#FAF7F2] text-[#5E524B] hover:text-[#1C1512]'
            }`}
          >
            {filterTrendingOnly && <Check size={12} />}
            <span>Trending</span>
          </button>

          {/* New Arrival Tag Toggle */}
          <button
            type="button"
            onClick={() => setFilterNewOnly(!filterNewOnly)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-semibold tracking-wider uppercase transition-all flex items-center gap-1 ${
              filterNewOnly
                ? 'bg-[#1C1512] text-[#FAF7F2] border-[#1C1512]'
                : 'border-[#E5DED5] bg-[#FAF7F2] text-[#5E524B] hover:text-[#1C1512]'
            }`}
          >
            {filterNewOnly && <Check size={12} />}
            <span>New Arrival</span>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-[#D9383A] hover:underline flex items-center gap-1 font-semibold pl-1"
            >
              <RefreshCw size={11} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Right: Sorting */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A] whitespace-nowrap">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-[#1C1512] font-semibold outline-none focus:border-[#1C1512]"
          >
            <option value="featured">Featured Sequence</option>
            <option value="newest">Newest Releases</option>
            <option value="article_asc">Article Number (A – Z)</option>
            <option value="article_desc">Article Number (Z – A)</option>
            {showPrice && (
              <>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Grid of Articles */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredArticles.map((art) => (
            <ArticleCard key={art.id} article={art} showPrice={showPrice} />
          ))}
        </div>
      ) : (
        /* Polished Empty State (Requirement 3: "If a collection contains no published articles, show a polished empty state rather than broken cards or fabricated products.") */
        <div className="text-center py-20 px-4 bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#EFE9E1] text-[#8C827A] flex items-center justify-center mx-auto">
            <Layers size={28} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#1C1512]">
            No Bag Articles Match Current Criteria
          </h3>
          <p className="text-xs sm:text-sm text-[#5E524B] leading-relaxed max-w-md mx-auto">
            {hasActiveFilters
              ? 'No articles in this collection match your selected colour or filter attributes. Try resetting your filters to view all available bag models.'
              : 'Our design atelier is currently preparing articles for this collection. Please check back shortly or explore our other collections.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="mt-2 px-6 py-2.5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors inline-block"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
