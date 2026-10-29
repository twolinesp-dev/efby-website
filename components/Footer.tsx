'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  initialSettings?: Partial<SiteSettings>;
}

export default function Footer({ initialSettings }: FooterProps) {
  const pathname = usePathname();
  const [settings, setSettings] = useState<Partial<SiteSettings>>(initialSettings || {});

  useEffect(() => {
    // Keep settings in sync with any updates made in the admin panel
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error('Failed to load settings in footer:', err));
  }, []);

  // Do not render consumer website footer on dedicated admin screens
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const bioText = settings.footer_bio || 'Established premium bag maker engineered for enduring elegance and functional mastery. From luxury handcrafted leather goods to heavy-duty ergonomic school carry.';
  const addressText = settings.address || 'EFBY Works, Kottarakkara, Kerala, India';
  const phoneText = settings.contact_phone || '+91 9847 000 000';
  const emailText = settings.contact_email || 'enquiry@efby.in';

  return (
    <footer className="bg-[#1C1512] text-[#FAF7F2] border-t border-[#2A211D] mt-auto">
      {/* Upper editorial section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative h-12 w-40">
              <Image
                src="/images/logo-light.png"
                alt="EFBY Official Logo"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-[#CBBFB3] leading-relaxed max-w-sm">
              {bioText}
            </p>
            <div className="pt-2 text-xs text-[#E8DFD5] space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={15} className="text-[#C5A880] flex-shrink-0" />
                <span>{addressText}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-[#C5A880] flex-shrink-0" />
                <a href={`tel:${phoneText.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {phoneText}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-[#C5A880] flex-shrink-0" />
                <a href={`mailto:${emailText}`} className="hover:text-white transition-colors">
                  {emailText}
                </a>
              </div>
            </div>
          </div>

          {/* Collections Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A880]">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-[#CBBFB3]">
              <li>
                <Link href="/collections/handbags" className="hover:text-white transition-colors">
                  Handbags
                </Link>
              </li>
              <li>
                <Link href="/collections/school-bags" className="hover:text-white transition-colors">
                  School Bags
                </Link>
              </li>
              <li>
                <Link href="/collections/office-bags" className="hover:text-white transition-colors">
                  Office & Briefcases
                </Link>
              </li>
              <li>
                <Link href="/collections/travel-bags" className="hover:text-white transition-colors">
                  Travel & Duffels
                </Link>
              </li>
              <li>
                <Link href="/collections/backpacks" className="hover:text-white transition-colors">
                  Backpacks
                </Link>
              </li>
              <li>
                <Link href="/collections/sling-bags" className="hover:text-white transition-colors">
                  Sling & Crossbody
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors flex items-center gap-1 text-[#C5A880] pt-1">
                  <span>View All Collections</span>
                  <ArrowUpRight size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Dynamic Lines Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A880]">
              Discover
            </h4>
            <ul className="space-y-2.5 text-xs text-[#CBBFB3]">
              <li>
                <Link href="/collections/trending" className="hover:text-white transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A]" />
                  <span>Trending Bag Models</span>
                </Link>
              </li>
              <li>
                <Link href="/collections/newly-launched" className="hover:text-white transition-colors">
                  Newly Launched Articles
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  Manufacturing Standards
                </Link>
              </li>
              <li>
                <Link href="/#warranty" className="hover:text-white transition-colors">
                  12-Month Guarantee
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-white transition-colors">
                  Direct B2B & Bulk Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Catalogue Protocol Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#C5A880]">
              Catalogue System
            </h4>
            <p className="text-xs text-[#CBBFB3] leading-relaxed">
              Every authentic bag model is tagged with a unique <strong>Article Number</strong> for precise factory tracking, warranty validation, and direct enquiry fulfillment.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2A211D] bg-[#150F0D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C827A]">
          <p>© {new Date().getFullYear()} EFBY Bag Manufacturers. All rights reserved.</p>
          <p className="tracking-widest uppercase text-[10px]">
            Collections First • Unique Article Numbers • Master Craftsmanship
          </p>
        </div>
      </div>
    </footer>
  );
}
