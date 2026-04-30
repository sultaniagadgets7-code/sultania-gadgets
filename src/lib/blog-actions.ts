'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  category: string | null;
  tags: string[] | null;
  published: boolean;
}

export async function saveBlogPost(data: BlogPostData) {
  const supabase = await createClient();

  const payload = {
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    featured_image: data.featured_image,
    category: data.category,
    tags: data.tags,
    published: data.published,
    published_at: data.published ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  if (data.id) {
    // Update existing
    const { error } = await supabase
      .from('blog_posts')
      .update(payload)
      .eq('id', data.id);

    if (error) return { success: false, error: error.message };
  } else {
    // Create new
    const { error } = await supabase
      .from('blog_posts')
      .insert({ ...payload, views: 0 });

    if (error) return { success: false, error: error.message };
  }

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  if (data.slug) revalidatePath(`/blog/${data.slug}`);

  return { success: true };
}

export async function deleteBlogPost(id: string): Promise<void> {
  const supabase = await createClient();
  await supabase.from('blog_posts').delete().eq('id', id);
  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}

export async function toggleBlogPublished(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from('blog_posts')
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
}
