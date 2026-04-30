'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [ready, setReady] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check we have an active session from the recovery link
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setReady(true);
      else { setMsg('Invalid or expired reset link.'); setState('error'); }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setMsg('Password must be at least 6 characters.'); setState('error'); return; }
    if (password !== confirm) { setMsg('Passwords do not match.'); setState('error'); return; }

    setState('loading');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setState('error'); setMsg(error.message); }
    else {
      setState('success');
      setTimeout(() => router.push('/'), 2000);
    }
  }

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 transition';

  return (
    <div className="max-w-sm mx-auto px-5 py-24">
      <h1 className="font-black text-2xl text-gray-950 mb-2 tracking-tight">Set New Password</h1>
      <p className="text-sm text-gray-400 mb-8">Choose a new password for your account.</p>

      {state === 'success' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 rounded-2xl px-4 py-3 text-sm mb-4">
          <CheckCircle className="w-4 h-4 shrink-0" /> Password updated! Redirecting...
        </div>
      )}
      {state === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl px-4 py-3 text-sm mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {msg}
        </div>
      )}

      {ready && state !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="New password (min 6 chars)" className={inp} autoComplete="new-password" required />
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm new password" className={inp} autoComplete="new-password" required />
          <button type="submit" disabled={state === 'loading'}
            className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50">
            {state === 'loading' ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      )}
    </div>
  );
}
