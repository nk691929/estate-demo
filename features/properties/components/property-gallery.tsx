"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

function useSwipe(onSwipe: (direction: 1 | -1) => void) {
  const startX = useRef<number | null>(null);

  return {
    onTouchStart: (event: React.TouchEvent) => {
      startX.current = event.touches[0].clientX;
    },
    onTouchEnd: (event: React.TouchEvent) => {
      if (startX.current === null) return;
      const distance = event.changedTouches[0].clientX - startX.current;
      startX.current = null;
      if (Math.abs(distance) > 50) onSwipe(distance < 0 ? 1 : -1);
    },
  };
}

const arrowClass =
  "absolute top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70";

export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const count = images.length;

  const go = useCallback(
    (direction: 1 | -1) => {
      setCurrent((index) => (index + direction + count) % count);
      setZoom(null);
    },
    [count]
  );

  const closeViewer = useCallback(() => {
    setOpen(false);
    setZoom(null);
  }, []);

  const pageSwipe = useSwipe(go);
  const viewerSwipe = useSwipe((direction) => {
    if (!zoom) go(direction);
  });

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, closeViewer]);

  if (count === 0) return null;

  function toggleZoom(event: React.MouseEvent<HTMLDivElement>) {
    if (zoom) {
      setZoom(null);
      return;
    }
    const box = event.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    });
  }

  return (
    <div>
      <div
        {...pageSwipe}
        className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground/5 md:aspect-auto md:h-[480px]"
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open photo viewer"
          className="absolute inset-0 cursor-zoom-in"
        >
          <Image
            src={images[current]}
            alt={`${title} photo ${current + 1}`}
            fill
            priority
            sizes="(min-width: 1152px) 1100px, 100vw"
            className="object-cover"
          />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className={`${arrowClass} right-3`}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          <Maximize2 className="size-3.5" />
          {current + 1} / {count}
        </span>
      </div>

      {count > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Show photo ${index + 1}`}
              aria-current={index === current}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition ${
                index === current
                  ? "ring-2 ring-foreground"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photos`}
          onClick={closeViewer}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={closeViewer}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="size-5" />
          </button>

          <span className="absolute left-4 top-5 z-10 text-sm text-white/80">
            {current + 1} / {count}
          </span>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                aria-label="Previous photo"
                className={`${arrowClass} left-3`}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                aria-label="Next photo"
                className={`${arrowClass} right-3`}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <div
            {...viewerSwipe}
            onClick={(event) => {
              event.stopPropagation();
              toggleZoom(event);
            }}
            className={`relative h-[85vh] w-full max-w-6xl overflow-hidden ${
              zoom ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
          >
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{
                transform: zoom ? "scale(2)" : "scale(1)",
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
              }}
            >
              <Image
                src={images[current]}
                alt={`${title} photo ${current + 1}`}
                fill
                sizes="100vw"
                quality={85}
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}