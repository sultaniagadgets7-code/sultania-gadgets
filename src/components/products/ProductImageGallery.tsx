'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn, Share2 } from 'lucide-react';
import type { ProductImage } from '@/types';

export function ProductImageGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const mainRef = useRef<HTMLDivElement>(null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    setZoomed(false);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomed(false);
  }, []);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + images.length) % images.length);
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % images.length);
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
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

  // Touch swipe support
  const touchStartX = useRef(0);
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  }

  // Zoom on hover
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!mainRef.current) return;
    const rect = mainRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  if (!images.length) return (
    <div className="w-full aspect-square bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[28px] flex items-center justify-center">
      <span className="text-gray-300 text-sm">No image</span>
    </div>
  );

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          ref={mainRef}
          className="relative w-full aspect-square bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[24px] overflow-hidden group cursor-zoom-in border border-[#e2e8f0] shadow-xl"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoomed(true)}
          onMouseLeave={() => setZoomed(false)}
          onClick={() => openLightbox(active)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="button"
          aria-label="Click to zoom"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(active)}
        >
          <Image
            src={images[active].image_url}
            alt={images[active].alt_text || title}
            fill
            className={`object-contain p-8 transition-all duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
            style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : {}}
            sizes="(max-width:768px) 100vw, 50vw"
            priority
          />

          {/* Zoom hint */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm">
              <ZoomIn className="w-3 h-3" />
              Click to zoom
            </div>
          </div>

          {/* Arrow nav on main image */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 touch-manipulation"
                aria-label="Previous image"
                style={{ touchAction: 'manipulation' }}
              >
                <ChevronLeft className="w-5 h-5 text-[#0f172a]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 touch-manipulation"
                aria-label="Next image"
                style={{ touchAction: 'manipulation' }}
              >
                <ChevronRight className="w-5 h-5 text-[#0f172a]" />
              </button>
            </>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/40 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              {active + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 touch-manipulation">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={`relative shrink-0 w-[68px] h-[68px] rounded-2xl overflow-hidden bg-[#f8fafc] transition-all duration-200 touch-manipulation ${
                  i === active
                    ? 'ring-2 ring-[#dc2626] ring-offset-2 opacity-100'
                    : 'opacity-50 hover:opacity-80 hover:ring-1 hover:ring-[#e2e8f0] hover:ring-offset-1'
                }`}
                aria-label={`View image ${i + 1}`}
                aria-pressed={i === active}
                style={{ touchAction: 'manipulation' }}
              >
                <Image
                  src={img.image_url}
                  alt={img.alt_text || `${title} ${i + 1}`}
                  fill
                  className="object-contain p-1.5"
                  sizes="68px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-4 z-10 touch-manipulation">
            <p className="text-white/60 text-sm truncate max-w-xs">{title}</p>
            <div className="flex items-center gap-2">
              {images.length > 1 && (
                <span className="text-white/40 text-sm">{lightboxIndex + 1} / {images.length}</span>
              )}
              <button
                onClick={closeLightbox}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors touch-manipulation"
                aria-label="Close"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 z-10 touch-manipulation"
              aria-label="Previous"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main lightbox image */}
          <div
            className="relative w-full max-w-2xl mx-16 aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].image_url}
              alt={images[lightboxIndex].alt_text || title}
              fill
              className="object-contain"
              sizes="(max-width:768px) 100vw, 672px"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-all hover:scale-110 z-10 touch-manipulation"
              aria-label="Next"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail strip in lightbox */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 touch-manipulation">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); setActive(i); }}
                  className={`w-12 h-12 rounded-xl overflow-hidden bg-white/10 transition-all touch-manipulation ${
                    i === lightboxIndex ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{ touchAction: 'manipulation' }}
                >
                  <Image
                    src={img.image_url}
                    alt={`${title} ${i + 1}`}
                    width={48}
                    height={48}
                    className="object-contain w-full h-full p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
