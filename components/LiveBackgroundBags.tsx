'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';

const bagStreamTop = [
  { src: '/images/floating-bags/bag-handbag.webp', title: 'Luxury Handbag' },
  { src: '/images/floating-bags/bag-1.webp', title: 'Ergonomic Backpack' },
  { src: '/images/floating-bags/bag-7.webp', title: 'Executive Briefcase' },
  { src: '/images/floating-bags/bag-8.webp', title: 'Classic Tote' },
  { src: '/images/floating-bags/bag-9.webp', title: 'Crossbody Sling' },
  { src: '/images/floating-bags/bag-3.webp', title: 'Urban Tech Pack' },
  { src: '/images/floating-bags/bag-6.webp', title: 'Signature Carry' },
];

const bagStreamBottom = [
  { src: '/images/floating-bags/bag-5.webp', title: 'Travel Duffle' },
  { src: '/images/floating-bags/bag-handbag.webp', title: 'Haute Handbag' },
  { src: '/images/floating-bags/bag-4.webp', title: 'Campus Commuter' },
  { src: '/images/floating-bags/bag-2.webp', title: 'School Voyager' },
  { src: '/images/floating-bags/bag-10.webp', title: 'Compact Sling' },
  { src: '/images/floating-bags/bag-8.webp', title: 'Everyday Tote' },
  { src: '/images/floating-bags/bag-1.webp', title: 'ProGrade School' },
];

export default function LiveBackgroundBags() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  // Scroll parallax transforms
  const yTop = useTransform(scrollY, [0, 2000], [0, -160]);
  const yBottom = useTransform(scrollY, [0, 2000], [0, -280]);
  const yFloating1 = useTransform(scrollY, [0, 2000], [0, -220]);
  const yFloating2 = useTransform(scrollY, [0, 2000], [0, -320]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname?.startsWith('/admin')) return null;

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      {/* Luxury Ambient Radial Depth Glows */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-[#C5A880]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-[700px] h-[700px] bg-[#D9383A]/8 rounded-full blur-[160px] pointer-events-none" />

      {/* STREAM 1: Upper Diagonal Marquee (Drifting Left) with 20% Opacity */}
      <motion.div 
        style={{ y: yTop }} 
        className="absolute top-[14%] -left-10 w-[240%] -rotate-2 opacity-20 hover:opacity-30 transition-opacity duration-700"
      >
        <div className="flex items-center gap-16 sm:gap-24 animate-bg-drift-left">
          {/* Double list for continuous seamless loop */}
          {[...bagStreamTop, ...bagStreamTop].map((item, idx) => (
            <div key={`st-${idx}`} className="flex items-center gap-5 flex-shrink-0">
              <div className="relative w-28 h-36 sm:w-36 sm:h-48 drop-shadow-sm filter contrast-[0.95] brightness-[1.02]">
                <Image
                  src={item.src}
                  alt="Live Bag Model"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 120px, 160px"
                />
              </div>
              <span className="hidden sm:inline font-serif uppercase tracking-[0.25em] text-[10px] text-[#1C1512]/40 font-bold whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* STREAM 2: Lower Diagonal Marquee (Drifting Right) with 22% Opacity */}
      <motion.div 
        style={{ y: yBottom }} 
        className="absolute top-[54%] -left-20 w-[240%] rotate-2 opacity-22 hover:opacity-30 transition-opacity duration-700"
      >
        <div className="flex items-center gap-16 sm:gap-24 animate-bg-drift-right">
          {[...bagStreamBottom, ...bagStreamBottom].map((item, idx) => (
            <div key={`sb-${idx}`} className="flex items-center gap-5 flex-shrink-0">
              <div className="relative w-28 h-36 sm:w-40 sm:h-52 drop-shadow-sm filter contrast-[0.95] brightness-[1.02]">
                <Image
                  src={item.src}
                  alt="Live Bag Model"
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 120px, 180px"
                />
              </div>
              <span className="hidden sm:inline font-serif uppercase tracking-[0.25em] text-[10px] text-[#1C1512]/40 font-bold whitespace-nowrap">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* INDEPENDENT FLOATING HERO NODES (Gentle Floating Bobbing with Opacity ~22%) */}
      {/* Top Right Floating Handbag */}
      <motion.div 
        style={{ y: yFloating1 }} 
        className="absolute top-[18%] right-[4%] sm:right-[6%] w-32 h-44 sm:w-48 sm:h-64 opacity-22 animate-bg-float-slow"
      >
        <div className="relative w-full h-full filter contrast-[0.95]">
          <Image
            src="/images/floating-bags/bag-handbag.webp"
            alt="Floating Bag"
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 768px) 140px, 200px"
          />
        </div>
      </motion.div>

      {/* Center Left Floating Everyday Tote */}
      <motion.div 
        style={{ y: yFloating2 }} 
        className="absolute top-[36%] left-[2%] sm:left-[4%] w-28 h-40 sm:w-44 sm:h-60 opacity-22 animate-bg-float-reverse"
      >
        <div className="relative w-full h-full filter contrast-[0.95]">
          <Image
            src="/images/floating-bags/bag-8.webp"
            alt="Floating Bag"
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 768px) 120px, 180px"
          />
        </div>
      </motion.div>

      {/* Bottom Right Floating Executive Briefcase */}
      <motion.div 
        style={{ y: yFloating1 }} 
        className="absolute bottom-[14%] right-[6%] w-32 h-44 sm:w-48 sm:h-64 opacity-22 animate-bg-float-slow"
      >
        <div className="relative w-full h-full filter contrast-[0.95]">
          <Image
            src="/images/floating-bags/bag-7.webp"
            alt="Floating Bag"
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 768px) 140px, 200px"
          />
        </div>
      </motion.div>

      {/* Bottom Left Floating Travel Duffle */}
      <motion.div 
        style={{ y: yFloating2 }} 
        className="absolute bottom-[8%] left-[5%] w-36 h-48 sm:w-52 sm:h-68 opacity-22 animate-bg-float-reverse"
      >
        <div className="relative w-full h-full filter contrast-[0.95]">
          <Image
            src="/images/floating-bags/bag-5.webp"
            alt="Floating Bag"
            fill
            className="object-contain drop-shadow-lg"
            sizes="(max-width: 768px) 150px, 220px"
          />
        </div>
      </motion.div>
    </div>
  );
}
