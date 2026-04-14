import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';

export function Footer({ whatsappNumber = '923001234567' }: { whatsappNumber?: string }) {
  return (
    <footer className="bg-[#0a0a0a] text-gray-500">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">

          {/* Brand — mirrors logo position in header */}
          <div className="col-span-2 md:col-span-2">
            <p className="font-black text-[#e01e1e] text-2xl tracking-[-0.04em] mb-4">SULTANIA</p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs mb-6">
              Genuine tech accessories. Every product tested before dispatch. Cash on delivery across Pakistan.
            </p>
            <a href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help.')}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full transition-colors">
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>

          {/* Shop — mirrors "Shop" nav link */}
          <div>
            <p className="label text-gray-600 mb-5">Shop</p>
            <ul className="space-y-3">
              {[
                { href: '/shop',  label: 'All Products' },
                { href: '/category/chargers',     label: 'Chargers' },
                { href: '/category/earbuds',      label: 'Earbuds' },
                { href: '/category/cables',       label: 'Cables' },
                { href: '/category/power-banks',  label: 'Power Banks' },
                { href: '/category/accessories',  label: 'Accessories' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — mirrors "About Us" + "Deals & Discounts" nav links */}
          <div>
            <p className="label text-gray-600 mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { href: '/about',  label: 'About Us' },
                { href: '/deals',  label: 'Deals & Discounts' },
                { href: '/faq',    label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — mirrors "Contact" nav link */}
          <div>
            <p className="label text-gray-600 mb-5">Contact</p>
            <ul className="space-y-3">
              {[
                { href: '/contact',          label: 'Contact Us' },
                { href: '/track-order',      label: 'Track Order' },
                { href: '/exchange-request', label: 'Exchange Request' },
                { href: '/shipping-policy',  label: 'Shipping Policy' },
                { href: '/exchange-policy',  label: 'Exchange Policy' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-500 hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
              <li>
                <a href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help.')}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:text-white transition-colors">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 pb-20 md:pb-0">
          <p className="text-xs text-gray-700">© {new Date().getFullYear()} Sultania Gadgets. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-gray-700">
            <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
            <Link href="/shipping-policy" className="hover:text-gray-400 transition-colors">Shipping</Link>
            <Link href="/exchange-policy" className="hover:text-gray-400 transition-colors">Exchange</Link>
            <Link href="/faq" className="hover:text-gray-400 transition-colors">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
