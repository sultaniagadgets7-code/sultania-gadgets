import type { Metadata } from 'next';
import { getCategories } from '@/lib/queries';
import { CategoriesManager } from './CategoriesManager';

export const metadata: Metadata = { title: 'Categories' };

export default async function AdminCategoriesPage() {
  const categories = await getCategories();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Categories</h1>
        <span className="text-sm text-gray-500">{categories.length} total</span>
      </div>
      <CategoriesManager categories={categories} />
    </div>
  );
}
