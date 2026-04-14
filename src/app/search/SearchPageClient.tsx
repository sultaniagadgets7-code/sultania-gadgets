'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchPageClient({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 bg-[#f7f7f7] rounded-full px-5 py-3 max-w-xl">
      <Search className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
      <input
        autoFocus
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search chargers, earbuds, cables..."
        className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-0 outline-none"
        aria-label="Search products"
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); router.push('/search'); }}
          className="text-gray-400 hover:text-gray-700"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="bg-[#0a0a0a] text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:bg-gray-800 transition-colors shrink-0"
      >
        Search
      </button>
    </form>
  );
}
