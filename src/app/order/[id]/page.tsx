import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, CheckCircle, Truck, Clock, XCircle, MapPin, Phone, User, MessageCircle, FileText } from 'lucide-react';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';
import { getSiteSettings } from '@/lib/queries';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string; description: string }> = {
  pending: {
    icon: Clock,
    color: 'text-orange-500 bg-orange-50 border-orange-200',
    label: 'Pending Confirmation',
    description: 'We received your order and will call you shortly to confirm.',
  },
  confirmed: {
    icon: CheckCircle,
    color: 'text-blue-500 bg-blue-50 border-blue-200',
    label: 'Confirmed',
    description: 'Your order is confirmed and being prepared for shipment.',
  },
  shipped: {
    icon: Truck,
    color: 'text-purple-500 bg-purple-50 border-purple-200',
    label: 'Shipped',
    description: 'Your order is on the way! Expect delivery within 2-4 business days.',
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-500 bg-green-50 border-green-200',
    label: 'Delivered',
    description: 'Your order has been delivered. Thank you for shopping with us!',
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-500 bg-red-50 border-red-200',
    label: 'Cancelled',
    description: 'This order has been cancelled.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order #${id.slice(0, 8).toUpperCase()}`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderDetailsPage({ params }: Props) {
  const { id } = await params;
  const admin = createAdminClient();

  // Fetch order with items
  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('*')
    .eq('id', id.toLowerCase())
    .single();

  if (orderError || !order) {
    console.error('Order fetch error:', orderError);
    notFound();
  }

  // Fetch order items with product details
  const { data: orderItems } = await admin
    .from('order_items')
    .select(`
      id,
      product_id,
      product_title_snapshot,
      price_snapshot,
      quantity,
      product:products (
        slug,
        product_images (image_url, alt_text)
      )
    `)
    .eq('order_id', order.id);

  // Attach items to order
  const orderWithItems = {
    ...order,
    order_items: orderItems || [],
  };

  const settings = await getSiteSettings();
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  const cfg = STATUS_CONFIG[orderWithItems.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const shortId = orderWithItems.id.slice(0, 8).toUpperCase();

  // Use stored delivery_fee if available, otherwise calculate
  const itemsTotal = orderWithItems.order_items?.reduce((sum: number, item: any) => sum + (item.price_snapshot * item.quantity), 0) || 0;
  const deliveryFee = orderWithItems.delivery_fee ?? (orderWithItems.total - itemsTotal);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-[#94a3b8] mb-2">
          <Link href="/" className="hover:text-[#0f172a] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#0f172a]">Order Details</span>
        </div>
        <h1 className="font-black text-2xl sm:text-3xl text-[#0f172a] tracking-tight">
          Order #{shortId}
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Placed on {new Date(orderWithItems.created_at).toLocaleDateString('en-PK', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className={`border-2 rounded-2xl p-6 ${cfg.color}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">{cfg.label}</h2>
                <p className="text-sm opacity-90">{cfg.description}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6">
            <h2 className="font-bold text-lg text-[#0f172a] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#94a3b8]" />
              Order Items
            </h2>
            <div className="space-y-4">
              {orderWithItems.order_items?.map((item: any) => {
                const imageUrl = item.product?.product_images?.[0]?.image_url || '/placeholder-product.jpg';
                const imageAlt = item.product?.product_images?.[0]?.alt_text || item.product_title_snapshot;
                
                return (
                  <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                    <div className="relative w-20 h-20 bg-[#f8fafc] rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {item.product?.slug ? (
                        <Link 
                          href={`/product/${item.product.slug}`}
                          className="font-semibold text-[#0f172a] hover:text-[#dc2626] transition-colors line-clamp-2">
                          {item.product_title_snapshot}
                        </Link>
                      ) : (
                        <p className="font-semibold text-[#0f172a] line-clamp-2">
                          {item.product_title_snapshot}
                        </p>
                      )}
                      <p className="text-sm text-[#94a3b8] mt-1">
                        Quantity: {item.quantity} × {formatPrice(item.price_snapshot)}
                      </p>
                    </div>
                    <p className="font-bold text-[#0f172a] shrink-0">
                      {formatPrice(item.price_snapshot * item.quantity)}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-[#e2e8f0] space-y-2">
              <div className="flex justify-between text-sm text-[#64748b]">
                <span>Subtotal</span>
                <span>{formatPrice(itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-[#64748b]">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              {orderWithItems.coupon_code && orderWithItems.discount_amount && (
                <div className="flex justify-between text-sm text-green-600 font-semibold">
                  <span>Discount ({orderWithItems.coupon_code})</span>
                  <span>−{formatPrice(orderWithItems.discount_amount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg text-[#0f172a] pt-2 border-t border-[#e2e8f0]">
                <span>Total</span>
                <span>{formatPrice(orderWithItems.total)}</span>
              </div>
              <p className="text-xs text-[#94a3b8] text-center pt-2">
                Payment Method: Cash on Delivery (COD)
              </p>
            </div>
          </div>

          {/* Order Notes */}
          {orderWithItems.notes && (
            <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-5">
              <h3 className="font-bold text-sm text-[#0f172a] mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#94a3b8]" />
                Order Notes
              </h3>
              <p className="text-sm text-[#64748b]">{orderWithItems.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Details */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <h2 className="font-bold text-base text-[#0f172a] mb-4">Customer Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-0.5">Name</p>
                  <p className="text-sm font-semibold text-[#0f172a]">{orderWithItems.customer_name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm font-semibold text-[#0f172a]">{orderWithItems.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#94a3b8] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-[#94a3b8] uppercase tracking-wider mb-0.5">Delivery Address</p>
                  <p className="text-sm font-semibold text-[#0f172a]">
                    {orderWithItems.address}
                    <br />
                    {orderWithItems.city}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <a
              href={getWhatsAppUrl(wa, `Assalamualaikum, I have a question about my order #${shortId}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-colors touch-manipulation"
              style={{ touchAction: 'manipulation' }}>
              <MessageCircle className="w-4 h-4" />
              Contact Support
            </a>
            <a
              href={`/api/invoice/${orderWithItems.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#f8fafc] border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9] font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-colors touch-manipulation"
              style={{ touchAction: 'manipulation' }}>
              📄 Download Invoice
            </a>
            <Link
              href="/shop"
              className="flex items-center justify-center w-full border border-[#e2e8f0] text-[#64748b] hover:bg-[#f8fafc] font-bold text-xs uppercase tracking-widest py-3.5 rounded-full transition-colors touch-manipulation"
              style={{ touchAction: 'manipulation' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
