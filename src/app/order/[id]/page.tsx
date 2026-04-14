import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, MessageCircle, Package, Truck, MapPin, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getSiteSettings } from '@/lib/queries';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = { title: 'Order Confirmed' };

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(product_title_snapshot, price_snapshot, quantity)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  const settings = await getSiteSettings();
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const orderId = order.id.slice(0, 8).toUpperCase();
  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">

      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" aria-hidden="true" />
        </div>
        <h1 className="font-black text-2xl text-gray-950 tracking-tight mb-1">Order Confirmed!</h1>
        <p className="text-gray-500 text-sm">
          Order <span className="font-mono font-bold text-gray-950">#{orderId}</span>
        </p>
        <p className="text-gray-400 text-xs mt-1">
          {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Order status tracker */}
      <div className="bg-[#f7f7f7] rounded-[20px] p-5 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Order Status</p>
        <div className="flex items-center gap-0">
          {STATUS_STEPS.map((step, i) => {
            const done = i <= currentStep;
            const active = i === currentStep;
            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    done ? 'bg-gray-950 text-white' : 'bg-gray-200 text-gray-400'
                  } ${active ? 'ring-2 ring-offset-2 ring-gray-950' : ''}`}>
                    {done && i < currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`text-[9px] font-semibold uppercase tracking-wide mt-1 capitalize ${done ? 'text-gray-950' : 'text-gray-400'}`}>
                    {step}
                  </p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < currentStep ? 'bg-gray-950' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Order items */}
      <div className="bg-[#f7f7f7] rounded-[20px] p-5 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Items Ordered</p>
        <div className="space-y-3">
          {order.order_items?.map((item: { product_title_snapshot: string; quantity: number; price_snapshot: number }, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
                  <Package className="w-4 h-4 text-gray-400" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.product_title_snapshot}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-950">{formatPrice(item.price_snapshot * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{formatPrice(order.delivery_fee)}</span></div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600 font-semibold">
              <span>Discount</span><span>−{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-gray-950 text-base border-t border-gray-200 pt-2 mt-1">
            <span>Total (COD)</span><span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery info */}
      <div className="bg-[#f7f7f7] rounded-[20px] p-5 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Delivery Details</p>
        <div className="space-y-2.5">
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Phone className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{order.customer_name} · {order.phone}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{order.address}, {order.city}</span>
          </div>
          <div className="flex items-start gap-3 text-sm text-gray-700">
            <Truck className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span>Estimated delivery: 2–4 business days · Cash on Delivery</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <a href={getWhatsAppUrl(wa, `Assalamualaikum, I placed an order #${orderId}. Please confirm.`)}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors">
          <MessageCircle className="w-4 h-4" /> Confirm via WhatsApp
        </a>
        <Link href="/shop"
          className="flex items-center justify-center w-full border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-gray-50 transition-colors">
          Continue Shopping
        </Link>
      </div>

      {/* Track order link */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Want to check your order later?{' '}
        <Link href="/track-order" className="text-gray-950 font-semibold underline underline-offset-4">
          Track your order
        </Link>
      </p>
    </div>
  );
}
