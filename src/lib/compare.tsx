'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/types';

const MAX_COMPARE = 3;
const COMPARE_KEY = 'sultania_compare';

interface CompareContextValue {
  ids: string[];
  products: Product[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
  isAdded: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue>({
  ids: [],
  products: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  isAdded: () => false,
});

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARE_KEY);
      if (stored) setProducts(JSON.parse(stored));
    } catch {}
  }, []);

  function persist(items: Product[]) {
    setProducts(items);
    try {
      localStorage.setItem(COMPARE_KEY, JSON.stringify(items));
    } catch {}
  }

  const add = useCallback((product: Product) => {
    setProducts((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      const next = [...prev, product];
      try { localStorage.setItem(COMPARE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== id);
      try { localStorage.setItem(COMPARE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    persist([]);
  }, []);

  const isAdded = useCallback((id: string) => products.some((p) => p.id === id), [products]);

  return (
    <CompareContext.Provider value={{ ids: products.map((p) => p.id), products, add, remove, clear, isAdded }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
