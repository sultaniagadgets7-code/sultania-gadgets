import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Tech Blog — Tips, Reviews & Guides | Sultania Gadgets Pakistan',
  description: 'Tech tips, product reviews, and buying guides for mobile accessories in Pakistan. Chargers, earbuds, cables — expert advice for Pakistani buyers.',
  keywords: ['tech blog pakistan', 'mobile accessories guide', 'charger review pakistan', 'earbuds review pakistan', 'tech tips urdu'],
  alternates: { canonical: 'https://sultaniagadgets.com/blog' },
  openGraph: {
    title: 'Tech Blog — Sultania Gadgets Pakistan',
    description: 'Tech tips, product reviews and buying guides for mobile accessories in Pakistan.',
    url: 'https://sultaniagadgets.com/blog',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Tech Blog — Sultania Gadgets', description: 'Tech tips and product reviews for Pakistan.' },
};

export const revalidate = 3600; // Revalidate every hour

async function getBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(20);
  
  return data || [];
}

async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_categories')
    .select('*')
    .order('name');
  
  return data || [];
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tech Blog</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Latest tech tips, product guides, and mobile accessory reviews
        </p>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full bg-black text-white text-sm"
          >
            All Posts
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog/category/${cat.slug}`}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      )}

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No blog posts yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                {post.featured_image && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="text-xs text-red-600 font-semibold uppercase">
                      {post.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-red-600 transition">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
