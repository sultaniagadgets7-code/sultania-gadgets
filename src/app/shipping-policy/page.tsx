import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Sultania Gadgets shipping policy — delivery timelines, COD, and dispatch information.',
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-gray-900">Shipping Policy</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h1>

      <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Delivery Timeframe</h2>
          <p>Orders are typically delivered within <strong>2–4 business days</strong> after confirmation. Delivery times may vary depending on your city and courier availability.</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Karachi, Lahore, Islamabad: 1–2 business days</li>
            <li>Other major cities: 2–3 business days</li>
            <li>Remote areas: 3–5 business days</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Dispatch</h2>
          <p>Orders are dispatched within <strong>1 business day</strong> of confirmation. You will receive a call from our team to confirm your order before dispatch.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Delivery Fee</h2>
          <p>A flat delivery fee of <strong>Rs. 200</strong> applies to all orders across Pakistan.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Cash on Delivery (COD)</h2>
          <p>We offer Cash on Delivery across Pakistan. You pay when you receive your order — no advance payment required.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Order Tracking</h2>
          <p>Once your order is dispatched, we will share the tracking number via WhatsApp or phone call.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Failed Delivery</h2>
          <p>If delivery fails due to an incorrect address or unavailability, we will contact you to reschedule. Repeated failed deliveries may result in order cancellation.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-2">Contact Us</h2>
          <p>For shipping queries, contact us on <Link href="/contact" className="text-blue-700 hover:underline">WhatsApp or our contact page</Link>.</p>
        </section>
      </div>
    </div>
  );
}
