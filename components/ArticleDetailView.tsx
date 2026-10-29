'use client';

import React, { useState } from 'react';
import Link from 'next/image';
import Image from 'next/image';
import NextLink from 'next/link';
import { 
  ShieldCheck, 
  Sparkles, 
  Ruler, 
  Layers, 
  Weight, 
  Box, 
  Check, 
  MessageSquare, 
  PhoneCall, 
  Maximize2,
  ChevronRight,
  Share2
} from 'lucide-react';
import { Article } from '@/lib/types';
import EnquiryModal from './EnquiryModal';

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles?: Article[];
  showPrice?: boolean;
  whatsappNumber?: string;
}

export default function ArticleDetailView({ 
  article, 
  relatedArticles = [], 
  showPrice = true,
  whatsappNumber
}: ArticleDetailViewProps) {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedColour, setSelectedColour] = useState<string | null>(
    article.colours && article.colours.length > 0 ? article.colours[0].name : null
  );
  const [liveWhatsApp, setLiveWhatsApp] = useState<string>(
    whatsappNumber || '+919847000000'
  );

  React.useEffect(() => {
    if (whatsappNumber) {
      setLiveWhatsApp(whatsappNumber);
    }
    // Fetch latest WhatsApp number directly from backend settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsapp_number) {
          setLiveWhatsApp(data.settings.whatsapp_number);
        }
      })
      .catch((err) => console.error('Failed to load settings in ArticleDetailView:', err));
  }, [whatsappNumber]);

  // Compile full gallery list (main image + colour images + additional images)
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (article.main_image) list.push(article.main_image);
    if (article.colours) {
      for (const col of article.colours) {
        if (col.image_url && !list.includes(col.image_url)) {
          list.push(col.image_url);
        }
      }
    }
    if (article.images) {
      for (const img of article.images) {
        if (!list.includes(img.image_url)) {
          list.push(img.image_url);
        }
      }
    }
    return list;
  }, [article.main_image, article.colours, article.images]);

  const [activeImage, setActiveImage] = useState<string>(allImages[0] || article.main_image);
  const [zoomOpen, setZoomOpen] = useState(false);

  // When user selects a colour, switch image if there is an associated colour image
  const handleSelectColour = (colourName: string) => {
    setSelectedColour(colourName);
    
    // 1. Direct match on colour object image_url
    const colMatch = article.colours?.find(
      (c) => c.name.toLowerCase() === colourName.toLowerCase()
    );
    if (colMatch?.image_url) {
      setActiveImage(colMatch.image_url);
      return;
    }

    // 2. Match on article_images tagged with this colour
    if (article.images) {
      const match = article.images.find(
        (img) => img.colour_name?.toLowerCase() === colourName.toLowerCase()
      );
      if (match) {
        setActiveImage(match.image_url);
      }
    }
  };

  const rawWhatsApp = liveWhatsApp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(
    `Hello EFBY, I would like to enquire about Article Number: ${article.article_number}${
      article.model_name ? ` (${article.model_name})` : ''
    }${selectedColour ? ` in colour ${selectedColour}` : ''}.`
  )}`;

  return (
    <>
      <div className="space-y-16">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C827A]">
          <NextLink href="/" className="hover:text-[#1C1512] transition-colors">Home</NextLink>
          <span>/</span>
          <NextLink href="/collections" className="hover:text-[#1C1512] transition-colors">Collections</NextLink>
          {article.collection_slug && (
            <>
              <span>/</span>
              <NextLink 
                href={`/collections/${article.collection_slug}`} 
                className="hover:text-[#1C1512] transition-colors"
              >
                {article.collection_name}
              </NextLink>
            </>
          )}
          <span>/</span>
          <span className="text-[#D9383A] font-bold">ARTICLE {article.article_number}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: Gallery Column */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Image Stage */}
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#FFFDF9] border border-[#E5DED5] shadow-lg group">
              <Image
                src={activeImage}
                alt={article.model_name || article.article_number}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                priority
              />

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {article.trending && (
                  <span className="inline-flex items-center gap-1 bg-[#D9383A] text-white text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded shadow-sm">
                    Trending
                  </span>
                )}
                {article.new_arrival && (
                  <span className="inline-flex items-center gap-1 bg-[#1C1512] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1 rounded shadow-sm">
                    <Sparkles size={11} className="text-[#C5A880]" />
                    New Arrival
                  </span>
                )}
              </div>

              {/* Expanded Zoom Trigger */}
              <button
                type="button"
                onClick={() => setZoomOpen(true)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-[#FAF7F2]/90 backdrop-blur-sm text-[#1C1512] hover:bg-[#1C1512] hover:text-white transition-colors shadow-md z-10"
                title="Expand photograph view"
              >
                <Maximize2 size={16} />
              </button>

              <div className="absolute bottom-4 left-4 bg-[#1C1512]/80 backdrop-blur-sm text-white px-3 py-1 rounded text-[11px] font-mono tracking-widest uppercase">
                {article.article_number}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-[#FFFDF9] ${
                      activeImage === imgUrl
                        ? 'border-[#D9383A] ring-2 ring-[#D9383A]/30 scale-105'
                        : 'border-[#E5DED5] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className="object-cover p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Specifications & Article Metadata Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* PRIMARY ARTICLE NUMBER DISPLAY */}
              <div className="inline-block bg-[#FAF0E6] text-[#D9383A] border border-[#D9383A]/30 px-3 py-1 rounded-md text-xs font-mono font-bold tracking-[0.2em] uppercase mb-2">
                ARTICLE NO. {article.article_number}
              </div>

              {/* Model Name */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#1C1512] tracking-tight leading-tight">
                {article.model_name || `Model ${article.article_number}`}
              </h1>

              {/* Collection Link & Availability Status */}
              <div className="flex items-center gap-3 mt-2 text-xs">
                {article.collection_slug && (
                  <NextLink
                    href={`/collections/${article.collection_slug}`}
                    className="font-semibold text-[#8C827A] hover:text-[#1C1512] uppercase tracking-wider underline underline-offset-4"
                  >
                    Collection: {article.collection_name}
                  </NextLink>
                )}
                <span className="text-[#E5DED5]">•</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  {article.availability}
                </span>
              </div>
            </div>

            {/* Price display (Optional) */}
            {article.display_price && (article.price !== null || article.sale_price !== null) && (
              <div className="p-4 rounded-xl bg-[#FFFDF9] border border-[#E5DED5] flex items-baseline gap-3">
                {article.sale_price ? (
                  <>
                    <span className="text-2xl font-bold text-[#1C1512]">
                      ₹{article.sale_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-[#8C827A] line-through">
                      ₹{article.price?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D9383A] bg-red-50 px-2 py-0.5 rounded">
                      Special Catalogue Rate
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#1C1512]">
                    ₹{article.price?.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#8C827A] ml-auto uppercase tracking-wider">
                  Direct Factory Price
                </span>
              </div>
            )}

            {/* Colour Selector */}
            {article.colours && article.colours.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-[#1C1512]">
                    Available Colours:
                  </span>
                  <span className="font-medium text-[#5E524B]">
                    {selectedColour || 'Select a colour'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {article.colours.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectColour(col.name)}
                      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                        selectedColour === col.name
                          ? 'border-[#1C1512] bg-[#1C1512] text-white shadow-sm'
                          : 'border-[#E5DED5] bg-[#FFFDF9] text-[#1C1512] hover:border-[#1C1512]'
                      }`}
                    >
                      {col.secondary_hex ? (
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0 overflow-hidden shadow-xs"
                          style={{
                            background: `linear-gradient(135deg, ${col.hex_code} 50%, ${col.secondary_hex} 50%)`
                          }}
                          title={`Primary: ${col.hex_code}, Secondary: ${col.secondary_hex}`}
                        />
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0 shadow-xs"
                          style={{ backgroundColor: col.hex_code }}
                        />
                      )}
                      <span>{col.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Descriptions */}
            <div className="space-y-3 pt-2 text-sm text-[#5E524B] leading-relaxed border-t border-[#E5DED5]">
              {article.short_description && (
                <p className="font-medium text-[#1C1512]">
                  {article.short_description}
                </p>
              )}
              {article.full_description && (
                <p className="whitespace-pre-line text-xs sm:text-sm">
                  {article.full_description}
                </p>
              )}
            </div>

            {/* PRIMARY CTA (Requirement: "ENQUIRE ABOUT THIS ARTICLE") */}
            <div className="pt-4 space-y-3">
              <button
                type="button"
                onClick={() => setEnquiryOpen(true)}
                className="w-full py-4 px-6 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-[#D9383A]/25 flex items-center justify-center gap-3 group"
              >
                <MessageSquare size={18} />
                <span>ENQUIRE ABOUT THIS ARTICLE</span>
              </button>

              {liveWhatsApp && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-6 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall size={16} />
                  <span>Quick WhatsApp Enquiry ({article.article_number})</span>
                </a>
              )}

              <p className="text-[11px] text-center text-[#8C827A]">
                Direct bag manufacturer enquiry. Quote <strong>{article.article_number}</strong> for rapid order processing or institutional tenders.
              </p>
            </div>

            {/* Factory Standards Reassurance */}
            <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-4 text-xs text-[#5E524B] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#1C1512]">
                <ShieldCheck size={16} className="text-[#D9383A]" />
                <span>EFBY Factory Standards & Warranty</span>
              </div>
              <ul className="space-y-1 list-disc list-inside text-[11px] text-[#5E524B]">
                <li>Certified under unique Article Number: <strong>{article.article_number}</strong></li>
                <li>12-Month Factory Warranty on structural stitching & zippers</li>
                <li>Direct factory dispatch with complete quality inspection</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Specifications Matrix (Requirement 4) */}
        {(article.materials || article.dimensions || article.capacity || article.weight || article.compartments || article.features) && (
          <section className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-6 sm:p-10 space-y-6">
            <div className="border-b border-[#E5DED5] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                Engineering & Specifications
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1512] mt-1">
                Article Specification Profile
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.materials && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Layers size={14} className="text-[#C5A880]" />
                    <span>Materials</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.materials}</p>
                </div>
              )}

              {article.dimensions && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Ruler size={14} className="text-[#C5A880]" />
                    <span>Dimensions</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.dimensions}</p>
                </div>
              )}

              {article.capacity && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Box size={14} className="text-[#C5A880]" />
                    <span>Capacity</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.capacity}</p>
                </div>
              )}

              {article.weight && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Weight size={14} className="text-[#C5A880]" />
                    <span>Weight</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.weight}</p>
                </div>
              )}

              {article.compartments && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1 md:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Box size={14} className="text-[#C5A880]" />
                    <span>Compartments & Pockets</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.compartments}</p>
                </div>
              )}

              {article.features && (
                <div className="border border-[#E5DED5] rounded-xl p-4 bg-[#FAF7F2] space-y-1 md:col-span-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8C827A]">
                    <Sparkles size={14} className="text-[#C5A880]" />
                    <span>Special Features & Hardware</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1C1512]">{article.features}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Articles From Same Collection (Requirement 4) */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between border-b border-[#E5DED5] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                  More From This Collection
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1C1512] mt-1">
                  Explore Complementary Articles
                </h3>
              </div>
              {article.collection_slug && (
                <NextLink
                  href={`/collections/${article.collection_slug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#1C1512] hover:text-[#D9383A] transition-colors"
                >
                  View Collection →
                </NextLink>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedArticles.map((rel) => (
                <div key={rel.id} className="group bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-3 space-y-3">
                  <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-[#FAF7F2]">
                    <Image
                      src={rel.main_image}
                      alt={rel.model_name || rel.article_number}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#D9383A] uppercase block">
                      ARTICLE {rel.article_number}
                    </span>
                    <h4 className="text-xs font-semibold text-[#1C1512] truncate mt-0.5">
                      {rel.model_name || 'Standard Model'}
                    </h4>
                  </div>
                  <NextLink
                    href={`/articles/${rel.slug}`}
                    className="block text-center py-1.5 px-3 rounded border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-white text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    View Article
                  </NextLink>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Expanded Photograph Modal */}
      {zoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-[#1C1512]/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={activeImage}
              alt="High resolution view"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setZoomOpen(false)}
              className="absolute top-4 right-4 text-white text-xs font-bold uppercase tracking-widest bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full"
            >
              Close [ESC]
            </button>
          </div>
        </div>
      )}

      {/* Official Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        article={{
          id: article.id,
          article_number: article.article_number,
          model_name: article.model_name,
          selected_colour: selectedColour,
        }}
        whatsappNumber={liveWhatsApp}
      />
    </>
  );
}
