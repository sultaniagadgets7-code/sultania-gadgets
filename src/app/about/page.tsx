import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, ShieldCheck, Truck, CreditCard, RefreshCw, CheckCircle, Users, Award, MapPin } from 'lucide-react';
import { getSiteSettings } from '@/lib/queries';
import { getWhatsAppUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'About Us — Sultania Gadgets',
  description: 'Learn about Sultania Gadgets — Pakistan\'s trusted source for genuine tech accessories with cash on delivery.',
};

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const wa = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923001234567';

  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="bg-[#0a0a0a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle,#e01e1e 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24 text-center">
          <p className="label text-[#e01e1e] mb-5">Our Story</p>
          <h1 className="display text-white mb-6">
            Built on Trust.<br />
            <em className="not-italic text-gray-400">Delivered with Care.</em>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl mx-auto">
            Sultania Gadgets started with one simple goal — give Pakistani customers access to genuine tech accessories they can actually trust.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { n: '100%', l: 'Genuine Products' },
            { n: 'COD',  l: 'Cash on Delivery' },
            { n: '2–4',  l: 'Day Delivery' },
            { n: '24/7', l: 'WhatsApp Support' },
          ].map(({ n, l }) => (
            <div key={l}>
              <p className="text-3xl font-black text-[#0a0a0a] tracking-tight">{n}</p>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <div className="space-y-6 text-gray-600 leading-relaxed">
          <div>
            <p className="label text-gray-400 mb-3">Who We Are</p>
            <h2 className="heading-xl text-gray-950 mb-4">Pakistan&apos;s Trusted Tech Store</h2>
            <p>
              Sultania Gadgets is a Pakistan-based online store specialising in genuine tech accessories — chargers, earbuds, cables, power banks, and more. We serve customers across all major cities with fast delivery and cash on delivery.
            </p>
          </div>
          <p>
            We started because we were frustrated with the market. Too many stores selling fake specs, low-quality products, and misleading listings. Customers were paying good money for accessories that stopped working in days.
          </p>
          <p>
            So we built something different. Every product we sell is sourced carefully, tested before dispatch, and listed with honest specifications. What you see is exactly what you get — no surprises, no fake numbers.
          </p>
          <p>
            We operate on a simple principle: <strong className="text-gray-950">if we wouldn&apos;t use it ourselves, we won&apos;t sell it.</strong>
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f7f7f7] py-16 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="label text-gray-400 mb-2">What We Stand For</p>
            <h2 className="heading-xl">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { icon: ShieldCheck, title: 'Honesty First',       desc: 'We list real specs. No inflated numbers, no misleading descriptions. Ever.' },
              { icon: CheckCircle, title: 'Quality Control',     desc: 'Every product is tested before it leaves our hands. We catch problems before you do.' },
              { icon: CreditCard,  title: 'Cash on Delivery',    desc: 'We believe in earning trust before asking for payment. Pay when you receive.' },
              { icon: Truck,       title: 'Fast Delivery',       desc: 'We dispatch quickly and deliver across Pakistan in 2–4 business days.' },
              { icon: RefreshCw,   title: 'Easy Exchange',       desc: 'Something wrong? We fix it. No long processes, no excuses.' },
              { icon: MessageCircle, title: 'Real Support',      desc: 'You talk to a real person on WhatsApp. Fast, honest, helpful.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-[20px] p-6">
                <div className="w-10 h-10 bg-[#0a0a0a] rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <p className="font-bold text-gray-950 mb-1.5">{title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why trust us */}
      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-16">
        <p className="label text-gray-400 mb-3">Why Customers Choose Us</p>
        <h2 className="heading-xl text-gray-950 mb-8">The Sultania Difference</h2>
        <div className="space-y-4">
          {[
            { q: 'Are your products genuine?',         a: 'Yes. We source directly from verified suppliers and test every product before dispatch. We do not sell counterfeit or low-quality items.' },
            { q: 'Why Cash on Delivery?',              a: 'Because we believe you should see the product before paying. COD is our way of saying we are confident in what we sell.' },
            { q: 'What if I receive a wrong item?',    a: 'Contact us on WhatsApp within 3 days. We will arrange a pickup and send the correct item at no extra cost.' },
            { q: 'Where do you deliver?',              a: 'We deliver across all major cities in Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and more.' },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-4">
              <p className="font-bold text-gray-950 text-sm mb-1.5">{q}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team / Location */}
      <section className="bg-[#f7f7f7] py-16 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-[20px] p-6 text-center">
              <Users className="w-8 h-8 text-[#0a0a0a] mx-auto mb-3" aria-hidden="true" />
              <p className="font-bold text-gray-950">Small Team</p>
              <p className="text-sm text-gray-500 mt-1">A dedicated team that cares about every order</p>
            </div>
            <div className="bg-white rounded-[20px] p-6 text-center">
              <MapPin className="w-8 h-8 text-[#e01e1e] mx-auto mb-3" aria-hidden="true" />
              <p className="font-bold text-gray-950">Based in Pakistan</p>
              <p className="text-sm text-gray-500 mt-1">Shipping from within Pakistan — fast and reliable</p>
            </div>
            <div className="bg-white rounded-[20px] p-6 text-center">
              <Award className="w-8 h-8 text-[#0a0a0a] mx-auto mb-3" aria-hidden="true" />
              <p className="font-bold text-gray-950">Quality Focused</p>
              <p className="text-sm text-gray-500 mt-1">Every product tested before it ships</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="bg-[#0a0a0a] rounded-[28px] px-8 py-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle,#e01e1e 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="relative">
            <p className="label text-gray-500 mb-3">Get in Touch</p>
            <h2 className="heading-xl text-white mb-3">Have a Question?</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
              We&apos;re a real team and we respond fast. Chat with us on WhatsApp.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={getWhatsAppUrl(wa, 'Assalamualaikum, I have a question about Sultania Gadgets.')}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full transition-colors">
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
              <Link href="/shop"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-full hover:border-white hover:text-white transition-colors">
                Browse Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
