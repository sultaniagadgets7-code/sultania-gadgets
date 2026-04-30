import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminProducts } from '@/lib/queries';
import { AdminProductsTable } from './AdminProductsTable';

export const metadata: Metadata = { title: 'Products' };

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-[#0a0a0a] hover:bg-gray-800 text-white text-sm font-bold uppercase tracking-widest px-4 py-2.5 rounded-full transition-colors"
        >
          + Add Product
        </Link>
      </div>
      <AdminProductsTable products={products} />
    </div>
  );
}
