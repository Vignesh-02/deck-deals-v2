"use client";

import { useEffect, useRef, useState } from "react";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const thumbStripRef = useRef<HTMLDivElement>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  if (images.length === 0) {
    return (
      <div className="aspect-square sm:aspect-[4/3] rounded-2xl border border-[#2a2a2a] bg-surface-darker flex items-center justify-center">
        <p className="text-cream-faint text-sm">No images</p>
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  useEffect(() => {
    setIsZoomActive(false);
    setZoomPos({ x: 50, y: 50 });
  }, [activeIndex]);

  function scrollThumbs(direction: "left" | "right") {
    const el = thumbStripRef.current;
    if (!el) return;
    const amount = 160;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  function handleMainImageMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = mainImageRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPos({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div
        ref={mainImageRef}
        onMouseEnter={() => setIsZoomActive(true)}
        onMouseLeave={() => setIsZoomActive(false)}
        onMouseMove={handleMainImageMouseMove}
        className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-surface-darker group"
      >
        <div className="relative aspect-square sm:aspect-[4/3]">
          <img
            src={activeImage}
            alt={alt}
            className="h-full w-full object-contain p-4 transition-transform duration-100 ease-out"
            style={{
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              transform: isZoomActive ? "scale(2)" : "scale(1)",
              cursor: isZoomActive ? "zoom-in" : "default",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Navigation arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-cream flex items-center justify-center opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev + 1) % images.length)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-cream flex items-center justify-center opacity-100 transition-opacity hover:bg-black/70"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image counter */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-cream text-xs font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollThumbs("left")}
            className="flex-shrink-0 w-8 h-8 rounded-full border border-[#333] bg-surface text-cream-muted hover:text-cream hover:border-brand-gold/50 transition-colors"
            aria-label="Scroll thumbnails left"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div ref={thumbStripRef} className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {images.map((url, index) => (
              <button
                key={`${url}-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`relative flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden border transition-all duration-200 ${
                  index === activeIndex
                    ? "border-brand-gold shadow-md shadow-brand-gold/25"
                    : "border-[#2a2a2a] opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`${alt} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollThumbs("right")}
            className="flex-shrink-0 w-8 h-8 rounded-full border border-[#333] bg-surface text-cream-muted hover:text-cream hover:border-brand-gold/50 transition-colors"
            aria-label="Scroll thumbnails right"
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
