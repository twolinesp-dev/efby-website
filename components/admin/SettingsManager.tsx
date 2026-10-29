'use client';

import React, { useState } from 'react';
import { Settings, Save, Check, AlertCircle, Phone, MessageSquare, Mail, MapPin, DollarSign, FileText } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface SettingsManagerProps {
  initialSettings: SiteSettings;
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Settings save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-serif font-bold text-[#1C1512]">
          Catalogue & Communication Settings
        </h2>
        <p className="text-xs text-[#5E524B]">
          Configure direct enquiry WhatsApp numbers, contact details, and price visibility.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
          <Check size={16} />
          <span>Settings updated successfully. All changes are live on the website.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Price Display Global Toggle */}
        <div className="p-4 rounded-xl border border-[#E5DED5] bg-[#FAF7F2] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1C1512] flex items-center gap-1.5">
              <DollarSign size={15} className="text-[#C5A880]" />
              <span>Public Catalogue Price Display</span>
            </span>
            <p className="text-[11px] text-[#5E524B]">
              When enabled, articles with prices configured will display rates to public customers. If disabled, all articles operate exclusively on enquiry mode.
            </p>
          </div>
          <input
            type="checkbox"
            checked={settings.global_price_display}
            onChange={(e) => setSettings({ ...settings, global_price_display: e.target.checked })}
            className="w-5 h-5 accent-[#1C1512] rounded cursor-pointer"
          />
        </div>

        {/* Business WhatsApp Number */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1 flex items-center gap-1.5">
            <MessageSquare size={14} className="text-[#25D366]" />
            <span>Business WhatsApp Number (With Country Code)</span>
          </label>
          <input
            type="text"
            required
            value={settings.whatsapp_number}
            onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            placeholder="+919847000000"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-sm text-[#1C1512] outline-none"
          />
          <span className="text-[10px] text-[#8C827A] mt-1 block">
            Customers clicking &ldquo;WhatsApp Enquiry&rdquo; will directly connect to this phone number with the Article Number pre-filled.
          </span>
        </div>

        {/* Support Phone & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1 flex items-center gap-1.5">
              <Phone size={14} className="text-[#C5A880]" />
              <span>Customer Support Phone</span>
            </label>
            <input
              type="text"
              value={settings.contact_phone}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1 flex items-center gap-1.5">
              <Mail size={14} className="text-[#C5A880]" />
              <span>Customer Support Email</span>
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] outline-none"
            />
          </div>
        </div>

        {/* Paragraph Below Logo (Brand Biography) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1 flex items-center gap-1.5">
            <FileText size={14} className="text-[#C5A880]" />
            <span>Paragraph Below Logo (Footer Brand Biography)</span>
          </label>
          <textarea
            rows={3}
            value={settings.footer_bio || ''}
            onChange={(e) => setSettings({ ...settings, footer_bio: e.target.value })}
            placeholder="Established premium bag maker engineered for enduring elegance and functional mastery..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] outline-none leading-relaxed resize-none focus:border-[#1C1512]"
          />
          <span className="text-[10px] text-[#8C827A] mt-1 block">
            This paragraph displays directly underneath the EFBY logo in the website footer across all customer pages.
          </span>
        </div>

        {/* Factory & Showroom Physical Address */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1 flex items-center gap-1.5">
            <MapPin size={14} className="text-[#C5A880]" />
            <span>Factory & Showroom Physical Address</span>
          </label>
          <input
            type="text"
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            placeholder="EFBY Works, Kottarakkara, Kerala, India"
            className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] outline-none focus:border-[#1C1512]"
          />
          <span className="text-[10px] text-[#8C827A] mt-1 block">
            Displayed alongside the location pin icon in the footer and across the Contact page.
          </span>
        </div>

        <div className="pt-4 border-t border-[#E5DED5] flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Updating Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
