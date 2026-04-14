'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, LogOut, ShoppingBag, Heart, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

type AuthMode = 'login' | 'signup' | 'reset';
type SignupStep = 1 | 2;

export function AccountMenu() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [signupStep, setSignupStep] = useState<SignupStep>(1);

  // Step 1 fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2 fields (profile details)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  const [authMsg, setAuthMsg] = useState('');
  const [authErr, setAuthErr] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); closeAuth(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = authOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [authOpen]);

  function closeAuth() {
    setAuthOpen(false);
    setAuthErr('');
    setAuthMsg('');
    setSignupStep(1);
    setEmail(''); setPassword('');
    setFullName(''); setPhone(''); setCity(''); setAddress('');
  }

  function switchMode(mode: AuthMode) {
    setAuthMode(mode);
    setAuthErr('');
    setAuthMsg('');
    setSignupStep(1);
  }

  // Step 1: validate email/password then move to step 2
  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setAuthErr('Please fill in all fields.'); return; }
    if (password.length < 6) { setAuthErr('Password must be at least 6 characters.'); return; }
    setAuthErr('');
    setSignupStep(2);
  }

  // Step 2: create account + save profile
  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setAuthErr('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setAuthErr('');

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) { setAuthErr(error.message); setLoading(false); return; }

    // Save profile details
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: fullName,
        phone,
        city,
        address,
        updated_at: new Date().toISOString(),
      });
    }

    setLoading(false);

    if (data.session) {
      // Auto-confirmed (email confirmation disabled)
      closeAuth();
    } else {
      setAuthMsg('Account created! Check your email to confirm, then sign in.');
      setSignupStep(1);
      setAuthMode('login');
    }
  }

  // Login
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthErr('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthErr(error.message);
    else closeAuth();
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setOpen(false);
  }

  const inp = 'w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 transition';

  return (
    <>
      {/* Trigger */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => user ? setOpen(!open) : setAuthOpen(true)}
          className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-950"
          aria-label="Account" aria-expanded={open} aria-haspopup="true">
          {user ? (
            <div className="w-7 h-7 bg-[#0a0a0a] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold uppercase">{user.email?.[0] ?? 'U'}</span>
            </div>
          ) : (
            <User className="w-5 h-5" aria-hidden="true" />
          )}
        </button>

        {/* Logged-in dropdown */}
        {user && open && (
          <div className="absolute right-0 top-12 w-56 bg-white rounded-[20px] shadow-xl border border-gray-100 py-2 z-50 fade-up">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-950 truncate">{user.email}</p>
              <p className="text-xs text-gray-400 mt-0.5">Customer Account</p>
            </div>
            {[
              { href: '/account/orders',  icon: ShoppingBag, label: 'My Orders' },
              { href: '/account/wishlist', icon: Heart,       label: 'Wishlist' },
              { href: '/account/profile',  icon: User,        label: 'My Profile' },
            ].map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[#f7f7f7] hover:text-gray-950 transition-colors">
                <Icon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 mt-1 pt-1">
              <button onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors rounded-b-[20px]">
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Auth modal */}
      {authOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeAuth} aria-hidden="true" />

          <div className="relative w-full max-w-sm bg-white rounded-[24px] p-6 shadow-2xl fade-up z-10"
            role="dialog" aria-modal="true">

            {/* Close */}
            <button onClick={closeAuth}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close">
              <X className="w-4 h-4 text-gray-500" />
            </button>

            {/* Header */}
            <div className="mb-5">
              <h2 className="font-black text-xl text-gray-950 tracking-tight">
                {authMode === 'login' ? 'Welcome back'
                  : authMode === 'reset' ? 'Reset Password'
                  : signupStep === 1 ? 'Create account' : 'Your details'}
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                {authMode === 'login' ? 'Sign in to your account'
                  : authMode === 'reset' ? 'Enter your email to receive a reset link'
                  : signupStep === 1 ? 'Step 1 of 2 — Account info' : 'Step 2 of 2 — Delivery details'}
              </p>
            </div>

            {/* Tabs — only show on step 1 of login/signup */}
            {signupStep === 1 && authMode !== 'reset' && (
              <div className="flex bg-[#f7f7f7] rounded-full p-1 mb-5">
                {(['login', 'signup'] as const).map((mode) => (
                  <button key={mode} onClick={() => switchMode(mode)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${authMode === mode ? 'bg-[#0a0a0a] text-white shadow-sm' : 'text-gray-400'}`}>
                    {mode === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            )}

            {/* Messages */}
            {authErr && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-3">{authErr}</p>}
            {authMsg && <p className="text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2 mb-3">{authMsg}</p>}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" className={inp} autoComplete="email" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password" className={inp} autoComplete="current-password" />
                <div className="flex justify-end">
                  <button type="button" onClick={() => setAuthMode('reset' as AuthMode)}
                    className="text-xs text-gray-400 hover:text-gray-950 transition-colors">
                    Forgot password?
                  </button>
                </div>
                <Btn loading={loading} label="Sign In" />
              </form>
            )}

            {/* SIGNUP STEP 1 */}
            {authMode === 'signup' && signupStep === 1 && (
              <form onSubmit={handleStep1} className="space-y-3">
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address" className={inp} autoComplete="email" />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 6 chars)" className={inp} autoComplete="new-password" />
                <Btn loading={false} label="Continue →" />
              </form>
            )}

            {/* SIGNUP STEP 2 — delivery details */}
            {authMode === 'signup' && signupStep === 2 && (
              <form onSubmit={handleStep2} className="space-y-3">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name *" className={inp} autoComplete="name" required />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number *" className={inp} autoComplete="tel" required />
                <input value={city} onChange={(e) => setCity(e.target.value)}
                  placeholder="City *" className={inp} autoComplete="address-level2" required />
                <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full Address *" className={`${inp} resize-none`} autoComplete="street-address" required />
                <p className="text-xs text-gray-400">These details will auto-fill your orders.</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setSignupStep(1); setAuthErr(''); }}
                    className="px-4 py-3.5 text-xs font-bold text-gray-500 hover:text-gray-950 transition-colors">
                    ← Back
                  </button>
                  <Btn loading={loading} label="Create Account" className="flex-1" />
                </div>
              </form>
            )}

            {authMode === 'login' && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Don&apos;t have an account?{' '}
                <button onClick={() => switchMode('signup')} className="text-gray-950 font-semibold hover:underline">
                  Sign up
                </button>
              </p>
            )}

            {/* RESET PASSWORD */}
            {authMode === 'reset' && (
              <ResetForm
                supabase={supabase}
                inp={inp}
                onBack={() => switchMode('login')}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Btn({ loading, label, className }: { loading: boolean; label: string; className?: string }) {
  return (
    <button type="submit" disabled={loading}
      className={`w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${className ?? ''}`}>
      {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
      {loading ? 'Please wait...' : label}
    </button>
  );
}

function ResetForm({ supabase, inp, onBack }: {
  supabase: ReturnType<typeof import('@/lib/supabase/client').createClient>;
  inp: string;
  onBack: () => void;
}) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(''); setMsg('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?type=recovery&next=/account/profile`,
    });
    if (error) setErr(error.message);
    else setMsg('Check your email for a password reset link.');
    setLoading(false);
  }

  return (
    <form onSubmit={handleReset} className="space-y-3">
      {err && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2">{err}</p>}
      {msg && <p className="text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2">{msg}</p>}
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address" className={inp} autoComplete="email" />
      <Btn loading={loading} label="Send Reset Link" />
      <button type="button" onClick={onBack}
        className="w-full text-xs text-gray-400 hover:text-gray-950 transition-colors py-2">
        ← Back to Sign In
      </button>
    </form>
  );
}
