'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TawkToChat() {
  const tawkId = process.env.NEXT_PUBLIC_TAWKTO_ID;
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (!tawkId || isAdmin || typeof window === 'undefined') return;

    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = `https://embed.tawk.to/${tawkId}/default`;
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    document.head.appendChild(s1);

    return () => {
      try { document.head.removeChild(s1); } catch {}
    };
  }, [tawkId, isAdmin]);

  return null;
}
