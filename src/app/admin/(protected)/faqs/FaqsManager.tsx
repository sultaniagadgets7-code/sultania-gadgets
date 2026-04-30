'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, Check, X, AlertCircle, Globe } from 'lucide-react';
import { createFaq, updateFaq, deleteFaq } from '@/lib/actions';
import type { FaqItem } from '@/types';

interface FaqsManagerProps {
  faqs: FaqItem[];
}

interface FormState {
  question: string;
  answer: string;
  sort_order: string;
  is_active: boolean;
  product_id: string;
}

const emptyForm: FormState = { question: '', answer: '', sort_order: '0', is_active: true, product_id: '' };

export function FaqsManager({ faqs }: FaqsManagerProps) {
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

  function openEdit(faq: FaqItem) {
    setForm({
      question: faq.question,
      answer: faq.answer,
      sort_order: String(faq.sort_order),
      is_active: faq.is_active,
      product_id: faq.product_id ?? '',
    });
    setEditingId(faq.id);
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
    if (!form.question.trim() || !form.answer.trim()) {
      setError('Question and answer are required.');
      return;
    }
    setLoading(true);
    setError('');

    const data = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    const result = editingId
      ? await updateFaq(editingId, data)
      : await createFaq({ ...data, product_id: form.product_id.trim() || null });

    if (result.success) {
      cancelForm();
      router.refresh();
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return;
    await deleteFaq(id);
    router.refresh();
  }

  async function handleToggleActive(faq: FaqItem) {
    await updateFaq(faq.id, {
      question: faq.question,
      answer: faq.answer,
      sort_order: faq.sort_order,
      is_active: !faq.is_active,
    });
    router.refresh();
  }

  const FormPanel = () => (
    <div className="bg-white border border-gray-200 rounded-[20px] p-5 mb-5">
      <p className="font-bold text-sm text-gray-900 mb-4">
        {editingId ? 'Edit FAQ' : 'Add New FAQ'}
      </p>
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      <div className="space-y-3 mb-4">
        <div>
          <label className={lbl}>Question *</label>
          <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="e.g. What is your return policy?" className={inp} />
        </div>
        <div>
          <label className={lbl}>Answer *</label>
          <textarea value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })}
            placeholder="Write the answer here..." rows={3}
            className={`${inp} resize-none`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lbl}>Sort Order</label>
            <input type="number" value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              placeholder="0" className={inp} />
          </div>
          {!editingId && (
            <div>
              <label className={lbl}>Product ID (optional)</label>
              <input value={form.product_id}
                onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                placeholder="Leave blank for global" className={inp} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setForm({ ...form, is_active: !form.is_active })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${form.is_active ? 'bg-gray-900' : 'bg-gray-300'}`}
            role="switch"
            aria-checked={form.is_active}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm text-gray-700">Active</span>
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
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      )}

      {showAdd && <FormPanel />}

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {faqs.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">No FAQs yet. Add your first one above.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Question</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Scope</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-16">Order</th>
                <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-20">Active</th>
                <th className="px-5 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faqs.map((faq) => (
                <React.Fragment key={faq.id}>
                  <tr className={`hover:bg-gray-50 ${editingId === faq.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-gray-900 line-clamp-1">{faq.question}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{faq.answer}</p>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      {faq.product_id ? (
                        <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {faq.product_id.slice(0, 8)}…
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-blue-600">
                          <Globe className="w-3 h-3" /> Global
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs font-mono">{faq.sort_order}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => handleToggleActive(faq)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${faq.is_active ? 'bg-gray-900' : 'bg-gray-300'}`}
                        role="switch"
                        aria-checked={faq.is_active}
                        aria-label={`Toggle ${faq.question}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${faq.is_active ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(faq)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                          aria-label={`Edit FAQ`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(faq.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          aria-label={`Delete FAQ`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {editingId === faq.id && (
                    <tr key={`${faq.id}-edit`}>
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
