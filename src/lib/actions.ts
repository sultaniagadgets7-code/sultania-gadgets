'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { CheckoutFormData, OrderStatus } from '@/types';

export async function createOrder(
  productId: string,
  productTitle: string,
  priceSnapshot: number,
  formData: CheckoutFormData
) {
  const supabase = await createClient();

  // Get current user if logged in (optional — orders work without account too)
  const { data: { user } } = await supabase.auth.getUser();

  const subtotal = priceSnapshot * formData.quantity;

  // Use delivery fee from site settings
  const { data: settings } = await supabase.from('site_settings').select('delivery_fee').limit(1).single();
  const deliveryFee = settings?.delivery_fee ?? 200;

  const total = subtotal + deliveryFee;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: formData.customer_name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      notes: formData.notes || null,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      total,
      order_source: 'website',
      user_id: user?.id ?? null,
    })
    .select()
    .single();

  if (orderError || !order) {
    return { success: false, error: orderError?.message || 'Failed to create order. Please try again.' };
  }

  const { error: itemError } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: productId,
    product_title_snapshot: productTitle,
    price_snapshot: priceSnapshot,
    quantity: formData.quantity,
  });

  if (itemError) {
    await supabase.from('orders').delete().eq('id', order.id);
    return { success: false, error: itemError?.message || 'Failed to create order. Please try again.' };
  }

  // Decrement stock
  await supabase.rpc('decrement_stock', {
    product_id: productId,
    qty: formData.quantity,
  });

  // Award loyalty points to logged-in users (1 point per Rs. 100 spent)
  if (user?.id) {
    await supabase.rpc('award_loyalty_points', {
      p_user_id: user.id,
      p_order_id: order.id,
      p_order_total: total,
    });
  }

  // Send order emails (admin always, customer if email available)
  try {
    const { sendOrderEmails } = await import('@/lib/email');
    await sendOrderEmails({
      orderId: order.id,
      customerName: formData.customer_name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      items: [{ title: productTitle, quantity: formData.quantity, price: priceSnapshot }],
      subtotal,
      deliveryFee,
      discount: 0,
      total,
    }, user?.email);
  } catch {}

  revalidatePath('/admin/orders');
  return { success: true, orderId: order.id, total, deliveryFee };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  // Award loyalty points when order is delivered (if not already awarded at placement)
  // This is a safety net — the RPC is idempotent per order_id
  if (status === 'delivered') {
    const { data: order } = await supabase
      .from('orders')
      .select('user_id, total')
      .eq('id', orderId)
      .single();
    if (order?.user_id) {
      await supabase.rpc('award_loyalty_points', {
        p_user_id: order.user_id,
        p_order_id: orderId,
        p_order_total: order.total,
      });
    }
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const specsRaw = formData.get('specs_json') as string;
  let specs = null;
  try {
    specs = specsRaw ? JSON.parse(specsRaw) : null;
  } catch {
    specs = null;
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      short_description: formData.get('short_description') as string || null,
      description: formData.get('description') as string || null,
      category_id: formData.get('category_id') as string || null,
      price: parseFloat(formData.get('price') as string),
      compare_at_price: formData.get('compare_at_price')
        ? parseFloat(formData.get('compare_at_price') as string)
        : null,
      stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
      sku: formData.get('sku') as string || null,
      condition: formData.get('condition') as string || 'New',
      badge: formData.get('badge') as string || null,
      compatibility: formData.get('compatibility') as string || null,
      specs_json: specs,
      whats_in_box: formData.get('whats_in_box') as string || null,
      is_featured: formData.get('is_featured') === 'true',
      is_new_arrival: formData.get('is_new_arrival') === 'true',
      is_active: formData.get('is_active') === 'true',
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  // Handle image URLs
  const imageUrls = (formData.get('image_urls') as string || '').split('\n').filter(Boolean);
  if (imageUrls.length > 0) {
    await supabase.from('product_images').insert(
      imageUrls.map((url, i) => ({
        product_id: data.id,
        image_url: url.trim(),
        alt_text: formData.get('title') as string,
        sort_order: i,
      }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  return { success: true, productId: data.id };
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const specsRaw = formData.get('specs_json') as string;
  let specs = null;
  try {
    specs = specsRaw ? JSON.parse(specsRaw) : null;
  } catch {
    specs = null;
  }

  const { error } = await supabase
    .from('products')
    .update({
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      short_description: formData.get('short_description') as string || null,
      description: formData.get('description') as string || null,
      category_id: formData.get('category_id') as string || null,
      price: parseFloat(formData.get('price') as string),
      compare_at_price: formData.get('compare_at_price')
        ? parseFloat(formData.get('compare_at_price') as string)
        : null,
      stock_quantity: parseInt(formData.get('stock_quantity') as string) || 0,
      sku: formData.get('sku') as string || null,
      condition: formData.get('condition') as string || 'New',
      badge: formData.get('badge') as string || null,
      compatibility: formData.get('compatibility') as string || null,
      specs_json: specs,
      whats_in_box: formData.get('whats_in_box') as string || null,
      is_featured: formData.get('is_featured') === 'true',
      is_new_arrival: formData.get('is_new_arrival') === 'true',
      is_active: formData.get('is_active') === 'true',
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId);

  if (error) return { success: false, error: error.message };

  // Replace images: delete old ones, insert new ones
  const imageUrls = (formData.get('image_urls') as string || '').split('\n').filter(Boolean);
  await supabase.from('product_images').delete().eq('product_id', productId);
  if (imageUrls.length > 0) {
    await supabase.from('product_images').insert(
      imageUrls.map((url, i) => ({
        product_id: productId,
        image_url: url.trim(),
        alt_text: formData.get('title') as string,
        sort_order: i,
      }))
    );
  }

  revalidatePath('/admin/products');
  revalidatePath('/shop');
  revalidatePath(`/product/${formData.get('slug')}`);
  return { success: true };
}

export async function toggleProductActive(productId: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  return { success: true };
}

export async function adminSignIn(email: string, password: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function adminSignOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

// ── Profile ───────────────────────────────────────────────────
export async function updateProfile(data: {
  full_name: string; phone: string; city: string; address: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...data, updated_at: new Date().toISOString() });

  if (error) return { success: false, error: error.message };
  revalidatePath('/account/profile');
  return { success: true };
}

// ── Wishlist ──────────────────────────────────────────────────
export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated', wishlisted: false };

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single();

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id);
    revalidatePath('/account/wishlist');
    return { success: true, wishlisted: false };
  } else {
    await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
    revalidatePath('/account/wishlist');
    return { success: true, wishlisted: true };
  }
}

// ── Reviews ───────────────────────────────────────────────────
export async function submitReview(data: {
  product_id: string;
  author_name: string;
  rating: number;
  title?: string;
  body: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, error: 'You must be signed in to leave a review.' };

  // Check if user has a confirmed/shipped/delivered order for this product
  const { data: order } = await supabase
    .from('orders')
    .select('id, order_items!inner(product_id)')
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'shipped', 'delivered'])
    .eq('order_items.product_id', data.product_id)
    .limit(1)
    .single();

  if (!order) {
    return {
      success: false,
      error: 'You can only review products you have purchased and received.',
    };
  }

  // Prevent duplicate review from same user
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('product_id', data.product_id)
    .eq('user_id', user.id)
    .single();

  if (existing) return { success: false, error: 'You have already reviewed this product.' };

  const { error } = await supabase.from('reviews').insert({
    ...data,
    user_id: user.id,
    is_verified: true, // always verified since we confirmed the purchase
    is_approved: true,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath(`/product/${data.product_id}`);
  return { success: true };
}

export async function deleteReview(reviewId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/reviews');
  return { success: true };
}

// ── Categories ────────────────────────────────────────────────
export async function createCategory(data: {
  name: string; slug: string; description?: string; sort_order?: number; emoji?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').insert({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    sort_order: data.sort_order ?? 0,
    emoji: data.emoji || '📦',
  });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

export async function updateCategory(id: string, data: {
  name: string; slug: string; description?: string; sort_order?: number; emoji?: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('categories').update({
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    sort_order: data.sort_order ?? 0,
    emoji: data.emoji || '📦',
  }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  // Check if any products use this category
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id);
  if (count && count > 0) {
    return { success: false, error: `Cannot delete — ${count} product(s) are using this category. Reassign them first.` };
  }
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/categories');
  revalidatePath('/');
  return { success: true };
}

// ── Site Settings ─────────────────────────────────────────────
export async function updateSiteSettings(data: Record<string, unknown>) {
  const supabase = await createClient();
  const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single();
  let error;
  if (existing) {
    const res = await supabase.from('site_settings').update({ ...data, updated_at: new Date().toISOString() }).eq('id', existing.id);
    error = res.error;
  } else {
    const res = await supabase.from('site_settings').insert(data);
    error = res.error;
  }
  if (error) return { success: false, error: error.message };
  revalidatePath('/');
  revalidatePath('/admin/settings');
  return { success: true };
}

// ── FAQs ──────────────────────────────────────────────────────
export async function createFaq(data: {
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
  product_id?: string | null;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('faq_items').insert({
    question: data.question,
    answer: data.answer,
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active ?? true,
    product_id: data.product_id ?? null,
  });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}

export async function updateFaq(id: string, data: {
  question: string;
  answer: string;
  sort_order?: number;
  is_active?: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('faq_items').update({
    question: data.question,
    answer: data.answer,
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active ?? true,
  }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('faq_items').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/faqs');
  revalidatePath('/faq');
  return { success: true };
}

// ── Testimonials ──────────────────────────────────────────────
export async function createTestimonial(data: {
  customer_name: string;
  quote: string;
  location?: string;
  is_featured?: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').insert({
    customer_name: data.customer_name,
    quote: data.quote,
    location: data.location ?? null,
    is_featured: data.is_featured ?? false,
  });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true };
}

export async function updateTestimonial(id: string, data: {
  customer_name: string;
  quote: string;
  location?: string;
  is_featured?: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').update({
    customer_name: data.customer_name,
    quote: data.quote,
    location: data.location ?? null,
    is_featured: data.is_featured ?? false,
  }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true };
}

// ── Stock ─────────────────────────────────────────────────────
export async function updateProductStock(productId: string, quantity: number) {
  const supabase = await createClient();
  await supabase.from('products').update({ stock_quantity: quantity, updated_at: new Date().toISOString() }).eq('id', productId);
  revalidatePath('/admin/stock');
  return { success: true };
}

// ── Coupons ───────────────────────────────────────────────────
export async function createCoupon(data: {
  code: string;
  discount_type: 'percent' | 'flat';
  discount_value: number;
  min_order_value?: number;
  max_uses?: number | null;
  expires_at?: string | null;
  is_active?: boolean;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('coupons').insert({
    code: data.code.toUpperCase().trim(),
    discount_type: data.discount_type,
    discount_value: data.discount_value,
    min_order_value: data.min_order_value ?? 0,
    max_uses: data.max_uses ?? null,
    expires_at: data.expires_at ?? null,
    is_active: data.is_active ?? true,
  });
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from('coupons').update({ is_active: isActive }).eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('coupons').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/coupons');
  return { success: true };
}

// ── Order Notes ───────────────────────────────────────────────
export async function updateOrderNote(orderId: string, note: string) {
  const supabase = await createClient();
  await supabase.from('orders').update({ notes_internal: note }).eq('id', orderId);
  revalidatePath('/admin/orders');
  return { success: true };
}

// ── Coupon Validation ─────────────────────────────────────────
export async function validateCoupon(code: string, orderTotal: number) {
  const supabase = await createClient();
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .single();

  if (error || !coupon) return { valid: false, error: 'Invalid coupon code.' };
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date())
    return { valid: false, error: 'This coupon has expired.' };
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses)
    return { valid: false, error: 'This coupon has reached its usage limit.' };
  if (coupon.min_order_value && orderTotal < coupon.min_order_value)
    return { valid: false, error: `Minimum order value is Rs. ${coupon.min_order_value} for this coupon.` };

  const discount = coupon.discount_type === 'percent'
    ? Math.round((orderTotal * coupon.discount_value) / 100)
    : coupon.discount_value;

  return {
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.discount_type as 'percent' | 'flat',
    discountValue: coupon.discount_value,
    discount,
    label: coupon.discount_type === 'percent' ? `${coupon.discount_value}% off` : `Rs. ${coupon.discount_value} off`,
  };
}

export async function createOrderWithCoupon(
  items: { productId: string; title: string; price: number; quantity: number }[],
  formData: { customer_name: string; phone: string; city: string; address: string; notes: string },
  couponCode?: string,
  customerEmail?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  // Get delivery fee from settings
  const { data: settings } = await supabase.from('site_settings').select('delivery_fee').limit(1).single();
  const deliveryFee = settings?.delivery_fee ?? 200;

  let discount = 0;
  let couponId: string | null = null;

  if (couponCode) {
    const result = await validateCoupon(couponCode, subtotal);
    if (result.valid) {
      discount = result.discount!;
      couponId = result.couponId!;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_name: formData.customer_name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      notes: formData.notes || null,
      status: 'pending',
      subtotal,
      delivery_fee: deliveryFee,
      total,
      order_source: 'website',
      user_id: user?.id ?? null,
      coupon_id: couponId,
      discount_amount: discount,
    })
    .select().single();

  if (orderErr || !order) return { success: false, error: 'Failed to place order.' };

  const { error: itemsErr } = await supabase.from('order_items').insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_title_snapshot: item.title,
      price_snapshot: item.price,
      quantity: item.quantity,
    }))
  );

  if (itemsErr) {
    await supabase.from('orders').delete().eq('id', order.id);
    return { success: false, error: 'Failed to place order.' };
  }

  // Increment coupon used_count
  if (couponId) {
    await supabase.rpc('increment_coupon_usage', { coupon_id: couponId });
  }

  // Decrement stock for each item
  for (const item of items) {
    await supabase.rpc('decrement_stock', { product_id: item.productId, qty: item.quantity });
  }

  // Award loyalty points to logged-in users (1 point per Rs. 100 spent)
  if (user?.id) {
    await supabase.rpc('award_loyalty_points', {
      p_user_id: user.id,
      p_order_id: order.id,
      p_order_total: total,
    });

    // Save delivery details to user profile if not already saved
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, phone, city, address')
      .eq('id', user.id)
      .single();

    // Update profile if any field is missing
    if (profile && (!profile.full_name || !profile.phone || !profile.city || !profile.address)) {
      await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name || formData.customer_name,
          phone: profile.phone || formData.phone,
          city: profile.city || formData.city,
          address: profile.address || formData.address,
        })
        .eq('id', user.id);
    }
  }

  // Send order emails
  try {
    const { sendOrderEmails } = await import('@/lib/email');
    await sendOrderEmails({
      orderId: order.id,
      customerName: formData.customer_name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      items: items.map((i) => ({ title: i.title, quantity: i.quantity, price: i.price })),
      subtotal,
      deliveryFee,
      discount,
      total,
    }, customerEmail || user?.email);
  } catch {}

  revalidatePath('/admin/orders');
  return { success: true, orderId: order.id, total, deliveryFee, discount };
}

// ── Product Duplication ───────────────────────────────────────
export async function duplicateProduct(productId: string) {
  const supabase = await createClient();
  const { data: original } = await supabase
    .from('products')
    .select('*, product_images(*)')
    .eq('id', productId)
    .single();

  if (!original) return { success: false, error: 'Product not found' };

  const { product_images, id, created_at, updated_at, ...rest } = original;

  const { data: copy, error } = await supabase
    .from('products')
    .insert({
      ...rest,
      slug: `${original.slug}-copy-${Date.now()}`,
      title: `${original.title} (Copy)`,
      is_active: false,
    })
    .select()
    .single();

  if (error || !copy) return { success: false, error: error?.message };

  if (product_images?.length) {
    await supabase.from('product_images').insert(
      product_images.map((img: { image_url: string; alt_text: string | null; sort_order: number }) => ({
        product_id: copy.id,
        image_url: img.image_url,
        alt_text: img.alt_text,
        sort_order: img.sort_order,
      }))
    );
  }

  revalidatePath('/admin/products');
  return { success: true, productId: copy.id };
}

// ── Bulk Product Actions ──────────────────────────────────────
export async function bulkToggleProducts(ids: string[], isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('products')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .in('id', ids);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  return { success: true };
}

export async function bulkDeleteProducts(ids: string[]) {
  const supabase = await createClient();
  // Delete images first
  await supabase.from('product_images').delete().in('product_id', ids);
  const { error } = await supabase.from('products').delete().in('id', ids);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/products');
  return { success: true };
}

// ── COD Collection ────────────────────────────────────────────
export async function markCodCollected(orderId: string, collectedBy?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({
    cod_collected: true,
    cod_collected_at: new Date().toISOString(),
    cod_collected_by: collectedBy || 'admin',
    updated_at: new Date().toISOString(),
  }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/cod');
  revalidatePath('/admin/orders');
  return { success: true };
}

// ── Courier / Dispatch ────────────────────────────────────────
export async function updateOrderDispatch(orderId: string, data: {
  courier: string; tracking_number: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('orders').update({
    courier: data.courier,
    tracking_number: data.tracking_number,
    dispatched_at: new Date().toISOString(),
    status: 'shipped',
    updated_at: new Date().toISOString(),
  }).eq('id', orderId);
  if (error) return { success: false, error: error.message };
  revalidatePath('/admin/orders');
  return { success: true };
}

// ── Loyalty Points ────────────────────────────────────────────
export async function awardLoyaltyPoints(userId: string, orderId: string, orderTotal: number) {
  const supabase = await createClient();
  await supabase.rpc('award_loyalty_points', {
    p_user_id: userId,
    p_order_id: orderId,
    p_order_total: orderTotal,
  });
}
