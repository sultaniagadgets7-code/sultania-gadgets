export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type OrderSource = 'website' | 'whatsapp';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt_text: string | null;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  category_id: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  sku: string | null;
  condition: string;
  badge: string | null;
  compatibility: string | null;
  specs_json: Record<string, string> | null;
  whats_in_box: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
  product_images?: ProductImage[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title_snapshot: string;
  price_snapshot: number;
  quantity: number;
  created_at: string;
  product?: Product;
}

export interface Order {
  id: string;
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  notes_internal?: string | null;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  order_source: OrderSource;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CheckoutFormData {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes: string;
  quantity: number;
}

export interface ProductFilters {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'featured';
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  product_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface Testimonial {
  id: string;
  customer_name: string;
  quote: string;
  location: string | null;
  is_featured: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  whatsapp_number: string;
  support_text: string | null;
  shipping_text: string | null;
  cod_enabled: boolean;
  store_city: string | null;
  delivery_fee: number;
  announcement_text: string | null;
  hero_headline: string | null;
  hero_subtext: string | null;
  social_whatsapp: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_tiktok: string | null;
  social_youtube: string | null;
  social_twitter: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  title: string | null;
  body: string;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewStats {
  average: number;
  total: number;
  breakdown: Record<number, number>;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}
