import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — Sultania Gadgets Pakistan',
  description: 'Terms and conditions for Sultania Gadgets. Read our policies on orders, cash on delivery, returns, and customer responsibilities.',
  keywords: ['sultania gadgets terms', 'online shopping terms pakistan', 'cod terms conditions'],
  alternates: { canonical: 'https://sultaniagadgets.com/terms' },
  openGraph: { title: 'Terms of Service — Sultania Gadgets', description: 'Our terms and conditions for shopping at Sultania Gadgets.', url: 'https://sultaniagadgets.com/terms' },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: April 16, 2026</p>
      
      <div className="blog-content">

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing and using Sultania Gadgets ("Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Website or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use of Website</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Eligibility</h3>
          <p>
            You must be at least 18 years old to make purchases on our Website. By placing an order, you confirm that you meet this age requirement.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Account Responsibility</h3>
          <p>If you create an account, you are responsible for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Maintaining the confidentiality of your password</li>
            <li>All activities that occur under your account</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Providing accurate and current information</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Prohibited Activities</h3>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Website for any illegal purpose</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with the proper functioning of the Website</li>
            <li>Impersonate any person or entity</li>
            <li>Transmit viruses or malicious code</li>
            <li>Scrape or harvest data from the Website</li>
            <li>Use automated systems to access the Website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Products and Pricing</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Product Information</h3>
          <p>
            We strive to provide accurate product descriptions, images, and specifications. However, we do not warrant that product descriptions or other content is accurate, complete, or error-free.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Pricing</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>All prices are in Pakistani Rupees (PKR)</li>
            <li>Prices are subject to change without notice</li>
            <li>We reserve the right to correct pricing errors</li>
            <li>Delivery fees are additional and displayed at checkout</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Product Availability</h3>
          <p>
            Product availability is subject to change. We reserve the right to limit quantities or discontinue products. If a product becomes unavailable after you place an order, we will notify you and offer a refund or alternative.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Orders and Payment</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Order Acceptance</h3>
          <p>
            Your order is an offer to purchase products. We reserve the right to accept or decline any order for any reason, including product availability, errors in pricing, or suspected fraud.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Cash on Delivery (COD)</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Payment is due upon delivery</li>
            <li>Please have exact change ready</li>
            <li>Orders may be canceled if payment is not received</li>
            <li>COD may not be available in all areas</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Order Confirmation</h3>
          <p>
            You will receive an order confirmation via SMS or email (if provided). This confirmation does not constitute acceptance of your order. We will notify you when your order is dispatched.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Shipping and Delivery</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Delivery Areas</h3>
          <p>
            We deliver to major cities across Pakistan. Delivery times and fees vary by location. Remote areas may have longer delivery times or additional charges.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Delivery Time</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard delivery: 3-7 business days</li>
            <li>Delivery times are estimates, not guarantees</li>
            <li>Delays may occur due to weather, holidays, or courier issues</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Delivery Responsibility</h3>
          <p>
            You are responsible for providing accurate delivery information. We are not liable for delays or non-delivery due to incorrect addresses or unavailability at the delivery location.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.4 Inspection Upon Delivery</h3>
          <p>
            Please inspect your order upon delivery. Report any damage or discrepancies to the courier and contact us within 24 hours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Returns and Exchanges</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Return Policy</h3>
          <p>We accept returns under the following conditions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Product is defective or damaged</li>
            <li>Wrong product was delivered</li>
            <li>Return request made within 7 days of delivery</li>
            <li>Product is unused and in original packaging</li>
            <li>All accessories and documentation included</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Non-Returnable Items</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Products with broken seals or tampered packaging</li>
            <li>Used or damaged products (unless defective)</li>
            <li>Products without original packaging</li>
            <li>Sale or clearance items (unless defective)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Exchange Process</h3>
          <p>To request an exchange:</p>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Contact us via WhatsApp or email within 7 days</li>
            <li>Provide order number and reason for exchange</li>
            <li>Send photos of the product and packaging</li>
            <li>Wait for approval before returning the product</li>
            <li>Ship the product back (return shipping may apply)</li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.4 Refunds</h3>
          <p>
            Approved refunds will be processed within 7-14 business days. Refund method depends on original payment method. Delivery fees are non-refundable unless the error was ours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Warranty</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Product Warranty</h3>
          <p>
            Products may come with manufacturer warranties. Warranty terms vary by product and manufacturer. We are not responsible for manufacturer warranty claims.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2 Disclaimer</h3>
          <p>
            Except as required by law, products are provided "as is" without warranties of any kind. We do not warrant that products will meet your requirements or be error-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Intellectual Property</h2>
          <p>
            All content on this Website, including text, images, logos, and software, is the property of Sultania Gadgets or its licensors and is protected by copyright and trademark laws.
          </p>
          <p className="mt-4">You may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Copy, reproduce, or distribute Website content</li>
            <li>Use our trademarks or logos without permission</li>
            <li>Create derivative works from our content</li>
            <li>Remove copyright or trademark notices</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Sultania Gadgets shall not be liable for any indirect, incidental, special, or consequential damages arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use or inability to use the Website</li>
            <li>Product defects or malfunctions</li>
            <li>Delivery delays or non-delivery</li>
            <li>Data loss or security breaches</li>
            <li>Third-party actions or services</li>
          </ul>
          <p className="mt-4">
            Our total liability shall not exceed the amount you paid for the product in question.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless Sultania Gadgets from any claims, damages, or expenses arising from your use of the Website, violation of these Terms, or infringement of any rights of another party.
          </p>
        </section>

        <section>
          <h2>11. Privacy</h2>
          <p>
            Your use of the Website is also governed by our <a href="/privacy-policy">Privacy Policy</a>. Please review it to understand how we collect and use your information.
          </p>
        </section>

        <section>
          <h2>12. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Your continued use of the Website after changes constitutes acceptance of the modified Terms.
          </p>
        </section>

        <section>
          <h2>13. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Pakistan.
          </p>
        </section>

        <section>
          <h2>14. Severability</h2>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>15. Contact Information</h2>
          <p>For questions about these Terms, contact us:</p>
          <div className="bg-[#f7f7f7] p-6 rounded-[20px] mt-4">
            <p><strong>Sultania Gadgets</strong></p>
            <p>Email: <a href="mailto:sultaniagadgets7@gmail.com">sultaniagadgets7@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/923009515230">+92 300 9515230</a></p>
            <p>Website: <a href="https://sultaniagadgets.com">sultaniagadgets.com</a></p>
          </div>
        </section>

        <section>
          <p className="text-sm text-gray-500">
            By using our Website and placing orders, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </section>
      </div>
    </div>
  );
}
