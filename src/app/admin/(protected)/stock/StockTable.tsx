'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, AlertTriangle } from 'lucide-react';
import { updateProductStock } from '@/lib/actions';

interface StockProduct {
  id: string;
  title: string;
  sku: string | null;
  stock_quantity: number;
  category: { name: string } | null;
}

interface StockTableProps {
  products: StockProduct[];
}

function stockColor(qty: number) {
  if (qty === 0) return 'text-red-700 bg-red-100';
  if (qty <= 3) return 'text-orange-700 bg-orange-100';
  return 'text-yellow-700 bg-yellow-100';
}

function stockDot(qty: number) {
  if (qty === 0) return 'bg-red-500';
  if (qty <= 3) return 'bg-orange-400';
  return 'bg-yellow-400';
}

export function StockTable({ products }: StockTableProps) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, string>>(
    Object.fromEntries(products.map((p) => [p.id, String(p.stock_quantity)]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  async function handleSave(productId: string) {
    const qty = parseInt(quantities[productId]);
    if (isNaN(qty) || qty < 0) return;
    setSaving(productId);
    await updateProductStock(productId, qty);
    setSaving(null);
    setSaved(productId);
    setTimeout(() => setSaved(null), 2000);
    router.refresh();
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-[20px] p-10 text-center">
        <div className="inline-flex p-3 bg-green-50 rounded-full mb-3">
          <AlertTriangle className="w-6 h-6 text-green-500" />
        </div>
        <p className="font-semibold text-gray-700">All products are well stocked!</p>
        <p className="text-sm text-gray-400 mt-1">No products with 5 or fewer units.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Product</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden sm:table-cell">SKU</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase hidden md:table-cell">Category</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase">Stock</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-500 text-xs uppercase w-40">Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${stockDot(p.stock_quantity)}`} />
                    <span className="font-medium text-gray-900 line-clamp-1">{p.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  {p.sku ? (
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">{p.sku}</span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-5 py-3 hidden md:table-cell text-gray-500 text-xs">
                  {p.category?.name ?? '—'}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stockColor(p.stock_quantity)}`}>
                    {p.stock_quantity === 0 ? 'Out of stock' : `${p.stock_quantity} left`}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      value={quantities[p.id]}
                      onChange={(e) => setQuantities({ ...quantities, [p.id]: e.target.value })}
                      className="w-16 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-gray-900"
                      aria-label={`Stock quantity for ${p.title}`}
                    />
                    <button
                      onClick={() => handleSave(p.id)}
                      disabled={saving === p.id}
                      className={`flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full transition-colors ${saved === p.id ? 'bg-green-100 text-green-700' : 'bg-[#0a0a0a] hover:bg-gray-800 text-white'} disabled:opacity-50`}
                      aria-label={`Save stock for ${p.title}`}
                    >
                      <Save className="w-3 h-3" />
                      {saved === p.id ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
