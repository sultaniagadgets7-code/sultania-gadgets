'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to subscribe. Please try again.');
    }
  };

  return (
    <div className="bg-[#0f172a] rounded-[20px] p-6 sm:p-8">
      <h3 className="text-lg font-black text-white mb-1">Stay Updated</h3>
      <p className="text-slate-400 text-sm mb-5">
        New arrivals, deals, and tech tips — straight to your inbox.
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-3 bg-green-900/30 border border-green-700 rounded-2xl px-4 py-3">
          <span className="text-green-400 text-lg">✓</span>
          <p className="text-green-400 text-sm font-semibold">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/10 text-white placeholder-slate-500 text-sm border border-white/10 focus:outline-none focus:border-white/30 disabled:opacity-50 transition"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-3 bg-[#dc2626] hover:bg-[#b91c1c] rounded-2xl font-bold text-white text-xs uppercase tracking-widest disabled:opacity-50 whitespace-nowrap transition-colors shrink-0"
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="mt-2 text-xs text-red-400">{message}</p>
      )}

      <p className="text-xs text-slate-600 mt-3">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
