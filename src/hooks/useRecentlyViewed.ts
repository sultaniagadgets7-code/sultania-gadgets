'use client';
import { useEffect } from 'react';

const KEY = 'sultania_recently_viewed';
const MAX = 6;

export function useTrackRecentlyViewed(productId: string) {
  useEffect(() => {
    try {
      const existing: string[] = JSON.parse(localStorage.getItem(KEY) || '[]');
      const updated = [productId, ...existing.filter(id => id !== productId)].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  }, [productId]);
}

export function getRecentlyViewedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
}
