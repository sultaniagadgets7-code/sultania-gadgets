import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory } from '@/lib/queries';
import { ProductGrid } from '@/components/products/ProductGrid';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} — Sultania Gadgets`,
    description: category.description || `Shop ${category.name} at Sultania Gadgets. Cash on delivery.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProductsByCategory(slug),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span className="mx-1">/</span>
        <Link href="/shop" className="hover:text-blue-700">Shop</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">{products.length} products</p>
      </div>

      <ProductGrid products={products} emptyMessage={`No ${category.name} products available yet.`} />
    </div>
  );
}
