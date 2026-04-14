'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductImage } from '@/types';

export function ProductImageGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const prev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, closeLightbox, prev, next]);

  if (!images.length) return (
    <div className="w-full aspect-square bg-[#f7f7f7] rounded-[28px] flex items-center justify-center">
      <span className="text-gray-300 text-sm">No image</span>
    </div>
  );

  return (
    <>
      <div className="space-y-3">
        {/* Main */}
        <button
          onClick={() => openLightbox(active)}
          className="relative w-full aspect-square bg-[#f7f7f7] rounded-[28px] overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2"
          aria-label="Open image in fullscreen"
        >
          <Image
            src={images[active].image_url}
            alt={images[active].alt_text || title}
            fill
            className="object-contain p-10 transition-opacity duration-200"
            sizes="(max-width:768px) 100vw,50vw"
            priority
          />
        </button>

        {/* Thumbs */}
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-[72px] h-[72px] rounded-2xl overflow-hidden bg-[#f7f7f7] transition-all duration-200 ${i === active ? 'ring-2 ring-gray-950 ring-offset-2' : 'opacity-50 hover:opacity-80'}`}
                aria-label={`Image ${i + 1}`}
                aria-pressed={i === active}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${title} ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="72px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-3xl max-h-[85vh] aspect-square mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].alt_text || title}
              fill
              className="object-contain"
              sizes="(max-width:768px) 100vw, 768px"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
