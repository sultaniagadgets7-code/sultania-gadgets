import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Truck, CheckCircle, RefreshCw, Package } from 'lucide-react';
import { getProductBySlug, getRelatedProducts, getFaqItems, getSiteSettings, getWishlistIds, getProfileForCheckout, getReviewStats } from '@/lib/queries';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { OrderForm } from '@/components/checkout/OrderForm';
import { WishlistButton } from '@/components/products/WishlistButton';
import { ShareButtons } from '@/components/products/ShareButtons';
import { VariationsPopup } from '@/components/products/VariationsPopup';
import { ProductReviews } from '@/components/reviews/ProductReviews';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { ProductPageClient } from '@/components/ui/ProductPageClient';
import { formatPrice, getDiscountPercent, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';
import { StarDisplay } from '@/components/reviews/StarRating';
import { TrackProductView } from '@/components/products/TrackProductView';
import { RecentlyViewed } from '@/components/products/RecentlyViewed';
import { FrequentlyBoughtTogether } from '@/components/products/FrequentlyBoughtTogether';

import { NotifyBackInStock } from '@/components/ui/NotifyBackInStock';

// Enable ISR - revalidate every 10 minutes
export const revalidate = 600;

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: 'Not Found' };
  const siteUrl = 'https://sultaniagadgets.com';
  const price = `Rs. ${p.price.toLocaleString()}`;
  const image = p.product_images?.[0]?.image_url;
  const desc = p.short_description
    ? `${p.short_description} Price: ${price}. COD available across Pakistan.`
    : `Buy ${p.title} in Pakistan at ${price}. Cash on delivery. Tested before dispatch. Fast 2-4 day delivery.`;
  const descShort = desc.slice(0, 160);
  return {
    title: `${p.title} — ${price} | Buy in Pakistan`,
    description: descShort,
    keywords: [p.title, `${p.title} pakistan`, `${p.title} price pakistan`, `buy ${p.title} online`, `${p.title} cod`, 'cash on delivery pakistan'],
    openGraph: {
      title: `${p.title} — ${price} | Sultania Gadgets`,
      description: descShort,
      url: `${siteUrl}/product/${slug}`,
      images: image ? [{ url: image, alt: p.title, width: 800, height: 800 }] : [],
      type: 'website',
      siteName: 'Sultania Gadgets',
    },
    twitter: { card: 'summary_large_image', title: `${p.title} — ${price}`, description: descShort, images: image ? [image] : [] },
    alternates: { canonical: `${siteUrl}/product/${slug}` },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([getProductBySlug(slug), getSiteSettings()]);
  if (!product) notFound();

  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const [related, faqs, wishlistIds, checkoutProfile, reviewStats] = await Promise.all([
    product.category_id ? getRelatedProducts(product.category_id, product.id) : Promise.resolve([]),
    getFaqItems(product.id),
    getWishlistIds(),
    getProfileForCheckout(),
    getReviewStats(product.id),
  ]);
  const isWishlisted = wishlistIds.includes(product.id);

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const pct = hasDiscount ? getDiscountPercent(product.price, product.compare_at_price!) : 0;
  const oos = product.stock_quantity === 0;
  const low = !oos && product.stock_quantity <= 3;
  const specs = product.specs_json as Record<string, unknown> | null;
  const variations = (specs?._variations as { name: string; options: string }[]) || [];
  // Build display specs (exclude internal _variations key)
  const displaySpecs = specs ? Object.fromEntries(Object.entries(specs).filter(([k]) => k !== '_variations')) as Record<string, string> : null;
  const box = product.whats_in_box?.split('\n').filter(Boolean) || [];
  const features = product.description?.split('\n').filter((l) => l.startsWith('-') || l.startsWith('•')).map((l) => l.replace(/^[-•]\s*/, '')) || [];

  return (
    <div className="pb-0 bg-white">

      {/* Client-side conversion components */}
      <ProductPageClient
        productTitle={product.title}
        price={product.price}
        isOutOfStock={oos}
        whatsappNumber={wa}
      />

      {/* JSON-LD structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product',
          name: product.title,
          description: product.short_description || product.description?.slice(0, 200) || '',
          image: product.product_images?.map((img) => img.image_url) || [],
          sku: product.sku || product.id,
          brand: { '@type': 'Brand', name: 'Sultania Gadgets' },
          offers: {
            '@type': 'Offer',
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://sultaniagadgets.com'}/product/${product.slug}`,
            priceCurrency: 'PKR', price: product.price,
            availability: product.stock_quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            itemCondition: product.condition === 'New' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
            seller: { '@type': 'Organization', name: 'Sultania Gadgets' },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: { '@type': 'MonetaryAmount', value: '200', currency: 'PKR' },
              deliveryTime: { '@type': 'ShippingDeliveryTime', handlingTime: { '@type': 'QuantitativeValue', minValue: 0, maxValue: 1, unitCode: 'DAY' }, transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 4, unitCode: 'DAY' } },
              shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'PK' },
            },
            hasMerchantReturnPolicy: { '@type': 'MerchantReturnPolicy', applicableCountry: 'PK', returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow', merchantReturnDays: 3, returnMethod: 'https://schema.org/ReturnByMail' },
          },
          ...(reviewStats.total > 0 && { aggregateRating: { '@type': 'AggregateRating', ratingValue: reviewStats.average, reviewCount: reviewStats.total, bestRating: 5, worstRating: 1 } }),
        })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sultaniagadgets.com' },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://sultaniagadgets.com/shop' },
            ...(product.category ? [{ '@type': 'ListItem', position: 3, name: product.category.name, item: `https://sultaniagadgets.com/category/${product.category.slug}` }] : []),
            { '@type': 'ListItem', position: product.category ? 4 : 3, name: product.title, item: `https://sultaniagadgets.com/product/${product.slug}` },
          ],
        })}} />

      <TrackProductView product={{ id: product.id, slug: product.slug, title: product.title, price: product.price, image: product.product_images?.[0]?.image_url || '' }} />

      {/* Breadcrumb */}
      <div className="border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-[#94a3b8]" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#0a0a0f] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#0a0a0f] transition-colors">Shop</Link>
            {product.category && (<><span>/</span>
              <Link href={`/category/${product.category.slug}`} className="hover:text-[#0a0a0f] transition-colors">{product.category.name}</Link></>)}
            <span>/</span>
            <span className="text-[#64748b] clamp-1">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* Main product section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 xl:gap-16">

          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery images={product.product_images || []} title={product.title} />
          </div>

          {/* Info panel */}
          <div className="space-y-5">

            {/* Category + badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && (
                <Link href={`/category/${product.category.slug}`}
                  className="label text-[#dc2626] bg-[#dc2626]/8 px-3 py-1 rounded-full hover:bg-[#dc2626]/15 transition-colors">
                  {product.category.name}
                </Link>
              )}
              {product.badge && <Badge variant={product.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}>{product.badge}</Badge>}
              {low && <Badge variant="low-stock">Only {product.stock_quantity} left</Badge>}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0a0a0f] leading-tight tracking-tight">{product.title}</h1>
              <div className="flex items-center gap-2 mt-3">
                <ShareButtons title={product.title} url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://sultaniagadgets.com'}/product/${product.slug}`} />
                <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
              </div>
              {product.price >= 100 && (
                <div className="mt-3 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                  <span className="text-xs font-bold text-amber-700">⭐ Earn {Math.floor(product.price / 100)} loyalty points</span>
                </div>
              )}
            </div>

            {/* Star rating */}
            {reviewStats.total > 0 && (
              <a href="#reviews" className="flex items-center gap-2 w-fit group">
                <StarDisplay rating={reviewStats.average} size="sm" />
                <span className="text-sm text-[#64748b] group-hover:text-[#0a0a0f] transition-colors">
                  {reviewStats.average} · {reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''}
                </span>
              </a>
            )}

            {/* Short desc */}
            {product.short_description && (
              <p className="text-[#64748b] leading-relaxed border-l-4 border-[#dc2626] pl-4 bg-[#fef2f2]/50 py-2 rounded-r-xl">
                {product.short_description}
              </p>
            )}

            {/* Variations */}
            {variations.length > 0 && (
              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e2e8f0]">
                <p className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] mb-3">Options</p>
                <VariationsPopup variations={variations} />
              </div>
            )}

            {/* Price block */}
            <div className="bg-[#f8fafc] rounded-2xl p-5 border border-[#e2e8f0]"
              style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-4xl font-black text-[#0a0a0f]">{formatPrice(product.price)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-[#94a3b8] line-through">{formatPrice(product.compare_at_price!)}</span>
                    <Badge variant="sale">Save {pct}%</Badge>
                  </>
                )}
              </div>
              {hasDiscount && (
                <p className="text-sm font-bold text-green-600 mb-2">
                  You save {formatPrice(product.compare_at_price! - product.price)} on this order
                </p>
              )}
              {hasDiscount && <CountdownTimer label="Offer ends in" hours={24} />}
              <div className="mt-3">
                {oos
                  ? <span className="inline-flex items-center gap-1.5 label text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">● Out of Stock</span>
                  : low
                  ? <span className="inline-flex items-center gap-1.5 label text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">● Only {product.stock_quantity} left</span>
                  : <span className="inline-flex items-center gap-1.5 label text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">● In Stock</span>
                }
              </div>
            </div>

            {/* Compatibility */}
            {product.compatibility && (
              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-[#e2e8f0]">
                <p className="label text-[#94a3b8] mb-1.5">Compatible With</p>
                <p className="text-sm font-semibold text-[#0a0a0f]">{product.compatibility}</p>
              </div>
            )}

            <div className="border-t border-[#e2e8f0]" />

            {/* Order form */}
            {!oos ? (
              <div id="order-form">
                <OrderForm
                  productId={product.id}
                  productTitle={product.title}
                  price={product.price}
                  whatsappNumber={wa}
                  maxQuantity={Math.min(product.stock_quantity, 10)}
                  profile={checkoutProfile}
                  productImage={product.product_images?.[0]?.image_url || '/placeholder-product.jpg'}
                  productSlug={product.slug}
                  deliveryFee={settings?.delivery_fee ?? 200}
                  product={product}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-[#64748b] bg-[#f8fafc] rounded-2xl p-4 border border-[#e2e8f0]">
                  Currently out of stock. Contact us on WhatsApp to check availability.
                </p>
                <NotifyBackInStock productId={product.id} productTitle={product.title} />
                <a href={getWhatsAppUrl(wa, `Assalamualaikum, is *${product.title}* available?`)}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-3d flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold label py-4 rounded-full transition-colors">
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details section */}
      <div className="bg-white border-t border-[#e2e8f0] mt-4">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">

              {features.length > 0 && (
                <section>
                  <h2 className="heading-lg text-[#0a0a0f] mb-6">Key Features</h2>
                  <ul className="space-y-3">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#64748b]">
                        <CheckCircle className="w-4 h-4 text-[#dc2626] shrink-0 mt-0.5" aria-hidden="true" /> {f}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {product.description && (
                <section>
                  <h2 className="heading-lg text-[#0a0a0f] mb-5">Description</h2>
                  <div className="text-sm text-[#64748b] leading-relaxed whitespace-pre-line">{product.description}</div>
                </section>
              )}

              {displaySpecs && Object.keys(displaySpecs).length > 0 && (
                <section>
                  <h2 className="heading-lg text-[#0a0a0f] mb-5">Specifications</h2>
                  <div className="rounded-[20px] overflow-hidden border border-[#e2e8f0]">
                    {Object.entries(displaySpecs).map(([k, v], i) => (
                      <div key={k} className={`flex text-sm ${i % 2 === 0 ? 'bg-[#f8fafc]' : 'bg-white'}`}>
                        <div className="w-1/3 px-5 py-3.5 font-semibold text-[#64748b] border-r border-[#e2e8f0]">{k}</div>
                        <div className="flex-1 px-5 py-3.5 text-[#0a0a0f] font-medium">{String(v)}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {box.length > 0 && (
                <section>
                  <h2 className="heading-lg text-[#0a0a0f] mb-5">What&apos;s in the Box</h2>
                  <ul className="space-y-2.5">
                    {box.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-[#64748b]">
                        <Package className="w-4 h-4 text-[#dc2626] shrink-0" aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {faqs.length > 0 && (
                <section>
                  <h2 className="heading-lg text-[#0a0a0f] mb-5">Questions & Answers</h2>
                  <div className="bg-[#f8fafc] rounded-[20px] px-6 border border-[#e2e8f0]">
                    <Accordion items={faqs} />
                  </div>
                </section>
              )}

              <div id="reviews">
                <ProductReviews productId={product.id} productSlug={product.slug} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="bg-[#f8fafc] rounded-[20px] p-5 space-y-4 border border-[#e2e8f0]">
                <p className="label text-[#dc2626]">Delivery Info</p>
                {[
                  { icon: Truck,     t: 'Estimated 2–4 business days' },
                  { icon: Package,   t: 'Ships from Pakistan' },
                  { icon: RefreshCw, t: 'Easy exchange on defects' },
                ].map(({ icon: Icon, t }) => (
                  <div key={t} className="flex items-center gap-3 text-sm text-[#64748b]">
                    <div className="w-8 h-8 bg-[#dc2626]/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-[#dc2626]" aria-hidden="true" />
                    </div>
                    {t}
                  </div>
                ))}
              </div>
              <a href={getWhatsAppUrl(wa, getProductWhatsAppMessage(product.title))}
                target="_blank" rel="noopener noreferrer"
                className="btn-3d flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold label py-4 rounded-[20px] transition-colors">
                <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Related — white background */}
      {related.length > 0 && (
        <div className="bg-white border-t border-[#e2e8f0] max-w-7xl mx-auto">
          <ProductCarousel title="You May Also Like" products={related}
            viewAllHref={product.category ? `/category/${product.category.slug}` : '/shop'} />
        </div>
      )}

      <FrequentlyBoughtTogether productId={product.id} categoryId={product.category_id} />
      <RecentlyViewed currentProductId={product.id} />
    </div>
  );
}
