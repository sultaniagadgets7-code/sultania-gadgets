import type { Metadata } from 'next';
import { createAdminClient } from '@/lib/supabase/admin';
import { TestimonialsManager } from './TestimonialsManager';
import type { Testimonial } from '@/types';

export const metadata: Metadata = { title: 'Testimonials' };

export default async function AdminTestimonialsPage() {
  let testimonials: Testimonial[] = [];
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    testimonials = (data ?? []) as Testimonial[];
  } catch (err) {
    console.error('AdminTestimonialsPage error:', err);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-sm text-gray-500 mt-1">Manage customer testimonials shown on the homepage</p>
      </div>
      <TestimonialsManager testimonials={testimonials} />
    </div>
  );
}
