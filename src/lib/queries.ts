import { createClient } from '@/lib/supabase/server';
import type { Product, Category, Order, FaqItem, Testimonial, SiteSettings, ProductFilters } from '@/types';

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8);
  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getProducts(filters: Partial<ProductFilters> = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('is_active', true);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
  }
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category.slug', filters.category);
  }
  if (filters.minPrice) {
    query = query.gte('price', parseFloat(filters.minPrice));
  }
  if (filters.maxPrice) {
    query = query.lte('price', parseFloat(filters.maxPrice));
  }

  switch (filters.sort) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    case 'featured':
      query = query.order('is_featured', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
  if (error) return null;
  return data as Product;
}

export async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(4);
  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data: category } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();
  if (!category) return [];

  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('category_id', category.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getFaqItems(productId?: string): Promise<FaqItem[]> {
  const supabase = await createClient();
  let query = supabase
    .from('faq_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (productId) {
    query = query.or(`product_id.eq.${productId},product_id.is.null`);
  } else {
    query = query.is('product_id', null);
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);
  if (error) return [];
  return data ?? [];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
  if (error) return null;
  return data;
}

// Admin queries
export async function getAdminOrders(status?: string): Promise<Order[]> {
  const supabase = await createClient();
  let query = supabase
    .from('orders')
    .select('*, order_items(*, product:products(title, product_images(*)))')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Order[];
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const [products, orders] = await Promise.all([
    supabase.from('products').select('id, is_active, stock_quantity'),
    supabase.from('orders').select('id, status'),
  ]);

  const productData = products.data ?? [];
  const orderData = orders.data ?? [];

  return {
    totalProducts: productData.filter((p) => p.is_active).length,
    totalOrders: orderData.length,
    pendingOrders: orderData.filter((o) => o.status === 'pending').length,
    confirmedOrders: orderData.filter((o) => o.status === 'confirmed').length,
    deliveredOrders: orderData.filter((o) => o.status === 'delivered').length,
    lowStock: productData.filter((p) => p.is_active && p.stock_quantity <= 3).length,
  };
}

// ── Account queries ───────────────────────────────────────────
export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { profile: data, email: user.email };
}

// Lightweight version for pre-filling order forms
export async function getProfileForCheckout() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('profiles')
    .select('full_name, phone, city, address')
    .eq('id', user.id)
    .single();

  if (!data?.full_name || !data?.phone || !data?.city || !data?.address) return null;
  return data as { full_name: string; phone: string; city: string; address: string };
}

export async function getUserOrders() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(product_title_snapshot, price_snapshot, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getUserWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, product_id, created_at, product:products(id, slug, title, price, compare_at_price, product_images(image_url, alt_text, sort_order))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data ?? [];
}

export async function getWishlistIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', user.id);

  return (data ?? []).map((w) => w.product_id as string);
}

// ── Reviews ───────────────────────────────────────────────────
export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []) as import('@/types').Review[];
}

export async function getReviewStats(productId: string): Promise<import('@/types').ReviewStats> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('reviews')
    .select('rating')
    .eq('product_id', productId)
    .eq('is_approved', true);

  const reviews = data ?? [];
  const total = reviews.length;
  if (!total) return { average: 0, total: 0, breakdown: {} };

  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  for (const r of reviews) {
    sum += r.rating;
    breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
  }
  return { average: Math.round((sum / total) * 10) / 10, total, breakdown };
}

export async function canUserReviewProduct(productId: string): Promise<{
  canReview: boolean;
  reason: 'not_logged_in' | 'not_purchased' | 'already_reviewed' | 'eligible';
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { canReview: false, reason: 'not_logged_in' };

  // Check existing review
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .single();

  if (existing) return { canReview: false, reason: 'already_reviewed' };

  // Check purchase
  const { data: order } = await supabase
    .from('orders')
    .select('id, order_items!inner(product_id)')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'shipped', 'delivered'])
    .eq('order_items.product_id', productId)
    .limit(1)
    .single();

  if (!order) return { canReview: false, reason: 'not_purchased' };

  return { canReview: true, reason: 'eligible' };
}
