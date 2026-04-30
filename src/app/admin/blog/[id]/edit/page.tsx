import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { BlogPostForm } from '../../BlogPostForm';

export const metadata: Metadata = { title: 'Edit Blog Post' };

export default async function EditBlogPostPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, content, featured_image, category, tags, published')
    .eq('id', params.id)
    .single();

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
