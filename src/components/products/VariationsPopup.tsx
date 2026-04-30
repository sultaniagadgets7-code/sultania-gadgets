'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Variation {
  name: string;
  options: string;
}

interface Props {
  variations: Variation[];
}

export function VariationsPopup({ variations }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (!variations || variations.length === 0) return null;

  const validVariations = variations.filter(v => v.name?.trim() && v.options?.trim());
  if (validVariations.length === 0) return null;

  return (
    <div className="space-y-3">
      {validVariations.map((variation) => {
        const options = variation.options.split(',').map(o => o.trim()).filter(Boolean);
        const isOpen = openDropdown === variation.name;
        const selectedValue = selected[variation.name];

        return (
          <div key={variation.name}>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-wide mb-1.5">
              {variation.name}
              {selectedValue && (
                <span className="ml-2 text-[#0f172a] normal-case font-bold">{selectedValue}</span>
              )}
            </p>

            {/* Chips for small option sets */}
            {options.length <= 6 ? (
              <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelected(prev => ({
                      ...prev,
                      [variation.name]: prev[variation.name] === opt ? '' : opt
                    }))}
                    className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      selectedValue === opt
                        ? 'bg-[#dc2626] text-white border-[#dc2626]'
                        : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#dc2626] hover:text-[#dc2626]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              /* Dropdown for large option sets */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : variation.name)}
                  className="w-full flex items-center justify-between bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm text-[#64748b] hover:border-[#dc2626] transition-colors"
                >
                  <span>{selectedValue || `Select ${variation.name}`}</span>
                  <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                    {options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSelected(prev => ({ ...prev, [variation.name]: opt }));
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#f8fafc] transition-colors ${
                          selectedValue === opt ? 'font-bold text-[#dc2626] bg-[#fef2f2]' : 'text-[#64748b]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
