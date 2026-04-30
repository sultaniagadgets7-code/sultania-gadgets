import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Shipping Policy — Sultania Gadgets Pakistan',
  description: 'Flat Rs. 200 delivery fee across Pakistan. 2-4 day delivery to major cities. Cash on delivery. Learn about our shipping policy.',
  alternates: { canonical: 'https://sultaniagadgets.com/shipping-policy' },
};

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-2">Shipping Policy</h1>
      <p className="text-gray-500 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Delivery Areas</h2>
          <p className="text-gray-700 leading-relaxed">
            We deliver to all major cities across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, 
            Faisalabad, Multan, Peshawar, Quetta, Sialkot, Gujranwala, and more. We also deliver to remote 
            areas through our courier partners.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Delivery Time</h2>
          <div className="bg-[#f7f7f7] rounded-2xl p-5 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Major Cities</span>
              <span className="font-semibold text-gray-950">2-4 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Other Cities</span>
              <span className="font-semibold text-gray-950">3-5 business days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Remote Areas</span>
              <span className="font-semibold text-gray-950">5-7 business days</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            * Delivery times may vary during peak seasons or public holidays.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Shipping Charges</h2>
          <div className="bg-[#f7f7f7] rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-950">Flat Rate Shipping</p>
                <p className="text-sm text-gray-500">All orders across Pakistan</p>
              </div>
              <p className="text-2xl font-black text-gray-950">Rs. 200</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Order Tracking</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            Once your order is dispatched, you'll receive:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Order confirmation via SMS and email</li>
            <li>Tracking number for your shipment</li>
            <li>Estimated delivery date</li>
            <li>Courier company details</li>
          </ul>
          <div className="mt-4">
            <Link href="/track-order" 
              className="inline-flex items-center text-sm font-semibold text-[#e01e1e] hover:text-[#c01818] transition-colors">
              Track Your Order →
            </Link>
          </div>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Cash on Delivery (COD)</h2>
          <p className="text-gray-700 leading-relaxed">
            We offer Cash on Delivery for all orders. Pay when you receive your product. 
            Please keep the exact amount ready to avoid delays. Our delivery partner will 
            hand over the product after receiving payment.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Order Confirmation</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            After placing your order:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>We'll call you to confirm your order within 24 hours</li>
            <li>Please confirm your delivery address and contact number</li>
            <li>Your order will be dispatched after confirmation</li>
            <li>You'll receive tracking details via SMS</li>
          </ol>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Delivery Issues</h2>
          <p className="text-gray-700 leading-relaxed mb-3">
            If you face any delivery issues:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Contact us immediately via WhatsApp or phone</li>
            <li>Provide your order number and tracking details</li>
            <li>We'll coordinate with the courier to resolve the issue</li>
            <li>Redelivery will be arranged if needed</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-xl text-gray-950 mb-3">Product Inspection</h2>
          <p className="text-gray-700 leading-relaxed">
            You have the right to inspect the product before making payment. If the product 
            is damaged or not as described, you can refuse delivery. Please inform us 
            immediately so we can arrange a replacement.
          </p>
        </section>

        <section className="bg-[#f7f7f7] rounded-2xl p-6">
          <h2 className="font-bold text-xl text-gray-950 mb-3">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            For shipping inquiries or support, contact us:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" 
              className="inline-flex items-center bg-[#0a0a0a] text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
              Contact Us
            </Link>
            <Link href="/faq" 
              className="inline-flex items-center border border-gray-200 text-gray-600 font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-full hover:bg-gray-50 transition-colors">
              View FAQs
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
