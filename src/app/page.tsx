import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, CreditCard, RefreshCw, CheckCircle, Star } from 'lucide-react';
import { getFeaturedProducts, getNewArrivals, getCategories, getFaqItems, getTestimonials, getSiteSettings, getProducts, getActiveBundles, getTopRatedProducts } from '@/lib/queries';import { ProductCarousel } from '@/components/products/ProductCarousel';
import { CategoryCarousel } from '@/components/ui/CategoryCarousel';
import { Accordion } from '@/components/ui/Accordion';
import { NewsletterForm } from '@/components/ui/NewsletterForm';
import { getWhatsAppUrl, formatPrice } from '@/lib/utils';

// Enable ISR - revalidate every 10 minutes (increased from 5)
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Sultania Gadgets — Pakistan's Trusted Tech Essentials",
  description: 'Shop genuine mobile accessories in Pakistan. Premium chargers, wireless earbuds, USB cables, and power banks. Cash on delivery nationwide. All products tested before dispatch. Fast 2-4 day shipping.',
  keywords: ['chargers Pakistan', 'earbuds Pakistan', 'cables COD', 'power banks Pakistan', 'mobile accessories', 'cash on delivery', 'Sultania Gadgets'],
  alternates: {
    canonical: 'https://sultaniagadgets.com',
  },
  openGraph: {
    title: "Sultania Gadgets — Pakistan's Trusted Tech Essentials",
    description: 'Shop genuine mobile accessories in Pakistan. Premium chargers, wireless earbuds, USB cables, and power banks. Cash on delivery nationwide.',
    url: 'https://sultaniagadgets.com',
    siteName: 'Sultania Gadgets',
    locale: 'en_PK',
    type: 'website',
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
};

export default async function HomePage() {
  // Single optimized batch — all queries in parallel
  // allProducts is fetched once and reused for both deals and category rows
  const [featured, newArrivals, categories, settings, faqs, testimonials, bundles, topRated, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getNewArrivals(),
    getCategories(),
    getSiteSettings(),
    getFaqItems().then(f => f.slice(0, 5)),
    getTestimonials().then(t => t.slice(0, 3)),
    getActiveBundles().then(b => b.slice(0, 3)),
    getTopRatedProducts().then(p => p.slice(0, 6)),
    getProducts({ sort: 'newest' }),
  ]);

  // Derive deals from allProducts — no second DB call
  const deals = allProducts
    .filter((p) => p.compare_at_price && p.compare_at_price > p.price)
    .sort((a, b) => {
      const pA = Math.round(((a.compare_at_price! - a.price) / a.compare_at_price!) * 100);
      const pB = Math.round(((b.compare_at_price! - b.price) / b.compare_at_price!) * 100);
      return pB - pA;
    })
    .slice(0, 8);

  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  // Find chargers and earbuds categories — check exact slugs first, then keywords
  const chargersCat = categories.find(c => c.slug === 'Chargers') ||
    categories.find(c => c.slug === 'chargers') ||
    categories.find(c => c.slug === 'wireless-chargers') ||
    categories.find(c => c.slug.toLowerCase().includes('charger') || c.name.toLowerCase().includes('charger'));

  const earbudsCat = categories.find(c => c.slug === 'wireless-earbuds') ||
    categories.find(c => c.slug === 'headphones') ||
    categories.find(c =>
      c.slug.toLowerCase().includes('earbud') || c.slug.toLowerCase().includes('headphone') ||
      c.name.toLowerCase().includes('earbud') || c.name.toLowerCase().includes('headphone')
    );

  // Derive category products from allProducts — matched by category id
  const chargerProducts = allProducts
    .filter(p => chargersCat && p.category?.id === chargersCat.id)
    .slice(0, 10);

  const earbudProducts = allProducts
    .filter(p => earbudsCat && p.category?.id === earbudsCat.id)
    .slice(0, 10);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="hero-bg text-white relative overflow-hidden">
        {/* 3D depth layers */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(220,38,38,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(153,27,27,0.15) 0%, transparent 40%)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05))' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#dc2626]/20 border border-[#dc2626]/40 rounded-full px-3 py-1.5 mb-5">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] pulse-red inline-block" />
              <span className="text-[10px] sm:text-xs font-bold text-[#fca5a5] uppercase tracking-widest">Trusted Tech · Pakistan</span>
            </div>
            <h1 className="display text-white hero-3d-text mb-4 sm:mb-6">
              {settings?.hero_headline || 'Gear That'}<br />
              <span className="text-gradient-red">{settings?.hero_subtext ? '' : 'Actually Works.'}</span>
            </h1>
            <p className="text-red-200/70 text-sm sm:text-lg leading-relaxed mb-7 sm:mb-10 max-w-md mx-auto px-2">
              {settings?.hero_subtext || 'Chargers, earbuds, cables — every product tested before dispatch. Cash on delivery. No fake specs.'}
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <Link href="/shop"
                className="btn-3d inline-flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors w-full sm:w-auto">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <a href={getWhatsAppUrl(wa, 'Assalamualaikum, I want to browse your products.')}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full hover:bg-white/10 hover:border-white/50 transition-all w-full sm:w-auto">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
            <p className="text-red-300/50 text-xs mt-5">✓ No advance payment &nbsp;·&nbsp; ✓ Pay on delivery &nbsp;·&nbsp; ✓ Easy exchange</p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex flex-nowrap justify-around sm:justify-center sm:gap-x-12 overflow-x-auto no-scrollbar">
            {[
              { n: '100%', l: 'Tested' },
              { n: 'COD',  l: 'Cash on Delivery' },
              { n: '2–4d', l: 'Delivery' },
              { n: '⭐',    l: 'Loyalty Points' },
              { n: '🔄',   l: 'Easy Exchange' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center shrink-0 px-1">
                <p className="text-white font-black text-xs sm:text-xl tracking-tight">{n}</p>
                <p className="text-red-300/50 font-semibold uppercase tracking-widest text-[8px] sm:text-[11px] mt-0.5 leading-tight">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ───────────────────────────────────── */}
      <section className="py-5 border-b border-[#e2e8f0]">
        <p className="text-center font-bold text-[#94a3b8] text-xs uppercase tracking-widest mb-3">Shop by Category</p>
        <CategoryCarousel categories={categories} />
      </section>

      {/* ── FEATURED ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <ProductCarousel title="Featured Products" subtitle="Handpicked" products={featured} viewAllHref="/shop" />
      </div>

      {/* ── NEW ARRIVALS ─────────────────────────────────────── */}
      {newArrivals.length > 0 && (
        <div className="max-w-7xl mx-auto">
          <ProductCarousel title="New Arrivals" subtitle="Just In" products={newArrivals} viewAllHref="/shop?sort=newest" />
        </div>
      )}

      {/* ── TOP RATED ────────────────────────────────────────── */}
      {topRated.length > 0 && (
        <div className="max-w-7xl mx-auto border-t border-gray-50">
          <ProductCarousel title="Top Rated" subtitle="Customer Favorites" products={topRated} viewAllHref="/shop" />
        </div>
      )}

      {/* ── DEALS & DISCOUNTS ────────────────────────────────── */}
      {deals.length > 0 && (
        <section className="px-3 sm:px-6 my-4 sm:my-6">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl sm:rounded-[28px] overflow-hidden relative">
          {/* Subtle fire dot pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,#dc2626 1px,transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-6 sm:pt-8 pb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">🔥</span>
                  <p className="label text-[#dc2626]">Limited Time</p>
                </div>
                <h2 className="heading-lg text-[#0f172a]">Deals &amp; Discounts</h2>
              </div>
              <Link href="/deals"
                className="flex items-center gap-1 text-xs font-bold text-[#94a3b8] hover:text-[#dc2626] transition-colors uppercase tracking-widest shrink-0">
                All Deals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pb-6 sm:pb-8">
              <ProductCarousel title="" products={deals} viewAllHref="/deals" />
            </div>
          </div>
          </div>
        </section>
      )}

      {/* ── CHARGERS ROW ─────────────────────────────────────── */}
      {chargerProducts.length > 0 && chargersCat && (
        <div className="max-w-7xl mx-auto border-t border-gray-50">
          <ProductCarousel
            title={chargersCat.name}
            subtitle={chargersCat.emoji ? `${chargersCat.emoji} Shop Now` : 'Shop Now'}
            products={chargerProducts}
            viewAllHref={`/category/${chargersCat.slug}`}
          />
        </div>
      )}

      {/* ── EARBUDS ROW ──────────────────────────────────────── */}
      {earbudProducts.length > 0 && earbudsCat && (
        <div className="max-w-7xl mx-auto border-t border-gray-50">
          <ProductCarousel
            title={earbudsCat.name}
            subtitle={earbudsCat.emoji ? `${earbudsCat.emoji} Shop Now` : 'Shop Now'}
            products={earbudProducts}
            viewAllHref={`/category/${earbudsCat.slug}`}
          />
        </div>
      )}

      {/* ── CATEGORY FEATURE BLOCKS ──────────────────────────── */}      {(chargersCat || earbudsCat) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[chargersCat, earbudsCat].filter(Boolean).map((cat) => (
              <Link key={cat!.slug} href={`/category/${cat!.slug}`}
                className="group relative bg-[#0a0a0f] rounded-[24px] p-8 overflow-hidden hover:bg-[#111] transition-colors border border-[#0a0a0f] hover:border-[#dc2626]">
                <div className="text-5xl mb-4" aria-hidden="true">{cat!.emoji || '📦'}</div>
                <h3 className="text-white font-bold text-xl tracking-tight mb-2">{cat!.name}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed mb-5">{cat!.description || `Shop all ${cat!.name} — genuine products, cash on delivery.`}</p>
                <span className="inline-flex items-center gap-2 text-[#dc2626] label group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── PRODUCT BUNDLES ──────────────────────────────────── */}
      {bundles.length > 0 && (
        <section className="px-3 sm:px-6 my-4 sm:my-6">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl sm:rounded-[28px] overflow-hidden relative">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">📦</span>
                  <p className="label text-[#dc2626]">Save More</p>
                </div>
                <h2 className="heading-lg text-[#0a0a0f]">Product Bundles</h2>
                <p className="text-[#64748b] text-sm mt-1">Get multiple products at discounted prices</p>
              </div>
              <Link href="/bundles"
                className="flex items-center gap-1 text-xs font-bold text-[#94a3b8] hover:text-[#dc2626] transition-colors uppercase tracking-widest shrink-0">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bundles.slice(0, 3).map((bundle: any) => {
                const items = bundle.bundle_items ?? [];
                const originalTotal = items.reduce((s: number, i: any) =>
                  s + (i.product?.price ?? 0) * i.quantity, 0);
                const discountedTotal = Math.round(originalTotal * (1 - bundle.discount_percent / 100));
                const savings = originalTotal - discountedTotal;

                return (
                  <Link key={bundle.id} href={`/bundles/${bundle.slug}`}
                    className="group bg-[#f8fafc] border border-[#e2e8f0] rounded-[20px] p-5 hover:border-[#dc2626] transition-all hover:shadow-md">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-[#0a0a0f] font-bold text-sm group-hover:text-[#dc2626] transition-colors line-clamp-2">
                        {bundle.title}
                      </h3>
                      {bundle.discount_percent > 0 && (
                        <span className="shrink-0 ml-2 bg-[#dc2626] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                          -{bundle.discount_percent}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-lg font-black text-[#0a0a0f]">{formatPrice(discountedTotal)}</span>
                      {savings > 0 && (
                        <span className="text-xs text-[#94a3b8] line-through">{formatPrice(originalTotal)}</span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748b]">{items.length} products • Save {formatPrice(savings)}</p>
                  </Link>
                );
              })}
            </div>
          </div>
          </div>
        </section>
      )}

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-16 px-4 sm:px-6 border-t border-[#e2e8f0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <p className="label text-[#dc2626] mb-2">Our Promise</p>
            <h2 className="heading-xl text-[#0a0a0f]">Why Sultania Gadgets?</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: ShieldCheck, t: 'Tested Before Dispatch', d: 'Every product checked before it leaves our hands.' },
              { icon: CheckCircle, t: 'Honest Specs',           d: 'No fake specs. What you see is what you get.' },
              { icon: CreditCard,  t: 'Cash on Delivery',       d: 'Pay when you receive. No advance payment.' },
              { icon: Truck,       t: 'Ships from Pakistan',    d: 'Fast delivery to all major cities in 2–4 days.' },
              { icon: RefreshCw,   t: 'Easy Exchange',          d: 'Defective item? We arrange a replacement.' },
              { icon: MessageCircle,t:'WhatsApp Support',       d: 'Fast, human support on WhatsApp. No bots.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 sm:p-6 hover:border-[#dc2626]/30 hover:shadow-md transition-all">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#0a0a0f] rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                </div>
                <p className="font-bold text-[#0a0a0f] text-xs sm:text-sm mb-1">{t}</p>
                <p className="text-[11px] sm:text-xs text-[#64748b] leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOYALTY PROGRAM ──────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a0a0f] rounded-2xl sm:rounded-[28px] p-6 sm:p-8 md:p-12 text-center text-white relative overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle,#dc2626 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 float" aria-hidden="true">⭐</div>
              <p className="label text-[#dc2626] mb-2 sm:mb-3">Rewards Program</p>
              <h2 className="heading-xl text-white mb-2 sm:mb-3">Earn Loyalty Points</h2>
              <p className="text-slate-400 text-sm mb-6 sm:mb-8 max-w-md mx-auto">
                Get 1 point for every Rs. 100 spent. Redeem for discounts on future orders.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3">
                <Link href="/account/loyalty"
                  className="btn-3d inline-flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full transition-colors w-full sm:w-auto">
                  <Star className="w-4 h-4" /> View My Points
                </Link>
                <Link href="/shop"
                  className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold text-sm uppercase tracking-widest px-7 py-3.5 rounded-full hover:border-white hover:bg-white/10 transition-colors w-full sm:w-auto">
                  Start Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-10 sm:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-10">
              <p className="label text-[#94a3b8] mb-2">Reviews</p>
              <h2 className="heading-xl">What Customers Say</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="bg-[#f8fafc] rounded-2xl p-5 border border-[#e2e8f0]">
                  <div className="flex gap-0.5 mb-3" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-[#64748b] leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs font-bold text-[#0f172a]">{t.customer_name}</p>
                  {t.location && <p className="text-xs text-[#94a3b8] mt-0.5">{t.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SOCIAL MEDIA ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-[#94a3b8] mb-2">Follow Us</p>
          <h2 className="heading-xl mb-3">Stay Connected</h2>
          <p className="text-[#64748b] text-sm mb-8 max-w-sm mx-auto">
            Follow us for new arrivals, deals, and tech tips.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {/* WhatsApp */}
            {(settings?.social_whatsapp || wa) && (
              <a href={settings?.social_whatsapp || `https://wa.me/${wa}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.977.994-3.634-.235-.374A9.818 9.818 0 1112 21.818z"/></svg>
                WhatsApp
              </a>
            )}
            {/* Facebook */}
            {settings?.social_facebook && (
              <a href={settings.social_facebook}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            )}
            {/* Instagram */}
            {settings?.social_instagram && (
              <a href={settings.social_instagram}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
                style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            )}
            {/* TikTok */}
            {settings?.social_tiktok && (
              <a href={settings.social_tiktok}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors border border-[#334155]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
                TikTok
              </a>
            )}
            {/* YouTube */}
            {settings?.social_youtube && (
              <a href={settings.social_youtube}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#FF0000] hover:bg-red-700 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
            )}
            {/* X / Twitter */}
            {settings?.social_twitter && (
              <a href={settings.social_twitter}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X / Twitter
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-white py-16 px-4 sm:px-6 border-t border-[#e2e8f0]">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="label text-[#94a3b8] mb-2">Help</p>
              <h2 className="heading-xl">Common Questions</h2>
            </div>
            <div className="bg-[#f8fafc] rounded-[20px] px-6 border border-[#e2e8f0]">
              <Accordion items={faqs.slice(0, 5)} />
            </div>
            <div className="text-center mt-6">
              <Link href="/faq" className="text-sm font-semibold text-[#94a3b8] hover:text-[#0a0a0f] transition-colors underline underline-offset-4">
                View all FAQs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16 px-4 sm:px-6 border-t border-[#e2e8f0]">
        <div className="max-w-xl mx-auto text-center">
          <p className="label text-[#dc2626] mb-2">Stay Updated</p>
          <h2 className="heading-xl text-[#0a0a0f] mb-3">Get Exclusive Deals</h2>
          <p className="text-[#64748b] text-sm mb-6 max-w-sm mx-auto">
            Subscribe for early access to new arrivals, flash sales, and special discounts. No spam, ever.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* ── WHATSAPP CTA ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a0a0f] rounded-[28px] px-8 py-14 text-center text-white relative overflow-hidden"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.15)' }}>
            <div className="absolute inset-0 opacity-[0.05]"
              style={{ backgroundImage: 'radial-gradient(circle,#dc2626 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <p className="label text-[#dc2626] mb-3">Get in Touch</p>
              <h2 className="heading-xl text-white mb-3">Need Help Choosing?</h2>
              <p className="text-slate-500 text-sm mb-8 max-w-xs mx-auto">Chat with us on WhatsApp — fast response, honest advice, no pressure.</p>
              <a href={getWhatsAppUrl(wa, 'Assalamualaikum, I need help choosing a product.')}
                target="_blank" rel="noopener noreferrer"
                className="btn-3d inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
