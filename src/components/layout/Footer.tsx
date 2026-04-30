import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';
import type { Category } from '@/types';
import { NewsletterForm } from '@/components/ui/NewsletterForm';

export function Footer({ whatsappNumber = '923001234567', categories = [] }: {
  whatsappNumber?: string;
  categories?: Pick<Category, 'slug' | 'name'>[];
}) {
  const shopLinks = [
    { href: '/shop', label: 'All Products' },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
  ];
  return (
    <footer className="bg-[#0a0a0f] text-[#94a3b8]"
      style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-6 sm:gap-8 md:gap-10 mb-10 sm:mb-16">

          {/* Brand — mirrors logo position in header */}
          <div className="col-span-1 sm:col-span-2 md:col-span-2">
            {/* Logo - white version for dark background */}
            <div className="mb-4">
              <Image 
                src="/logo-white.svg" 
                alt="Sultania Gadgets" 
                width={160} 
                height={50}
                className="h-10 md:h-12 w-auto object-contain touch-manipulation"
                style={{ touchAction: 'manipulation' }}
              />
            </div>
            <p className="text-sm text-[#94a3b8] leading-relaxed max-w-xs mb-6">
              Genuine tech accessories. Every product tested before dispatch. Cash on delivery across Pakistan.
            </p>
            <a href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help.')}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold uppercase tracking-widest px-5 py-3 rounded-full transition-colors touch-manipulation"
              style={{ touchAction: 'manipulation' }}>
              <MessageCircle className="w-4 h-4" />
              WhatsApp Support
            </a>
          </div>

          {/* Shop — driven from DB categories */}
          <div>
            <p className="label text-[#64748b] mb-5">Shop</p>
            <ul className="space-y-3">
              {shopLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#94a3b8] hover:text-white transition-colors touch-target" style={{ touchAction: 'manipulation' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company — mirrors "About Us" + "Deals & Discounts" nav links */}
          <div>
            <p className="label text-[#64748b] mb-5">Company</p>
            <ul className="space-y-3">
              {[
                { href: '/about',  label: 'About Us' },
                { href: '/blog',   label: 'Blog' },
                { href: '/deals',  label: 'Deals & Discounts' },
                { href: '/bundles', label: 'Product Bundles' },
                { href: '/faq',    label: 'FAQ' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#94a3b8] hover:text-white transition-colors touch-target" style={{ touchAction: 'manipulation' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="label text-[#64748b] mb-5">Legal</p>
            <ul className="space-y-3">
              {[
                { href: '/privacy-policy', label: 'Privacy Policy' },
                { href: '/terms', label: 'Terms of Service' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#94a3b8] hover:text-white transition-colors touch-target" style={{ touchAction: 'manipulation' }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — mirrors "Contact" nav link */}
          <div>
            <p className="label text-[#64748b] mb-5">Contact</p>
            <ul className="space-y-3">
              {[
                { href: '/contact',          label: 'Contact Us' },
                { href: '/track-order',      label: 'Track Order' },
                { href: '/exchange-request', label: 'Exchange Request' },
                { href: '/exchange-policy',  label: 'Exchange Policy' },
                { href: '/shipping-policy',  label: 'Shipping Policy' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-[#94a3b8] hover:text-white transition-colors touch-target" style={{ touchAction: 'manipulation' }}>{label}</Link>
                </li>
              ))}
              <li>
                <a href={getWhatsAppUrl(whatsappNumber, 'Assalamualaikum, I need help.')}
                  target="_blank" rel="noopener noreferrer"
                  className="text-sm text-[#94a3b8] hover:text-white transition-colors touch-target"
                  style={{ touchAction: 'manipulation' }}>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-10">
          <NewsletterForm />
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#64748b]">© {new Date().getFullYear()} Sultania Gadgets. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-[#64748b]">
            <Link href="/about" className="hover:text-[#94a3b8] transition-colors min-h-[44px] flex items-center" style={{ touchAction: 'manipulation' }}>About</Link>
            <Link href="/privacy-policy" className="hover:text-[#94a3b8] transition-colors min-h-[44px] flex items-center" style={{ touchAction: 'manipulation' }}>Privacy</Link>
            <Link href="/terms" className="hover:text-[#94a3b8] transition-colors min-h-[44px] flex items-center" style={{ touchAction: 'manipulation' }}>Terms</Link>
            <Link href="/shipping-policy" className="hover:text-[#94a3b8] transition-colors min-h-[44px] flex items-center" style={{ touchAction: 'manipulation' }}>Shipping</Link>
            <Link href="/exchange-policy" className="hover:text-[#94a3b8] transition-colors min-h-[44px] flex items-center" style={{ touchAction: 'manipulation' }}>Exchange</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
