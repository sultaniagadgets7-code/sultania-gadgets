import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp, rateLimitResponse, rateLimitConfigs } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  // Rate limiting: 30 requests per minute
  const clientIp = getClientIp(req);
  const { success, remaining, reset } = await rateLimit(`coupon:${clientIp}`, rateLimitConfigs.api);
  
  if (!success) {
    return rateLimitResponse(reset);
  }

  try {
    const { code, orderTotal } = await req.json();

    if (!code || typeof orderTotal !== 'number') {
      return NextResponse.json({ valid: false, message: 'Invalid request' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon has expired' });
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ valid: false, message: 'Coupon usage limit reached' });
    }

    // Check minimum order value
    if (orderTotal < coupon.min_order_value) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order value is Rs. ${coupon.min_order_value}`,
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discount_type === 'percent') {
      discount = Math.round((orderTotal * coupon.discount_value) / 100);
    } else {
      discount = coupon.discount_value;
    }

    return NextResponse.json({
      valid: true,
      discount,
      couponId: coupon.id,
      code: coupon.code,
    }, {
      headers: {
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      }
    });
  } catch (err) {
    return NextResponse.json({ valid: false, message: 'Server error' }, { status: 500 });
  }
}
