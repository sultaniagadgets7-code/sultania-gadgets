'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, initMetaPixel, initTawkTo, trackMetaPixelPageView, trackGAPageView } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  useEffect(() => {
    // Initialize analytics on mount
    initGA();
    initMetaPixel();
    
    // Only initialize Tawk.to on non-admin pages
    if (!isAdminPage) {
      initTawkTo();
    }
  }, [isAdminPage]);

  useEffect(() => {
    // Track page views on route change
    trackGAPageView(pathname);
    trackMetaPixelPageView();
  }, [pathname]);

  return null;
}
