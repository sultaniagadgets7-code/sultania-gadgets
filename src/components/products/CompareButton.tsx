'use client';

import { useCompare } from '@/lib/compare';
import type { Product } from '@/types';

export function CompareButton({ product }: { product: Product }) {
  const { add, remove, isAdded, ids } = useCompare();
  const added = isAdded(product.id);
  const full = ids.length >= 3 && !added;

  function toggle() {
    if (added) remove(product.id);
    else if (!full) add(product);
  }

  return (
    <button
      onClick={toggle}
      disabled={full}
      className={`text-xs font-semibold transition-colors ${
        added
          ? 'text-[#e01e1e] hover:text-red-700'
          : full
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-400 hover:text-gray-700'
      }`}
      aria-label={added ? `Remove ${product.title} from compare` : `Add ${product.title} to compare`}
      aria-pressed={added}
    >
      {added ? '✓ Comparing' : full ? 'Compare full' : '+ Compare'}
    </button>
  );
}
