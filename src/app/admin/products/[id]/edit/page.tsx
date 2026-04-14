import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategories } from '@/lib/queries';
import { createClient } from '@/lib/supabase/server';
import { ProductForm } from '../../ProductForm';
import type { Product } from '@/types';

export const metadata: Metadata = { title: 'Edit Product' };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, categories] = await Promise.all([
    supabase.from('products').select('*, product_images(*)').eq('id', id).single(),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/products" className="text-sm text-gray-500 hover:text-gray-700">← Products</Link>
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
      </div>
      <ProductForm categories={categories} product={product as Product} />
    </div>
  );
}
