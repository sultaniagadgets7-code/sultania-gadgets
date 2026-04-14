'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, AlertCircle, MessageCircle, ShoppingBag, Tag, X } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice, getWhatsAppUrl } from '@/lib/utils';
import { validateCoupon, createOrderWithCoupon } from '@/lib/actions';

interface Props {
  whatsappNumber: string;
  profile?: { full_name: string; phone: string; city: string; address: string } | null;
  deliveryFee?: number;
}

type State = 'idle' | 'loading' | 'success' | 'error';

export function CartCheckout({ whatsappNumber, profile, deliveryFee = 200 }: Props) {
  const { items, total, clearCart } = useCart();
  const lock = useRef(false);
  const [state, setState] = useState<State>('idle');
  const [errMsg, setErrMsg] = useState('');
  const [orderId, setOrderId] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  const hasProfile = !!(profile?.full_name && profile?.phone && profile?.city && profile?.address);

  const [form, setForm] = useState({
    customer_name: profile?.full_name || '',
    phone: profile?.phone || '',
    city: profile?.city || '',
    address: profile?.address || '',
    notes: '',
  });
  const [errs, setErrs] = useState<Partial<typeof form>>({});

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<{ code: string; discount: number; label: string } | null>(null);
  const [couponError, setCouponError] = useState('');

  const discount = couponResult?.discount ?? 0;
  const grandTotal = Math.max(0, total + deliveryFee - discount);

  async function applyCoupon() {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const result = await validateCoupon(couponInput, total);
    if (result.valid) {
      setCouponResult({ code: result.code!, discount: result.discount!, label: result.label! });
    } else {
      setCouponError(result.error || 'Invalid coupon.');
    }
    setCouponLoading(false);
  }

  function removeCoupon() {
    setCouponResult(null);
    setCouponInput('');
    setCouponError('');
  }

  function validate() {
    const e: Partial<typeof form> = {};
    if (!form.customer_name.trim()) e.customer_name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    else if (!/^(\+92|0)?[0-9]{10,11}$/.test(form.phone.replace(/\s/g, ''))) e.phone = 'Invalid Pakistani number';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    setErrs(e);
    return !Object.keys(e).length;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (lock.current || !validate() || !items.length) return;
    lock.current = true;
    setState('loading');

    const result = await createOrderWithCoupon(
      items.map((item) => ({ productId: item.id, title: item.title, price: item.price, quantity: item.quantity })),
      form,
      couponResult?.code
    );

    if (result.success) {
      clearCart();
      setOrderId(result.orderId!);
      setFinalTotal(result.total!);
      setState('success');
    } else {
      setState('error');
      setErrMsg(result.error || 'Failed to place order.');
      lock.current = false;
    }
  }

  const inp = (err?: string) =>
    `w-full bg-[#f7f7f7] border-0 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-950 transition ${err ? 'ring-2 ring-red-300' : ''}`;

  // ── Empty cart ───────────────────────────────────────────────
  if (!items.length && state !== 'success') return (
    <div className="max-w-lg mx-auto px-5 py-24 text-center">
      <ShoppingBag className="w-14 h-14 text-gray-200 mx-auto mb-4" />
      <h1 className="font-bold text-xl text-gray-950 mb-2">Your cart is empty</h1>
      <p className="text-gray-400 text-sm mb-6">Add some products before checking out.</p>
      <Link href="/shop" className="inline-flex items-center bg-[#0a0a0a] text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full hover:bg-gray-800 transition-colors">
        Browse Products
      </Link>
    </div>
  );

  // ── Success ──────────────────────────────────────────────────
  if (state === 'success') return (
    <div className="max-w-lg mx-auto px-5 py-16 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="font-black text-2xl text-gray-950 mb-2">Order Placed!</h1>
      <p className="text-gray-500 text-sm mb-1">
        Order ID: <span className="font-mono font-bold text-gray-950">{orderId.slice(0, 8).toUpperCase()}</span>
      </p>
      <p className="text-gray-500 text-sm mb-1">
        Total: <span className="font-bold text-gray-950">{formatPrice(finalTotal)}</span>
      </p>
      <p className="text-gray-400 text-sm mb-6">We&apos;ll call to confirm. Payment is Cash on Delivery.</p>
      <div className="flex flex-col gap-3">
        <a href={getWhatsAppUrl(whatsappNumber, `Assalamualaikum, I placed an order. ID: ${orderId.slice(0, 8).toUpperCase()}`)}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full transition-colors">
          <MessageCircle className="w-4 h-4" /> Confirm via WhatsApp
        </a>
        <Link href={`/order/${orderId}`}
          className="inline-flex items-center justify-center w-full border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest py-4 rounded-full hover:bg-gray-50 transition-colors">
          View Order Details
        </Link>
        <Link href="/shop" className="text-sm text-gray-400 hover:text-gray-950 transition-colors underline underline-offset-4">
          Continue Shopping
        </Link>
      </div>
    </div>
  );

  // ── Checkout form ────────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10">
      <h1 className="font-black text-2xl text-gray-950 mb-8 tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Delivery Details</p>

          {state === 'error' && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-2xl p-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" /> {errMsg}
            </div>
          )}

          {hasProfile && (
            <div className="bg-[#f7f7f7] rounded-2xl p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-950 uppercase tracking-widest">Delivering to</span>
                <button type="button" onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-gray-400 hover:text-gray-950 transition-colors">
                  Edit {showDetails ? '↑' : '↓'}
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900">{form.customer_name}</p>
              <p className="text-sm text-gray-500">{form.phone}</p>
              <p className="text-sm text-gray-500">{form.address}, {form.city}</p>
            </div>
          )}

          {(!hasProfile || showDetails) && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                    placeholder="Full Name *" className={inp(errs.customer_name)} autoComplete="name" />
                  {errs.customer_name && <p className="text-xs text-red-500 mt-1 px-1">{errs.customer_name}</p>}
                </div>
                <div>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone *" className={inp(errs.phone)} autoComplete="tel" />
                  {errs.phone && <p className="text-xs text-red-500 mt-1 px-1">{errs.phone}</p>}
                </div>
              </div>
              <div>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City *" className={inp(errs.city)} autoComplete="address-level2" />
                {errs.city && <p className="text-xs text-red-500 mt-1 px-1">{errs.city}</p>}
              </div>
              <div>
                <textarea rows={2} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Full Address *" className={`${inp(errs.address)} resize-none`} autoComplete="street-address" />
                {errs.address && <p className="text-xs text-red-500 mt-1 px-1">{errs.address}</p>}
              </div>
            </div>
          )}

          <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Order notes (optional)" className={`${inp()} resize-none`} />

          {/* Coupon code */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Coupon Code</p>
            {couponResult ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 text-green-700">
                  <Tag className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-bold">{couponResult.code}</span>
                  <span className="text-sm">— {couponResult.label}</span>
                </div>
                <button type="button" onClick={removeCoupon} className="text-green-500 hover:text-green-700" aria-label="Remove coupon">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                  placeholder="Enter coupon code" className={`${inp(couponError ? 'err' : '')} flex-1`} />
                <button type="button" onClick={applyCoupon} disabled={couponLoading || !couponInput.trim()}
                  className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-5 rounded-2xl transition-colors disabled:opacity-40 shrink-0">
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-500 mt-1 px-1">{couponError}</p>}
          </div>

          <button type="submit" disabled={state === 'loading'}
            className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {state === 'loading' && <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {state === 'loading' ? 'Placing Order...' : 'Place Order — Cash on Delivery'}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
          <div className="bg-[#f7f7f7] rounded-[20px] p-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-white rounded-xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-1.5" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.title}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-gray-950 shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}

            <div className="border-t border-gray-200 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount ({couponResult?.code})</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-gray-950 text-base border-t border-gray-200 pt-2 mt-1">
                <span>Total</span><span>{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
