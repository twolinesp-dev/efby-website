'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Invalid administrator password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FAF7F2]">
      <div className="w-full max-w-md bg-[#FFFDF9] rounded-2xl shadow-xl border border-[#E5DED5] p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="relative h-10 w-36 mx-auto">
            <Image
              src="/images/logo.png"
              alt="EFBY Official Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE9E1] text-[#1C1512] text-[10px] font-bold uppercase tracking-[0.2em]">
              <Shield size={12} className="text-[#C5A880]" />
              <span>Restricted Catalogue Portal</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-[#1C1512] mt-2">
              Administrator Access
            </h1>
            <p className="text-xs text-[#5E524B]">
              Manage bag collections, unique Article Numbers, and customer enquiries.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E5DED5] bg-[#FAF7F2] text-sm text-[#1C1512] focus:border-[#1C1512] focus:ring-1 focus:ring-[#1C1512] outline-none transition-all"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-[#8C827A]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-[0.16em] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In To Catalogue Admin'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="p-3 rounded-lg bg-[#FAF7F2] border border-[#E5DED5] text-center">
          <p className="text-[11px] text-[#8C827A]">
            Default development password: <code className="font-mono font-bold text-[#1C1512]">efbyadmin2026</code>
          </p>
        </div>
      </div>
    </div>
  );
}
