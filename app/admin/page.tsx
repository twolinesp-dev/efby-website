import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  Layers, 
  MessageSquare, 
  PlusCircle, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { getCollections, getArticles, getEnquiries } from '@/lib/catalogue';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    redirect('/admin/login');
  }

  const articles = getArticles({ includeUnpublished: true });
  const collections = getCollections(true);
  const enquiries = getEnquiries();

  const publishedCount = articles.filter(a => a.publication_status === 'published').length;
  const trendingCount = articles.filter(a => a.trending).length;
  const newArrivalCount = articles.filter(a => a.new_arrival).length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  return (
    <div className="space-y-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DED5] pb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
            Catalogue Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1512] mt-1">
            EFBY Operations Dashboard
          </h1>
          <p className="text-xs text-[#5E524B] mt-1">
            Collections First • Unique Article Numbers Second • Secure Direct Enquiries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles?action=new"
            className="px-4 py-2.5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
          >
            <PlusCircle size={15} />
            <span>Add New Article</span>
          </Link>
          <Link
            href="/admin/collections"
            className="px-4 py-2.5 rounded-lg border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <Layers size={15} />
            <span>New Collection</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            <span>Total Articles</span>
            <Package size={16} className="text-[#D9383A]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#1C1512]">{articles.length}</p>
          <p className="text-[11px] text-[#5E524B]">
            {publishedCount} Published • {articles.length - publishedCount} Drafts
          </p>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            <span>Active Collections</span>
            <Layers size={16} className="text-[#C5A880]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#1C1512]">{collections.length}</p>
          <p className="text-[11px] text-[#5E524B]">
            Primary category discovery tiles
          </p>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            <span>Customer Enquiries</span>
            <MessageSquare size={16} className="text-emerald-700" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#1C1512]">{enquiries.length}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {newEnquiriesCount} New Uncontacted
          </p>
        </div>

        <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#8C827A]">
            <span>Dynamic Highlights</span>
            <Sparkles size={16} className="text-[#C5A880]" />
          </div>
          <p className="text-3xl font-serif font-bold text-[#1C1512]">
            {trendingCount + newArrivalCount}
          </p>
          <p className="text-[11px] text-[#5E524B]">
            {trendingCount} Trending • {newArrivalCount} New
          </p>
        </div>
      </div>

      {/* Two Column Layout: Recent Enquiries & Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries */}
        <div className="lg:col-span-7 bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DED5] pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare size={18} className="text-[#C5A880]" />
              <h3 className="text-base font-bold uppercase tracking-wider text-[#1C1512]">
                Recent Customer Enquiries
              </h3>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs font-bold uppercase tracking-wider text-[#D9383A] hover:underline flex items-center gap-1"
            >
              <span>View All ({enquiries.length})</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          {enquiries.length > 0 ? (
            <div className="divide-y divide-[#E5DED5]">
              {enquiries.slice(0, 5).map((enq) => (
                <div key={enq.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#D9383A] bg-[#FAF0E6] px-2 py-0.5 rounded">
                      ARTICLE {enq.article_number}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      enq.status === 'new' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-[#EFE9E1] text-[#5E524B]'
                    }`}>
                      {enq.status}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-semibold text-[#1C1512]">{enq.customer_name}</span>
                    <span className="text-[#8C827A]">{new Date(enq.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-xs text-[#5E524B] flex items-center gap-4">
                    <span>Phone: {enq.phone}</span>
                    {enq.selected_colour && <span>Colour: {enq.selected_colour}</span>}
                  </div>
                  {enq.message && (
                    <p className="text-xs text-[#8C827A] italic line-clamp-1">
                      &ldquo;{enq.message}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#8C827A] py-6 text-center">No customer enquiries logged yet.</p>
          )}
        </div>

        {/* Recent Articles Showcase */}
        <div className="lg:col-span-5 bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E5DED5] pb-3">
            <div className="flex items-center gap-2">
              <Package size={18} className="text-[#D9383A]" />
              <h3 className="text-base font-bold uppercase tracking-wider text-[#1C1512]">
                Active Articles
              </h3>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs font-bold uppercase tracking-wider text-[#D9383A] hover:underline flex items-center gap-1"
            >
              <span>Manage Catalogue</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="divide-y divide-[#E5DED5]">
            {articles.slice(0, 5).map((art) => (
              <div key={art.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#1C1512]">
                      {art.article_number}
                    </span>
                    {art.trending && (
                      <span className="text-[9px] uppercase font-bold tracking-wider text-[#D9383A] bg-red-50 px-1.5 py-0.2 rounded">
                        Trending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5E524B] truncate max-w-[200px]">
                    {art.model_name || 'Standard Model'}
                  </p>
                </div>
                <Link
                  href={`/articles/${art.slug}`}
                  target="_blank"
                  className="text-xs text-[#8C827A] hover:text-[#1C1512] font-semibold"
                >
                  View Live ↗
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
