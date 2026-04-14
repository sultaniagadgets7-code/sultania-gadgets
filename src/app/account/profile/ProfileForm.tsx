'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/actions';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface Profile {
  full_name?: string | null;
  phone?: string | null;
  city?: string | null;
  address?: string | null;
}

export function ProfileForm({ profile }: { profile?: Profile | null }) {
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    address: profile?.address || '',
  });
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('loading');
    const result = await updateProfile(form);
    if (result.success) { setState('success'); setMsg('Profile updated.'); }
    else { setState('error'); setMsg(result.error || 'Something went wrong.'); }
    setTimeout(() => setState('idle'), 3000);
  }

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 transition';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {state === 'success' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-2xl px-4 py-3 text-sm">
          <CheckCircle className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}
      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Full Name</label>
          <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            placeholder="Ahmed Khan" className={inp} autoComplete="name" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Phone</label>
          <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="03XX-XXXXXXX" className={inp} autoComplete="tel" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">City</label>
          <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Karachi" className={inp} autoComplete="address-level2" />
        </div>
        <div className="col-span-2">
          <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1.5">Address</label>
          <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="House No., Street, Area" className={`${inp} resize-none`} autoComplete="street-address" />
        </div>
      </div>

      <button type="submit" disabled={state === 'loading'}
        className="bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2">
        {state === 'loading' && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
        {state === 'loading' ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
