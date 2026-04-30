'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toggleProductActive, duplicateProduct, bulkToggleProducts, bulkDeleteProducts } from '@/lib/actions';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import type { Product } from '@/types';
import { Edit, Eye, EyeOff, Copy, Trash2 } from 'lucide-react';

interface AdminProductsTableProps {
  products: Product[];
}

export function AdminProductsTable({ products }: AdminProductsTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = products.filter((p) =>
    !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.sku?.includes(search)
  );

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  }

  async function handleToggle(productId: string, currentActive: boolean) {
    setTogglingId(productId);
    await toggleProductActive(productId, !currentActive);
    setTogglingId(null);
    router.refresh();
  }

  async function handleDuplicate(productId: string) {
    setDuplicatingId(productId);
    const result = await duplicateProduct(productId);
    setDuplicatingId(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || 'Failed to duplicate product');
    }
  }

  async function handleBulkActivate(isActive: boolean) {
    if (!selected.size) return;
    setBulkLoading(true);
    await bulkToggleProducts(Array.from(selected), isActive);
    setSelected(new Set());
    setBulkLoading(false);
    router.refresh();
  }

  async function handleBulkDelete() {
    if (!selected.size) return;
    if (!confirm(`Delete ${selected.size} product(s)? This cannot be undone.`)) return;
    setBulkLoading(true);
    await bulkDeleteProducts(Array.from(selected));
    setSelected(new Set());
    setBulkLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Search products"
        />
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-blue-700">{selected.size} selected</span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handleBulkActivate(true)}
              disabled={bulkLoading}
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
            >
              Activate {selected.size}
            </button>
            <button
              onClick={() => handleBulkActivate(false)}
              disabled={bulkLoading}
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Deactivate {selected.size}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkLoading}
              className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition-colors disabled:opacity-50"
            >
              Delete {selected.size}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 w-8">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="rounded"
                      aria-label="Select all products"
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase hidden md:table-cell">Stock</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50 ${selected.has(product.id) ? 'bg-blue-50' : ''}`}>
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded"
                        aria-label={`Select ${product.title}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0">
                          <Image
                            src={getPrimaryImage(product.product_images)}
                            alt={product.title}
                            fill
                            className="object-contain p-1"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{product.title}</p>
                          {product.sku && <p className="text-xs text-gray-500">SKU: {product.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-600 text-xs">
                      {product.category?.name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{formatPrice(product.price)}</p>
                      {product.compare_at_price && (
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.compare_at_price)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold ${product.stock_quantity <= 3 ? 'text-red-600' : 'text-gray-700'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button
                          onClick={() => handleToggle(product.id, product.is_active)}
                          disabled={togglingId === product.id}
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded transition-colors ${
                            product.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                          aria-label={product.is_active ? 'Deactivate product' : 'Activate product'}
                        >
                          {product.is_active ? <Eye className="w-3 h-3" aria-hidden="true" /> : <EyeOff className="w-3 h-3" aria-hidden="true" />}
                          {product.is_active ? 'Active' : 'Hidden'}
                        </button>
                        {product.is_featured && (
                          <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                            Featured
                          </span>
                        )}
                        {product.is_new_arrival && (
                          <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                          aria-label={`Edit ${product.title}`}
                        >
                          <Edit className="w-3.5 h-3.5" aria-hidden="true" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDuplicate(product.id)}
                          disabled={duplicatingId === product.id}
                          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium disabled:opacity-50"
                          aria-label={`Duplicate ${product.title}`}
                        >
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                          {duplicatingId === product.id ? '...' : 'Dupe'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
