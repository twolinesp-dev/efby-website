import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Compass, 
  CheckCircle2, 
  Factory, 
  Gem, 
  Award, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { getCollections, getArticles, getSiteSettings } from '@/lib/catalogue';
import CollectionCard from '@/components/CollectionCard';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 0; // Always fresh from database

export default async function HomePage() {
  const collections = getCollections().filter(c => !c.is_hidden);
  const featuredCollections = collections.filter(c => c.is_featured).slice(0, 4);
  const regularCollections = collections.slice(0, 6);

  const trendingArticles = getArticles({ trendingOnly: true, limit: 4 });
  const newlyLaunchedArticles = getArticles({ newArrivalOnly: true, limit: 4 });
  const settings = getSiteSettings();

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* 1. SIGNATURE HERO SECTION: EFBY — LUXURY WITHIN REACH */}
      <section className="relative overflow-hidden pt-10 pb-12 sm:pt-16 sm:pb-16 border-b border-[#E5DED5]">
        {/* Subtle decorative luxury ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C5A880]/15 via-[#FAF7F2] to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
          {/* Frosted Luxury Atelier Manifesto Card */}
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E5DED5] shadow-2xl max-w-5xl mx-auto space-y-7 transition-all duration-300">
            {/* Grand Main Heading: EFBY in logo color with Tagline Below */}
            <div className="space-y-4">
              <h1 className="flex flex-col items-center justify-center gap-1.5 sm:gap-2.5">
                <span className="text-5xl sm:text-7xl md:text-8xl font-serif font-extrabold tracking-tight">
                  <span className="text-[#1C1512]">E</span>
                  <span className="text-[#D9383A]">FB</span>
                  <span className="text-[#1C1512]">Y</span>
                </span>
                <span className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-[#1C1512] tracking-tight">
                  Luxury Within Reach
                </span>
              </h1>
              <div className="w-16 h-1 bg-[#D9383A] rounded-full mx-auto" />
            </div>

            {/* Small Introduction Paragraph requested by USER */}
            <div className="max-w-3xl mx-auto space-y-4 pt-1">
              <p className="text-base sm:text-lg text-[#4A3F38] leading-relaxed font-sans font-normal">
                Step into the world of EFBY, where timeless sophistication meets contemporary luxury. Crafted for those who appreciate elegance in every detail, our premium bags embody refined design, exceptional style, and effortless grace. Every creation is more than an accessory—it is an expression of individuality, a symbol of confidence, and a statement of understated luxury.
              </p>
              
              <div className="pt-2 flex items-center justify-center gap-3">
                <span className="h-px w-8 sm:w-16 bg-[#C5A880]/60" />
                <p className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.22em] text-[#D9383A]">
                  EFBY — Carry Elegance. Define Luxury.
                </p>
                <span className="h-px w-8 sm:w-16 bg-[#C5A880]/60" />
              </div>
            </div>

            {/* Three Certified Factory Standards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-2 max-w-2xl mx-auto border-y border-[#E5DED5] py-4 bg-[#FAF7F2]/90 rounded-2xl px-4 sm:px-8">
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-serif font-bold text-[#1C1512]">100%</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8C827A] font-semibold mt-0.5">
                  Unique Article No.
                </p>
              </div>
              <div className="text-center border-x border-[#E5DED5]/80 px-2 sm:px-4">
                <p className="text-lg sm:text-2xl font-serif font-bold text-[#D9383A]">12 Mo.</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8C827A] font-semibold mt-0.5">
                  Factory Warranty
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg sm:text-2xl font-serif font-bold text-[#1C1512]">Direct</p>
                <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8C827A] font-semibold mt-0.5">
                  Factory Enquiries
                </p>
              </div>
            </div>

            {/* Action CTA */}
            <div className="flex items-center justify-center pt-2">
              <Link
                href="/collections"
                className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 shadow-xl hover:shadow-[#D9383A]/25 flex items-center justify-center gap-3 group"
              >
                <span>Explore Collections</span>
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 2. SIGNATURE ATELIER SHOWCASE (Visual Magazine Grid) */}
          <div className="pt-8 sm:pt-12 text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
              {/* Main Flagship Masterpiece (7 Cols) */}
              <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border-2 border-[#E5DED5] bg-[#1C1512] text-white shadow-2xl group flex flex-col justify-end min-h-[460px] sm:min-h-[520px]">
                <Image
                  src="/uploads/efby_aethel_handbag.webp"
                  alt="EFBY Aethel Luxury Handbag"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-95"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150F0D] via-[#150F0D]/40 to-transparent" />
                
                {/* Floating Metallic Article Tag */}
                <div className="absolute top-5 left-5 z-10 flex items-center gap-2">
                  <span className="bg-[#1C1512]/95 backdrop-blur-md text-[#FAF7F2] text-[10px] font-mono font-bold tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                    ARTICLE NO. EF-HB-001
                  </span>
                  <span className="bg-[#D9383A] text-white text-[10px] font-bold uppercase tracking-[0.16em] px-2.5 py-1 rounded-full shadow-md">
                    Atelier Flagship
                  </span>
                </div>

                <div className="relative z-10 p-6 sm:p-10 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C5A880]">
                    Haute Maroquinerie Edition
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                    The Aethel Luxury Handbag
                  </h3>
                  <p className="text-xs sm:text-sm text-[#E8DFD5] max-w-xl leading-relaxed">
                    Crafted in warm ivory & espresso fine-grain calfskin, finished with champagne gold alloy hardware, interior velvet lining, and hand-painted edges.
                  </p>
                  
                  <div className="pt-3 flex flex-wrap items-center gap-4">
                    <Link
                      href="/articles/ef-hb-001"
                      className="px-5 py-2.5 rounded-lg bg-white text-[#1C1512] hover:bg-[#D9383A] hover:text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center gap-2"
                    >
                      <span>Examine Specifications</span>
                      <ArrowRight size={14} />
                    </Link>
                    <Link
                      href="/collections/handbags"
                      className="text-xs font-bold uppercase tracking-wider text-[#C5A880] hover:text-white transition-colors"
                    >
                      View All Handbags →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Secondary Highlights (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* School & Travel Ergonomic Feature */}
                <div className="relative rounded-3xl overflow-hidden border border-[#E5DED5] bg-[#FFFDF9] p-6 sm:p-7 shadow-lg flex-1 flex flex-col justify-between group hover:border-[#1C1512] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#D9383A] bg-[#FAF0E6] px-2.5 py-1 rounded border border-[#D9383A]/20">
                        ARTICLE NO. EF-SB-001
                      </span>
                      <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1C1512] mt-2 group-hover:text-[#D9383A] transition-colors">
                        School Voyager Backpack
                      </h4>
                      <p className="text-xs text-[#5E524B] mt-1 leading-relaxed">
                        Engineered with ergonomic spinal airflow padding, water-resistant ballistic canvas, and heavy-duty load bar-tacking.
                      </p>
                    </div>
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0">
                      <Image
                        src="/images/floating-bags/bag-1.webp"
                        alt="School Voyager"
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E5DED5] flex items-center justify-between text-xs">
                    <Link
                      href="/articles/ef-sb-001"
                      className="font-bold uppercase tracking-wider text-[#1C1512] group-hover:text-[#D9383A] transition-colors flex items-center gap-1.5"
                    >
                      <span>Model Specs</span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link
                      href="/collections/school-bags"
                      className="text-[11px] text-[#8C827A] hover:text-[#1C1512] uppercase tracking-wider font-semibold"
                    >
                      Explore School Line →
                    </Link>
                  </div>
                </div>

                {/* Executive Heritage Briefcase */}
                <div className="relative rounded-3xl overflow-hidden border border-[#E5DED5] bg-[#FFFDF9] p-6 sm:p-7 shadow-lg flex-1 flex flex-col justify-between group hover:border-[#1C1512] transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#D9383A] bg-[#FAF0E6] px-2.5 py-1 rounded border border-[#D9383A]/20">
                        ARTICLE NO. EF-BC-001
                      </span>
                      <h4 className="text-lg sm:text-xl font-serif font-bold text-[#1C1512] mt-2 group-hover:text-[#D9383A] transition-colors">
                        Executive Heritage Briefcase
                      </h4>
                      <p className="text-xs text-[#5E524B] mt-1 leading-relaxed">
                        Padded 16-inch workstation compartment, trolley strap pass-through, and architectural saddle leather framing.
                      </p>
                    </div>
                    <div className="relative w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0">
                      <Image
                        src="/images/floating-bags/bag-7.webp"
                        alt="Executive Heritage Briefcase"
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#E5DED5] flex items-center justify-between text-xs">
                    <Link
                      href="/articles/ef-bc-001"
                      className="font-bold uppercase tracking-wider text-[#1C1512] group-hover:text-[#D9383A] transition-colors flex items-center gap-1.5"
                    >
                      <span>Model Specs</span>
                      <ChevronRight size={14} />
                    </Link>
                    <Link
                      href="/collections/executive-briefcases"
                      className="text-[11px] text-[#8C827A] hover:text-[#1C1512] uppercase tracking-wider font-semibold"
                    >
                      Explore Executive Line →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR PILLARS OF EFBY EXCELLENCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5DED5] shadow-sm space-y-3 hover:border-[#1C1512] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
              <Gem size={20} className="text-[#C5A880]" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1512]">
              Refined Design
            </h4>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Architectural silhouettes engineered with effortless grace, balanced proportions, and understated luxury finishes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5DED5] shadow-sm space-y-3 hover:border-[#1C1512] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
              <Award size={20} className="text-[#D9383A]" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1512]">
              Exceptional Style
            </h4>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Created for connoisseurs who demand distinction in every detail, from bespoke handbags to everyday school backpacks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5DED5] shadow-sm space-y-3 hover:border-[#1C1512] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
              <ShieldCheck size={20} className="text-[#C5A880]" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1512]">
              Certified Article No.
            </h4>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Every individual bag model carries a unique, registered Article Number ensuring strict factory traceability.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FFFDF9] border border-[#E5DED5] shadow-sm space-y-3 hover:border-[#1C1512] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
              <Factory size={20} className="text-[#D9383A]" />
            </div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-[#1C1512]">
              Direct Enquiries
            </h4>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Direct bag manufacturer catalogue. Inquire for individual orders, boutique retail stock, or institutional wholesale lots.
            </p>
          </div>
        </div>
      </section>

      {/* 3. COLLECTIONS FIRST: DISCOVERY SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4 border-b border-[#E5DED5] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A880] mb-2">
              <Compass size={15} />
              <span>Browse By Category</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1512] tracking-tight">
              Explore the EFBY Collections
            </h2>
            <p className="text-sm text-[#5E524B] mt-1 max-w-xl">
              Discover thoughtfully selected bags for every journey, occasion, and everyday essential.
            </p>
          </div>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1C1512] hover:text-[#D9383A] transition-colors py-2"
          >
            <span>View All {collections.length} Collections</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Editorial Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regularCollections.map((col, index) => (
            <CollectionCard
              key={col.id}
              collection={col}
              featured={index === 0 || index === 3}
            />
          ))}
        </div>
      </section>

      {/* 4. TRENDING ARTICLES SECTION */}
      {trendingArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 border-b border-[#E5DED5] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D9383A] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D9383A] animate-ping" />
                <span>High Demand Line</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1512] tracking-tight">
                Trending Bag Models
              </h2>
              <p className="text-sm text-[#5E524B] mt-1">
                Each bag model is identified by its certified Article Number.
              </p>
            </div>

            <Link
              href="/collections/trending"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1C1512] hover:text-[#D9383A] transition-colors py-2"
            >
              <span>Explore All Trending Articles</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {trendingArticles.map((art) => (
              <ArticleCard key={art.id} article={art} showPrice={settings.global_price_display} />
            ))}
          </div>
        </section>
      )}

      {/* 5. BRAND STORY & MANUFACTURING EXCELLENCE */}
      <section id="about" className="bg-[#1C1512] text-[#FAF7F2] py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-[11px] font-bold uppercase tracking-[0.2em]">
                <Factory size={14} />
                <span>Direct Manufacturer Standards</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FAF7F2] tracking-tight leading-tight">
                Relentless Precision. Uncompromising Material Purity.
              </h2>

              <p className="text-sm sm:text-base text-[#CBBFB3] leading-relaxed">
                At EFBY, bag making is not an assembly line; it is an architectural craft. Every seam is engineered to endure tensile loads far beyond industry standards, whether in our luxury handbags or high-resilience school backpacks.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="border-l-2 border-[#D9383A] pl-4 space-y-1.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    Unique Article Numbers
                  </h4>
                  <p className="text-xs text-[#CBBFB3] leading-relaxed">
                    Every bag style possesses a registered Article Number for traceable factory inspection and warranty service.
                  </p>
                </div>
                <div className="border-l-2 border-[#C5A880] pl-4 space-y-1.5">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                    12-Month Guarantee
                  </h4>
                  <p className="text-xs text-[#CBBFB3] leading-relaxed">
                    Full factory backing covering zippers, structural stitching, strap joins, and material resilience.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#2A211D]">
                <Image
                  src="/uploads/web_1775897344523-ahgam2.webp"
                  alt="EFBY Craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#2A211D] translate-y-6">
                <Image
                  src="/uploads/efby_aethel_handbag.webp"
                  alt="Executive Leather Work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWLY LAUNCHED ARTICLES */}
      {newlyLaunchedArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4 border-b border-[#E5DED5] pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C5A880] mb-2">
                <Sparkles size={14} />
                <span>Fresh From The Atelier</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1512] tracking-tight">
                Newly Launched Bag Models
              </h2>
              <p className="text-sm text-[#5E524B] mt-1">
                Latest seasonal editions, modern silhouettes, and ergonomic designs.
              </p>
            </div>

            <Link
              href="/collections/newly-launched"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1C1512] hover:text-[#D9383A] transition-colors py-2"
            >
              <span>Explore All New Launches</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {newlyLaunchedArticles.map((art) => (
              <ArticleCard key={art.id} article={art} showPrice={settings.global_price_display} />
            ))}
          </div>
        </section>
      )}

      {/* 7. INSTITUTIONAL & BULK CATALOGUE ENQUIRY BANNER */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1512] via-[#2A211D] to-[#1C1512] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 border border-[#2A211D] shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C5A880]">
              Direct Bag Manufacturer Wholesale & Custom Lots
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
              Institutional, Corporate & Custom Bag Manufacturing
            </h3>
            <p className="text-sm sm:text-base text-[#CBBFB3] leading-relaxed">
              We supply schools, colleges, corporations, and luxury boutique retailers with customized bags, certified under dedicated factory Article Numbers with branded hardware and customized specs.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/collections"
                className="px-6 py-3.5 rounded-xl bg-[#FAF7F2] text-[#1C1512] hover:bg-[#D9383A] hover:text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors text-center"
              >
                Browse Bag Models
              </Link>
              <a
                href={`https://wa.me/${(settings.whatsapp_number || '+919847000000').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello EFBY, I am interested in bulk / corporate bag manufacturing enquiry.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl border border-[#FAF7F2]/30 text-[#FAF7F2] hover:bg-white/10 text-xs font-bold uppercase tracking-[0.16em] transition-colors text-center"
              >
                Direct WhatsApp Hotline
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
