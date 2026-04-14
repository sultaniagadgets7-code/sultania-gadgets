'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Check, X, AlertCircle, GripVertical } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

const categoryIcons: Record<string, string> = {
  chargers: '⚡', earbuds: '🎧', cables: '🔗',
  accessories: '📱', 'power-banks': '🔋', adapters: '🔄',
};

interface CategoriesManagerProps {
  categories: Category[];
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  sort_order: string;
}

const emptyForm: FormState = { name: '', slug: '', description: '', sort_order: '0' };

export function CategoriesManager({ categories }: CategoriesManagerProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);

  function openAdd() {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
    setShowAdd(true);
  }

  function openEdit(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      sort_order: String(cat.sort_order),
    });
    setEditingId(cat.id);
    setShowAdd(false);
    setError('');
  }

  function handleNameChange(val: string) {
    setForm((prev) => ({
      ...prev,
      name: val,
      // Auto-generate slug only when adding new
      ...(editingId ? {} : { slug: slugify(val) }),
    }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    setLoading(true);
    setError('');

    const data = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      sort_order: parseInt(form.sort_order) || 0,
    };

    const result = editingId
      ? await updateCategory(editingId, data)
      : await createCategory(data);

    if (result.success) {
      setShowAdd(false);
      setEditingId(null);
      setForm(emptyForm);
      router.refresh();
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Products using it will be unassigned.')) return;
    setDeletingId(id);
    const result = await deleteCategory(id);
    if (!result.success) {
      alert(result.error);
    } else {
      router.refresh();
    }
    setDeletingId(null);
  }

  function cancelForm() {
    setShowAdd(false);
    setEditingId(null);
    setForm(emptyForm);
    setError('');
  }

  const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition';

  const FormPanel = () => (
    <div className="bg-white border border-gray-200 rounded-[20px] p-5 mb-5">
      <p className="font-bold text-sm text-gray-900 mb-4">
        {editingId ? 'Edit Category' : 'Add New Category'}
      </p>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Name *
          </label>
          <input value={form.name} onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Chargers" className={inp} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Slug *
          </label>
          <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="e.g. chargers" className={`${inp} font-mono`} />
          <p className="text-xs text-gray-400 mt-1">URL: /category/{form.slug || '...'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Description
          </label>
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional description" className={inp} />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Sort Order
          </label>
          <input type="number" value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            placeholder="0" className={inp} />
          <p className="text-xs text-gray-400 mt-1">Lower = appears first</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} disabled={loading}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-50">
          {loading
            ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            : <Check className="w-3.5 h-3.5" />
          }
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
      {/* Add button */}
      {!showAdd && !editingId && (
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors mb-5">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      )}

      {/* Add form */}
      {showAdd && <FormPanel />}

      {/* Categories list */}
      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            No categories yet. Add your first one above.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-8" />
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Category</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Slug</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Description</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-16">Order</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <React.Fragment key={cat.id}>
                  <tr className={`hover:bg-gray-50 ${editingId === cat.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-5 py-3 text-gray-300">
                      <GripVertical className="w-4 h-4" aria-hidden="true" />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg" aria-hidden="true">
                          {categoryIcons[cat.slug] || '📦'}
                        </span>
                        <span className="font-semibold text-gray-900">{cat.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-400 text-xs">
                      {cat.description || <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs font-mono">{cat.sort_order}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(cat)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label={`Edit ${cat.name}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors disabled:opacity-40"
                          aria-label={`Delete ${cat.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Inline edit form */}
                  {editingId === cat.id && (
                    <tr key={`${cat.id}-edit`}>
                      <td colSpan={6} className="px-5 py-4 bg-blue-50 border-b border-blue-100">
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
