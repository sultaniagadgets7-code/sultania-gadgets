'use client';

import { useState, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Zap, AlertCircle } from 'lucide-react';

// Create client once outside component
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.session) {
      setError(signInError?.message || 'Invalid credentials');
      setLoading(false);
      return;
    }

    // Session confirmed — navigate to admin
    // Small delay to ensure cookies are written
    setTimeout(() => {
      window.location.href = '/admin';
    }, 100);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[#0a0a0a] font-black text-xl mb-1">
            <Zap className="w-6 h-6 text-[#e01e1e]" aria-hidden="true" />
            Sultania Gadgets
          </div>
          <p className="text-gray-500 text-sm">Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-[20px] p-6 space-y-4">
          <h1 className="text-base font-bold text-gray-900">Sign In</h1>

          {error && (
            <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-2xl p-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
