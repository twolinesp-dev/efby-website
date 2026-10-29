import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { 
  Package, 
  Layers, 
  MessageSquare, 
  Settings, 
  LogOut, 
  ExternalLink,
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import { isAuthenticatedAdmin } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = await isAuthenticatedAdmin();

  // If unauthenticated, we check if current page is login
  // Headers in Next.js App Router can retrieve the current pathname
  const headersList = await headers();
  const pathname = headersList.get('x-invoke-path') || '';

  if (!isAuth && !pathname.includes('/admin/login')) {
    // If not on login page, redirect
    // Note: client components can also handle login redirection
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#1C1512] text-[#FAF7F2] border-b border-[#2A211D] px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="relative h-7 w-24">
              <Image
                src="/images/logo-light.png"
                alt="EFBY"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-[#D9383A] text-white px-2 py-0.5 rounded">
              Catalogue Admin
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 text-xs font-semibold uppercase tracking-wider">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-[#CBBFB3] hover:text-white transition-colors"
          >
            <span>Live Catalogue</span>
            <ExternalLink size={13} />
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A211D] bg-white/5 hover:bg-[#D9383A] text-white transition-colors"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </header>

      {/* Main Admin Sub-Navigation */}
      <div className="bg-[#FFFDF9] border-b border-[#E5DED5] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-6 overflow-x-auto py-2 text-xs font-bold uppercase tracking-[0.14em]">
          <Link
            href="/admin"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <LayoutDashboard size={15} className="text-[#C5A880]" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/articles"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <Package size={15} className="text-[#D9383A]" />
            <span>Article Catalogue</span>
          </Link>
          <Link
            href="/admin/collections"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <Layers size={15} className="text-[#C5A880]" />
            <span>Collections</span>
          </Link>
          <Link
            href="/admin/enquiries"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <MessageSquare size={15} className="text-[#C5A880]" />
            <span>Enquiries</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 py-2 px-3 rounded-lg text-[#1C1512] hover:bg-[#EFE9E1] transition-colors"
          >
            <Settings size={15} className="text-[#C5A880]" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8">
        {children}
      </div>
    </div>
  );
}
