'use client';

import { MessageCircle } from 'lucide-react';
import { formatPrice, getWhatsAppUrl, getProductWhatsAppMessage } from '@/lib/utils';

export function StickyOrderBar({ price, productTitle, whatsappNumber }: {
  price: number; productTitle: string; whatsappNumber: string;
}) {
  return (
    // Sits above the mobile tab bar (tab bar is ~64px tall)
    <div className="md:hidden fixed bottom-[64px] left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3 z-40 shadow-lg">
      <span className="font-black text-gray-950 text-sm shrink-0">{formatPrice(price)}</span>
      <button
        onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
        className="flex-1 bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-full transition-colors">
        Order Now
      </button>
      <a href={getWhatsAppUrl(whatsappNumber, getProductWhatsAppMessage(productTitle))}
        target="_blank" rel="noopener noreferrer"
        className="flex items-center justify-center w-11 h-11 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full transition-colors shrink-0"
        aria-label="Order via WhatsApp">
        <MessageCircle className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}
