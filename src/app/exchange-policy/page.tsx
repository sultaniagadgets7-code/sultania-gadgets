import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Exchange Policy — Sultania Gadgets Pakistan',
  description: 'Free exchange on defective or wrong products within 7 days. Easy exchange process. Cash on delivery. Learn about our exchange policy.',
  alternates: { canonical: 'https://sultaniagadgets.com/exchange-policy' },
};

export default function ExchangePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-2">Exchange Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Exchange Eligibility</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Products can be exchanged within <strong>7 days of delivery</strong> if:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-[#f7f7f7] rounded-2xl p-4">
              <span className="text-2xl">🔧</span>
              <div>
                <p className="font-semibold text-gray-950">Defective Product</p>
                <p className="text-sm text-gray-600">Product has manufacturing defects or doesn't work properly</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#f7f7f7] rounded-2xl p-4">
              <span className="text-2xl">📦</span>
              <div>
                <p className="font-semibold text-gray-950">Wrong Product</p>
                <p className="text-sm text-gray-600">You received a different product than what you ordered</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#f7f7f7] rounded-2xl p-4">
              <span className="text-2xl">❌</span>
              <div>
                <p className="font-semibold text-gray-950">Doesn't Match Description</p>
                <p className="text-sm text-gray-600">Product specifications don't match the listing</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-[#f7f7f7] rounded-2xl p-4">
              <span className="text-2xl">💔</span>
              <div>
                <p className="font-semibold text-gray-950">Damaged in Transit</p>
                <p className="text-sm text-gray-600">Product arrived damaged or broken</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Exchange Process</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e01e1e] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <p className="font-semibold text-gray-950">Submit Request</p>
                <p className="text-sm text-gray-600">Go to your order details and click "Request Exchange" or contact us via WhatsApp</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e01e1e] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <p className="font-semibold text-gray-950">Review & Approval</p>
                <p className="text-sm text-gray-600">Our team will review your request within 24 hours and approve if eligible</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e01e1e] text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <p className="font-semibold text-gray-950">Pickup Arrangement</p>
                <p className="text-sm text-gray-600">We'll arrange pickup of the defective product from your address</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e01e1e] text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <p className="font-semibold text-gray-950">Inspection</p>
                <p className="text-sm text-gray-600">Product will be inspected to verify the issue</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#e01e1e] text-white rounded-full flex items-center justify-center font-bold text-sm">5</div>
              <div>
                <p className="font-semibold text-gray-950">Replacement Dispatch</p>
                <p className="text-sm text-gray-600">Replacement product will be sent to you within 3-5 business days</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Non-Exchangeable Items</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            The following items cannot be exchanged:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Products with physical damage caused by customer misuse</li>
            <li>Products with missing accessories, cables, or original packaging</li>
            <li>Products used beyond normal testing (scratches, wear and tear)</li>
            <li>Products without original invoice or order number</li>
            <li>Products purchased from unauthorized sellers</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Exchange Charges</h2>
          <div className="bg-[#f7f7f7] rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-950">Defective Products</p>
                <p className="text-sm text-gray-500">Manufacturing defects or wrong items</p>
              </div>
              <p className="text-lg font-black text-green-600">FREE</p>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-950">Change of Mind</p>
                <p className="text-sm text-gray-500">Customer preference or size issues</p>
              </div>
              <p className="text-lg font-black text-gray-950">Rs. 200</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Important Notes</h2>
          <div className="bg-[#fff3cd] border border-[#ffc107] rounded-2xl p-5 space-y-2">
            <p className="text-sm text-[#856404]">
              <strong>⚠️ Please Note:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-[#856404]">
              <li>Keep the original packaging until you're satisfied with the product</li>
              <li>Take photos/videos while unboxing if you suspect damage</li>
              <li>Report issues within 24 hours of delivery for faster processing</li>
              <li>Exchange is subject to product availability</li>
              <li>If replacement is not available, we'll offer a full refund</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Refund Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            If a replacement is not available or you prefer a refund, we'll process a full refund 
            within 7-10 business days after receiving and inspecting the returned product. Refunds 
            will be issued via bank transfer or mobile wallet.
          </p>
        </section>

        <section className="bg-[#f7f7f7] rounded-2xl p-6">
          <h2 className="font-bold text-xl text-gray-950 mb-3">Request an Exchange</h2>
          <p className="text-gray-700 mb-4">
            Need to exchange a product? We're here to help!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/account/orders" 
              className="inline-flex items-center bg-[#e01e1e] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-[#c01818] transition-colors">
              View My Orders
            </Link>
            <Link href="/contact" 
              className="inline-flex items-center border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
              Contact Support
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
