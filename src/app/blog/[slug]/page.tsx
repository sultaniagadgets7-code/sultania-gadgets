import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();
  
  // Increment view count
  if (data) {
    await supabase
      .from('blog_posts')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id);
  }
  
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Sultania Gadgets Blog`,
    description: post.excerpt || post.content?.substring(0, 160) || '',
    alternates: { canonical: `https://sultaniagadgets.com/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.featured_image ? [{ url: post.featured_image, alt: post.title }] : [],
      type: 'article',
      publishedTime: post.published_at,
      siteName: 'Sultania Gadgets',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || '',
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/blog"
        className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-8"
      >
        ← Back to Blog
      </Link>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Category */}
      {post.category && (
        <span className="text-xs text-red-600 font-semibold uppercase">
          {post.category}
        </span>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
        {post.title}
      </h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-8 pb-8 border-b">
        <time>
          {new Date(post.published_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>•</span>
        <span>{post.views || 0} views</span>
      </div>

      {/* Content */}
      <div
        className="blog-content text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-sm font-semibold mb-3">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Share */}
      <div className="mt-8 pt-8 border-t">
        <h3 className="text-sm font-semibold mb-3">Share this post:</h3>
        <div className="flex gap-3">
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              `https://sultaniagadgets.com/blog/${post.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              `https://sultaniagadgets.com/blog/${post.slug}`
            )}&text=${encodeURIComponent(post.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
          >
            Twitter
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `${post.title} - https://sultaniagadgets.com/blog/${post.slug}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
