'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function TawkToChat() {
  const tawkId = process.env.NEXT_PUBLIC_TAWKTO_ID;
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (!tawkId || isAdmin || typeof window === 'undefined') return;

    (window as any).Tawk_API = (window as any).Tawk_API || {};
    (window as any).Tawk_LoadStart = new Date();

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    // Inject CSS to push the widget to the right side, above the mobile tab bar
    const style = document.createElement('style');
    style.id = 'tawk-mobile-offset';
    style.textContent = `
      @media (max-width: 767px) {
        #tawk-bubble-container,
        .tawk-min-container,
        [id^="tawk-"],
        iframe[title*="chat widget"],
        iframe[src*="tawk.to"] {
          bottom: 90px !important;
          right: 20px !important;
          margin-bottom: 0 !important;
        }
      }
      @media (min-width: 768px) {
        #tawk-bubble-container,
        .tawk-min-container,
        [id^="tawk-"],
        iframe[title*="chat widget"],
        iframe[src*="tawk.to"] {
          bottom: 20px !important;
          right: 20px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Fallback: poll for the Tawk iframe and position it on the right
    const poll = setInterval(() => {
      const el = document.getElementById('tawk-bubble-container') ||
                 document.querySelector('.tawk-min-container') as HTMLElement;
      if (el && window.innerWidth < 768) {
        (el as HTMLElement).style.setProperty('bottom', '90px', 'important');
        (el as HTMLElement).style.setProperty('right', '20px', 'important');
        clearInterval(poll);
      }
    }, 500);

    return () => {
      document.querySelector(`script[src*="embed.tawk.to"]`)?.remove();
      document.getElementById('tawk-mobile-offset')?.remove();
      clearInterval(poll);
    };
  }, [tawkId, isAdmin]);

  return null;
}
