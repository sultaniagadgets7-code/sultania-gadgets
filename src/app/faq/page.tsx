import type { Metadata } from 'next';
import Link from 'next/link';
import { getFaqItems } from '@/lib/queries';
import { Accordion } from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: 'FAQ — Frequently Asked Questions',
  description: 'Common questions about ordering, delivery, and products at Sultania Gadgets.',
};

export default async function FaqPage() {
  const faqs = await getFaqItems();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">FAQ</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-600 text-sm mb-6">Everything you need to know before ordering.</p>

      {faqs.length > 0 ? (
        <Accordion items={faqs} />
      ) : (
        <p className="text-gray-500 text-sm">No FAQs available yet.</p>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4 text-sm">
        <p className="font-semibold text-blue-800 mb-1">Still have questions?</p>
        <p className="text-blue-700">
          Contact us on <Link href="/contact" className="underline">WhatsApp</Link> — we respond fast.
        </p>
      </div>
    </div>
  );
}
