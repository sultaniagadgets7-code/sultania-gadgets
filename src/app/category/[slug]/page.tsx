import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategories, getProductsByCategory, getFeaturedProducts } from '@/lib/queries';
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sultaniagadgets.com';
  const desc = category.description || `Shop ${category.name} in Pakistan at Sultania Gadgets. Genuine products, cash on delivery. Tested before dispatch.`;
  return {
    title: `${category.name} in Pakistan — Sultania Gadgets`,
    description: desc,
    keywords: [`${category.name} pakistan`, `buy ${category.name} online pakistan`, `${category.name} cash on delivery`, `${category.name} price pakistan`],
    openGraph: { title: `${category.name} — Sultania Gadgets`, description: desc, url: `${siteUrl}/category/${slug}`, type: 'website' },
    twitter: { card: 'summary_large_image', title: `${category.name} — Sultania Gadgets`, description: desc },
    alternates: { canonical: `${siteUrl}/category/${slug}` },
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

  const isEmpty = products.length === 0;
  const featured = isEmpty ? await getFeaturedProducts() : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-gray-950 transition-colors">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-950">{category.name}</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-black text-2xl text-gray-950 tracking-tight">
          {category.emoji && <span className="mr-2">{category.emoji}</span>}
          {category.name}
        </h1>
        {category.description && (
          <p className="text-gray-500 text-sm mt-1">{category.description}</p>
        )}
        {!isEmpty && <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-widest">{products.length} products</p>}
      </div>

      {isEmpty ? (
        <div>
          <div className="bg-[#f7f7f7] rounded-[20px] p-10 text-center mb-10">
            <p className="font-bold text-gray-950 mb-1">No products in {category.name} yet</p>
            <p className="text-sm text-gray-400 mb-5">We&apos;re adding new products regularly. Check back soon.</p>
            <Link href="/shop"
              className="inline-flex items-center bg-[#0a0a0a] hover:bg-gray-800 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-colors">
              Browse All Products
            </Link>
          </div>
          {featured.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">You might like</p>
              <ProductGrid products={featured} />
            </div>
          )}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
