import type { Metadata } from 'next';
import Link from 'next/link';
import { getFaqItems } from '@/lib/queries';
import { Accordion } from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: 'FAQ — Sultania Gadgets Pakistan',
  description: 'Frequently asked questions about ordering, delivery, cash on delivery, and products at Sultania Gadgets Pakistan.',
  keywords: ['sultania gadgets faq', 'cash on delivery pakistan', 'delivery time pakistan', 'genuine products pakistan'],
  alternates: { canonical: 'https://sultaniagadgets.com/faq' },
  openGraph: { title: 'FAQ — Sultania Gadgets', description: 'Everything you need to know before ordering from Sultania Gadgets.', url: 'https://sultaniagadgets.com/faq' },
  twitter: { card: 'summary', title: 'FAQ — Sultania Gadgets', description: 'Everything you need to know before ordering.' },
};

export default async function FaqPage() {
  const faqs = await getFaqItems();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
      {/* FAQ JSON-LD for Google rich results */}
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        })}} />
      )}
      <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-950 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-950">FAQ</span>
      </nav>

      <h1 className="font-black text-3xl text-gray-950 mb-2">Frequently Asked Questions</h1>
      <p className="text-gray-500 text-sm mb-8">Everything you need to know before ordering.</p>

      {faqs.length > 0 ? (
        <div className="bg-[#f7f7f7] rounded-[20px] px-6">
          <Accordion items={faqs} />
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No FAQs available yet.</p>
      )}

      <div className="mt-8 bg-[#f7f7f7] rounded-[20px] p-5 text-sm">
        <p className="font-bold text-gray-950 mb-1">Still have questions?</p>
        <p className="text-gray-500">
          Contact us on <Link href="/contact" className="text-[#e01e1e] font-semibold hover:underline">WhatsApp</Link> — we respond fast.
        </p>
      </div>
    </div>
  );
}
