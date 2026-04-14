import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Clock } from 'lucide-react';
import { getSiteSettings } from '@/lib/queries';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Contact Sultania Gadgets via WhatsApp or phone for support and order queries.',
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappNumber = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Contact</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-600 text-sm mb-6">We&apos;re here to help. Reach out via WhatsApp for the fastest response.</p>

      <div className="space-y-4">
        <div className="border border-gray-200 rounded p-4 flex items-start gap-4">
          <MessageCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">WhatsApp (Fastest)</p>
            <p className="text-xs text-gray-500 mb-2">Typical response within 1 hour during business hours</p>
            <a
              href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help with an order.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 flex items-start gap-4">
          <Phone className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Phone</p>
            <p className="text-xs text-gray-500 mb-1">Call us during business hours</p>
            <a href={`tel:+${whatsappNumber}`} className="text-blue-700 hover:underline text-sm font-medium">
              +{whatsappNumber}
            </a>
          </div>
        </div>

        <div className="border border-gray-200 rounded p-4 flex items-start gap-4">
          <Clock className="w-6 h-6 text-gray-500 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-gray-900 text-sm">Business Hours</p>
            <p className="text-sm text-gray-600">Monday – Saturday: 10:00 AM – 8:00 PM (PKT)</p>
            <p className="text-sm text-gray-600">Sunday: 12:00 PM – 6:00 PM (PKT)</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-900 mb-1">For Order Issues</p>
        <p>If you have an issue with an existing order, please have your Order ID ready when you contact us. You can find it in the order confirmation message.</p>
      </div>
    </div>
  );
}
