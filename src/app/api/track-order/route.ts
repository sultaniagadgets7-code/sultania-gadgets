import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { phone, orderId } = await req.json();
    const supabase = createAdminClient();

    if (orderId) {
      // Search by order ID
      const cleaned = orderId.trim().toUpperCase();
      let query = supabase
        .from('orders')
        .select('id, customer_name, status, total, created_at, city, order_items(product_title_snapshot, quantity)');

      if (cleaned.length === 36 || cleaned.includes('-')) {
        query = query.eq('id', cleaned.toLowerCase());
      } else {
        query = query.ilike('id', `${cleaned.toLowerCase()}%`);
      }

      const { data, error } = await query.limit(5);
      if (error) return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
      return NextResponse.json({ orders: data ?? [] });
    }

    if (phone) {
      const raw = phone.replace(/[\s\-]/g, '');
      const formats: string[] = [];
      if (raw.startsWith('+92')) {
        formats.push(raw, '0' + raw.slice(3), raw.slice(1));
      } else if (raw.startsWith('92')) {
        formats.push(raw, '+' + raw, '0' + raw.slice(2));
      } else if (raw.startsWith('0')) {
        formats.push(raw, '+92' + raw.slice(1), '92' + raw.slice(1));
      } else {
        formats.push(raw, '0' + raw, '+92' + raw);
      }

      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, status, total, created_at, city, order_items(product_title_snapshot, quantity)')
        .in('phone', formats)
        .order('created_at', { ascending: false });

      if (error) return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
      return NextResponse.json({ orders: data ?? [] });
    }

    return NextResponse.json({ error: 'Phone or order ID required.' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
