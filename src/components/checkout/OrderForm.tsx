'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, ShoppingBag, Shield, RotateCcw, Truck, Clock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';
import { CompareButton } from '@/components/compare/CompareButton';
import type { Product } from '@/types';

interface ProfileData {
  full_name: string;
  phone: string;
  city: string;
  address: string;
}

interface Props {
  productId: string;
  productTitle: string;
  price: number;
  whatsappNumber: string;
  maxQuantity?: number;
  profile?: ProfileData | null;
  productImage?: string;
  productSlug?: string;
  deliveryFee?: number;
  product?: Product;
}

// Random but stable viewer count for social proof
function useViewerCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(Math.floor(Math.random() * 18) + 7); // 7–24
  }, []);
  return count;
}

export function OrderForm({
  productId, productTitle, price, whatsappNumber,
  maxQuantity = 10, productImage = '/placeholder-product.jpg', productSlug = '',
  deliveryFee = 200, product,
}: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const viewers = useViewerCount();

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: productId, slug: productSlug, title: productTitle, price, image: productImage, maxQty: maxQuantity });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleOrderNow() {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: productId, slug: productSlug, title: productTitle, price, image: productImage, maxQty: maxQuantity });
    }
    router.push('/checkout');
  }

  const subtotal = price * quantity;
  const savings = (product?.compare_at_price && product.compare_at_price > price)
    ? (product.compare_at_price - price) * quantity
    : 0;

  return (
    <div className="space-y-4">

      {/* Live viewers */}
      {viewers > 0 && (
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          {viewers} people viewing this right now
        </div>
      )}

      {/* COD Guarantee */}
      <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
        <span className="text-2xl" aria-hidden="true">🛡️</span>
        <div>
          <p className="text-sm font-bold text-green-800">100% Safe — Cash on Delivery</p>
          <p className="text-xs text-green-700">Pay when you receive. No advance payment needed.</p>
        </div>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#64748b] uppercase tracking-wide">Qty</label>
          <div className="flex items-center border border-[#e2e8f0] rounded-2xl overflow-hidden touch-manipulation">
            <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-11 h-11 flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] transition-colors text-lg font-bold touch-manipulation"
              aria-label="Decrease quantity" style={{ touchAction: 'manipulation' }}>−</button>
            <span className="w-10 text-center text-sm font-black text-[#0a0a0f]">{quantity}</span>
            <button type="button" onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              className="w-11 h-11 flex items-center justify-center text-[#64748b] hover:bg-[#f8fafc] transition-colors text-lg font-bold touch-manipulation"
              aria-label="Increase quantity" style={{ touchAction: 'manipulation' }}>+</button>
          </div>
          <span className="text-sm text-[#94a3b8]">of {maxQuantity}</span>
        </div>
        {product && <CompareButton product={product} size="sm" />}
      </div>

      {/* Price summary */}
      <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-[#64748b]">
          <span>Subtotal ({quantity}×)</span><span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-[#64748b]">
          <span>Delivery</span><span>{formatPrice(deliveryFee)}</span>
        </div>
        {savings > 0 && (
          <div className="flex justify-between text-green-600 font-semibold">
            <span>You save</span><span>−{formatPrice(savings)}</span>
          </div>
        )}
        <div className="flex justify-between font-black text-[#0a0a0f] border-t border-[#e2e8f0] pt-2 mt-1 text-base">
          <span>Total</span><span>{formatPrice(subtotal + deliveryFee)}</span>
        </div>
        <p className="text-xs text-[#94a3b8] pt-0.5">💵 Pay cash when your order arrives</p>
      </div>

      {/* Primary CTA */}
      <button type="button" onClick={handleOrderNow}
        className="btn-3d w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-black label py-4 rounded-xl transition-colors flex items-center justify-center gap-2 touch-manipulation"
        style={{ touchAction: 'manipulation' }}>
        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
        Order Now — Cash on Delivery
      </button>
      <p className="text-center text-xs text-[#94a3b8] -mt-2">✓ No account needed &nbsp;·&nbsp; ✓ Pay on delivery &nbsp;·&nbsp; ✓ Free exchange</p>

      {/* Add to cart */}
      <button type="button" onClick={handleAddToCart}
        className={`w-full font-bold label py-4 rounded-xl transition-all border flex items-center justify-center gap-2 touch-manipulation ${
          added ? 'bg-green-600 text-white border-green-600' : 'bg-white text-[#0a0a0f] border-[#e2e8f0] hover:border-[#0a0a0f] hover:bg-[#f8fafc]'
        }`}
        style={{ touchAction: 'manipulation' }}>
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-[#e2e8f0]" />
        <span className="text-xs text-[#94a3b8]">or order via</span>
        <div className="flex-1 border-t border-[#e2e8f0]" />
      </div>

      {/* WhatsApp */}
      <a href={getWhatsAppUrl(whatsappNumber, getProductWhatsAppMessage(productTitle))}
        target="_blank" rel="noopener noreferrer"
        className="btn-3d flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold label py-4 rounded-xl transition-colors touch-manipulation"
        style={{ touchAction: 'manipulation' }}>
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        WhatsApp — Instant Reply
      </a>

      {/* Trust grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          { icon: Shield,    label: 'Genuine Product',   sub: 'Tested before dispatch' },
          { icon: Truck,     label: '2–4 Day Delivery',  sub: 'Ships from Pakistan' },
          { icon: RotateCcw, label: 'Easy Exchange',     sub: 'Defective? We fix it' },
          { icon: Clock,     label: 'Fast Confirmation', sub: 'We call within 2 hours' },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-start gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl p-3">
            <div className="w-7 h-7 bg-[#dc2626]/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-[#dc2626]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0a0a0f] leading-tight">{label}</p>
              <p className="text-[10px] text-[#94a3b8] leading-tight mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
