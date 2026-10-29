'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Package, 
  Search, 
  Plus, 
  Copy, 
  Edit3, 
  Trash2, 
  Eye, 
  Check, 
  X, 
  Upload, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Tag, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Article, Collection, ArticleColour, ArticleImage } from '@/lib/types';

interface ArticleCatalogueManagerProps {
  initialArticles: Article[];
  collections: Collection[];
}

export default function ArticleCatalogueManager({ initialArticles, collections }: ArticleCatalogueManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollection, setFilterCollection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterHighlight, setFilterHighlight] = useState('all'); // trending or new

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Partial<Article> | null>(null);
  const [activeTab, setActiveTab] = useState<'essential' | 'details' | 'media' | 'display' | 'seo'>('essential');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingColourIdx, setUploadingColourIdx] = useState<number | null>(null);

  // Delete Confirmation Modal State
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const numMatch = art.article_number.toLowerCase().includes(q);
        const nameMatch = art.model_name?.toLowerCase().includes(q);
        if (!numMatch && !nameMatch) return false;
      }

      // Collection
      if (filterCollection !== 'all' && art.primary_collection_id !== filterCollection) {
        return false;
      }

      // Publication Status
      if (filterStatus !== 'all' && art.publication_status !== filterStatus) {
        return false;
      }

      // Highlights
      if (filterHighlight === 'trending' && !art.trending) return false;
      if (filterHighlight === 'new_arrival' && !art.new_arrival) return false;

      return true;
    });
  }, [articles, searchQuery, filterCollection, filterStatus, filterHighlight]);

  // Open Editor for New Article
  const handleAddNew = () => {
    setEditingArticle({
      article_number: '',
      model_name: '',
      primary_collection_id: collections[0]?.id || '',
      short_description: '',
      full_description: '',
      main_image: '/uploads/web_1775723735904-tpf6ow.webp',
      publication_status: 'published',
      trending: false,
      new_arrival: false,
      launch_date: new Date().toISOString().split('T')[0],
      featured: false,
      display_price: false,
      price: null,
      sale_price: null,
      availability: 'In Stock',
      materials: '',
      dimensions: '',
      capacity: '',
      weight: '',
      compartments: '',
      features: '',
      display_order: 0,
      colours: [{ name: 'Obsidian Black', hex_code: '#18181B' }],
      images: [],
    });
    setFormError('');
    setActiveTab('essential');
    setIsEditorOpen(true);
  };

  // Open Editor to Edit Existing Article
  const handleEdit = (art: Article) => {
    setEditingArticle({
      ...art,
      colours: art.colours ? [...art.colours] : [],
      images: art.images ? [...art.images] : [],
    });
    setFormError('');
    setActiveTab('essential');
    setIsEditorOpen(true);
  };

  // Duplicate Article (Requirement 6: "When duplicating an article, do not publish it automatically with the original Article Number. Require the administrator to enter a new unique Article Number before publishing.")
  const handleDuplicate = (art: Article) => {
    setEditingArticle({
      ...art,
      id: undefined, // Cleared ID so it saves as new
      article_number: `${art.article_number}-COPY`, // Force modification
      model_name: `${art.model_name || ''} (Duplicate)`,
      publication_status: 'draft', // Saved as draft automatically
      slug: '',
      colours: art.colours ? [...art.colours] : [],
      images: art.images ? [...art.images] : [],
    });
    setFormError('Duplicated as a Draft. Please assign a new, unique Article Number before publishing.');
    setActiveTab('essential');
    setIsEditorOpen(true);
  };

  // Quick toggle publication status
  const handleTogglePublish = async (art: Article) => {
    const newStatus = art.publication_status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...art, publication_status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.article) {
        setArticles(articles.map((a) => (a.id === art.id ? data.article : a)));
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Delete Article
  const handleConfirmDelete = async () => {
    if (!articleToDelete) return;
    try {
      const res = await fetch(`/api/articles/${articleToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter((a) => a.id !== articleToDelete.id));
        setArticleToDelete(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Handle Image File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      if (isGallery && data.urls) {
        const newImages = data.urls.map((u: string, idx: number) => ({
          image_url: u,
          display_order: (editingArticle?.images?.length || 0) + idx + 1,
        }));
        setEditingArticle({
          ...editingArticle,
          images: [...(editingArticle?.images || []), ...newImages],
        });
      } else if (data.url) {
        setEditingArticle({
          ...editingArticle,
          main_image: data.url,
        });
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle Image File Upload specifically for a Colour
  const handleColourImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, colIdx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingColourIdx(colIdx);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      const uploadedUrl = data.url || (data.urls && data.urls[0]);
      if (uploadedUrl && editingArticle?.colours) {
        const newCols = [...editingArticle.colours];
        const currentColourName = newCols[colIdx]?.name?.trim() || '';
        newCols[colIdx] = {
          ...newCols[colIdx],
          image_url: uploadedUrl,
        };

        // Also add to gallery images if not present
        const existingImgs = editingArticle.images || [];
        const hasImg = existingImgs.some((img) => img.image_url === uploadedUrl);
        const updatedImgs = hasImg
          ? existingImgs.map((img) =>
              img.image_url === uploadedUrl ? { ...img, colour_name: currentColourName } : img
            )
          : [
              ...existingImgs,
              {
                image_url: uploadedUrl,
                colour_name: currentColourName,
                display_order: existingImgs.length + 1,
              },
            ];

        setEditingArticle({
          ...editingArticle,
          colours: newCols,
          images: updatedImgs,
        });
      }
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingColourIdx(null);
    }
  };

  // Save Article Submit
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editingArticle?.article_number?.trim()) {
      setFormError('Article Number is mandatory.');
      setActiveTab('essential');
      return;
    }

    if (!editingArticle?.primary_collection_id) {
      setFormError('Please select a Primary Collection.');
      setActiveTab('essential');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingArticle),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save article.');
      }

      // Update state
      if (editingArticle.id) {
        setArticles(articles.map((a) => (a.id === data.article.id ? data.article : a)));
      } else {
        setArticles([data.article, ...articles]);
      }

      setIsEditorOpen(false);
      setEditingArticle(null);
    } catch (err: any) {
      setFormError(err.message || 'Error saving article.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Search Bar */}
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#1C1512]">
              Article Catalogue Management
            </h2>
            <p className="text-xs text-[#5E524B]">
              Every bag model is catalogued under a strictly unique <strong>Article Number</strong>.
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="px-5 py-2.5 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md flex-shrink-0"
          >
            <Plus size={16} />
            <span>Add New Article</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Search by Article Number or Name */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Article No. (e.g. EF-HB-001)..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] font-medium outline-none focus:border-[#1C1512]"
            />
            <Search size={15} className="absolute left-3 top-2.5 text-[#8C827A]" />
          </div>

          {/* Collection Filter */}
          <select
            value={filterCollection}
            onChange={(e) => setFilterCollection(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] font-semibold outline-none focus:border-[#1C1512]"
          >
            <option value="all">All Collections ({collections.length})</option>
            {collections.map((col) => (
              <option key={col.id} value={col.id}>{col.name}</option>
            ))}
          </select>

          {/* Publication Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] font-semibold outline-none focus:border-[#1C1512]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Highlight Filter */}
          <select
            value={filterHighlight}
            onChange={(e) => setFilterHighlight(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512] font-semibold outline-none focus:border-[#1C1512]"
          >
            <option value="all">All Highlights</option>
            <option value="trending">Trending Only</option>
            <option value="new_arrival">Newly Launched Only</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2] border-b border-[#E5DED5] text-[10px] font-bold uppercase tracking-[0.16em] text-[#8C827A]">
                <th className="py-3.5 px-4">Article</th>
                <th className="py-3.5 px-4">Article Number</th>
                <th className="py-3.5 px-4">Model Name</th>
                <th className="py-3.5 px-4">Collection</th>
                <th className="py-3.5 px-4">Colours</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tags</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5DED5] text-xs">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF7F2] border border-[#E5DED5]">
                        <Image
                          src={art.main_image}
                          alt={art.article_number}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>

                    {/* Article Number */}
                    <td className="py-3 px-4 font-mono font-bold text-[#D9383A]">
                      {art.article_number}
                    </td>

                    {/* Model Name */}
                    <td className="py-3 px-4 font-semibold text-[#1C1512]">
                      {art.model_name || '—'}
                    </td>

                    {/* Primary Collection */}
                    <td className="py-3 px-4 text-[#5E524B]">
                      {art.collection_name || 'Unassigned'}
                    </td>

                    {/* Colour swatches */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {art.colours?.map((c, i) => (
                          <span
                            key={i}
                            title={`${c.name}${c.secondary_hex ? ` (${c.hex_code} / ${c.secondary_hex})` : ` (${c.hex_code})`}`}
                            className="w-3.5 h-3.5 rounded-full border border-black/20 overflow-hidden shadow-xs flex-shrink-0"
                            style={{ 
                              background: c.secondary_hex 
                                ? `linear-gradient(135deg, ${c.hex_code} 50%, ${c.secondary_hex} 50%)`
                                : c.hex_code 
                            }}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleTogglePublish(art)}
                        title="Click to toggle publish/draft"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          art.publication_status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {art.publication_status === 'published' ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Highlights */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {art.trending && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#D9383A] bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">
                            Trending
                          </span>
                        )}
                        {art.new_arrival && (
                          <span className="text-[9px] font-bold uppercase tracking-wider text-[#C5A880] bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/articles/${art.slug}`}
                          target="_blank"
                          title="Preview Article on Live Catalogue"
                          className="p-1.5 rounded hover:bg-[#EFE9E1] text-[#5E524B] hover:text-[#1C1512]"
                        >
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => handleDuplicate(art)}
                          title="Duplicate Article (requires new Article No.)"
                          className="p-1.5 rounded hover:bg-[#EFE9E1] text-[#5E524B] hover:text-[#1C1512]"
                        >
                          <Copy size={15} />
                        </button>
                        <button
                          onClick={() => handleEdit(art)}
                          title="Edit Article"
                          className="p-1.5 rounded hover:bg-[#EFE9E1] text-[#5E524B] hover:text-[#1C1512]"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => setArticleToDelete(art)}
                          title="Delete Article"
                          className="p-1.5 rounded hover:bg-red-50 text-[#8C827A] hover:text-[#D9383A]"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C827A]">
                    No articles match current filters. Click &ldquo;Add New Article&rdquo; to create a new bag model.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ARTICLE EDITOR MODAL (31 Fields Structured into Clean Tabs) */}
      {isEditorOpen && editingArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-[#1C1512]/75 backdrop-blur-md">
          <div className="fixed inset-0" onClick={() => setIsEditorOpen(false)} aria-hidden="true" />

          <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E5DED5] overflow-hidden z-10">
            {/* Header (Always Visible at Top of Modal) */}
            <div className="flex-shrink-0 bg-[#1C1512] text-[#FAF7F2] px-6 py-4.5 sm:py-5 flex items-center justify-between border-b border-[#2A211D] z-30">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C5A880] block mb-0.5">
                  Bag Model Catalogue Editor
                </span>
                <h3 className="text-lg sm:text-xl font-serif font-bold tracking-wide text-white">
                  {editingArticle.id ? `Edit Article: ${editingArticle.article_number}` : 'Create New Bag Article'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="text-[#FAF7F2]/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Close Editor"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error banner */}
            {formError && (
              <div className="flex-shrink-0 m-4 mb-0 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Tabs (Always Visible Under Header) */}
            <div className="flex-shrink-0 flex border-b border-[#E5DED5] bg-[#FFFDF9] text-xs font-bold uppercase tracking-wider overflow-x-auto z-20 shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab('essential')}
                className={`py-3.5 px-5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'essential'
                    ? 'border-[#D9383A] text-[#D9383A]'
                    : 'border-transparent text-[#5E524B] hover:text-[#1C1512]'
                }`}
              >
                1. Essential & Identity
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`py-3.5 px-5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'details'
                    ? 'border-[#D9383A] text-[#D9383A]'
                    : 'border-transparent text-[#5E524B] hover:text-[#1C1512]'
                }`}
              >
                2. Colours & Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('media')}
                className={`py-3.5 px-5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'media'
                    ? 'border-[#D9383A] text-[#D9383A]'
                    : 'border-transparent text-[#5E524B] hover:text-[#1C1512]'
                }`}
              >
                3. Gallery & Photography
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('display')}
                className={`py-3.5 px-5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'display'
                    ? 'border-[#D9383A] text-[#D9383A]'
                    : 'border-transparent text-[#5E524B] hover:text-[#1C1512]'
                }`}
              >
                4. Trending & Pricing
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-3.5 px-5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'seo'
                    ? 'border-[#D9383A] text-[#D9383A]'
                    : 'border-transparent text-[#5E524B] hover:text-[#1C1512]'
                }`}
              >
                5. SEO & URLs
              </button>
            </div>

            {/* Form Form Body (Scrollable Content with Sticky Action Bar) */}
            <form onSubmit={handleSaveArticle} className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* TAB 1: ESSENTIAL & IDENTITY */}
              {activeTab === 'essential' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Article Number (Mandatory and Unique) */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Article Number <span className="text-[#D9383A]">* (Unique Business ID)</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingArticle.article_number || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, article_number: e.target.value.toUpperCase() })}
                        placeholder="e.g. EF-HB-001"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] font-mono text-sm font-bold text-[#1C1512] focus:border-[#1C1512] outline-none"
                      />
                      <span className="text-[10px] text-[#8C827A] mt-1 block">
                        Exact model code. Must be strictly unique across the entire EFBY catalogue.
                      </span>
                    </div>

                    {/* Model Name */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Model Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.model_name || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, model_name: e.target.value })}
                        placeholder="e.g. Aethel Luxury Handbag"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] focus:border-[#1C1512] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Collection */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Primary Collection <span className="text-[#D9383A]">*</span>
                      </label>
                      <select
                        required
                        value={editingArticle.primary_collection_id || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, primary_collection_id: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] font-semibold focus:border-[#1C1512] outline-none"
                      >
                        <option value="">Select a Collection...</option>
                        {collections.map((col) => (
                          <option key={col.id} value={col.id}>{col.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Publication Status */}
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Publication Status
                      </label>
                      <select
                        value={editingArticle.publication_status || 'published'}
                        onChange={(e) => setEditingArticle({ ...editingArticle, publication_status: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] font-semibold focus:border-[#1C1512] outline-none"
                      >
                        <option value="published">Published (Visible to Customers)</option>
                        <option value="draft">Draft (Admin Only)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      Short Description (Card Summary)
                    </label>
                    <input
                      type="text"
                      value={editingArticle.short_description || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, short_description: e.target.value })}
                      placeholder="One-line summary for article cards and previews..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      Full Description & Craftsmanship Details
                    </label>
                    <textarea
                      rows={4}
                      value={editingArticle.full_description || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, full_description: e.target.value })}
                      placeholder="Detailed craftsmanship, stitching methods, interior linings..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: COLOURS & SPECIFICATIONS */}
              {activeTab === 'details' && (
                <div className="space-y-5">
                  {/* Colours Management with Image against Colour */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E5DED5] pb-2">
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#1C1512] block">
                          Colour Variations & Swatch Images
                        </label>
                        <p className="text-[11px] text-[#5E524B]">
                          Add colours for this bag model. You can attach an image directly against each colour so customers see the bag in that exact shade when selected.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const cols = editingArticle.colours || [];
                          setEditingArticle({
                            ...editingArticle,
                            colours: [...cols, { name: '', hex_code: '#181818', secondary_hex: '#C5A880', image_url: null }],
                          });
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm flex-shrink-0"
                      >
                        + Add Colour
                      </button>
                    </div>

                    <div className="space-y-4">
                      {editingArticle.colours && editingArticle.colours.length > 0 ? (
                        editingArticle.colours.map((col, idx) => (
                          <div 
                            key={idx} 
                            className="bg-[#FAF7F2] border border-[#E5DED5] p-3.5 sm:p-4 rounded-xl space-y-3.5 shadow-xs hover:border-[#1C1512]/40 transition-colors"
                          >
                            {/* Variation Name, Dual-Tone Live Swatch, and Remove */}
                            <div className="flex items-center gap-3">
                              {/* Live Dual-Tone Preview Swatch */}
                              <div 
                                className="w-8 h-8 rounded-full border border-black/20 shadow-xs flex-shrink-0"
                                style={{
                                  background: col.secondary_hex
                                    ? `linear-gradient(135deg, ${col.hex_code || '#181818'} 50%, ${col.secondary_hex} 50%)`
                                    : (col.hex_code || '#181818')
                                }}
                                title="Dual-tone colour preview"
                              />

                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={col.name}
                                  onChange={(e) => {
                                    const oldName = col.name;
                                    const newName = e.target.value;
                                    const newCols = [...(editingArticle.colours || [])];
                                    newCols[idx] = { ...newCols[idx], name: newName };
                                    
                                    // Also update gallery images tagged with old name
                                    const updatedImgs = (editingArticle.images || []).map((img) =>
                                      img.colour_name === oldName ? { ...img, colour_name: newName } : img
                                    );

                                    setEditingArticle({ 
                                      ...editingArticle, 
                                      colours: newCols,
                                      images: updatedImgs 
                                    });
                                  }}
                                  placeholder="Variation Name (e.g. Obsidian Black & Champagne Gold, Navy / Tan Trim)..."
                                  className="w-full px-3.5 py-2 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] font-semibold outline-none focus:border-[#1C1512]"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const newCols = editingArticle.colours?.filter((_, i) => i !== idx);
                                  setEditingArticle({ ...editingArticle, colours: newCols });
                                }}
                                className="text-[#8C827A] hover:text-[#D9383A] p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Remove this colour variation"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            {/* Dual Colour Pickers: Option 1 (Primary) and Option 2 (Secondary) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/70 p-3 rounded-lg border border-[#E5DED5]">
                              {/* Option 1: Primary Colour */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C1512] mb-1.5 flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-[#1C1512] inline-block" />
                                  <span>1. Primary Colour (Main Body)</span>
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={col.hex_code || '#181818'}
                                    onChange={(e) => {
                                      const newCols = [...(editingArticle.colours || [])];
                                      newCols[idx] = { ...newCols[idx], hex_code: e.target.value };
                                      setEditingArticle({ ...editingArticle, colours: newCols });
                                    }}
                                    className="w-9 h-9 rounded-lg border border-[#E5DED5] cursor-pointer bg-white p-0.5 flex-shrink-0"
                                    title="Pick Primary Colour"
                                  />
                                  <input
                                    type="text"
                                    value={col.hex_code || ''}
                                    onChange={(e) => {
                                      const newCols = [...(editingArticle.colours || [])];
                                      newCols[idx] = { ...newCols[idx], hex_code: e.target.value };
                                      setEditingArticle({ ...editingArticle, colours: newCols });
                                    }}
                                    placeholder="#181818"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs font-mono uppercase"
                                  />
                                </div>
                              </div>

                              {/* Option 2: Secondary Colour */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1C1512] mb-1.5 flex items-center justify-between">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-[#C5A880] inline-block" />
                                    <span>2. Secondary Colour (Trim / Accent)</span>
                                  </span>
                                  {col.secondary_hex && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newCols = [...(editingArticle.colours || [])];
                                        newCols[idx] = { ...newCols[idx], secondary_hex: null };
                                        setEditingArticle({ ...editingArticle, colours: newCols });
                                      }}
                                      className="text-[9px] font-bold text-[#8C827A] hover:text-[#D9383A] normal-case"
                                    >
                                      Remove Secondary
                                    </button>
                                  )}
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={col.secondary_hex || '#C5A880'}
                                    onChange={(e) => {
                                      const newCols = [...(editingArticle.colours || [])];
                                      newCols[idx] = { ...newCols[idx], secondary_hex: e.target.value };
                                      setEditingArticle({ ...editingArticle, colours: newCols });
                                    }}
                                    className="w-9 h-9 rounded-lg border border-[#E5DED5] cursor-pointer bg-white p-0.5 flex-shrink-0"
                                    title="Pick Secondary / Accent Colour"
                                  />
                                  <input
                                    type="text"
                                    value={col.secondary_hex || ''}
                                    onChange={(e) => {
                                      const newCols = [...(editingArticle.colours || [])];
                                      newCols[idx] = { ...newCols[idx], secondary_hex: e.target.value || null };
                                      setEditingArticle({ ...editingArticle, colours: newCols });
                                    }}
                                    placeholder="#C5A880 (Optional secondary)"
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs font-mono uppercase"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Bottom row: Image Against Colour */}
                            <div className="flex items-center gap-3 pt-2.5 border-t border-[#E5DED5]/80 bg-white/60 p-2.5 rounded-lg">
                              {/* Thumbnail preview */}
                              <div className="relative w-14 h-16 rounded-lg overflow-hidden bg-white border border-[#E5DED5] flex-shrink-0 flex items-center justify-center">
                                {col.image_url ? (
                                  <Image
                                    src={col.image_url}
                                    alt={col.name || 'Colour preview'}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="text-[9px] text-[#8C827A] font-semibold text-center leading-tight px-1">
                                    No Image Assigned
                                  </span>
                                )}
                              </div>

                              {/* Upload and URL input */}
                              <div className="flex-1 space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#1C1512] hover:bg-[#D9383A] text-white text-[10px] font-bold uppercase tracking-wider transition-colors shadow-xs">
                                    <Upload size={12} />
                                    <span>
                                      {uploadingColourIdx === idx 
                                        ? 'Uploading...' 
                                        : col.image_url 
                                          ? 'Change Colour Photo' 
                                          : 'Upload Image for this Colour'}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      disabled={uploadingColourIdx === idx}
                                      onChange={(e) => handleColourImageUpload(e, idx)}
                                      className="hidden"
                                    />
                                  </label>

                                  {col.image_url && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newCols = [...(editingArticle.colours || [])];
                                        newCols[idx] = { ...newCols[idx], image_url: null };
                                        setEditingArticle({ ...editingArticle, colours: newCols });
                                      }}
                                      className="text-[10px] font-bold text-[#8C827A] hover:text-[#D9383A] hover:underline"
                                    >
                                      Remove Photo
                                    </button>
                                  )}

                                  {/* Select from existing gallery images if available */}
                                  {editingArticle.images && editingArticle.images.length > 0 && (
                                    <select
                                      value=""
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          const newCols = [...(editingArticle.colours || [])];
                                          newCols[idx] = { ...newCols[idx], image_url: e.target.value };
                                          setEditingArticle({ ...editingArticle, colours: newCols });
                                        }
                                      }}
                                      className="text-[10px] font-semibold px-2 py-1 rounded border border-[#E5DED5] bg-white text-[#5E524B] outline-none"
                                    >
                                      <option value="">Or pick from gallery...</option>
                                      {editingArticle.images.map((img, i) => (
                                        <option key={i} value={img.image_url}>
                                          Gallery Photo {i + 1} {img.colour_name ? `(${img.colour_name})` : ''}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                </div>

                                <input
                                  type="text"
                                  value={col.image_url || ''}
                                  onChange={(e) => {
                                    const newCols = [...(editingArticle.colours || [])];
                                    newCols[idx] = { ...newCols[idx], image_url: e.target.value.trim() || null };
                                    setEditingArticle({ ...editingArticle, colours: newCols });
                                  }}
                                  placeholder="Or paste image URL (e.g. /uploads/bag_cognac.webp)..."
                                  className="w-full px-2.5 py-1 rounded border border-[#E5DED5] bg-white text-[11px] text-[#1C1512] outline-none focus:border-[#1C1512]"
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl border border-dashed border-[#E5DED5] text-center text-xs text-[#8C827A]">
                          No colour variations added yet. Click &quot;+ Add Colour&quot; above to add colours and attach images.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Specifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#E5DED5]">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Materials (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.materials || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, materials: e.target.value })}
                        placeholder="e.g. Full-Grain Vegan Nappa, Champagne Hardware"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Dimensions (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.dimensions || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, dimensions: e.target.value })}
                        placeholder="e.g. 28cm x 22cm x 11cm"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Capacity (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.capacity || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, capacity: e.target.value })}
                        placeholder="e.g. 6.5 Litres / 28 Litres"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Weight (Optional)
                      </label>
                      <input
                        type="text"
                        value={editingArticle.weight || ''}
                        onChange={(e) => setEditingArticle({ ...editingArticle, weight: e.target.value })}
                        placeholder="e.g. 620 grams"
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      Compartments & Pockets
                    </label>
                    <input
                      type="text"
                      value={editingArticle.compartments || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, compartments: e.target.value })}
                      placeholder="e.g. 3 main compartments, padded 16 inch laptop sleeve, bottle pockets"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      Features & Hardware
                    </label>
                    <input
                      type="text"
                      value={editingArticle.features || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, features: e.target.value })}
                      placeholder="e.g. Water-resistant zippers, detachable strap, 12-Month Guarantee"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & PHOTOGRAPHY */}
              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Main Product Image */}
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512]">
                      Main Product Photograph (Primary Cover)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E5DED5]">
                        {editingArticle.main_image && (
                          <Image
                            src={editingArticle.main_image}
                            alt="Main image preview"
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors">
                          <Upload size={14} />
                          <span>{uploadingImage ? 'Uploading...' : 'Upload New Cover Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, false)}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={editingArticle.main_image || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, main_image: e.target.value })}
                          placeholder="Or enter image URL..."
                          className="w-full px-3 py-1.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Gallery Images */}
                  <div className="space-y-3 pt-4 border-t border-[#E5DED5]">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1C1512]">
                        Additional Gallery Photographs ({editingArticle.images?.length || 0})
                      </label>
                      <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold text-[#D9383A] hover:underline">
                        <Upload size={13} />
                        <span>Upload Photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleFileUpload(e, true)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {editingArticle.images?.map((img, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#E5DED5] group p-2 space-y-2 flex flex-col justify-between">
                          <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-white border border-[#E5DED5]">
                            <Image
                              src={img.image_url}
                              alt={`Gallery ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImgs = editingArticle.images?.filter((_, i) => i !== idx);
                                setEditingArticle({ ...editingArticle, images: newImgs });
                              }}
                              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white hover:bg-[#D9383A] transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Colour tag selector */}
                          <div>
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-[#8C827A] mb-0.5">
                              Colour Association:
                            </label>
                            <select
                              value={img.colour_name || ''}
                              onChange={(e) => {
                                const newColourName = e.target.value;
                                const newImgs = [...(editingArticle.images || [])];
                                newImgs[idx] = { ...newImgs[idx], colour_name: newColourName || null };
                                
                                // Also update the colour's image_url if colour doesn't have an image
                                const newCols = (editingArticle.colours || []).map((col) => {
                                  if (col.name === newColourName && !col.image_url) {
                                    return { ...col, image_url: img.image_url };
                                  }
                                  return col;
                                });

                                setEditingArticle({ 
                                  ...editingArticle, 
                                  images: newImgs,
                                  colours: newCols 
                                });
                              }}
                              className="w-full px-2 py-1 rounded border border-[#E5DED5] bg-white text-[10px] text-[#1C1512] font-medium outline-none"
                            >
                              <option value="">(All / General)</option>
                              {editingArticle.colours?.filter((c) => c.name.trim()).map((c, i) => (
                                <option key={i} value={c.name}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: TRENDING & PRICING */}
              {activeTab === 'display' && (
                <div className="space-y-6">
                  {/* Dynamic Collection Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[#E5DED5] bg-[#FFFDF9] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1512]">
                          Trending Bag Article
                        </h4>
                        <p className="text-[11px] text-[#5E524B]">
                          Automatically appears in the dynamic Trending collection.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(editingArticle.trending)}
                        onChange={(e) => setEditingArticle({ ...editingArticle, trending: e.target.checked })}
                        className="w-5 h-5 accent-[#D9383A] rounded cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-xl border border-[#E5DED5] bg-[#FFFDF9] flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1512]">
                          New Arrival Article
                        </h4>
                        <p className="text-[11px] text-[#5E524B]">
                          Automatically appears in the Newly Launched collection.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(editingArticle.new_arrival)}
                        onChange={(e) => setEditingArticle({ ...editingArticle, new_arrival: e.target.checked })}
                        className="w-5 h-5 accent-[#D9383A] rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Pricing Toggles */}
                  <div className="p-4 rounded-xl border border-[#E5DED5] bg-[#FFFDF9] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#E5DED5] pb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1512]">
                          Display Price on Public Catalogue
                        </h4>
                        <p className="text-[11px] text-[#5E524B]">
                          If disabled, customers submit enquiries without public prices.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={Boolean(editingArticle.display_price)}
                        onChange={(e) => setEditingArticle({ ...editingArticle, display_price: e.target.checked })}
                        className="w-5 h-5 accent-[#1C1512] rounded cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                          Standard Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingArticle.price || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, price: e.target.value ? parseFloat(e.target.value) : null })}
                          placeholder="e.g. 4899"
                          className="w-full px-3.5 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                          Catalogue Sale Price (₹ Optional)
                        </label>
                        <input
                          type="number"
                          value={editingArticle.sale_price || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                          placeholder="e.g. 4299"
                          className="w-full px-3.5 py-2 rounded-lg border border-[#E5DED5] bg-[#FAF7F2] text-xs text-[#1C1512]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Availability Status
                      </label>
                      <select
                        value={editingArticle.availability || 'In Stock'}
                        onChange={(e) => setEditingArticle({ ...editingArticle, availability: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      >
                        <option value="In Stock">In Stock (Immediate Dispatch)</option>
                        <option value="Available on Order">Available on Order</option>
                        <option value="Limited Batch">Limited Batch</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                        Display Order Sequence
                      </label>
                      <input
                        type="number"
                        value={editingArticle.display_order || 0}
                        onChange={(e) => setEditingArticle({ ...editingArticle, display_order: parseInt(e.target.value || '0', 10) })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SEO & SLUG */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      URL Slug
                    </label>
                    <input
                      type="text"
                      value={editingArticle.slug || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                      placeholder="e.g. ef-hb-001"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs font-mono text-[#1C1512]"
                    />
                    <span className="text-[10px] text-[#8C827A] mt-1 block">
                      Canonical path: /articles/{editingArticle.slug || 'slug'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      SEO Title (Optional)
                    </label>
                    <input
                      type="text"
                      value={editingArticle.seo_title || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seo_title: e.target.value })}
                      placeholder="e.g. ARTICLE NO. EF-HB-001 | Luxury Bag"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                      SEO Meta Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={editingArticle.seo_description || ''}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seo_description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] resize-none"
                    />
                  </div>
                </div>
              )}

              </div>

              {/* Modal Bottom Action Bar (Always Visible at Bottom of Modal) */}
              <div className="flex-shrink-0 bg-[#FAF7F2] border-t border-[#E5DED5] px-6 py-4 flex items-center justify-between z-30 shadow-md">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-5 py-2.5 rounded-lg border border-[#1C1512] text-[#1C1512] hover:bg-[#1C1512] hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Check size={16} />
                    <span>{saving ? 'Saving Article...' : 'Save Article Model'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {articleToDelete && (
        <div className="fixed inset-0 z-[110] bg-[#1C1512]/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl p-6 shadow-2xl border border-[#E5DED5] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1C1512]">
              Delete Bag Article?
            </h3>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Are you sure you want to permanently delete Article{' '}
              <strong className="text-[#D9383A] font-mono">{articleToDelete.article_number}</strong>
              {articleToDelete.model_name ? ` (${articleToDelete.model_name})` : ''}? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setArticleToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#1C1512] text-xs font-bold uppercase tracking-wider text-[#1C1512]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-lg bg-[#D9383A] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
