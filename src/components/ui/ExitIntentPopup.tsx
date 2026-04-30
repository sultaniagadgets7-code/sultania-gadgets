'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Tag } from 'lucide-react';

const STORAGE_KEY = 'sultania_exit_popup_shown';
const COUPON = 'SAVE10';

interface Props {
  whatsappNumber: string;
}

export function ExitIntentPopup({ whatsappNumber }: Props) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const dismiss = useCallback(() => {
    setVisible(false);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  }, []);

  useEffect(() => {
    // Don't show if already shown this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {}

    let triggered = false;

    function handleMouseLeave(e: MouseEvent) {
      if (triggered || e.clientY > 50) return;
      triggered = true;
      setVisible(true);
    }

    // Mobile: show after 40 seconds of inactivity
    let mobileTimer: ReturnType<typeof setTimeout>;
    function resetTimer() {
      clearTimeout(mobileTimer);
      mobileTimer = setTimeout(() => {
        if (!triggered) { triggered = true; setVisible(true); }
      }, 40000);
    }

    if (window.innerWidth < 768) {
      resetTimer();
      window.addEventListener('touchstart', resetTimer, { passive: true });
    } else {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(mobileTimer);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    // Subscribe to newsletter
    try {
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
    } catch {}
    setSubmitted(true);
  }

  async function copyCoupon() {
    try {
      await navigator.clipboard.writeText(COUPON);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} aria-hidden="true" />

      <div className="relative w-full max-w-sm bg-white rounded-[28px] overflow-hidden shadow-2xl fade-up">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header */}
        <div className="bg-[#0a0a0a] px-6 pt-8 pb-6 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">🎁</div>
          <h2 className="text-xl font-black text-white tracking-tight">Wait! Don&apos;t Leave Yet</h2>
          <p className="text-gray-400 text-sm mt-1">Get an exclusive discount before you go</p>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {!submitted ? (
            <>
              {/* Coupon display */}
              <div className="bg-[#fff3cd] border-2 border-dashed border-[#ffc107] rounded-2xl p-4 text-center mb-5">
                <p className="text-xs font-bold text-[#856404] uppercase tracking-widest mb-1">Your Coupon Code</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-black text-[#0a0a0a] font-mono tracking-widest">{COUPON}</span>
                  <button
                    onClick={copyCoupon}
                    className="flex items-center gap-1.5 bg-[#0a0a0a] text-white text-xs font-bold px-3 py-2 rounded-full transition-colors hover:bg-gray-800"
                  >
                    <Tag className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-[#856404] mt-1.5">Apply at checkout for extra savings</p>
              </div>

              {/* Email form */}
              <p className="text-xs text-gray-500 text-center mb-3">Enter your email to get more exclusive deals</p>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-950"
                  required
                />
                <button
                  type="submit"
                  className="bg-[#e01e1e] hover:bg-[#c01818] text-white font-bold text-xs uppercase tracking-widest px-4 py-3 rounded-2xl transition-colors shrink-0"
                >
                  Get Deal
                </button>
              </form>

              <button
                onClick={dismiss}
                className="w-full text-xs text-gray-400 hover:text-gray-600 mt-3 py-1 transition-colors"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl mb-3" aria-hidden="true">✅</div>
              <p className="font-bold text-gray-950 mb-1">Coupon Saved!</p>
              <p className="text-sm text-gray-500 mb-4">Use <span className="font-mono font-bold">{COUPON}</span> at checkout</p>
              <button
                onClick={dismiss}
                className="bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
