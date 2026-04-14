import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, Truck, ShieldCheck, CheckCircle, RefreshCw, Package, ArrowRight } from 'lucide-react';
import { getProductBySlug, getRelatedProducts, getFaqItems, getSiteSettings, getWishlistIds, getProfileForCheckout, getReviewStats } from '@/lib/queries';
import { ProductImageGallery } from '@/components/products/ProductImageGallery';
import { ProductCarousel } from '@/components/products/ProductCarousel';
import { OrderForm } from '@/components/checkout/OrderForm';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WishlistButton } from '@/components/products/WishlistButton';
import { ShareButtons } from '@/components/products/ShareButtons';
import { ProductReviews } from '@/components/reviews/ProductReviews';
import { Badge } from '@/components/ui/Badge';
import { Accordion } from '@/components/ui/Accordion';
import { formatPrice, getDiscountPercent, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';
import { StarDisplay } from '@/components/reviews/StarRating';
import { StickyOrderBar } from './StickyOrderBar';
import { TrackProductView } from '@/components/products/TrackProductView';
import { RecentlyViewed } from '@/components/products/RecentlyViewed';
import { FrequentlyBoughtTogether } from '@/components/products/FrequentlyBoughtTogether';

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: 'Not Found' };
  return {
    title: p.title,
    description: p.short_description || p.description?.slice(0, 160) || '',
    openGraph: { title: p.title, description: p.short_description || '', images: p.product_images?.[0]?.image_url ? [p.product_images[0].image_url] : [] },
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
  const specs = product.specs_json as Record<string, string> | null;
  const box = product.whats_in_box?.split('\n').filter(Boolean) || [];
  const features = product.description?.split('\n').filter((l) => l.startsWith('-') || l.startsWith('•')).map((l) => l.replace(/^[-•]\s*/, '')) || [];

  return (
    <div className="pb-36 md:pb-0">

      {/* Track view */}
      <TrackProductView product={{
        id: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
        image: product.product_images?.[0]?.image_url || '',
      }} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-gray-950 transition-colors">Shop</Link>
          {product.category && (<><span>/</span>
            <Link href={`/category/${product.category.slug}`} className="hover:text-gray-950 transition-colors">{product.category.name}</Link></>)}
          <span>/</span>
          <span className="text-gray-600 clamp-1">{product.title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

          {/* Gallery */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductImageGallery images={product.product_images || []} title={product.title} />
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Category + badge */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category && <span className="label text-gray-400">{product.category.name}</span>}
              {product.badge && <Badge variant={product.badge.toLowerCase() === 'sale' ? 'sale' : 'new'}>{product.badge}</Badge>}
              {low && <Badge variant="low-stock">Only {product.stock_quantity} left</Badge>}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-950 leading-tight tracking-tight">{product.title}</h1>
              <div className="flex items-center gap-2 shrink-0">
                <ShareButtons title={product.title} url={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://sultaniagadgets.com'}/product/${product.slug}`} />
                <WishlistButton productId={product.id} initialWishlisted={isWishlisted} />
              </div>
            </div>

            {/* Star rating summary */}
            {reviewStats.total > 0 && (
              <a href="#reviews" className="flex items-center gap-2 w-fit group">
                <StarDisplay rating={reviewStats.average} size="sm" />
                <span className="text-sm text-gray-500 group-hover:text-gray-950 transition-colors">
                  {reviewStats.average} · {reviewStats.total} review{reviewStats.total !== 1 ? 's' : ''}
                </span>
              </a>
            )}

            {/* Short desc */}
            {product.short_description && <p className="text-gray-500 leading-relaxed">{product.short_description}</p>}

            {/* Price */}
            <div className="flex items-baseline gap-3 py-1">
              <span className="text-3xl font-black text-gray-950">{formatPrice(product.price)}</span>
              {hasDiscount && (<>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.compare_at_price!)}</span>
                <Badge variant="sale">Save {pct}%</Badge>
              </>)}
            </div>

            {/* Stock */}
            <div>
              {oos ? <span className="label text-red-500">Out of Stock</span>
                : low ? <span className="label text-amber-600">Low Stock</span>
                : <span className="label text-green-600">In Stock</span>}
            </div>

            {/* Compatibility */}
            {product.compatibility && (
              <div className="bg-[#f7f7f7] rounded-2xl p-4">
                <p className="label text-gray-400 mb-1.5">Compatible With</p>
                <p className="text-sm text-gray-700">{product.compatibility}</p>
              </div>
            )}

            <div className="border-t border-gray-100" />

            {/* Order form */}
            {!oos ? (
              <OrderForm
                productId={product.id}
                productTitle={product.title}
                price={product.price}
                whatsappNumber={wa}
                maxQuantity={Math.min(product.stock_quantity, 10)}
                profile={checkoutProfile}
                productImage={product.product_images?.[0]?.image_url || '/placeholder-product.jpg'}
                productSlug={product.slug}
              />
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 bg-[#f7f7f7] rounded-2xl p-4">
                  Currently out of stock. Contact us on WhatsApp to check availability.
                </p>
                <a href={getWhatsAppUrl(wa, `Assalamualaikum, is *${product.title}* available?`)}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold label py-4 rounded-full transition-colors">
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
              </div>
            )}

            {/* Add to Cart */}
            {!oos && (
              <AddToCartButton
                productId={product.id} slug={product.slug} title={product.title}
                price={product.price}
                image={product.product_images?.[0]?.image_url || '/placeholder-product.jpg'}
                maxQty={product.stock_quantity}
                size="lg" className="w-full justify-center"
              />
            )}

            {/* Trust pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: ShieldCheck, t: 'Tested before dispatch' },
                { icon: CheckCircle, t: `Condition: ${product.condition}` },
                { icon: Truck,       t: '2–4 day delivery' },
                { icon: RefreshCw,   t: 'Easy exchange' },
              ].map(({ icon: Icon, t }) => (
                <span key={t} className="inline-flex items-center gap-1.5 bg-[#f7f7f7] text-gray-600 text-xs font-semibold px-3 py-2 rounded-full">
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" /> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {features.length > 0 && (
              <section>
                <h2 className="heading-lg mb-5">Key Features</h2>
                <ul className="space-y-3">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-gray-950 shrink-0 mt-0.5" aria-hidden="true" /> {f}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.description && (
              <section>
                <h2 className="heading-lg mb-5">Description</h2>
                <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</div>
              </section>
            )}

            {specs && Object.keys(specs).length > 0 && (
              <section>
                <h2 className="heading-lg mb-5">Specifications</h2>
                <div className="rounded-[20px] overflow-hidden border border-gray-100">
                  {Object.entries(specs).map(([k, v], i) => (
                    <div key={k} className={`flex text-sm ${i % 2 === 0 ? 'bg-[#f7f7f7]' : 'bg-white'}`}>
                      <div className="w-1/3 px-5 py-3.5 font-semibold text-gray-500 border-r border-gray-100">{k}</div>
                      <div className="flex-1 px-5 py-3.5 text-gray-900">{v}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {box.length > 0 && (
              <section>
                <h2 className="heading-lg mb-5">What&apos;s in the Box</h2>
                <ul className="space-y-2.5">
                  {box.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <Package className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {faqs.length > 0 && (
              <section>
                <h2 className="heading-lg mb-5">Questions & Answers</h2>
                <div className="bg-[#f7f7f7] rounded-[20px] px-6">
                  <Accordion items={faqs} />
                </div>
              </section>
            )}

            {/* Reviews */}
            <ProductReviews productId={product.id} productSlug={product.slug} />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-[#f7f7f7] rounded-[20px] p-5 space-y-3">
              <p className="label text-gray-400">Delivery</p>
              {[
                { icon: Truck,     t: 'Estimated 2–4 business days' },
                { icon: Package,   t: 'Ships from Pakistan' },
                { icon: RefreshCw, t: 'Easy exchange on defects' },
              ].map(({ icon: Icon, t }) => (
                <div key={t} className="flex items-center gap-3 text-sm text-gray-600">
                  <Icon className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" /> {t}
                </div>
              ))}
            </div>
            <a href={getWhatsAppUrl(wa, getProductWhatsAppMessage(product.title))}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold label py-4 rounded-[20px] transition-colors">
              <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="border-t border-gray-100 max-w-7xl mx-auto">
          <ProductCarousel title="You May Also Like" products={related}
            viewAllHref={product.category ? `/category/${product.category.slug}` : '/shop'} />
        </div>
      )}

      {/* Frequently Bought Together */}
      <FrequentlyBoughtTogether productId={product.id} categoryId={product.category_id} />

      {/* Recently Viewed */}
      <RecentlyViewed currentProductId={product.id} />

      {!oos && <StickyOrderBar price={product.price} productTitle={product.title} whatsappNumber={wa} />}
    </div>
  );
}
