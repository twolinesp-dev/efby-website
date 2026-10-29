import React from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Building2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { getSiteSettings } from '@/lib/catalogue';

export const metadata = {
  title: 'Contact EFBY | Direct Bag Manufacturer & Luxury Atelier',
  description: 'Connect with EFBY Bag Manufacturer. Direct inquiries, wholesale distribution, corporate lots, and bespoke luxury handbag atelier consultations.',
};

export default async function ContactPage() {
  const settings = getSiteSettings();
  const rawWhatsApp = (settings.whatsapp_number || '+919847000000').replace(/[^0-9]/g, '');

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. HERO HEADER */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-16 border-b border-[#E5DED5] bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E5DED5] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#1C1512] shadow-sm">
            <Building2 size={13} className="text-[#D9383A]" />
            <span>Direct Manufacturer & Atelier Communications</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1C1512] tracking-tight">
            Contact EFBY
          </h1>

          <p className="text-sm sm:text-base text-[#5E524B] max-w-2xl mx-auto leading-relaxed">
            Connect directly with our master atelier and factory distribution desk. Whether for single bespoke editions, corporate orders, or institutional school bag manufacturing.
          </p>
        </div>
      </section>

      {/* 2. DIRECT CONTACT CHANNELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Channel 1: WhatsApp Hotline */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E5DED5] p-8 shadow-lg hover:border-[#1C1512] transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
                <MessageSquare size={22} className="text-[#C5A880]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block">
                Instant Chat
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1C1512]">
                WhatsApp Hotline
              </h3>
              <p className="text-xs text-[#5E524B] leading-relaxed">
                Connect directly with our sales desk on WhatsApp for instant replies, stock availability, and digital catalogue specs.
              </p>
              <p className="text-sm font-mono font-bold text-[#1C1512]">
                {settings.whatsapp_number}
              </p>
            </div>
            <div className="pt-6">
              <a
                href={`https://wa.me/${rawWhatsApp}?text=${encodeURIComponent('Hello EFBY, I am reaching out from your catalogue website.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Open WhatsApp</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Channel 2: Direct Phone */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E5DED5] p-8 shadow-lg hover:border-[#1C1512] transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
                <Phone size={22} className="text-[#D9383A]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block">
                Direct Line
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1C1512]">
                Factory Phone
              </h3>
              <p className="text-xs text-[#5E524B] leading-relaxed">
                Speak directly with our factory customer service and bulk ordering coordinators during atelier operating hours.
              </p>
              <p className="text-sm font-mono font-bold text-[#1C1512]">
                {settings.contact_phone}
              </p>
            </div>
            <div className="pt-6">
              <a
                href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                className="w-full py-3 px-4 rounded-xl border-2 border-[#1C1512] hover:bg-[#1C1512] hover:text-white text-[#1C1512] text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Call Factory Line</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Channel 3: Official Email */}
          <div className="relative rounded-3xl overflow-hidden bg-[#FFFDF9] border border-[#E5DED5] p-8 shadow-lg hover:border-[#1C1512] transition-colors flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1C1512] text-[#FAF7F2] flex items-center justify-center">
                <Mail size={22} className="text-[#C5A880]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block">
                Official Inquiries
              </span>
              <h3 className="text-xl font-serif font-bold text-[#1C1512]">
                Correspondence Email
              </h3>
              <p className="text-xs text-[#5E524B] leading-relaxed">
                Submit formal RFP documents, dealer distribution applications, or institutional custom branding inquiries.
              </p>
              <p className="text-sm font-mono font-bold text-[#1C1512]">
                {settings.contact_email}
              </p>
            </div>
            <div className="pt-6">
              <a
                href={`mailto:${settings.contact_email}`}
                className="w-full py-3 px-4 rounded-xl border border-[#E5DED5] hover:bg-[#FAF7F2] text-[#1C1512] text-xs font-bold uppercase tracking-[0.16em] transition-colors flex items-center justify-center gap-2"
              >
                <span>Send Email</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ATELIER LOCATION & OPERATING HOURS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#1C1512] text-[#FAF7F2] p-8 sm:p-12 lg:p-16 border border-[#2A211D] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A880] text-[11px] font-bold uppercase tracking-[0.2em]">
                <MapPin size={14} />
                <span>Manufacturing Atelier Headquarters</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                EFBY Works & Manufacturing Plant
              </h2>
              <p className="text-sm sm:text-base text-[#CBBFB3] leading-relaxed">
                Our central production facility and sample showroom are located at the heart of South India’s bagcrafting belt. Buyers, retail representatives, and institutional delegates are welcomed by prior appointment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#2A211D]">
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                    Atelier Address
                  </h4>
                  <p className="text-xs text-[#E8DFD5] leading-relaxed">
                    {settings.address}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C5A880]">
                    Factory Operating Hours
                  </h4>
                  <p className="text-xs text-[#E8DFD5] leading-relaxed">
                    Monday — Saturday: 9:00 AM — 6:30 PM IST<br />
                    Sunday: Dedicated wholesale appointments only
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#2A211D]/80 rounded-2xl p-6 sm:p-8 border border-[#3E342F] space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C5A880]">
                Quick Enquiry Protocol
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Looking for a specific Article Number?
              </h3>
              <p className="text-xs text-[#CBBFB3] leading-relaxed">
                If you have a certified Article Number (e.g. EF-HB-001 or EF-SB-001), you can enquire directly on the bag&apos;s catalogue page or submit an inquiry with the model code.
              </p>
              <div className="pt-2 flex flex-col gap-3">
                <Link
                  href="/collections"
                  className="w-full py-3 px-4 rounded-xl bg-[#FAF7F2] text-[#1C1512] hover:bg-[#D9383A] hover:text-white text-xs font-bold uppercase tracking-[0.16em] transition-colors text-center"
                >
                  Browse Catalogue Collections
                </Link>
                <Link
                  href="/collections/trending"
                  className="w-full py-3 px-4 rounded-xl border border-white/20 text-[#FAF7F2] hover:bg-white/10 text-xs font-bold uppercase tracking-[0.16em] transition-colors text-center"
                >
                  View Trending Bag Models
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
