import type { Metadata } from 'next';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin';
import { deleteBlogPost, toggleBlogPublished } from '@/lib/blog-actions';
import { PlusCircle } from 'lucide-react';

export const metadata: Metadata = { title: 'Blog Posts' };

// Void wrappers for form actions
async function togglePublishedAction(id: string, published: boolean): Promise<void> {
  'use server';
  await toggleBlogPublished(id, published);
}

async function deletePostAction(id: string): Promise<void> {
  'use server';
  await deleteBlogPost(id);
}

export default async function AdminBlogPage() {
  const supabase = createAdminClient();
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, published, category, views, published_at, created_at')
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{posts?.length ?? 0} posts total</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          New Post
        </Link>
      </div>

      {!posts?.length ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No blog posts yet.</p>
          <Link href="/admin/blog/new" className="text-blue-600 hover:underline text-sm font-semibold">
            Create your first post →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{post.category || '—'}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-600">{post.views ?? 0}</td>
                  <td className="px-4 py-3">
                    <form action={togglePublishedAction.bind(null, post.id, !post.published)}>
                      <button
                        type="submit"
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          post.published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {post.published ? 'Published' : 'Draft'}
                      </button>
                    </form>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-blue-600 hover:underline text-xs font-semibold"
                      >
                        Edit
                      </Link>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-700 text-xs"
                      >
                        View ↗
                      </a>
                      <form action={deletePostAction.bind(null, post.id)}>
                        <button
                          type="submit"
                          className="text-red-500 hover:text-red-700 text-xs font-semibold"
                          onClick={(e) => {
                            if (!confirm('Delete this post?')) e.preventDefault();
                          }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
