import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Sultania Gadgets Pakistan',
  description: 'Privacy policy for Sultania Gadgets. Learn how we collect, use, and protect your personal information when you shop with us.',
  keywords: ['sultania gadgets privacy', 'data protection pakistan', 'online shopping privacy'],
  alternates: { canonical: 'https://sultaniagadgets.com/privacy-policy' },
  openGraph: { title: 'Privacy Policy — Sultania Gadgets', description: 'How we protect your data at Sultania Gadgets.', url: 'https://sultaniagadgets.com/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
      <h1 className="font-black text-3xl text-gray-950 mb-2">Privacy Policy</h1>
      <p className="text-gray-400 text-sm mb-10">Last updated: April 16, 2026</p>
      
      <div className="blog-content">

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Sultania Gadgets ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Personal Information</h3>
          <p>When you place an order or create an account, we collect:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full name</li>
            <li>Phone number</li>
            <li>Delivery address</li>
            <li>City</li>
            <li>Email address (optional, for order updates)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Order Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Products purchased</li>
            <li>Order amount</li>
            <li>Delivery preferences</li>
            <li>Order notes</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Technical Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate order status and delivery updates</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send promotional offers (with your consent)</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share your data with:</p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Service Providers</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Delivery couriers (for order fulfillment)</li>
            <li>Payment processors (for COD verification)</li>
            <li>Email service providers (for order notifications)</li>
            <li>Analytics providers (Google Analytics)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Legal Requirements</h3>
          <p>We may disclose your information if required by law or to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comply with legal processes</li>
            <li>Protect our rights and property</li>
            <li>Prevent fraud or illegal activities</li>
            <li>Ensure user safety</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS encryption for all data transmission</li>
            <li>Secure database with row-level security</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
            <li>Encrypted password storage</li>
          </ul>
          <p className="mt-4">
            However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2>6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Data Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Object:</strong> Object to processing of your data</li>
          </ul>
          <p>
            To exercise these rights, contact us at: <a href="mailto:sultaniagadgets7@gmail.com">sultaniagadgets7@gmail.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Remember your preferences</li>
            <li>Analyze website traffic (Google Analytics)</li>
            <li>Improve user experience</li>
            <li>Enable shopping cart functionality</li>
          </ul>
          <p className="mt-4">
            You can control cookies through your browser settings. Disabling cookies may affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Third-Party Services</h2>
          <p>Our website uses third-party services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
            <li><strong>Tawk.to:</strong> Live chat support</li>
            <li><strong>Supabase:</strong> Database and authentication</li>
            <li><strong>Vercel:</strong> Website hosting</li>
          </ul>
          <p className="mt-4">
            These services have their own privacy policies. We recommend reviewing them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
          <p>
            Our website is not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Data Retention</h2>
          <p>We retain your personal data for as long as necessary to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fulfill orders and provide services</li>
            <li>Comply with legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p className="mt-4">
            Order history is retained for 7 years for accounting and legal purposes. Account data is deleted upon request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">11. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries outside Pakistan. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">12. Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>If you have questions about this privacy policy or your data, contact us:</p>
          <div className="bg-[#f7f7f7] p-6 rounded-[20px] mt-4">
            <p><strong>Sultania Gadgets</strong></p>
            <p>Email: <a href="mailto:sultaniagadgets7@gmail.com">sultaniagadgets7@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/923009515230">+92 300 9515230</a></p>
            <p>Website: <a href="https://sultaniagadgets.com">sultaniagadgets.com</a></p>
          </div>
        </section>

        <section>
          <p className="text-sm text-gray-500">
            By using our website and services, you acknowledge that you have read and understood this privacy policy and agree to its terms.
          </p>
        </section>
      </div>
    </div>
  );
}
