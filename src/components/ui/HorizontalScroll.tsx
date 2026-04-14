'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HorizontalScroll({ children, className, showArrows = true }: {
  children: React.ReactNode; className?: string; showArrows?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === 'right' ? ref.current.clientWidth * 0.8 : -ref.current.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className="relative group/scroll">
      {showArrows && (
        <button onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all hover:scale-105"
          aria-label="Scroll left">
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>
      )}
      <div ref={ref}
        className={cn('flex gap-4 overflow-x-auto no-scrollbar', className)}
        style={{ WebkitOverflowScrolling: 'touch' }}>
        {children}
      </div>
      {showArrows && (
        <button onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 bg-white border border-gray-200 rounded-full shadow-md items-center justify-center opacity-0 group-hover/scroll:opacity-100 transition-all hover:scale-105"
          aria-label="Scroll right">
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>
      )}
    </div>
  );
}
