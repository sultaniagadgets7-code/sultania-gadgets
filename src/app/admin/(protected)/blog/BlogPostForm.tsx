'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveBlogPost } from '@/lib/blog-actions';
import { slugify } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Props {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    category: string | null;
    tags: string[] | null;
    published: boolean;
  };
}

const inp = 'w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition';

export function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const isEdit = !!post;

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [published, setPublished] = useState(post?.published ?? false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

    const result = await saveBlogPost({
      id: post?.id,
      title,
      slug,
      excerpt: excerpt || null,
      content,
      featured_image: featuredImage || null,
      category: category || null,
      tags: tagsArray.length > 0 ? tagsArray : null,
      published,
    });

    if (result.success) {
      setMessage({ type: 'success', text: isEdit ? 'Post updated!' : 'Post created!' });
      if (!isEdit) router.push('/admin/blog');
    } else {
      setMessage({ type: 'error', text: result.error || 'Something went wrong.' });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {message.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="font-bold text-sm text-gray-700 uppercase tracking-wide">Post Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Best Chargers for iPhone in Pakistan 2026"
              required
              className={inp}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL Slug *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">/blog/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className={`${inp} pl-14 font-mono`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Tech Tips, Product Reviews"
              className={inp}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Short summary shown on blog listing page..."
              className={`${inp} resize-none`}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Featured Image URL</label>
            <input
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              placeholder="https://..."
              className={inp}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="chargers, pakistan, tech tips"
              className={inp}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
          Content * <span className="text-gray-400 font-normal normal-case">(HTML supported)</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          required
          placeholder={`<h2>Introduction</h2>\n<p>Your blog content here...</p>\n\n<h2>Section 2</h2>\n<p>More content...</p>`}
          className={`${inp} font-mono text-xs resize-y`}
        />
        <p className="text-xs text-gray-400 mt-1.5">
          Tip: Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;strong&gt; for formatting.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded accent-gray-900"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">Publish this post</p>
            <p className="text-xs text-gray-500">When checked, the post will be visible on your blog</p>
          </div>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-900 hover:bg-gray-700 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <a href="/admin/blog" className="text-sm text-gray-400 hover:text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors">
          Cancel
        </a>
        {isEdit && (
          <a
            href={`/blog/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-gray-400 hover:text-gray-700 underline"
          >
            View on site ↗
          </a>
        )}
      </div>
    </form>
  );
}
