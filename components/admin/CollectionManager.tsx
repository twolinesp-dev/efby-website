'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Upload, 
  Check, 
  X, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';
import { Collection } from '@/lib/types';

interface CollectionManagerProps {
  initialCollections: Collection[];
}

export default function CollectionManager({ initialCollections }: CollectionManagerProps) {
  const [collections, setCollections] = useState<Collection[]>(initialCollections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Partial<Collection> | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  const handleAddNew = () => {
    setEditingCollection({
      name: '',
      slug: '',
      description: '',
      cover_image: '/uploads/web_1775723735904-tpf6ow.webp',
      display_order: collections.length + 1,
      is_hidden: false,
      is_featured: false,
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleEdit = (col: Collection) => {
    setEditingCollection({ ...col });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setEditingCollection({ ...editingCollection, cover_image: data.url });
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!editingCollection?.name || !editingCollection?.slug) {
      setErrorMessage('Collection Name and Slug are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCollection),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save collection');

      if (editingCollection.id) {
        setCollections(collections.map((c) => (c.id === data.collection.id ? data.collection : c)));
      } else {
        setCollections([...collections, data.collection]);
      }

      setIsModalOpen(false);
      setEditingCollection(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!collectionToDelete) return;
    try {
      const res = await fetch(`/api/collections/${collectionToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCollections(collections.filter((c) => c.id !== collectionToDelete.id));
        setCollectionToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete collection:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1C1512]">
            Collections Management
          </h2>
          <p className="text-xs text-[#5E524B]">
            Create, rename, reorder, hide, and manage cover photographs for collections.
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md flex-shrink-0"
        >
          <Plus size={16} />
          <span>New Collection</span>
        </button>
      </div>

      {/* Grid of collections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((col) => (
          <div
            key={col.id}
            className="bg-[#FFFDF9] border border-[#E5DED5] rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[16/9] bg-[#FAF7F2]">
              {col.cover_image && (
                <Image
                  src={col.cover_image}
                  alt={col.name}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                {col.is_hidden && (
                  <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <EyeOff size={11} />
                    Hidden
                  </span>
                )}
                {col.is_featured && (
                  <span className="bg-[#1C1512] text-[#FAF7F2] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                    <Sparkles size={11} className="text-[#C5A880]" />
                    Featured
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A880] block">
                  /{col.slug}
                </span>
                <h3 className="text-lg font-serif font-bold text-white">
                  {col.name}
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <p className="text-xs text-[#5E524B] line-clamp-2">
                {col.description || 'No description provided.'}
              </p>

              <div className="pt-3 border-t border-[#E5DED5] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#8C827A]">
                  {col.article_count || 0} Articles Catalogued
                </span>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/collections/${col.slug}`}
                    target="_blank"
                    className="p-1.5 rounded hover:bg-[#EFE9E1] text-[#5E524B]"
                    title="View Collection Page"
                  >
                    <Eye size={15} />
                  </Link>
                  <button
                    onClick={() => handleEdit(col)}
                    className="p-1.5 rounded hover:bg-[#EFE9E1] text-[#5E524B]"
                    title="Edit Collection"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => setCollectionToDelete(col)}
                    className="p-1.5 rounded hover:bg-red-50 text-[#8C827A] hover:text-[#D9383A]"
                    title="Delete Collection"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COLLECTION EDIT MODAL */}
      {isModalOpen && editingCollection && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#1C1512]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setIsModalOpen(false)} aria-hidden="true" />

          <div className="relative w-full max-w-lg bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E5DED5] overflow-hidden z-10">
            <div className="bg-[#1C1512] text-[#FAF7F2] p-5 flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold">
                {editingCollection.id ? `Edit: ${editingCollection.name}` : 'New Bag Collection'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            {errorMessage && (
              <div className="m-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle size={15} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Collection Name <span className="text-[#D9383A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCollection.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = !editingCollection.id ? name.toLowerCase().replace(/[^a-z0-9_-]/g, '-') : editingCollection.slug;
                    setEditingCollection({ ...editingCollection, name, slug });
                  }}
                  placeholder="e.g. Travel Bags"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-sm text-[#1C1512] font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  URL Slug <span className="text-[#D9383A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editingCollection.slug || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-') })}
                  placeholder="e.g. travel-bags"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs font-mono text-[#1C1512] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingCollection.description || ''}
                  onChange={(e) => setEditingCollection({ ...editingCollection, description: e.target.value })}
                  placeholder="Short editorial introduction for this bag line..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512] outline-none resize-none"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Editorial Cover Photograph
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-[#EFE9E1] border border-[#E5DED5]">
                    {editingCollection.cover_image && (
                      <Image
                        src={editingCollection.cover_image}
                        alt="Cover preview"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1512] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#D9383A] transition-colors">
                      <Upload size={12} />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Cover'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <input
                      type="text"
                      value={editingCollection.cover_image || ''}
                      onChange={(e) => setEditingCollection({ ...editingCollection, cover_image: e.target.value })}
                      placeholder="Or enter image URL..."
                      className="w-full px-2.5 py-1 rounded border border-[#E5DED5] bg-[#FFFDF9] text-[11px] text-[#1C1512]"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1C1512] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingCollection.is_featured)}
                    onChange={(e) => setEditingCollection({ ...editingCollection, is_featured: e.target.checked })}
                    className="accent-[#1C1512] w-4 h-4"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-[#1C1512] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingCollection.is_hidden)}
                    onChange={(e) => setEditingCollection({ ...editingCollection, is_hidden: e.target.checked })}
                    className="accent-[#D9383A] w-4 h-4"
                  />
                  <span>Hide Collection</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1C1512] mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={editingCollection.display_order || 0}
                  onChange={(e) => setEditingCollection({ ...editingCollection, display_order: parseInt(e.target.value || '0', 10) })}
                  className="w-full px-3 py-2 rounded-lg border border-[#E5DED5] bg-[#FFFDF9] text-xs text-[#1C1512]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5DED5] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1C1512] text-xs font-bold uppercase tracking-wider text-[#1C1512]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-[#1C1512] hover:bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {collectionToDelete && (
        <div className="fixed inset-0 z-[110] bg-[#1C1512]/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl p-6 shadow-2xl border border-[#E5DED5] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1C1512]">
              Delete Collection?
            </h3>
            <p className="text-xs text-[#5E524B] leading-relaxed">
              Are you sure you want to delete <strong>{collectionToDelete.name}</strong>? Articles assigned to this collection will remain safe in the catalogue as unassigned.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCollectionToDelete(null)}
                className="px-4 py-2 rounded-lg border border-[#1C1512] text-xs font-bold uppercase tracking-wider text-[#1C1512]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 rounded-lg bg-[#D9383A] text-white text-xs font-bold uppercase tracking-wider shadow-md"
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
