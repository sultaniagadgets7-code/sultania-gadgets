import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit, getClientIp, rateLimitResponse, rateLimitConfigs } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = getClientIp(request);
    const { success, reset } = await rateLimit(
      `newsletter:${ip}`,
      rateLimitConfigs.contact
    );

    if (!success) {
      return rateLimitResponse(reset);
    }

    const { email } = await request.json();

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 400 }
        );
      }
      
      // Reactivate if previously unsubscribed
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', subscribed_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // New subscriber
      await supabase.from('newsletter_subscribers').insert({
        email: email.toLowerCase(),
        status: 'active',
        source: 'website',
      });
    }

    // TODO: Send welcome email via Resend
    // await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
