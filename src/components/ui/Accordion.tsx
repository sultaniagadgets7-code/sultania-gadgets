'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

export function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `faq-panel-${i}`;
        const triggerId = `faq-trigger-${i}`;
        return (
          <div key={i}>
            <button
              id={triggerId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-gray-900 hover:text-gray-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 rounded"
              aria-expanded={isOpen}
              aria-controls={panelId}
            >
              <span>{item.question}</span>
              {isOpen
                ? <Minus className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
                : <Plus className="w-4 h-4 text-gray-400 shrink-0" aria-hidden="true" />
              }
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
            >
              <p className="pb-4 text-sm text-gray-500 leading-relaxed">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
