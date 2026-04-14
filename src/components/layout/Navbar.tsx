'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Search, X, Menu, ChevronDown } from 'lucide-react';
import { CartIcon } from '@/components/cart/CartIcon';
import { AccountMenu } from '@/components/auth/AccountMenu';

const categoryIcons: Record<string, string> = {
  chargers: '⚡', earbuds: '🎧', cables: '🔗',
  accessories: '📱', 'power-banks': '🔋', adapters: '🔄',
};

interface NavbarProps {
  categories?: { id: string; name: string; slug: string }[];
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
    { href: '/',      label: 'Home' },
    { href: '/shop',  label: 'Shop' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_0_#f0f0f0]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px] md:h-[68px]">

          {/* Logo */}
          <Link href="/" className="font-black text-[#e01e1e] text-xl tracking-[-0.04em] shrink-0">
            SULTANIA
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map(({ href, label, red }) => (
              <Link key={href} href={href}
                className={`text-sm font-medium rounded-full transition-all duration-150 ${
                  red
                    ? 'text-[#e01e1e] font-bold fire-glow px-4 py-2'
                    : pathname === href
                    ? 'text-[#0a0a0a] bg-gray-100 font-semibold px-4 py-2'
                    : 'text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50 px-4 py-2'
                }`}>
                {label}
              </Link>
            ))}

            {/* Categories dropdown */}
            <div className="relative" ref={catRef}>
              <button
                onClick={() => setCatOpen(!catOpen)}
                onMouseEnter={() => setCatOpen(true)}
                className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  catOpen ? 'text-[#0a0a0a] bg-gray-100' : 'text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50'
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
                  className="absolute top-full left-0 mt-1 w-56 bg-white rounded-[20px] shadow-xl border border-gray-100 py-2 z-50 fade-up">
                  <Link href="/shop"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-[#f7f7f7] hover:text-[#0a0a0a] transition-colors rounded-xl mx-1">
                    <span className="text-base" aria-hidden="true">🛍️</span>
                    All Products
                  </Link>
                  <div className="border-t border-gray-100 my-1.5" />
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-[#f7f7f7] hover:text-[#0a0a0a] transition-colors rounded-xl mx-1">
                      <span className="text-base w-6 text-center" aria-hidden="true">
                        {categoryIcons[cat.slug] || '📦'}
                      </span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Deals — after Categories, with fire glow */}
            <Link href="/deals"
              className="text-sm font-bold text-[#e01e1e] fire-glow px-4 py-2 rounded-full transition-all duration-150">
              Deals &amp; Discounts
            </Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-[#0a0a0a]"
              aria-label="Search">
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <CartIcon />
            <AccountMenu />
            <Link href="/contact"
              className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-gray-500 hover:text-[#0a0a0a] rounded-full hover:bg-gray-50 transition-colors">
              Contact
            </Link>
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 py-3 fade-up">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              <input autoFocus type="search" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search chargers, earbuds, cables..."
                className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none py-1"
                aria-label="Search products" />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white fade-up">
          <div className="max-w-7xl mx-auto px-5 py-3 space-y-0.5">

            {/* Main links */}
            {navLinks.map(({ href, label, red }) => (
              <Link key={href} href={href}
                className={`flex items-center py-3 text-sm font-semibold border-b border-gray-50 transition-colors ${
                  red ? 'text-[#e01e1e]' : 'text-gray-700 hover:text-[#e01e1e]'
                }`}>
                {label}
              </Link>
            ))}

            {/* Categories accordion */}
            <div className="border-b border-gray-50">
              <button
                onClick={() => setMobileCatOpen(!mobileCatOpen)}
                className="flex items-center justify-between w-full py-3 text-sm font-semibold text-gray-700 hover:text-[#e01e1e] transition-colors"
                aria-expanded={mobileCatOpen}>
                Categories
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileCatOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {mobileCatOpen && (
                <div className="pb-2 space-y-0.5 fade-up">
                  <Link href="/shop"
                    className="flex items-center gap-3 py-2.5 pl-4 text-sm text-gray-600 hover:text-[#e01e1e] transition-colors">
                    <span aria-hidden="true">🛍️</span> All Products
                  </Link>
                  {categories.map((cat) => (
                    <Link key={cat.id} href={`/category/${cat.slug}`}
                      className="flex items-center gap-3 py-2.5 pl-4 text-sm text-gray-600 hover:text-[#e01e1e] transition-colors">
                      <span aria-hidden="true">{categoryIcons[cat.slug] || '📦'}</span>
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="flex items-center py-3 text-sm font-semibold text-gray-700 hover:text-[#e01e1e] transition-colors border-b border-gray-50">
              About Us
            </Link>
            <Link href="/contact" className="flex items-center py-3 text-sm font-semibold text-gray-700 hover:text-[#e01e1e] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
