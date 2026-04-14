import type { Metadata } from 'next';
import { CartCheckout } from './CartCheckout';
import { getSiteSettings, getProfileForCheckout } from '@/lib/queries';

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage() {
  const [settings, profile] = await Promise.all([getSiteSettings(), getProfileForCheckout()]);
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';
  const deliveryFee = settings?.delivery_fee ?? 200;
  return <CartCheckout whatsappNumber={wa} profile={profile} deliveryFee={deliveryFee} />;
}
