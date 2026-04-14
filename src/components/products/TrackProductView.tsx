'use client';

import { useEffect } from 'react';

const KEY = 'sultania_recently_viewed';
const MAX = 10;

interface RecentItem {
  id: string;
  slug: string;
  title: string;
  price: number;
  image: string;
}

export function TrackProductView({ product }: { product: RecentItem }) {
  useEffect(() => {
    try {
      const existing: RecentItem[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const deduped = existing.filter((p) => p.id !== product.id);
      const updated = [product, ...deduped].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  }, [product]);

  return null;
}
