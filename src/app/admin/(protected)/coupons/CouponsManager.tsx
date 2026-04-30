'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Check, X, AlertCircle, Ticket } from 'lucide-react';
import { createCoupon, toggleCouponActive, deleteCoupon } from '@/lib/actions';
import type { Coupon } from '@/types';

interface CouponsManagerProps {
  coupons: Coupon[];
}

interface FormState {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: string;
  min_order_value: string;
  max_uses: string;
  expires_at: string;
  is_active: boolean;
}

const emptyForm: FormState = {
  code: '',
  discount_type: 'percent',
  discount_value: '',
  min_order_value: '0',
  max_uses: '',
  expires_at: '',
  is_active: true,
};

export function CouponsManager({ coupons }: CouponsManagerProps) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<FormState>(emptyForm);

  const inp = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 transition';
  const lbl = 'text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5';

  function cancelForm() {
    setShowAdd(false);
    setForm(emptyForm);
    setError('');
  }

  async function handleCreate() {
    if (!form.code.trim() || !form.discount_value) {
      setError('Code and discount value are required.');
      return;
    }
    setLoading(true);
    setError('');
    const result = await createCoupon({
      code: form.code,
      discount_type: form.discount_type,
      discount_value: parseFloat(form.discount_value),
      min_order_value: parseFloat(form.min_order_value) || 0,
      max_uses: form.max_uses ? parseInt(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    });
    if (result.success) {
      cancelForm();
      router.refresh();
    } else {
      setError(result.error || 'Something went wrong.');
    }
    setLoading(false);
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleCouponActive(id, !current);
    router.refresh();
  }

  async function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    await deleteCoupon(id);
    router.refresh();
  }

  function isExpired(expiresAt: string | null) {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  return (
    <div>
      {!showAdd && (
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors mb-5">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      )}

      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-[20px] p-5 mb-5">
          <p className="font-bold text-sm text-gray-900 mb-4">New Coupon</p>
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl p-3 text-sm mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className={lbl}>Coupon Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. SAVE20"
                className={`${inp} font-mono uppercase`}
              />
            </div>
            <div>
              <label className={lbl}>Discount Type *</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percent' | 'flat' })}
                className={inp}
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (Rs.)</option>
              </select>
            </div>
            <div>
              <label className={lbl}>Discount Value *</label>
              <input
                type="number"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                placeholder={form.discount_type === 'percent' ? '20' : '200'}
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Min. Order Value (Rs.)</label>
              <input
                type="number"
                value={form.min_order_value}
                onChange={(e) => setForm({ ...form, min_order_value: e.target.value })}
                placeholder="0"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Max Uses (blank = unlimited)</label>
              <input
                type="number"
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
                placeholder="Unlimited"
                className={inp}
              />
            </div>
            <div>
              <label className={lbl}>Expires At</label>
              <input
                type="datetime-local"
                value={form.expires_at}
                onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
                className={inp}
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mb-4">
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
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={loading}
              className="flex items-center gap-2 bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors disabled:opacity-50">
              {loading
                ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <Check className="w-3.5 h-3.5" />}
              {loading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button onClick={cancelForm}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 px-4 py-2.5 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
        {coupons.length === 0 ? (
          <div className="p-10 text-center text-gray-400 text-sm">
            <Ticket className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No coupons yet. Create your first one above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Code</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Discount</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">Uses</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Expires</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-24">Active</th>
                  <th className="px-5 py-3 w-16" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => {
                  const expired = isExpired(c.expires_at);
                  return (
                    <tr key={c.id} className={`hover:bg-gray-50 ${expired ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-3">
                        <span className="font-mono font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg text-xs">
                          {c.code}
                        </span>
                        {expired && (
                          <span className="ml-2 text-xs text-red-500 font-medium">Expired</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <span className="font-semibold text-gray-900">
                          {c.discount_type === 'percent' ? `${c.discount_value}%` : `Rs. ${c.discount_value}`}
                        </span>
                        {c.min_order_value > 0 && (
                          <p className="text-xs text-gray-400">Min. Rs. {c.min_order_value}</p>
                        )}
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell text-gray-600 text-xs">
                        {c.used_count} / {c.max_uses ?? '∞'}
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell text-xs text-gray-500">
                        {c.expires_at
                          ? new Date(c.expires_at).toLocaleDateString('en-PK')
                          : <span className="text-gray-300">Never</span>}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleToggle(c.id, c.is_active)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${c.is_active && !expired ? 'bg-gray-900' : 'bg-gray-300'}`}
                          role="switch"
                          aria-checked={c.is_active}
                          aria-label={`Toggle ${c.code}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${c.is_active && !expired ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() => handleDelete(c.id, c.code)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                          aria-label={`Delete ${c.code}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
