import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LiveBackgroundBags from '@/components/LiveBackgroundBags';
import { getSiteSettings } from '@/lib/catalogue';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'EFBY | Luxury Bag Brand & Manufacturer Catalogue',
  description: 'Explore EFBY collections: Handbags, School Bags, Office Briefcases, Travel Luggage, and Backpacks. Authentic manufacturer catalogue with unique Article Numbers and direct enquiry fulfillment.',
  keywords: 'EFBY, bag manufacturer, luxury handbags, school bags, backpacks, travel duffel, office bags, bag catalogue, Article Number',
  openGraph: {
    title: 'EFBY | Luxury Bag Brand & Manufacturer Catalogue',
    description: 'Explore EFBY collections: Handbags, School Bags, Office Briefcases, Travel Luggage, and Backpacks. Direct manufacturer enquiries.',
    url: 'https://efby.in',
    siteName: 'EFBY Bag Makers',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 400,
        alt: 'EFBY Official Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getSiteSettings();

  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1C1512] selection:bg-[#D9383A] selection:text-white relative">
        {/* Premium Live Moving Bag Collections Background (25% Opacity) */}
        <LiveBackgroundBags />
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer initialSettings={settings} />
      </body>
    </html>
  );
}
