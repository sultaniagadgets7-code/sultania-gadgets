'use client';

import { useState } from 'react';
import { User, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function CheckoutAuthPrompt() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (authMode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.refresh();
        setShowModal(false);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        router.refresh();
        setShowModal(false);
      }
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/checkout`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  const inp = 'w-full bg-[#f8fafc] border-0 rounded-xl px-4 py-3.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition';

  return (
    <>
      {/* Prompt Card */}
      <div className="bg-gradient-to-br from-[#dc2626] to-[#b91c1c] rounded-2xl p-5 text-white mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">Sign in for faster checkout</h3>
            <p className="text-sm text-white/90 mb-4">
              Save your details, track orders, and earn loyalty points
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { setAuthMode('login'); setShowModal(true); }}
                className="bg-white text-[#dc2626] font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors touch-manipulation"
                style={{ touchAction: 'manipulation' }}>
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setShowModal(true); }}
                className="bg-white/20 backdrop-blur-sm text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-full hover:bg-white/30 transition-colors touch-manipulation"
                style={{ touchAction: 'manipulation' }}>
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl z-10 my-auto">
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close">
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <h2 className="font-black text-xl text-gray-950 tracking-tight">
                {authMode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {authMode === 'login' ? 'Sign in to continue' : 'Sign up to save your details'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex bg-[#f1f5f9] rounded-full p-1 mb-5">
              {(['login', 'signup'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => { setAuthMode(mode); setError(''); }}
                  className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${
                    authMode === mode ? 'bg-[#dc2626] text-white shadow-sm' : 'text-[#64748b]'
                  }`}>
                  {mode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{error}</p>
            )}

            {/* Google OAuth Button - Primary */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3.5 rounded-full transition-all disabled:opacity-50 mb-4">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {authMode === 'login' ? 'Continue with Google' : 'Sign up with Google'}
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-400">Or use email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={inp}
                autoComplete="email"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 6 chars)"
                className={inp}
                autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {loading ? 'Please wait...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
              {authMode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button onClick={() => { setAuthMode('signup'); setError(''); }} className="text-gray-950 font-semibold hover:underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={() => { setAuthMode('login'); setError(''); }} className="text-gray-950 font-semibold hover:underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
