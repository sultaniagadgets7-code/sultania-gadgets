'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TawkToChat() {
  const tawkId = process.env.NEXT_PUBLIC_TAWKTO_ID;
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (!tawkId || isAdmin || typeof window === 'undefined') return;

    // Initialize Tawk
    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    script.onload = () => {
      console.log('Tawk.to loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Tawk.to');
    };
    document.body.appendChild(script);

    return () => {
      try {
        const tawkScript = document.querySelector(`script[src*="embed.tawk.to"]`);
        if (tawkScript) tawkScript.remove();
      } catch (e) {
        console.error('Error removing Tawk script:', e);
      }
    };
  }, [tawkId, isAdmin]);

  return null;
}
