import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { TrustStrip } from '@/components/ui/TrustBadge';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/lib/cart';
import { LanguageProvider } from '@/lib/language';
import { CompareProvider } from '@/lib/compare';
import { AbandonedCartTracker } from '@/components/cart/AbandonedCartTracker';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { CookieBanner } from '@/components/ui/CookieBanner';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { MetaPixel } from '@/components/analytics/MetaPixel';
import { getNavCategories, getSiteSettings } from '@/lib/queries';

export const metadata: Metadata = {
  title: { default: "Sultania Gadgets — Pakistan's Trusted Tech Essentials", template: '%s | Sultania Gadgets' },
  description: 'Shop genuine mobile accessories in Pakistan. Premium chargers, wireless earbuds, USB cables, and power banks. Cash on delivery nationwide. All products tested before dispatch. Fast 2-4 day shipping.',
  keywords: ['chargers', 'earbuds', 'cables', 'power banks', 'mobile accessories', 'Pakistan', 'COD'],
  authors: [{ name: 'Sultania Gadgets' }],
  creator: 'Sultania Gadgets',
  publisher: 'Sultania Gadgets',
  formatDetection: { telephone: false },
  metadataBase: new URL('https://sultaniagadgets.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://sultaniagadgets.com',
    siteName: 'Sultania Gadgets',
    title: "Sultania Gadgets — Pakistan's Trusted Tech Essentials",
    description: 'Shop genuine mobile accessories in Pakistan. Premium chargers, wireless earbuds, USB cables, and power banks. Cash on delivery nationwide.',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Sultania Gadgets - Trusted Tech Accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Sultania Gadgets — Pakistan's Trusted Tech Essentials",
    description: 'Shop genuine mobile accessories in Pakistan. COD nationwide. Tested before dispatch.',
    images: ['/api/og'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, settings] = await Promise.all([getNavCategories(), getSiteSettings()]);
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const deliveryFee = settings?.delivery_fee ?? 200;

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0a0a0f" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sultania" />
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://tblvxsfmcqbltifoqrnx.supabase.co" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pub-bdcc7c4e796b4cf7a97402a408b5dc6c.r2.dev" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen flex flex-col bg-white" suppressHydrationWarning>
        {/* Organization structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Organization', 'OnlineStore'],
          name: 'Sultania Gadgets',
          url: 'https://sultaniagadgets.com',
          logo: 'https://sultaniagadgets.com/favicon.svg',
          image: 'https://sultaniagadgets.com/og-image.jpg',
          description: 'Genuine tech accessories — chargers, earbuds, cables, power banks. Cash on delivery across Pakistan.',
          contactPoint: { 
            '@type': 'ContactPoint', 
            contactType: 'customer service', 
            availableLanguage: ['English', 'Urdu'],
            telephone: `+${settings?.whatsapp_number || '923001234567'}`,
            contactOption: 'TollFree',
          },
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'PK',
            addressRegion: 'Pakistan',
          },
          areaServed: { '@type': 'Country', name: 'Pakistan' },
          priceRange: 'Rs. 500 - Rs. 50,000',
          paymentAccepted: 'Cash on Delivery',
          currenciesAccepted: 'PKR',
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tech Accessories',
            itemListElement: [
              { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Mobile Chargers' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Wireless Earbuds' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'USB Cables' } },
              { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Power Banks' } },
            ],
          },
          sameAs: [
            settings?.social_facebook,
            settings?.social_instagram,
            settings?.social_twitter,
            settings?.social_youtube,
            settings?.social_tiktok,
          ].filter(Boolean),
        })}} />
        {/* WebSite structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Sultania Gadgets',
          url: 'https://sultaniagadgets.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://sultaniagadgets.com/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
          },
        })}} />
        <MetaPixel />

        <LanguageProvider>
        <CompareProvider>
        <CartProvider>
          {/* Announcement bar — only if text is set */}
          {settings?.announcement_text && (
            <div className="bg-[#e01e1e] text-white text-center py-2 px-4 text-xs font-semibold">
              {settings.announcement_text}
            </div>
          )}
          <TrustStrip />
          <Navbar categories={categories} />
          <CartDrawer deliveryFee={deliveryFee} />
          <main className="flex-1 pb-[calc(56px+env(safe-area-inset-bottom,0px))] md:pb-0">{children}</main>
          <Footer whatsappNumber={wa} categories={categories} />
          <MobileTabBar />
          <ScrollToTop />
          <Suspense fallback={null}>
            <CookieBanner />
            <PWAInstallPrompt />
            <AbandonedCartTracker />
          </Suspense>
        </CartProvider>
        </CompareProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
