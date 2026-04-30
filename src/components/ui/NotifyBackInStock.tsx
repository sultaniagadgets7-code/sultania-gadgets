'use client';

import { useState } from 'react';
import { Bell, Check } from 'lucide-react';

interface Props {
  productId: string;
  productTitle: string;
}

export function NotifyBackInStock({ productId, productTitle }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/notify-restock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), productId, productTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
        <Check className="w-5 h-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-bold text-green-800">You&apos;re on the list!</p>
          <p className="text-xs text-green-700">We&apos;ll email you when this item is back in stock.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-[#dc2626]" />
        <p className="text-sm font-bold text-[#0a0a0f]">Notify me when available</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="flex-1 bg-white border border-[#e2e8f0] rounded-xl px-3 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 shrink-0 touch-manipulation"
          style={{ touchAction: 'manipulation' }}
        >
          {loading ? '...' : 'Notify'}
        </button>
      </form>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      <p className="text-xs text-[#94a3b8] mt-2">We&apos;ll only email you about this product.</p>
    </div>
  );
}
