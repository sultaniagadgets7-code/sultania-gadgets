import type { Metadata } from 'next';
import './globals.css';
import { TrustStrip } from '@/components/ui/TrustBadge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/lib/cart';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { TawkToChat } from '@/components/ui/TawkToChat';
import { getCategories, getSiteSettings } from '@/lib/queries';

export const metadata: Metadata = {
  title: { default: 'Sultania Gadgets — Trusted Tech Accessories in Pakistan', template: '%s | Sultania Gadgets' },
  description: 'Buy genuine chargers, earbuds, cables, power banks. Cash on delivery across Pakistan. Tested before dispatch.',
  keywords: ['chargers', 'earbuds', 'cables', 'power banks', 'mobile accessories', 'Pakistan', 'COD'],
  openGraph: { type: 'website', locale: 'en_PK', siteName: 'Sultania Gadgets' },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getCategories(), getSiteSettings()]);
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        <MetaPixel />
        <TawkToChat />
        <CartProvider>
          {/* Announcement bar — only if text is set */}
          {settings?.announcement_text && (
            <div className="bg-[#e01e1e] text-white text-center py-2 px-4 text-xs font-semibold">
              {settings.announcement_text}
            </div>
          )}
          <TrustStrip />
          <Navbar categories={categories} />
          <CartDrawer />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer whatsappNumber={wa} />
          <MobileTabBar />
          <ScrollToTop />
          <CookieBanner />
        </CartProvider>
      </body>
    </html>
  );
}
