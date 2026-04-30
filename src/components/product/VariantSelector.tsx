'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Variant {
  id: string;
  name: string;
  price?: number;
  stock: number;
  image?: string;
  attributes: Record<string, string>;
  is_default: boolean;
}

interface VariantAttribute {
  attribute_name: string;
  attribute_values: string[];
}

interface Props {
  variants: Variant[];
  attributes: VariantAttribute[];
  basePrice: number;
  onVariantChange: (variant: Variant) => void;
}

export function VariantSelector({ variants, attributes, basePrice, onVariantChange }: Props) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(() => {
    const defaultVariant = variants.find(v => v.is_default) || variants[0];
    return defaultVariant?.attributes || {};
  });

  // Find matching variant based on selected attributes
  const currentVariant = variants.find(v => {
    return Object.keys(selectedAttributes).every(
      key => v.attributes[key] === selectedAttributes[key]
    );
  });

  const handleAttributeChange = (attrName: string, value: string) => {
    const newSelection = { ...selectedAttributes, [attrName]: value };
    setSelectedAttributes(newSelection);

    // Find and notify parent of variant change
    const matchingVariant = variants.find(v => {
      return Object.keys(newSelection).every(
        key => v.attributes[key] === newSelection[key]
      );
    });

    if (matchingVariant) {
      onVariantChange(matchingVariant);
    }
  };

  // Check if a specific attribute value is available
  const isValueAvailable = (attrName: string, value: string) => {
    const testSelection = { ...selectedAttributes, [attrName]: value };
    return variants.some(v => {
      return Object.keys(testSelection).every(
        key => v.attributes[key] === testSelection[key]
      ) && v.stock > 0;
    });
  };

  return (
    <div className="space-y-6">
      {/* Variant Image */}
      {currentVariant?.image && (
        <div className="relative h-20 w-20 rounded border">
          <Image
            src={currentVariant.image}
            alt={currentVariant.name}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      {/* Price */}
      <div className="text-2xl font-bold">
        Rs. {(currentVariant?.price || basePrice).toLocaleString()}
      </div>

      {/* Attribute Selectors */}
      {attributes.map((attr) => (
        <div key={attr.attribute_name}>
          <label className="block text-sm font-semibold mb-2">
            {attr.attribute_name}
          </label>
          <div className="flex flex-wrap gap-2">
            {attr.attribute_values.map((value) => {
              const isSelected = selectedAttributes[attr.attribute_name] === value;
              const isAvailable = isValueAvailable(attr.attribute_name, value);

              return (
                <button
                  key={value}
                  onClick={() => handleAttributeChange(attr.attribute_name, value)}
                  disabled={!isAvailable}
                  className={`
                    px-4 py-2 border rounded transition
                    ${isSelected 
                      ? 'border-black bg-black text-white' 
                      : 'border-gray-300 hover:border-black'
                    }
                    ${!isAvailable && 'opacity-50 cursor-not-allowed line-through'}
                  `}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Stock Status */}
      {currentVariant && (
        <div className="text-sm">
          {currentVariant.stock > 0 ? (
            <span className="text-green-600">
              ✓ In Stock ({currentVariant.stock} available)
            </span>
          ) : (
            <span className="text-red-600">✗ Out of Stock</span>
          )}
        </div>
      )}
    </div>
  );
}
