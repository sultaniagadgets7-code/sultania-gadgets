'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const COOKIE_KEY = 'sultania_cookies_accepted';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) {
        setVisible(true);
      }
    } catch {}
  }, []);

  function accept() {
    try {
      localStorage.setItem(COOKIE_KEY, '1');
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-5 py-4"
      role="region"
      aria-label="Cookie notice"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="flex-1 text-sm text-gray-600">
          We use cookies to improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/faq"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900 underline underline-offset-2 transition-colors"
          >
            Learn More
          </Link>
          <button
            onClick={accept}
            className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-full transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
