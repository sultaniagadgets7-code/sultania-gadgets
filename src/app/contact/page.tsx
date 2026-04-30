import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone, Clock } from 'lucide-react';
import { getSiteSettings } from '@/lib/queries';
import { getWhatsAppUrl } from '@/lib/utils';
import { SUPPORT } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Contact Us — Sultania Gadgets Pakistan',
  description: 'Contact Sultania Gadgets via WhatsApp or phone. Fast support for orders, delivery queries, and product questions. Available 9AM-9PM Pakistan time.',
  keywords: ['sultania gadgets contact', 'whatsapp support pakistan', 'tech accessories support', 'order help pakistan'],
  openGraph: { title: 'Contact Sultania Gadgets', description: 'Reach us on WhatsApp for fast support. Available 9AM-9PM.', url: 'https://sultaniagadgets.com/contact', type: 'website' },
  twitter: { card: 'summary', title: 'Contact — Sultania Gadgets', description: 'Reach us on WhatsApp for fast support.' },
  alternates: { canonical: 'https://sultaniagadgets.com/contact' },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const whatsappNumber = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12">
      <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-950">Contact</span>
      </nav>

      <h1 className="font-black text-3xl text-gray-950 mb-2">Contact Us</h1>
      <p className="text-gray-500 text-sm mb-8">We&apos;re here to help. Reach out via WhatsApp for the fastest response.</p>

      <div className="space-y-4">
        <div className="bg-[#f7f7f7] rounded-[20px] p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-gray-950 mb-0.5">WhatsApp (Fastest)</p>
            <p className="text-xs text-gray-500 mb-3">Typical response within 1 hour during business hours</p>
            <a
              href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help with an order.')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-[20px] p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#0a0a0a] rounded-2xl flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-gray-950 mb-0.5">Phone</p>
            <p className="text-xs text-gray-500 mb-1">Call us during business hours</p>
            <a href={`tel:+${whatsappNumber}`} className="text-sm font-bold text-gray-950 hover:text-[#e01e1e] transition-colors">
              +{whatsappNumber}
            </a>
          </div>
        </div>

        <div className="bg-[#f7f7f7] rounded-[20px] p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-[#f7f7f7] border border-gray-200 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </div>
          <div>
            <p className="font-bold text-gray-950 mb-0.5">Support Hours</p>
            <p className="text-sm text-gray-600">{SUPPORT.hours}</p>
            <p className="text-xs text-gray-400 mt-1">Messages outside hours are replied to next business day.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-[20px] p-5 text-sm text-gray-700">
        <p className="font-bold text-gray-950 mb-1">For Order Issues</p>
        <p>Have your Order ID ready when you contact us. You can find it in your order confirmation or in <Link href="/account/orders" className="text-[#e01e1e] font-semibold hover:underline">My Orders</Link>.</p>
      </div>
    </div>
  );
}
