'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, MessageCircle, CheckCircle } from 'lucide-react';
import { abandonedCartMessage } from '@/lib/whatsapp';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface AbandonedCart {
  id: string;
  session_id: string;
  phone: string | null;
  items: CartItem[];
  total: number;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sultaniagadgets.com';

export function AbandonedCartsClient({ carts }: { carts: AbandonedCart[] }) {
  const router = useRouter();
  const [marking, setMarking] = useState<string | null>(null);

  async function markReminderSent(id: string) {
    setMarking(id);
    const supabase = createClient();
    await supabase.from('abandoned_carts').update({ reminder_sent: true }).eq('id', id);
    setMarking(null);
    router.refresh();
  }

  function buildWaUrl(cart: AbandonedCart) {
    const phone = cart.phone?.replace(/\D/g, '');
    if (!phone) return null;
    const itemsText = cart.items.map((i) => `• ${i.title} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`).join('\n');
    const msg = abandonedCartMessage(itemsText, `${SITE_URL}/shop`);
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  const totalValue = carts.filter((c) => !c.reminder_sent).reduce((s, c) => s + c.total, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#e01e1e]" />
          Abandoned Carts
        </h1>
        <div className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{carts.filter((c) => !c.reminder_sent).length}</span> pending ·{' '}
          <span className="font-semibold text-[#e01e1e]">{formatPrice(totalValue)}</span> recoverable
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {carts.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm">No abandoned carts yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Session</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Phone</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Time</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {carts.map((cart) => {
                  const waUrl = buildWaUrl(cart);
                  return (
                    <tr key={cart.id} className={`hover:bg-gray-50 ${cart.reminder_sent ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">
                        {cart.session_id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-0.5">
                          {cart.items.slice(0, 3).map((item, i) => (
                            <p key={i} className="text-xs text-gray-700 truncate max-w-[200px]">
                              {item.title} ×{item.quantity}
                            </p>
                          ))}
                          {cart.items.length > 3 && (
                            <p className="text-xs text-gray-400">+{cart.items.length - 3} more</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{formatPrice(cart.total)}</td>
                      <td className="px-4 py-3 text-gray-600">{cart.phone || <span className="text-gray-300">—</span>}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(cart.updated_at).toLocaleString('en-PK', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3">
                        {cart.reminder_sent ? (
                          <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Sent
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {waUrl && (
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => markReminderSent(cart.id)}
                                className="inline-flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                              </a>
                            )}
                            <button
                              onClick={() => markReminderSent(cart.id)}
                              disabled={marking === cart.id}
                              className="text-xs text-gray-400 hover:text-gray-600 underline disabled:opacity-50"
                            >
                              Mark Sent
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
