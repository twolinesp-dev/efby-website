'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ArrowRight, Phone } from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Do not render consumer website navbar on dedicated admin screens
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DED5] transition-all">
        {/* Top announcement bar */}
        <div className="bg-[#1C1512] text-[#FAF7F2] text-[11px] font-medium tracking-[0.18em] uppercase py-2 px-4 text-center flex items-center justify-center gap-2">
          <span>Official EFBY Bag Manufacturer & Luxury Catalogue</span>
          <span className="hidden md:inline text-[#C5A880]">•</span>
          <span className="hidden md:inline text-[#E8DFD5]">Direct Inquiries & Wholesale Distribution</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#1C1512] hover:text-[#D9383A] p-2 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group" title="EFBY Luxury Bags Home">
                <div className="relative h-9 w-9 sm:h-11 sm:w-11 transition-transform duration-300 group-hover:scale-105 flex-shrink-0">
                  <Image
                    src="/images/logo-emblem.png"
                    alt="EFBY Emblem"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-9 w-28 sm:h-11 sm:w-36 transition-transform duration-300 group-hover:scale-[1.02]">
                  <Image
                    src="/images/logo.png"
                    alt="EFBY Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-7 text-xs font-semibold uppercase tracking-[0.15em] text-[#1C1512]">
              <Link href="/collections" className="hover:text-[#D9383A] transition-colors py-1 relative group">
                All Collections
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/collections/handbags" className="hover:text-[#D9383A] transition-colors py-1 relative group">
                Handbags
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/collections/school-bags" className="hover:text-[#D9383A] transition-colors py-1 relative group">
                School Bags
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/collections/trending" className="hover:text-[#D9383A] transition-colors py-1 relative group flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A] animate-pulse" />
                Trending
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/collections/newly-launched" className="hover:text-[#D9383A] transition-colors py-1 relative group">
                Newly Launched
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link href="/#about" className="hover:text-[#D9383A] transition-colors py-1 relative group text-[#5E524B]">
                Heritage
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#D9383A] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#1C1512] hover:text-[#D9383A] p-2 transition-colors rounded-full hover:bg-[#EFE9E1]"
                title="Search by Article Number or model"
              >
                <Search size={18} />
                <span className="hidden lg:inline text-[11px] text-[#5E524B]">Article Search</span>
              </button>

              <Link
                href="/contact"
                className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-lg border border-[#E5DED5] text-[#1C1512] hover:border-[#1C1512] hover:bg-[#1C1512] hover:text-[#FAF7F2] transition-colors shadow-sm"
                title="Contact EFBY Atelier & Factory"
              >
                <Phone size={13} className="text-[#D9383A]" />
                <span className="hidden sm:inline">Contacts</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FAF7F2] border-b border-[#E5DED5] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2 text-sm font-semibold tracking-wider uppercase text-[#1C1512]">
              <Link
                href="/collections"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1] flex items-center justify-between"
              >
                <span>Explore All Collections</span>
                <ArrowRight size={16} className="text-[#C5A880]" />
              </Link>
              <Link
                href="/collections/handbags"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1]"
              >
                Handbags
              </Link>
              <Link
                href="/collections/school-bags"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1]"
              >
                School Bags
              </Link>
              <Link
                href="/collections/trending"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1] flex items-center gap-2 text-[#D9383A]"
              >
                <span className="w-2 h-2 rounded-full bg-[#D9383A]" />
                Trending Articles
              </Link>
              <Link
                href="/collections/newly-launched"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1]"
              >
                Newly Launched
              </Link>
              <Link
                href="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded hover:bg-[#EFE9E1] text-[#5E524B]"
              >
                Heritage & Factory
              </Link>
              <div className="pt-2 border-t border-[#E5DED5]">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded hover:bg-[#EFE9E1] flex items-center gap-2 text-[#1C1512] font-semibold"
                >
                  <Phone size={16} className="text-[#D9383A]" />
                  <span>Contacts & Factory Hotline</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Article Number Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
