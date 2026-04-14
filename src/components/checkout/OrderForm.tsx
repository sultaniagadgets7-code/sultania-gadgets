'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';

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
}

export function OrderForm({
  productId, productTitle, price, whatsappNumber,
  maxQuantity = 10, productImage = '/placeholder-product.jpg', productSlug = '',
}: Props) {
  const { addItem, openCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem({ id: productId, slug: productSlug, title: productTitle, price, image: productImage, maxQty: maxQuantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleOrderNow() {
    // Add to cart then go straight to checkout
    addItem({ id: productId, slug: productSlug, title: productTitle, price, image: productImage, maxQty: maxQuantity });
    router.push('/checkout');
  }

  const subtotal = price * quantity;

  return (
    <div className="space-y-4">
      <p className="label text-gray-400">Order — Cash on Delivery</p>

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Qty</label>
        <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg font-bold"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-bold text-gray-950">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-lg font-bold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <span className="text-sm text-gray-400">of {maxQuantity} available</span>
      </div>

      {/* Price summary */}
      <div className="bg-[#f7f7f7] rounded-2xl p-4 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Subtotal ({quantity}×)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-500">
          <span>Delivery</span>
          <span>Rs. 200</span>
        </div>
        <div className="flex justify-between font-black text-gray-950 border-t border-gray-200 pt-2 mt-1">
          <span>Total</span>
          <span>{formatPrice(subtotal + 200)}</span>
        </div>
        <p className="text-xs text-gray-400 pt-1">Payment: Cash on Delivery</p>
      </div>

      {/* Primary CTA — goes to checkout page */}
      <button
        type="button"
        onClick={handleOrderNow}
        className="w-full bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold label py-4 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        <ShoppingBag className="w-4 h-4" aria-hidden="true" />
        Place Order — COD
      </button>

      {/* Add to cart (secondary) */}
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full font-bold label py-4 rounded-full transition-all border flex items-center justify-center gap-2 ${
          added
            ? 'bg-green-600 text-white border-green-600'
            : 'bg-white text-gray-950 border-gray-200 hover:border-gray-950 hover:bg-gray-50'
        }`}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 border-t border-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 border-t border-gray-100" />
      </div>

      {/* WhatsApp */}
      <a
        href={getWhatsAppUrl(whatsappNumber, getProductWhatsAppMessage(productTitle))}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold label py-4 rounded-full transition-colors"
      >
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
        Order via WhatsApp
      </a>
    </div>
  );
}
