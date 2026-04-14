'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors focus-visible:outline-none"
            aria-expanded={open === i}>
            <span>{item.question}</span>
            {open === i ? <Minus className="w-4 h-4 text-gray-400 shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          {open === i && (
            <p className="pb-4 text-sm text-gray-500 leading-relaxed fade-up">{item.answer}</p>
          )}
        </div>
      ))}
    </div>
  );
}
