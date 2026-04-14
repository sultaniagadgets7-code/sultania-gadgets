import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exchange & Return Policy',
  description: 'Sultania Gadgets exchange and return policy — how we handle defective or incorrect items.',
};

export default function ExchangePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Exchange Policy</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Exchange & Return Policy</h1>

      <div className="space-y-6 text-gray-700 text-sm">
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="font-semibold text-green-800">Our Commitment</p>
          <p className="text-green-700 mt-1">Every product is tested before dispatch. If you receive a defective or incorrect item, we will make it right.</p>
        </div>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Exchange Eligibility</h2>
          <p>You are eligible for an exchange if:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>The product is defective or not working</li>
            <li>The wrong item was delivered</li>
            <li>The product is significantly different from what was shown</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Exchange Window</h2>
          <p>Exchange requests must be raised within <strong>3 days</strong> of receiving the product. Contact us on WhatsApp with a photo or video of the issue.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Non-Eligible Cases</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Physical damage caused by the customer</li>
            <li>Change of mind after delivery</li>
            <li>Products with broken seals or missing accessories (unless defective)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">How to Request an Exchange</h2>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Contact us on WhatsApp within 3 days of delivery</li>
            <li>Share a clear photo or video of the issue</li>
            <li>We will arrange a pickup and send a replacement</li>
          </ol>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Refunds</h2>
          <p>We do not offer cash refunds. All eligible cases are handled through product exchange.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Contact</h2>
          <p>Reach us on <Link href="/contact" className="text-blue-700 hover:underline">WhatsApp or our contact page</Link> for any exchange requests.</p>
        </section>
      </div>
    </div>
  );
}
