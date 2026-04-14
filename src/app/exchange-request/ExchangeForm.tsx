'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { waUrl } from '@/lib/whatsapp';

const REASONS = ['Defective / Not Working', 'Wrong Item Received', 'Not as Described', 'Damaged in Transit', 'Other'];

export function ExchangeForm() {
  const [form, setForm] = useState({
    order_id: '', customer_name: '', phone: '', product_name: '', reason: '', description: '',
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [requestId, setRequestId] = useState('');

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a0a0a] transition';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_name || !form.phone || !form.product_name || !form.reason) {
      setMsg('Please fill in all required fields.'); setState('error'); return;
    }
    setState('loading');
    const supabase = createClient();
    const { data, error } = await supabase.from('exchange_requests').insert({
      order_id: form.order_id || null,
      customer_name: form.customer_name,
      phone: form.phone,
      product_name: form.product_name,
      reason: form.reason,
      description: form.description || null,
    }).select('id').single();

    if (error) { setState('error'); setMsg('Failed to submit. Please try WhatsApp instead.'); return; }
    setRequestId(data.id.slice(0, 8).toUpperCase());
    setState('success');
  }

  if (state === 'success') return (
    <div className="bg-green-50 rounded-[20px] p-6 text-center space-y-4">
      <CheckCircle className="w-10 h-10 text-green-600 mx-auto" />
      <h2 className="font-bold text-gray-950">Request Submitted!</h2>
      <p className="text-sm text-gray-600">
        Your exchange request <span className="font-mono font-bold">#{requestId}</span> has been received.
        We&apos;ll contact you within 24 hours.
      </p>
      <a href={waUrl(`Assalamualaikum, I submitted an exchange request #${requestId}. Please assist.`)}
        target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-full transition-colors">
        <MessageCircle className="w-4 h-4" /> Follow Up on WhatsApp
      </a>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl p-3.5 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}

      <input value={form.order_id} onChange={(e) => setForm({ ...form, order_id: e.target.value })}
        placeholder="Order ID (optional — e.g. ABC12345)" className={inp} />

      <div className="grid grid-cols-2 gap-3">
        <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
          placeholder="Full Name *" className={inp} required />
        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone *" className={inp} required />
      </div>

      <input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })}
        placeholder="Product Name *" className={inp} required />

      <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
        className={`${inp} cursor-pointer`} required>
        <option value="">Select Reason *</option>
        {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
        placeholder="Describe the issue in detail (optional)" className={`${inp} resize-none`} />

      <button type="submit" disabled={state === 'loading'}
        className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
        {state === 'loading' && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
        {state === 'loading' ? 'Submitting...' : 'Submit Exchange Request'}
      </button>

      <p className="text-center text-xs text-gray-400">
        Or contact us directly on{' '}
        <a href={waUrl('Assalamualaikum, I need to request an exchange.')}
          target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold">
          WhatsApp
        </a>
      </p>
    </form>
  );
}
