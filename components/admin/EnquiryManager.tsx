'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  PhoneCall, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { Enquiry } from '@/lib/types';

interface EnquiryManagerProps {
  initialEnquiries: Enquiry[];
}

export default function EnquiryManager({ initialEnquiries }: EnquiryManagerProps) {
  const [enquiries, setEnquiries] = useState<Enquiry[]>(initialEnquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [currentNotes, setCurrentNotes] = useState('');

  const filteredEnquiries = enquiries.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      const numMatch = e.article_number.toLowerCase().includes(q);
      const nameMatch = e.customer_name.toLowerCase().includes(q);
      const phoneMatch = e.phone.includes(q);
      if (!numMatch && !nameMatch && !phoneMatch) return false;
    }
    return true;
  });

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status: newStatus as any } : e)));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: enquiries.find(e => e.id === id)?.status, notes: currentNotes }),
      });
      if (res.ok) {
        setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, admin_notes: currentNotes } : e)));
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error('Save notes failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filters */}
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1512]">
              Customer Catalogue Enquiries
            </h2>
            <p className="text-xs text-[#5E524B]">
              Direct enquiries submitted for specific bag Article Numbers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C827A]">
              Total Logged:
            </span>
            <span className="text-sm font-bold bg-[#FAF7F2] border border-[#E5DED5] px-3 py-1 rounded-lg text-[#1C1512]">
              {enquiries.length} Enquiries
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by Article No., Customer Name, or Phone..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] outline-none"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-[#8C827A]" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] font-semibold outline-none"
          >
            <option value="all">All Enquiry Statuses</option>
            <option value="new">New (Uncontacted)</option>
            <option value="contacted">Contacted</option>
            <option value="in_discussion">In Discussion / Tender</option>
            <option value="resolved">Resolved / Fulfilled</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Enquiry Cards List */}
      <div className="space-y-4">
        {filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((enq) => {
            const cleanPhone = enq.phone.replace(/[^0-9]/g, '');
            const whatsappReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${enq.customer_name}, thank you for enquiring about EFBY Article No. ${enq.article_number}${
                enq.model_name ? ` (${enq.model_name})` : ''
              }. How may we assist you with order specifications?`
            )}`;

            return (
              <div
                key={enq.id}
                className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-5 space-y-4 shadow-sm hover:border-[#1C1512]/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DED5] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold tracking-wider text-[#D9383A] bg-[#FAF0E6] px-2.5 py-1 rounded border border-[#D9383A]/20">
                      ARTICLE NO. {enq.article_number}
                    </span>
                    {enq.model_name && (
                      <span className="text-xs font-semibold text-[#1C1512]">
                        {enq.model_name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-[#8C827A] flex items-center gap-1">
                      <Clock size={13} />
                      {new Date(enq.created_at).toLocaleString()}
                    </span>

                    {/* Status Select */}
                    <select
                      value={enq.status}
                      onChange={(e) => handleUpdateStatus(enq.id, e.target.value)}
                      className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                        enq.status === 'new'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : enq.status === 'contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-[#FAF7F2] text-[#5E524B] border-[#E5DED5]'
                      }`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_discussion">In Discussion</option>
                      <option value="resolved">Resolved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block">
                      Customer Contact
                    </span>
                    <p className="text-sm font-bold text-[#1C1512] mt-0.5">{enq.customer_name}</p>
                    <div className="mt-1 space-y-1">
                      <a href={`tel:${enq.phone}`} className="text-xs text-[#1C1512] font-semibold flex items-center gap-1.5 hover:underline">
                        <PhoneCall size={13} className="text-[#C5A880]" />
                        <span>{enq.phone}</span>
                      </a>
                      {enq.email && (
                        <a href={`mailto:${enq.email}`} className="text-xs text-[#5E524B] flex items-center gap-1.5 hover:underline">
                          <Mail size={13} className="text-[#C5A880]" />
                          <span>{enq.email}</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C827A] block">
                      Selected Specifications
                    </span>
                    <p className="text-xs text-[#1C1512] mt-1">
                      Colour: <strong>{enq.selected_colour || 'Default / Not Specified'}</strong>
                    </p>
                    {enq.message && (
                      <div className="mt-2 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E5DED5]">
                        <span className="text-[10px] text-[#8C827A] uppercase font-bold block mb-0.5">Customer Message:</span>
                        <p className="text-xs text-[#1C1512] italic whitespace-pre-wrap">{enq.message}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Notes */}
                  <div className="flex flex-col justify-between space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={whatsappReplyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <MessageCircle size={14} />
                        <span>Reply on WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${enq.phone}`}
                        className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        <PhoneCall size={13} />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Admin notes */}
                    {editingNotesId === enq.id ? (
                      <div className="space-y-1.5 pt-1">
                        <textarea
                          rows={2}
                          value={currentNotes}
                          onChange={(e) => setCurrentNotes(e.target.value)}
                          placeholder="Add internal notes on order status..."
                          className="w-full p-2 text-xs border border-[#E5DED5] rounded bg-[#FAF7F2] outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="text-[11px] text-[#8C827A] hover:underline"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveNotes(enq.id)}
                            className="text-[11px] font-bold text-[#1C1512] hover:underline"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-[#8C827A] pt-1">
                        <span>Notes: {enq.admin_notes || 'None'}</span>
                        <button
                          onClick={() => {
                            setEditingNotesId(enq.id);
                            setCurrentNotes(enq.admin_notes || '');
                          }}
                          className="font-bold text-[#1C1512] hover:underline"
                        >
                          Edit Notes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl text-[#8C827A] text-xs">
            No customer enquiries match current criteria.
          </div>
        )}
      </div>
    </div>
  );
}
