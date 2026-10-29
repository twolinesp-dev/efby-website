'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { Article } from '@/lib/types';
import EnquiryModal from './EnquiryModal';

interface ArticleCardProps {
  article: Article;
  showPrice?: boolean;
}

export default function ArticleCard({ article, showPrice = true }: ArticleCardProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [activeColour, setActiveColour] = useState<string | null>(
    article.colours && article.colours.length > 0 ? article.colours[0].name : null
  );

  // If a specific colour is selected, check if there is a matching image
  const displayImage = React.useMemo(() => {
    if (activeColour) {
      const colObj = article.colours?.find(c => c.name.toLowerCase() === activeColour.toLowerCase());
      if (colObj?.image_url) return colObj.image_url;
      if (article.images) {
        const match = article.images.find(img => img.colour_name?.toLowerCase() === activeColour.toLowerCase());
        if (match) return match.image_url;
      }
    }
    return article.main_image;
  }, [activeColour, article.colours, article.images, article.main_image]);

  return (
    <>
      <div className="group bg-[#FFFDF9] rounded-xl border border-[#E5DED5] overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:border-[#1C1512]/30 hover:-translate-y-1">
        {/* Card Header Badges & Image */}
        <div className="relative aspect-[4/5] bg-[#FAF7F2] overflow-hidden">
          <Link href={`/articles/${article.slug}`} className="block w-full h-full">
            <Image
              src={displayImage}
              alt={article.model_name || article.article_number}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* Badges container */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {article.new_arrival && (
              <span className="inline-flex items-center gap-1 bg-[#1C1512] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded shadow-sm">
                <Sparkles size={11} className="text-[#C5A880]" />
                New Arrival
              </span>
            )}
            {article.trending && (
              <span className="inline-flex items-center gap-1 bg-[#D9383A] text-white text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1 rounded shadow-sm">
                Trending
              </span>
            )}
          </div>

          {/* Quick Actions Hover Overlay */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2 z-10">
            <Link
              href={`/articles/${article.slug}`}
              className="flex-1 py-2 px-3 bg-[#FAF7F2]/95 backdrop-blur-sm hover:bg-[#1C1512] hover:text-[#FAF7F2] text-[#1C1512] text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <Eye size={14} />
              <span>View Article</span>
            </Link>
            <button
              type="button"
              onClick={() => setEnquiryOpen(true)}
              className="py-2 px-3 bg-[#1C1512]/95 backdrop-blur-sm hover:bg-[#D9383A] text-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
              title="Enquire About This Article"
            >
              <MessageSquare size={14} />
              <span className="hidden sm:inline">Enquire</span>
            </button>
          </div>
        </div>

        {/* Card Details */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Primary Business Identifier: ARTICLE NUMBER */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-mono font-bold tracking-[0.16em] uppercase text-[#D9383A] bg-[#FAF0E6] px-2 py-0.5 rounded border border-[#D9383A]/20">
                ARTICLE NO. {article.article_number}
              </span>
              <span className="text-[11px] font-medium text-[#8C827A]">
                {article.availability}
              </span>
            </div>

            {/* Model Name */}
            <h3 className="text-sm sm:text-base font-semibold text-[#1C1512] group-hover:text-[#D9383A] transition-colors line-clamp-1">
              <Link href={`/articles/${article.slug}`}>
                {article.model_name || 'Standard Production Model'}
              </Link>
            </h3>

            {/* Optional Short Description */}
            {article.short_description && (
              <p className="text-xs text-[#5E524B] line-clamp-2 mt-1 leading-relaxed">
                {article.short_description}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-[#E5DED5]/70 space-y-3">
            {/* Colour Swatches */}
            {article.colours && article.colours.length > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] uppercase tracking-wider text-[#8C827A] font-medium">
                  Colours:
                </span>
                <div className="flex items-center gap-1.5">
                  {article.colours.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveColour(c.name)}
                      title={`${c.name}${c.secondary_hex ? ` (${c.hex_code} / ${c.secondary_hex})` : ` (${c.hex_code})`}`}
                      className={`w-4 h-4 rounded-full border transition-all overflow-hidden flex-shrink-0 ${
                        activeColour === c.name
                          ? 'ring-2 ring-[#1C1512] scale-110 shadow-xs'
                          : 'border-[#E5DED5] hover:scale-110'
                      }`}
                      style={{ 
                        background: c.secondary_hex 
                          ? `linear-gradient(135deg, ${c.hex_code} 50%, ${c.secondary_hex} 50%)`
                          : c.hex_code 
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Price display (if enabled) */}
            {article.display_price && (article.price !== null || article.sale_price !== null) && (
              <div className="flex items-baseline gap-2">
                {article.sale_price ? (
                  <>
                    <span className="text-sm font-bold text-[#1C1512]">
                      ₹{article.sale_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#8C827A] line-through">
                      ₹{article.price?.toLocaleString('en-IN')}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-bold text-[#1C1512]">
                    ₹{article.price?.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                href={`/articles/${article.slug}`}
                className="py-2 px-3 text-center rounded border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider transition-all"
              >
                View Article
              </Link>
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="py-2 px-3 rounded bg-[#1C1512] text-[#FAF7F2] hover:bg-[#D9383A] text-[11px] font-bold uppercase tracking-wider transition-all text-center"
              >
                Enquire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        article={{
          id: article.id,
          article_number: article.article_number,
          model_name: article.model_name,
          selected_colour: activeColour,
        }}
      />
    </>
  );
}
