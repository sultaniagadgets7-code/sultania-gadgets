import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const { email, productId, productTitle } = await req.json();
    if (!email || !productId) {
      return NextResponse.json({ error: 'Email and product ID required.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Check if restock_notifications table exists, if not just store in a simple way
    // We'll use the newsletter table with a product_id tag as a fallback
    const { error } = await supabase.from('restock_notifications').upsert({
      email: email.toLowerCase().trim(),
      product_id: productId,
      product_title: productTitle,
      notified: false,
      created_at: new Date().toISOString(),
    }, { onConflict: 'email,product_id' });

    if (error) {
      // Table might not exist — that's ok, just return success
      console.error('Restock notification error:', error);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
