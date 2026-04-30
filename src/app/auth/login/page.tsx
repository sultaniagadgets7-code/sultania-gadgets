'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/account/orders';
  const needsAddressParam = searchParams.get('needs_address') === '1';
  const oauthError = searchParams.get('error');

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [needsAddress, setNeedsAddress] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [err, setErr] = useState(
    oauthError === 'oauth_failed'
      ? 'Google sign-in failed. Please use email/password login or try again later.'
      : oauthError === 'access_denied'
      ? 'Google sign-in was cancelled.'
      : ''
  );
  const [msg, setMsg] = useState('');
  const [redirecting, setRedirecting] = useState(false);

  const supabase = createClient();
  const inp = 'w-full bg-[#f8fafc] rounded-2xl px-4 py-3.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#dc2626] transition';

  // On mount: if already logged in, check profile then redirect
  useEffect(() => {
    let mounted = true;
    
    async function checkAuth() {
      try {
        // Use getUser() instead of getSession() to avoid stale cached sessions
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!mounted) return;
        
        if (user) {
          // If OAuth callback flagged needs_address AND going to checkout, show address form
          if (needsAddressParam && (next === '/checkout' || next.startsWith('/checkout'))) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, phone, city, address')
              .eq('id', user.id)
              .single();
            if (!mounted) return;
            setUserId(user.id);
            setFullName(profile?.full_name || '');
            setPhone(profile?.phone || '');
            setCity(profile?.city || '');
            setAddress(profile?.address || '');
            setNeedsAddress(true);
            setChecking(false);
            return;
          }

          // User is already logged in — redirect directly
          setRedirecting(true);
          router.replace(next);
        } else {
          setChecking(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) setChecking(false);
      }
    }

    checkAuth();

    return () => { mounted = false; };
  }, [next, needsAddressParam, router, supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) { 
        setErr(error.message); 
        setLoading(false); 
        return; 
      }
      
      if (data.user) {
        // Only check profile completeness if heading to checkout
        if (next === '/checkout' || next.startsWith('/checkout')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone, city, address')
            .eq('id', data.user.id)
            .single();

          const incomplete = !profile?.phone || !profile?.city || !profile?.address;
          if (incomplete) {
            setUserId(data.user.id);
            setFullName(profile?.full_name || '');
            setPhone(profile?.phone || '');
            setCity(profile?.city || '');
            setAddress(profile?.address || '');
            setNeedsAddress(true);
            setLoading(false);
            return;
          }
        }
        // Profile complete or not going to checkout — redirect directly
        setRedirecting(true);
        router.replace(next);
      }
    } catch (error) {
      setErr('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setErr('Password must be at least 6 characters.'); return; }
    setErr(''); setSignupStep(2);
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr('');
    
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { setErr(error.message); setLoading(false); return; }
      
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id, email, full_name: fullName,
          phone, city, address, updated_at: new Date().toISOString(),
        });
      }
      
      if (data.session) {
        setRedirecting(true);
        router.replace(next);
      } else {
        setLoading(false);
        setMsg('Account created! Check your email to confirm, then sign in.');
        setTab('login'); setSignupStep(1);
      }
    } catch (error) {
      setErr('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleSaveAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true); setErr('');
    
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: userId, full_name: fullName, phone, city, address,
        updated_at: new Date().toISOString(),
      });
      if (error) { setErr(error.message); setLoading(false); return; }
      
      setRedirecting(true);
      router.replace(next);
    } catch (error) {
      setErr('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true); setErr('');
    // Use /auth/callback as the redirect to properly handle OAuth session
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) { setErr(error.message); setLoading(false); }
  }

  if (checking || redirecting) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
          {redirecting && <p className="text-sm text-[#64748b]">Redirecting...</p>}
        </div>
      </div>
    );
  }

  // Address collection screen
  if (needsAddress) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/"><p className="font-black text-2xl tracking-tight text-[#0f172a]">SULTANIA <span className="text-[#dc2626]">GADGETS</span></p></Link>
          </div>
          <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#e2e8f0]">
            <h2 className="font-black text-xl text-[#0f172a] mb-1">One more step</h2>
            <p className="text-sm text-[#94a3b8] mb-5">Add your delivery details to complete checkout.</p>
            {err && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-4">{err}</p>}
            <form onSubmit={handleSaveAddress} className="space-y-3">
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className={inp} autoComplete="name" />
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className={inp} autoComplete="tel" />
              <input required value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={inp} />
              <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" className={`${inp} resize-none`} />
              <p className="text-xs text-[#94a3b8]">Saved to your profile — auto-fills future orders.</p>
              <SubmitBtn loading={loading} label="Save & Continue to Checkout" />
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main login/signup
  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/"><p className="font-black text-2xl tracking-tight text-[#0f172a]">SULTANIA <span className="text-[#dc2626]">GADGETS</span></p></Link>
          <p className="text-sm text-[#94a3b8] mt-2">Sign in to continue to checkout</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#e2e8f0]">
          {/* Tabs */}
          <div className="flex bg-[#f1f5f9] rounded-full p-1 mb-6">
            {(['login', 'signup'] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setErr(''); setMsg(''); setSignupStep(1); }}
                className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-full transition-all ${tab === t ? 'bg-[#dc2626] text-white shadow-sm' : 'text-[#64748b]'}`}>
                {t === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {err && <p className="text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-4">{err}</p>}
          {msg && <p className="text-xs text-green-600 bg-green-50 rounded-xl px-3 py-2 mb-4">{msg}</p>}

          {/* LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={inp} autoComplete="email" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={inp} autoComplete="current-password" />
              <div className="flex justify-end">
                <Link href="/auth/reset-password" className="text-xs text-[#94a3b8] hover:text-[#0f172a]">Forgot password?</Link>
              </div>
              <SubmitBtn loading={loading} label="Sign In & Continue" />
            </form>
          )}

          {/* SIGNUP STEP 1 */}
          {tab === 'signup' && signupStep === 1 && (
            <form onSubmit={handleStep1} className="space-y-3">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={inp} autoComplete="email" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 6 chars)" className={inp} autoComplete="new-password" />
              <SubmitBtn loading={false} label="Continue →" />
            </form>
          )}

          {/* SIGNUP STEP 2 */}
          {tab === 'signup' && signupStep === 2 && (
            <form onSubmit={handleStep2} className="space-y-3">
              <p className="text-xs text-[#94a3b8] mb-1">Step 2 of 2 — Delivery details</p>
              <input required value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className={inp} autoComplete="name" />
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" className={inp} autoComplete="tel" />
              <input required value={city} onChange={e => setCity(e.target.value)} placeholder="City" className={inp} />
              <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="Full Address" className={`${inp} resize-none`} />
              <p className="text-xs text-[#94a3b8]">Auto-fills your future orders.</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => { setSignupStep(1); setErr(''); }} className="px-4 py-3.5 text-xs font-bold text-[#64748b] hover:text-[#0f172a]">← Back</button>
                <SubmitBtn loading={loading} label="Create Account" className="flex-1" />
              </div>
            </form>
          )}

          {/* Google */}
          {(tab === 'login' || (tab === 'signup' && signupStep === 1)) && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e2e8f0]" /></div>
                <div className="relative flex justify-center text-xs"><span className="px-2 bg-white text-[#94a3b8]">Or continue with</span></div>
              </div>
              <button type="button" onClick={handleGoogle} disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#64748b] font-medium text-sm py-3 rounded-full transition-colors disabled:opacity-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#94a3b8] mt-6">
          <Link href="/" className="hover:text-[#0f172a] underline underline-offset-4">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}

function SubmitBtn({ loading, label, className }: { loading: boolean; label: string; className?: string }) {
  return (
    <button type="submit" disabled={loading}
      className={`w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${className ?? ''}`}>
      {loading && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
      {loading ? 'Please wait...' : label}
    </button>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#dc2626] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginPageInner />
    </Suspense>
  );
}
