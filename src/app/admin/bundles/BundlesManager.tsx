'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { Plus, Trash2, Edit2, Package2, X } from 'lucide-react';

interface SimpleProduct {
  id: string;
  title: string;
  price: number;
}

interface BundleItem {
  id: string;
  product_id: string;
  quantity: number;
  product: SimpleProduct;
}

interface Bundle {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
  bundle_items: BundleItem[];
}

interface BundleItemDraft {
  product_id: string;
  quantity: number;
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  discount_percent: 0,
  is_active: true,
};

export function BundlesManager({ bundles, products }: { bundles: Bundle[]; products: SimpleProduct[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [draftItems, setDraftItems] = useState<BundleItemDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  function set(field: string, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function autoSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function addItem() {
    if (products.length === 0) return;
    setDraftItems((prev) => [...prev, { product_id: products[0].id, quantity: 1 }]);
  }

  function removeItem(idx: number) {
    setDraftItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: 'product_id' | 'quantity', value: string | number) {
    setDraftItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  }

  function startEdit(bundle: Bundle) {
    setEditingId(bundle.id);
    setForm({
      title: bundle.title,
      slug: bundle.slug,
      description: bundle.description ?? '',
      discount_percent: bundle.discount_percent,
      is_active: bundle.is_active,
    });
    setDraftItems(bundle.bundle_items.map((bi) => ({ product_id: bi.product_id, quantity: bi.quantity })));
    setShowForm(true);
  }

  function resetForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDraftItems([]);
  }

  async function handleSave() {
    if (!form.title || !form.slug) return;
    setSaving(true);
    const supabase = createClient();

    if (editingId) {
      await supabase.from('bundles').update({
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        discount_percent: form.discount_percent,
        is_active: form.is_active,
      }).eq('id', editingId);
      // Replace bundle items
      await supabase.from('bundle_items').delete().eq('bundle_id', editingId);
      if (draftItems.length > 0) {
        await supabase.from('bundle_items').insert(
          draftItems.map((item) => ({ bundle_id: editingId, ...item }))
        );
      }
    } else {
      const { data: newBundle } = await supabase.from('bundles').insert({
        title: form.title,
        slug: form.slug,
        description: form.description || null,
        discount_percent: form.discount_percent,
        is_active: form.is_active,
      }).select('id').single();

      if (newBundle && draftItems.length > 0) {
        await supabase.from('bundle_items').insert(
          draftItems.map((item) => ({ bundle_id: newBundle.id, ...item }))
        );
      }
    }

    setSaving(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this bundle?')) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from('bundle_items').delete().eq('bundle_id', id);
    await supabase.from('bundles').delete().eq('id', id);
    setDeleting(null);
    router.refresh();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Package2 className="w-6 h-6 text-[#e01e1e]" />
          Bundles
        </h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#e01e1e] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Bundle
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">{editingId ? 'Edit Bundle' : 'New Bundle'}</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
              <input
                value={form.title}
                onChange={(e) => { set('title', e.target.value); if (!editingId) set('slug', autoSlug(e.target.value)); }}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01e1e]/30"
                placeholder="Bundle title"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Slug *</label>
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01e1e]/30"
                placeholder="bundle-slug"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01e1e]/30 resize-none"
                placeholder="Bundle description"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Discount %</label>
              <input
                type="number"
                min={0}
                max={100}
                value={form.discount_percent}
                onChange={(e) => set('discount_percent', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#e01e1e]/30"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="is_active"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
            </div>
          </div>

          {/* Bundle items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-600">Products in Bundle</label>
              <button onClick={addItem} className="text-xs text-[#e01e1e] font-semibold hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>
            <div className="space-y-2">
              {draftItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={item.product_id}
                    onChange={(e) => updateItem(idx, 'product_id', e.target.value)}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none bg-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.title} — {formatPrice(p.price)}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none text-center"
                  />
                  <button onClick={() => removeItem(idx)} className="text-gray-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {draftItems.length === 0 && (
                <p className="text-xs text-gray-400">No products added yet.</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingId ? 'Update Bundle' : 'Create Bundle'}
            </button>
            <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
          </div>
        </div>
      )}

      {/* Bundles list */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {bundles.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">No bundles yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {bundles.map((bundle) => {
              const total = bundle.bundle_items.reduce((s, bi) => s + bi.product.price * bi.quantity, 0);
              const discounted = total - Math.round((total * bundle.discount_percent) / 100);
              return (
                <div key={bundle.id} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{bundle.title}</p>
                      {!bundle.is_active && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>
                      )}
                      {bundle.discount_percent > 0 && (
                        <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">
                          {bundle.discount_percent}% off
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {bundle.bundle_items.length} products · {formatPrice(discounted)}
                      {bundle.discount_percent > 0 && (
                        <span className="line-through text-gray-300 ml-1">{formatPrice(total)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(bundle)}
                      className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bundle.id)}
                      disabled={deleting === bundle.id}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
