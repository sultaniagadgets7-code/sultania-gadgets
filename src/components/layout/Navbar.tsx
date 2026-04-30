'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Menu, ChevronDown, Heart } from 'lucide-react';
import { CartIcon } from '@/components/cart/CartIcon';
import { AccountMenu } from '@/components/auth/AccountMenu';

const categoryIcons: Record<string, string> = {
  chargers: '⚡', earbuds: '🎧', cables: '🔗',
  accessories: '📱', 'power-banks': '🔋', adapters: '🔄',
};

interface NavbarProps {
  categories?: { id: string; name: string; slug: string; emoji?: string | null }[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const catRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCatOpen(false);
    setMobileCatOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  if (pathname.startsWith('/admin')) return null;

  const navLinks = [
    { href: '/',     label: 'Home', red: false },
    { href: '/shop', label: 'Shop', red: false },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0a0f]/95 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] border-b border-white/5' 
        : 'bg-[#0a0a0f]'
    }`}
      style={{ paddingLeft: 'env(safe-area-inset-left, 0px)', paddingRight: 'env(safe-area-inset-right, 0px)' }}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[64px] md:h-[72px]">

          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center">
            <Image 
              src="/logo-white.svg" 
              alt="Sultania Gadgets" 
              width={160} 
              height={50}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className={`text-sm font-semibold rounded-xl transition-all duration-200 px-4 py-2.5 ${
                  pathname === href
                    ? 'text-white bg-white/10'
                    : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}>
                {label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                onMouseEnter={() => setCatOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                  catOpen ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'
                }`}
                aria-expanded={catOpen}
                aria-haspopup="true">
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {/* Dropdown panel */}
              {catOpen && (
                <div
                  onMouseLeave={() => setCatOpen(false)}
                  className="absolute top-full left-0 mt-2 w-64 bg-[#0a0a0f] rounded-2xl shadow-2xl border border-white/10 py-2 z-50 fade-up">
                  <Link href="/shop"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/8 hover:text-white transition-colors rounded-xl mx-1">
                    <span className="text-base" aria-hidden="true">🛍️</span>
                    All Products
                  </Link>
                  <div className="border-t border-white/10 my-2" />
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/8 hover:text-white transition-colors rounded-xl mx-1">
                      <span className="text-base w-6 text-center" aria-hidden="true">
                        {cat.emoji || categoryIcons[cat.slug] || '📦'}
                      </span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Deals */}
            <Link href="/deals"
              className="text-sm font-bold text-[#dc2626] px-4 py-2.5 rounded-xl transition-all duration-200 hover:bg-[#dc2626]/10">
              🔥 Deals
            </Link>
            <Link href="/bundles"
              className={`text-sm font-semibold rounded-xl transition-all duration-200 px-4 py-2.5 ${
                pathname === '/bundles' ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'
              }`}>
              Bundles
            </Link>
            <Link href="/compare"
              className={`text-sm font-semibold rounded-xl transition-all duration-200 px-4 py-2.5 ${
                pathname === '/compare' ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'
              }`}>
              Compare
            </Link>
            <Link href="/blog"
              className={`text-sm font-semibold rounded-xl transition-all duration-200 px-4 py-2.5 ${
                pathname.startsWith('/blog') ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/8'
              }`}>
              Blog
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white active:scale-95 touch-manipulation"
              aria-label="Search"
              style={{ touchAction: 'manipulation' }}>
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <Link href="/account/wishlist"
              className="hidden md:flex w-11 h-11 items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white/70 hover:text-white active:scale-95 touch-manipulation"
              aria-label="Wishlist"
              style={{ touchAction: 'manipulation' }}>
              <Heart className="w-5 h-5" />
            </Link>
            <CartIcon />
            <AccountMenu />
            <Link href="/contact"
              className="hidden md:flex items-center px-4 py-2.5 text-sm font-semibold text-white/70 hover:text-white rounded-xl hover:bg-white/8 transition-colors">
              Contact
            </Link>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="md:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors text-white/70 active:scale-95 touch-manipulation"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              style={{ touchAction: 'manipulation' }}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-b border-white/10 py-3 fade-up">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-4 h-4 text-white/40 shrink-0" aria-hidden="true" />
              <input autoFocus type="search" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chargers, earbuds, cables..."
                className="flex-1 text-sm text-white placeholder-white/40 bg-transparent border-0 outline-none py-1"
                aria-label="Search products" />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-white/40 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0a0f] fade-up max-h-[80vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-5 py-3 space-y-0.5">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}
                className="flex items-center py-4 text-base font-semibold border-b border-white/8 transition-colors text-white/70 hover:text-white touch-target"
                style={{ touchAction: 'manipulation' }}>
                {label}
              </Link>
            ))}

            <div className="border-b border-white/8">
              <button
                onClick={() => setMobileCatOpen(!mobileCatOpen)}
                className="flex items-center justify-between w-full py-4 text-base font-semibold text-white/70 hover:text-white transition-colors touch-target"
                aria-expanded={mobileCatOpen}
                style={{ touchAction: 'manipulation' }}>
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileCatOpen && (
                <div className="pb-2 space-y-0.5 fade-up">
                  <Link href="/shop"
                    className="flex items-center gap-3 py-3 pl-4 text-base text-white/60 hover:text-white transition-colors touch-target"
                    style={{ touchAction: 'manipulation' }}>
                    <span aria-hidden="true">🛍️</span> All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 py-3 pl-4 text-base text-white/60 hover:text-white transition-colors touch-target"
                      style={{ touchAction: 'manipulation' }}>
                      <span aria-hidden="true">{cat.emoji || categoryIcons[cat.slug] || '📦'}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/bundles" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>Bundles</Link>            <Link href="/deals" className="flex items-center py-4 text-base font-bold text-[#dc2626] hover:text-[#f87171] transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>🔥 Deals & Discounts</Link>
            <Link href="/about" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>About Us</Link>
            <Link href="/contact" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>Contact</Link>
            <Link href="/compare" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>Compare Products</Link>
            <Link href="/blog" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors border-b border-white/8 touch-target" style={{ touchAction: 'manipulation' }}>Blog</Link>
            <Link href="/account/orders" className="flex items-center py-4 text-base font-semibold text-white/70 hover:text-white transition-colors touch-target" style={{ touchAction: 'manipulation' }}>My Account</Link>
          </div>
        </div>
      )}
    </header>
  );
}
