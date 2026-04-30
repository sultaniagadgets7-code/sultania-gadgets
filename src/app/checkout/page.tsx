import { getSiteSettings, getProfileForCheckout } from '@/lib/queries';
import { createClient } from '@/lib/supabase/server';
import { CartCheckout } from './CartCheckout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  // Allow guest checkout — don't redirect if not logged in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [settings, profile] = await Promise.all([
    getSiteSettings(),
    user ? getProfileForCheckout() : Promise.resolve(null),
  ]);

  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const deliveryFee = settings?.delivery_fee ?? 200;

  return <CartCheckout whatsappNumber={wa} profile={profile} deliveryFee={deliveryFee} isGuest={!user} />;
}
