import { createClient } from '@/lib/supabase/server';
import type { Product, Category, Order, FaqItem, Testimonial, SiteSettings, ProductFilters } from '@/types';

export const revalidate = 600;

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return [];
  return data ?? [];
}

// Nav categories — regular async (uses cookies via Supabase auth)
export async function getNavCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, emoji, sort_order, created_at')
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  const { data: activeCatIds } = await supabase
    .from('products')
    .select('category_id')
    .eq('is_active', true)
    .not('category_id', 'is', null);

  if (!activeCatIds) return data as Category[];

  const ids = new Set(activeCatIds.map((p) => p.category_id));
  return (data as Category[]).filter((c) => ids.has(c.id));
}

// Site settings — regular async
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

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  
  // Fetch featured products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, stock_quantity, category_id')
    .eq('is_featured', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12);
    
  if (error || !products) return [];

  // Fetch categories and images
  const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
  const productIds = products.map(p => p.id);
  
  const [categories, images] = await Promise.all([
    supabase.from('categories').select('id, name, slug').in('id', categoryIds),
    supabase.from('product_images').select('product_id, image_url, alt_text, sort_order').in('product_id', productIds).order('sort_order'),
  ]);

  return products.map(p => ({
    ...p,
    category: categories.data?.find(c => c.id === p.category_id) || null,
    product_images: images.data?.filter(img => img.product_id === p.id) || [],
  })) as unknown as Product[];
}

export async function getNewArrivals(): Promise<Product[]> {
  const supabase = await createClient();
  
  // Fetch new arrival products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, stock_quantity, category_id')
    .eq('is_new_arrival', true)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(12);
    
  if (error || !products) return [];

  // Fetch categories and images
  const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
  const productIds = products.map(p => p.id);
  
  const [categories, images] = await Promise.all([
    supabase.from('categories').select('id, name, slug').in('id', categoryIds),
    supabase.from('product_images').select('product_id, image_url, alt_text, sort_order').in('product_id', productIds).order('sort_order'),
  ]);

  return products.map(p => ({
    ...p,
    category: categories.data?.find(c => c.id === p.category_id) || null,
    product_images: images.data?.filter(img => img.product_id === p.id) || [],
  })) as unknown as Product[];
}

export async function getProducts(filters: Partial<ProductFilters> = {}): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, stock_quantity, short_description, category_id')
    .eq('is_active', true);

  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`);
  }
  if (filters.category && filters.category !== 'all') {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
  if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));

  switch (filters.sort) {
    case 'price_asc':  query = query.order('price', { ascending: true }); break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'featured':   query = query.order('is_featured', { ascending: false }); break;
    default:           query = query.order('created_at', { ascending: false });
  }

  query = query.limit(50);
  const { data: products, error } = await query;
  if (error || !products) return [];

  // Fetch categories and images
  const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
  const productIds = products.map(p => p.id);
  
  const [categories, images] = await Promise.all([
    supabase.from('categories').select('id, name, slug').in('id', categoryIds),
    supabase.from('product_images').select('product_id, image_url, alt_text, sort_order').in('product_id', productIds).order('sort_order'),
  ]);

  return products.map(p => ({
    ...p,
    category: categories.data?.find(c => c.id === p.category_id) || null,
    product_images: images.data?.filter(img => img.product_id === p.id) || [],
  })) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  
  // Fetch product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();
    
  if (error || !product) return null;

  // Fetch category and images
  const [category, images] = await Promise.all([
    product.category_id ? supabase.from('categories').select('*').eq('id', product.category_id).single() : Promise.resolve({ data: null }),
    supabase.from('product_images').select('*').eq('product_id', product.id).order('sort_order'),
  ]);

  return {
    ...product,
    category: category.data,
    product_images: images.data || [],
  } as Product;
}

export async function getRelatedProducts(categoryId: string, excludeId: string): Promise<Product[]> {
  const supabase = await createClient();
  
  // Fetch related products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, stock_quantity')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .neq('id', excludeId)
    .limit(6);
    
  if (error || !products) return [];

  // Fetch images
  const productIds = products.map(p => p.id);
  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url, alt_text, sort_order')
    .in('product_id', productIds)
    .order('sort_order');

  return products.map(p => ({
    ...p,
    product_images: images?.filter(img => img.product_id === p.id) || [],
  })) as Product[];
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
    .select('*, category:categories(id, name, slug), product_images(image_url, alt_text, sort_order)')
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
    .select('id, customer_name, quote, location, created_at')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) return [];
  return (data ?? []) as unknown as Testimonial[];
}

// Admin queries
export async function getAdminOrders(status?: string): Promise<Order[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  
  // First, fetch orders
  let ordersQuery = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (status && status !== 'all') ordersQuery = ordersQuery.eq('status', status);

  const { data: orders, error: ordersError } = await ordersQuery;
  if (ordersError || !orders) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  // Then, fetch order items for all orders
  const orderIds = orders.map(o => o.id);
  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(
        title,
        product_images(image_url, sort_order)
      )
    `)
    .in('order_id', orderIds);

  // Attach order items to their respective orders
  const ordersWithItems = orders.map(order => ({
    ...order,
    order_items: orderItems?.filter(item => item.order_id === order.id) || [],
  }));

  return ordersWithItems as Order[];
}

export async function getAdminProducts(): Promise<Product[]> {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  
  // Fetch products
  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, stock_quantity, sku, badge, condition, is_active, is_featured, is_new_arrival, created_at, category_id')
    .order('created_at', { ascending: false })
    .limit(500);
    
  if (error || !products) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Fetch categories
  const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .in('id', categoryIds);

  // Fetch product images
  const productIds = products.map(p => p.id);
  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url, alt_text, sort_order')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true });

  // Attach categories and images to products
  const productsWithRelations = products.map(product => ({
    ...product,
    category: categories?.find(c => c.id === product.category_id) || null,
    product_images: images?.filter(img => img.product_id === product.id) || [],
  }));

  return productsWithRelations as unknown as Product[];
}

export async function getDashboardStats() {
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
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
    outOfStock: productData.filter((p) => p.is_active && p.stock_quantity === 0).length,
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

  // Use admin client to bypass RLS — user can only see their own orders (filtered by user_id)
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const admin = createAdminClient();

  // Fetch orders first
  const { data: orders, error: ordersError } = await admin
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (ordersError || !orders) return [];

  // Fetch order items
  const orderIds = orders.map(o => o.id);
  if (orderIds.length === 0) return [];

  const { data: orderItems } = await admin
    .from('order_items')
    .select('order_id, product_title_snapshot, price_snapshot, quantity')
    .in('order_id', orderIds);

  // Attach items to orders
  const ordersWithItems = orders.map(order => ({
    ...order,
    order_items: orderItems?.filter(item => item.order_id === order.id) || [],
  }));

  return ordersWithItems;
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

  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', productId)
    .eq('user_id', user.id)
    .single();

  if (existing) return { canReview: false, reason: 'already_reviewed' };

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

// ── Bundles ───────────────────────────────────────────────────
export async function getActiveBundles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('bundles')
    .select('id, slug, title, discount_percent, created_at, bundle_items(quantity, product:products(id, slug, title, price, product_images(image_url, sort_order)))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3);
  if (error) return [];
  return data ?? [];
}

// ── Top Rated Products ────────────────────────────────────────
export async function getTopRatedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  // First get products with approved reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('product_id, rating')
    .eq('is_approved', true);

  if (reviewsError || !reviews) return [];

  // Calculate average ratings
  const ratingsByProduct = reviews.reduce((acc: Record<string, number[]>, review) => {
    if (!acc[review.product_id]) acc[review.product_id] = [];
    acc[review.product_id].push(review.rating);
    return acc;
  }, {});

  // Filter products with at least 2 reviews and avg >= 4.0
  const topProductIds = Object.entries(ratingsByProduct)
    .map(([productId, ratings]) => ({
      productId,
      avg: ratings.reduce((a, b) => a + b, 0) / ratings.length,
      count: ratings.length,
    }))
    .filter(p => p.count >= 2 && p.avg >= 4.0)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 6)
    .map(p => p.productId);

  if (topProductIds.length === 0) return [];

  // Fetch products
  const { data: products } = await supabase
    .from('products')
    .select('id, slug, title, price, compare_at_price, badge, stock_quantity, category_id')
    .in('id', topProductIds)
    .eq('is_active', true);

  if (!products) return [];

  // Fetch categories and images
  const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
  const [categories, images] = await Promise.all([
    supabase.from('categories').select('id, name, slug').in('id', categoryIds),
    supabase.from('product_images').select('product_id, image_url, alt_text, sort_order').in('product_id', topProductIds).order('sort_order'),
  ]);

  return products.map(p => ({
    ...p,
    category: categories.data?.find(c => c.id === p.category_id) || null,
    product_images: images.data?.filter(img => img.product_id === p.id) || [],
  })) as unknown as Product[];
}
