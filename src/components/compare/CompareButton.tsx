'use client';

import { useState } from 'react';
import { Scale } from 'lucide-react';
import { useCompare } from '@/lib/compare';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface CompareButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md';
}

export function CompareButton({ product, className, size = 'md' }: CompareButtonProps) {
  const { products, add, remove } = useCompare();
  const [loading, setLoading] = useState(false);
  const isInCompare = products.some((p) => p.id === product.id);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    
    if (isInCompare) {
      remove(product.id);
    } else {
      if (products.length >= 4) {
        alert('You can compare up to 4 products at a time');
      } else {
        add(product);
      }
    }
    
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold uppercase tracking-widest rounded-full transition-all disabled:opacity-50 touch-manipulation',
        size === 'sm' ? 'text-xs px-4 py-2.5 touch-target' : 'text-sm px-6 py-3 touch-target',
        isInCompare
          ? 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
          : 'bg-white/90 text-[#64748b] hover:bg-[#f8fafc] border border-[#e2e8f0]',
        className
      )}
      aria-label={isInCompare ? 'Remove from compare' : 'Add to compare'}
      style={{ touchAction: 'manipulation' }}>
      <Scale className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
      {isInCompare ? 'In Compare' : 'Compare'}
    </button>
  );
}
