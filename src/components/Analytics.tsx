'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, initMetaPixel, trackMetaPixelPageView, trackGAPageView } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize analytics on mount
    initGA();
    initMetaPixel();
  }, []);

  useEffect(() => {
    // Track page views on route change
    trackGAPageView(pathname);
    trackMetaPixelPageView();
  }, [pathname]);

  return null;
}
