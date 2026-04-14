'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { items, count, total, removeItem, updateQty, clearCart, isOpen, closeCart } = useCart();
  const ref = useRef<HTMLDivElement>(null);
  const DELIVERY = 200;

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

  return (
    <>
      {/* Backdrop */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden="true" />

      {/* Drawer */}
      <div ref={ref} role="dialog" aria-label="Shopping cart" aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-[60] flex flex-col shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0a0a0a]" aria-hidden="true" />
            <span className="font-bold text-[#0a0a0a]">Cart</span>
            {count > 0 && (
              <span className="bg-[#e01e1e] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
          <button onClick={closeCart}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close cart">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-14 h-14 text-gray-200 mb-4" aria-hidden="true" />
              <p className="font-semibold text-gray-500">Your cart is empty</p>
              <p className="text-sm text-gray-400 mt-1 mb-6">Add some products to get started</p>
              <button onClick={closeCart}
                className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-colors">
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
                    className="text-sm font-semibold text-gray-900 hover:text-[#e01e1e] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </Link>
                  <p className="text-sm font-bold text-[#0a0a0a] mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      aria-label="Decrease quantity">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.maxQty}
                      className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-40"
                      aria-label="Increase quantity">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)}
                      className="ml-auto text-gray-300 hover:text-red-500 transition-colors"
                      aria-label="Remove item">
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
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery</span><span>Rs. {DELIVERY}</span></div>
              <div className="flex justify-between font-black text-[#0a0a0a] text-base border-t border-gray-100 pt-2 mt-1">
                <span>Total</span><span>{formatPrice(total + DELIVERY)}</span>
              </div>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="flex items-center justify-center w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-full transition-colors">
              Checkout — COD
            </Link>
            <button onClick={clearCart}
              className="w-full text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium py-1">
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
