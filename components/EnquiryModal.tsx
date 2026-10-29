'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, PhoneCall, AlertCircle } from 'lucide-react';
import { Article } from '@/lib/types';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: {
    article_number: string;
    model_name?: string | null;
    selected_colour?: string | null;
    id?: string;
  } | null;
  whatsappNumber?: string;
}

export default function EnquiryModal({ isOpen, onClose, article, whatsappNumber }: EnquiryModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedColour, setSelectedColour] = useState(article?.selected_colour || '');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeWhatsApp, setActiveWhatsApp] = useState<string>(whatsappNumber || '+919847000000');

  // Synchronize colour when article updates and fetch live settings
  React.useEffect(() => {
    if (article?.selected_colour) {
      setSelectedColour(article.selected_colour);
    }
    setSubmitted(false);
    setErrorMessage('');

    if (whatsappNumber) {
      setActiveWhatsApp(whatsappNumber);
    }

    // Always fetch latest business WhatsApp number from backend settings
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.whatsapp_number) {
          setActiveWhatsApp(data.settings.whatsapp_number);
        }
      })
      .catch((err) => console.error('Failed to load settings in EnquiryModal:', err));
  }, [article, isOpen, whatsappNumber]);

  if (!isOpen || !article) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !phone.trim()) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_number: article.article_number,
          model_name: article.model_name,
          customer_name: customerName,
          phone,
          email,
          selected_colour: selectedColour,
          message,
          article_id: article.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const rawNumber = activeWhatsApp.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${rawNumber}?text=${encodeURIComponent(
    `Hello EFBY, I would like to enquire about Article Number: ${article.article_number}${
      article.model_name ? ` (${article.model_name})` : ''
    }${selectedColour ? ` in colour ${selectedColour}` : ''}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1512]/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E5DED5] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1C1512] text-[#FAF7F2] p-5 sm:p-6 flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block mb-1">
              Official Catalogue Enquiry
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              ARTICLE NO. <span className="text-[#D9383A]">{article.article_number}</span>
            </h3>
            {article.model_name && (
              <p className="text-xs text-[#E8DFD5] mt-0.5">{article.model_name}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF7F2]/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-xl font-bold text-[#1C1512]">Enquiry Received</h4>
              <p className="text-sm text-[#5E524B] max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Your enquiry for Article{' '}
                <strong className="text-[#1C1512]">{article.article_number}</strong> has been logged into our secure system. An EFBY customer representative will reach out to you shortly.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>Connect On WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-[#1C1512] text-[#1C1512] text-xs font-bold uppercase tracking-wider hover:bg-[#1C1512] hover:text-[#FAF7F2] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-lg p-3 text-xs text-[#5E524B] flex items-center justify-between">
                <span>Direct Bag Manufacturer Model Ref:</span>
                <span className="font-mono font-bold text-[#1C1512]">{article.article_number}</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Full Name <span className="text-[#D9383A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Alexander Vance"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] focus:border-[#1C1512] focus:ring-1 focus:ring-[#1C1512] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                    Phone / WhatsApp <span className="text-[#D9383A]">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] focus:border-[#1C1512] focus:ring-1 focus:ring-[#1C1512] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] focus:border-[#1C1512] focus:ring-1 focus:ring-[#1C1512] outline-none transition-all"
                  />
                </div>
              </div>

              {selectedColour && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                    Selected Colour Option
                  </label>
                  <input
                    type="text"
                    value={selectedColour}
                    onChange={(e) => setSelectedColour(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Enquiry Message or Quantity Requirement
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Let us know your quantity, customization requests, delivery location, or questions..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] focus:border-[#1C1512] focus:ring-1 focus:ring-[#1C1512] outline-none transition-all resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                >
                  <Send size={15} />
                  <span>{submitting ? 'Submitting Enquiry...' : 'Submit Official Enquiry'}</span>
                </button>

                {activeWhatsApp && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    title="Enquire directly on WhatsApp"
                  >
                    <MessageSquare size={16} />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
              </div>

              <p className="text-[11px] text-center text-[#8C827A] pt-1">
                EFBY Catalogue operates on an enquiry & direct fulfillment model. No immediate payment required.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
