import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategories } from '@/lib/queries';
import { ProductForm } from '../ProductForm';

export const metadata: Metadata = { title: 'Add Product' };

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">← Products</Link>
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
