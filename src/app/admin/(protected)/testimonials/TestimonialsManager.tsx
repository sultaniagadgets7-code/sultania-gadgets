'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Check, X, AlertCircle, Star } from 'lucide-react';
import { createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/actions';
import type { Testimonial } from '@/types';

interface TestimonialsManagerProps {
  testimonials: Testimonial[];
}

interface FormState {
  customer_name: string;
  quote: string;
  location: string;
  is_featured: boolean;
}

const emptyForm: FormState = { customer_name: '', quote: '', location: '', is_featured: false };

export function TestimonialsManager({ testimonials }: TestimonialsManagerProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);

  const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition';
  const lbl = 'text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5';

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowAdd(true);
  }

  function openEdit(t: Testimonial) {
    setForm({
      customer_name: t.customer_name,
      quote: t.quote,
      location: t.location ?? '',
      is_featured: t.is_featured,
    });
    setEditingId(t.id);
    setShowAdd(false);
    setError('');
  }

  function cancelForm() {
    setShowAdd(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  async function handleSave() {
    if (!form.customer_name.trim() || !form.quote.trim()) {
      setError('Customer name and quote are required.');
      return;
    }
    setLoading(true);
    setError('');

    const data = {
      customer_name: form.customer_name.trim(),
      quote: form.quote.trim(),
      location: form.location.trim() || undefined,
      is_featured: form.is_featured,
    };

    const result = editingId
      ? await updateTestimonial(editingId, data)
      : await createTestimonial(data);

    if (result.success) {
      cancelForm();
      router.refresh();
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    await deleteTestimonial(id);
    router.refresh();
  }

  async function handleToggleFeatured(t: Testimonial) {
    await updateTestimonial(t.id, {
      customer_name: t.customer_name,
      quote: t.quote,
      location: t.location ?? undefined,
      is_featured: !t.is_featured,
    });
    router.refresh();
  }

  const FormPanel = () => (
    <div className="bg-white border border-gray-200 rounded-[20px] p-5 mb-5">
      <p className="font-bold text-sm text-gray-900 mb-4">
        {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
      </p>
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Customer Name *</label>
            <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              placeholder="e.g. Ahmed Khan" className={inp} />
          </div>
          <div>
            <label className={lbl}>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Lahore, Pakistan" className={inp} />
          </div>
        </div>
        <div>
          <label className={lbl}>Quote *</label>
          <textarea value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })}
            placeholder="Customer's testimonial..." rows={3}
            className={`${inp} resize-none`} />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, is_featured: !form.is_featured })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.is_featured ? 'bg-gray-900' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={form.is_featured}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_featured ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={loading}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-50">
          {loading
            ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : <Check className="w-3.5 h-3.5" />}
          {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
        </button>
        <button onClick={cancelForm}
          className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {!showAdd && !editingId && (
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors mb-5">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      )}

      {showAdd && <FormPanel />}

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {testimonials.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No testimonials yet. Add your first one above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Customer</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Quote</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Location</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-24">Featured</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {testimonials.map((t) => (
                <React.Fragment key={t.id}>
                  <tr className={`hover:bg-gray-50 ${editingId === t.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900">{t.customer_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(t.created_at).toLocaleDateString('en-PK')}
                      </p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <p className="text-gray-600 text-xs line-clamp-2 max-w-xs">{t.quote}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-gray-500 text-xs">
                      {t.location || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleFeatured(t)}
                        className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${t.is_featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-600'}`}
                        aria-label={`Toggle featured for ${t.customer_name}`}
                      >
                        <Star className="w-3 h-3" />
                        {t.is_featured ? 'Featured' : 'No'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(t)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label={`Edit ${t.customer_name}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(t.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          aria-label={`Delete ${t.customer_name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === t.id && (
                    <tr key={`${t.id}-edit`}>
                      <td colSpan={5} className="px-5 py-4 bg-blue-50 border-b border-blue-100">
                        <FormPanel />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
