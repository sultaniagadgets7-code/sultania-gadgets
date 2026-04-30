'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2, Tag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export function CartDrawer({ deliveryFee = 200 }: { deliveryFee?: number }) {
  const { items, count, total, removeItem, updateQty, clearCart, isOpen, closeCart } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) closeCart();
    }
    if (isOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeCart]);

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: total }),
      });
      const data = await res.json();

      if (data.valid) {
        setCouponDiscount(data.discount);
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setCouponDiscount(0);
      }
    } catch (err) {
      setCouponError('Failed to apply coupon');
      setCouponDiscount(0);
    }
    setApplyingCoupon(false);
  }

  function removeCoupon() {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponError('');
  }

  const finalTotal = total + deliveryFee - couponDiscount;

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true" />

      {/* Drawer */}
      <div ref={ref} role="dialog" aria-label="Shopping cart" aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full sm:max-w-sm bg-white z-[60] flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0f172a]" aria-hidden="true" />
            <span className="font-bold text-[#0f172a]">Cart</span>
            {count > 0 && (
              <span className="bg-[#dc2626] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart}
            className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-[#f8fafc] transition-colors touch-manipulation"
            aria-label="Close cart"
            style={{ touchAction: 'manipulation' }}>
            <X className="w-5 h-5 text-[#64748b]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-14 h-14 text-[#e2e8f0] mb-4" aria-hidden="true" />
              <p className="font-semibold text-[#64748b]">Your cart is empty</p>
              <p className="text-sm text-[#94a3b8] mt-1 mb-6">Add some products to get started</p>
              <button onClick={closeCart}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors touch-manipulation"
                style={{ touchAction: 'manipulation' }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <Link href={`/product/${item.slug}`} onClick={closeCart}
                  className="relative w-20 h-20 bg-[#f7f7f7] rounded-2xl overflow-hidden shrink-0">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-2" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/product/${item.slug}`} onClick={closeCart}
                    className="text-sm font-semibold text-gray-900 hover:text-[#dc2626] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </Link>
                  <p className="text-sm font-bold text-[#0f172a] mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-[#e2e8f0] transition-colors touch-manipulation"
                      aria-label="Decrease quantity"
                      style={{ touchAction: 'manipulation' }}>
                      <Minus className="w-3 h-3 text-[#64748b]" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQty}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-[#f8fafc] hover:bg-[#e2e8f0] transition-colors disabled:opacity-40 touch-manipulation"
                      aria-label="Increase quantity"
                      style={{ touchAction: 'manipulation' }}>
                      <Plus className="w-3 h-3 text-[#64748b]" />
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="ml-auto text-[#94a3b8] hover:text-red-500 transition-colors touch-manipulation"
                      aria-label="Remove item"
                      style={{ touchAction: 'manipulation' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-4">
            {/* Coupon input */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Have a coupon?</span>
              </div>
              {couponDiscount > 0 ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 uppercase">{couponCode}</span>
                    <span className="text-xs text-green-600">−{formatPrice(couponDiscount)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-green-600 hover:text-green-800 touch-manipulation" style={{ touchAction: 'manipulation' }}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 text-sm px-3 py-2 border border-[#e2e8f0] rounded-xl focus:outline-none focus:border-[#dc2626]"
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={applyingCoupon || !couponCode.trim()}
                      className="bg-[#0f172a] text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#1e293b] transition-colors disabled:opacity-40 touch-manipulation"
                      style={{ touchAction: 'manipulation' }}>
                      {applyingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Coupon Discount</span><span>−{formatPrice(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-[#0f172a] text-base border-t border-[#e2e8f0] pt-2 mt-1">
                <span>Total</span><span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
            {user ? (
              <Link href="/checkout" onClick={closeCart}
                className="flex items-center justify-center w-full bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors">
                Checkout — COD
              </Link>
            ) : (
              <div className="space-y-2">
                <div className="bg-[#fff3cd] border border-[#ffc107] rounded-2xl p-3 text-center">
                  <p className="text-xs font-semibold text-[#856404]">Please login to checkout</p>
                </div>
                <Link
                  href="/auth/login?next=/checkout"
                  onClick={closeCart}
                  className="flex items-center justify-center w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors">
                  Login to Continue
                </Link>
              </div>
            )}
            <button onClick={clearCart}
              className="w-full text-xs text-[#94a3b8] hover:text-[#64748b] transition-colors font-medium py-1 touch-manipulation"
              style={{ touchAction: 'manipulation' }}>
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
