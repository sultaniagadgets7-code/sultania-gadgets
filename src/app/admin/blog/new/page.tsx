import type { Metadata } from 'next';
import { BlogPostForm } from '../BlogPostForm';

export const metadata: Metadata = { title: 'New Blog Post' };

export default function NewBlogPostPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
