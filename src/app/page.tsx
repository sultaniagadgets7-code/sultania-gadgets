import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ShieldCheck, Truck, CreditCard, RefreshCw, CheckCircle, Star } from 'lucide-react';
import { getFeaturedProducts, getCategories, getFaqItems, getTestimonials, getSiteSettings, getProducts } from '@/lib/queries';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { CategoryCarousel } from '@/components/ui/CategoryCarousel';
import { Accordion } from '@/components/ui/Accordion';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Sultania Gadgets — Trusted Tech Accessories in Pakistan',
  description: 'Genuine chargers, earbuds, cables, power banks. Cash on delivery. Tested before dispatch.',
};

export default async function HomePage() {
  const [featured, categories, faqs, testimonials, settings, all] = await Promise.all([
    getFeaturedProducts(), getCategories(), getFaqItems(),
    getTestimonials(), getSiteSettings(), getProducts({ sort: 'newest' }),
  ]);
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const chargers = all.filter((p) => p.category?.slug === 'chargers');
  const earbuds  = all.filter((p) => p.category?.slug === 'earbuds');
  const deals    = all.filter((p) => p.compare_at_price && p.compare_at_price > p.price)
                      .sort((a, b) => {
                        const pA = Math.round(((a.compare_at_price! - a.price) / a.compare_at_price!) * 100);
                        const pB = Math.round(((b.compare_at_price! - b.price) / b.compare_at_price!) * 100);
                        return pB - pA;
                      })
                      .slice(0, 10);

  return (
    <div>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Subtle dot texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,#e01e1e 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-32 lg:py-40">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label text-gray-500 mb-6">Trusted Tech · Pakistan</p>
            <h1 className="display text-white mb-6">
              {settings?.hero_headline || 'Gear That'}<br />
              <em className="not-italic text-gray-400">{settings?.hero_subtext ? '' : 'Actually Works.'}</em>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md mx-auto">
              {settings?.hero_subtext || 'Chargers, earbuds, cables — every product tested before dispatch. Cash on delivery. No fake specs.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {/* Primary CTA — red, the one action we want */}
              <Link href="/shop"
                className="inline-flex items-center gap-2 bg-[#e01e1e] hover:bg-[#c01818] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              {/* Secondary — outlined, neutral */}
              <a href={getWhatsAppUrl(wa, 'Assalamualaikum, I want to browse your products.')}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full hover:border-white hover:text-white transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex flex-nowrap justify-center gap-x-6 sm:gap-x-8 overflow-x-auto no-scrollbar">
            {[
              { n: '100%', l: 'Tested Before Dispatch' },
              { n: 'COD',  l: 'Cash on Delivery' },
              { n: '2–4',  l: 'Day Delivery' },
              { n: '24/7', l: 'WhatsApp Support' },
            ].map(({ n, l }) => (
              <div key={l} className="text-center">
                <p className="text-white font-black text-sm sm:text-xl tracking-tight">{n}</p>
                <p className="text-gray-600 font-semibold uppercase tracking-widest text-[9px] sm:text-[11px] mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY PILLS ───────────────────────────────────── */}
      <section className="py-5 border-b border-gray-100">
        <p className="text-center font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Shop by Category</p>
        <CategoryCarousel categories={categories} />
      </section>

      {/* ── FEATURED ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <ProductCarousel title="Featured Products" subtitle="Handpicked" products={featured} viewAllHref="/shop" />
      </div>

      {/* ── NEW ARRIVALS ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto">
        <ProductCarousel title="New Arrivals" subtitle="Just In" products={all.slice(0, 10)} viewAllHref="/shop?sort=newest" />
      </div>

      {/* ── DEALS & DISCOUNTS ────────────────────────────────── */}
      {deals.length > 0 && (
        <section className="mx-4 sm:mx-6 my-6 bg-white border border-gray-100 rounded-[28px] overflow-hidden relative">
          {/* Subtle fire dot pattern */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,#e01e1e 1px,transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="relative max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-8 pb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl" aria-hidden="true">🔥</span>
                  <p className="label text-[#e01e1e]">Limited Time</p>
                </div>
                <h2 className="heading-lg text-[#0a0a0a]">Deals &amp; Discounts</h2>
              </div>
              <Link href="/deals"
                className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#e01e1e] transition-colors uppercase tracking-widest shrink-0">
                All Deals <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="pb-8">
              <ProductCarousel title="" products={deals} viewAllHref="/deals" />
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY FEATURE BLOCKS ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { slug: 'chargers', emoji: '⚡', title: 'Fast Chargers', desc: 'GaN technology, compact design, universal compatibility.' },
            { slug: 'earbuds',  emoji: '🎧', title: 'Premium Earbuds', desc: 'ANC, long battery, crystal-clear sound.' },
          ].map(({ slug, emoji, title, desc }) => (
            <Link key={slug} href={`/category/${slug}`}
              className="group relative bg-[#0a0a0a] rounded-[24px] p-8 overflow-hidden hover:bg-[#1a0000] transition-colors border border-gray-800 hover:border-[#e01e1e]">
              <div className="text-5xl mb-4" aria-hidden="true">{emoji}</div>
              <h3 className="text-white font-bold text-xl tracking-tight mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{desc}</p>
              <span className="inline-flex items-center gap-2 text-[#e01e1e] label group-hover:gap-3 transition-all">
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── CHARGERS CAROUSEL ────────────────────────────────── */}
      {chargers.length > 0 && (
        <div className="max-w-7xl mx-auto border-t border-gray-50">
          <ProductCarousel title="Chargers" subtitle="Fast & Reliable" products={chargers} viewAllHref="/category/chargers" />
        </div>
      )}

      {/* ── EARBUDS CAROUSEL ─────────────────────────────────── */}
      {earbuds.length > 0 && (
        <div className="max-w-7xl mx-auto border-t border-gray-50">
          <ProductCarousel title="Earbuds" subtitle="Premium Sound" products={earbuds} viewAllHref="/category/earbuds" />
        </div>
      )}

      {/* ── WHY US ───────────────────────────────────────────── */}
      <section className="bg-[#f7f7f7] py-16 px-4 sm:px-6 mt-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="label text-gray-400 mb-2">Our Promise</p>
            <h2 className="heading-xl">Why Sultania Gadgets?</h2>
          </div>
          {/* Mobile: horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 md:overflow-visible">
            {[
              { icon: ShieldCheck, t: 'Tested Before Dispatch', d: 'Every product checked and verified before it leaves our hands.' },
              { icon: CheckCircle, t: 'Honest Specs',           d: 'No fake specs. No misleading listings. What you see is what you get.' },
              { icon: CreditCard,  t: 'Cash on Delivery',       d: 'Pay when you receive. No advance payment, no risk.' },
              { icon: Truck,       t: 'Ships from Pakistan',    d: 'Fast delivery to all major cities in 2–4 business days.' },
              { icon: RefreshCw,   t: 'Easy Exchange',          d: 'Defective item? We arrange a replacement at no extra cost.' },
              { icon: MessageCircle,t:'WhatsApp Support',       d: 'Fast, human support on WhatsApp. No bots, no delays.' },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="shrink-0 w-60 md:w-auto bg-white rounded-[20px] p-6">
                <div className="w-10 h-10 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <p className="font-bold text-gray-950 text-sm mb-1.5">{t}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              <p className="label text-gray-400 mb-2">Reviews</p>
              <h2 className="heading-xl">What Customers Say</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 md:grid md:grid-cols-3 md:overflow-visible">
              {testimonials.map((t) => (
                <div key={t.id} className="shrink-0 w-72 md:w-auto bg-[#f7f7f7] rounded-[20px] p-6">
                  <div className="flex gap-0.5 mb-3" aria-label="5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gray-950 text-gray-950" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-xs font-bold text-gray-950">{t.customer_name}</p>
                  {t.location && <p className="text-xs text-gray-400 mt-0.5">{t.location}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SOCIAL MEDIA ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <p className="label text-gray-400 mb-2">Follow Us</p>
          <h2 className="heading-xl mb-3">Stay Connected</h2>
          <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
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
                className="flex items-center gap-3 bg-[#0a0a0a] hover:bg-gray-800 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors border border-gray-800">
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
                className="flex items-center gap-3 bg-[#0a0a0a] hover:bg-gray-800 text-white px-6 py-3.5 rounded-full font-bold text-sm transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X / Twitter
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      {faqs.length > 0 && (
        <section className="bg-[#f7f7f7] py-16 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="label text-gray-400 mb-2">Help</p>
              <h2 className="heading-xl">Common Questions</h2>
            </div>
            <div className="bg-white rounded-[20px] px-6">
              <Accordion items={faqs.slice(0, 5)} />
            </div>
            <div className="text-center mt-6">
              <Link href="/faq" className="text-sm font-semibold text-gray-400 hover:text-gray-950 transition-colors underline underline-offset-4">
                View all FAQs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── WHATSAPP CTA ─────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#0a0a0a] rounded-[28px] px-8 py-14 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(circle,#e01e1e 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
            <p className="label text-gray-500 mb-3">Get in Touch</p>
              <h2 className="heading-xl text-white mb-3">Need Help Choosing?</h2>
              <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">Chat with us on WhatsApp — fast response, honest advice, no pressure.</p>
              <a href={getWhatsAppUrl(wa, 'Assalamualaikum, I need help choosing a product.')}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm uppercase tracking-widest px-8 py-4 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
