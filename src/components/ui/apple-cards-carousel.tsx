'use client';
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

interface CarouselProps {
  items: React.ReactNode[];
  speed?: number;
}

export type AppleCardType = {
  src: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  isLogo?: boolean;
  color?: string;
};

export const Carousel = ({ items, speed = 35 }: CarouselProps) => {
  const [isGrabbing, setIsGrabbing] = useState(false);

  const SET_COUNT = 8;
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);

  const singleSetWidthRef = useRef(0);
  const x = useRef(0);
  const isDragging = useRef(false);
  const isHovered = useRef(false);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocity = useRef(0);
  const hasInitialized = useRef(false);

  const wrap = (val: number, min: number, max: number) => {
    const range = max - min;
    return ((((val - min) % range) + range) % range) + min;
  };

  const updateSetWidth = () => {
    if (firstSetRef.current) {
      const width = firstSetRef.current.getBoundingClientRect().width;
      if (width > 0) {
        singleSetWidthRef.current = width;
        if (!hasInitialized.current) {
          x.current = -2 * width;
          hasInitialized.current = true;
          if (trackRef.current) {
            trackRef.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
          }
        }
      }
    }
  };

  useEffect(() => {
    updateSetWidth();

    if (!firstSetRef.current) return;
    const observer = new ResizeObserver(() => {
      updateSetWidth();
    });
    observer.observe(firstSetRef.current);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    let rafId: number;
    let lastTime: number | null = null;

    const animate = (now: number) => {
      if (lastTime === null) {
        lastTime = now;
      }
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;

      const W = singleSetWidthRef.current;
      if (W > 0 && trackRef.current) {
        if (!isDragging.current) {
          if (Math.abs(velocity.current) > 0.02) {
            x.current += velocity.current * dt;
            velocity.current *= 0.92;
            x.current = wrap(x.current, -3 * W, -2 * W);
            trackRef.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
          } else {
            velocity.current = 0;
            if (!isHovered.current) {
              const autoSpeed = (W / speed) / 1000;
              x.current -= autoSpeed * dt;
              x.current = wrap(x.current, -3 * W, -2 * W);
              trackRef.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
            }
          }
        }
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    setIsGrabbing(true);
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    velocity.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPointerX.current;
    const now = performance.now();
    const dt = now - lastPointerTime.current;
    if (dt > 0) {
      const v = dx / dt;
      velocity.current = 0.7 * v + 0.3 * velocity.current;
    }
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;

    const W = singleSetWidthRef.current;
    x.current += dx;
    if (W > 0 && trackRef.current) {
      x.current = wrap(x.current, -3 * W, -2 * W);
      trackRef.current.style.transform = `translate3d(${x.current}px, 0, 0)`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsGrabbing(false);
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden py-2 select-none touch-pan-y',
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerEnter={() => {
        isHovered.current = true;
      }}
      onPointerLeave={() => {
        if (!isDragging.current) {
          isHovered.current = false;
        }
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
      >
        {Array.from({ length: SET_COUNT }).map((_, setIdx) => (
          <div
            key={setIdx}
            ref={setIdx === 0 ? firstSetRef : undefined}
            className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6"
          >
            {items.map((item, itemIdx) => (
              <div key={`set-${setIdx}-item-${itemIdx}`} className="shrink-0">
                {React.isValidElement(item)
                  ? React.cloneElement(item as React.ReactElement<{ key?: string }>, {
                    key: `set-${setIdx}-${itemIdx}`,
                  })
                  : item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Card = ({
  card,
  index,
}: {
  card: AppleCardType;
  index: number;
  layout?: boolean;
}) => {
  return (
    <div className="group relative z-10 flex aspect-[9/16] w-64 sm:w-72 md:w-80 flex-col items-start justify-start overflow-hidden rounded-3xl border border-border/80 bg-neutral-950 p-6 transition-all duration-300 hover:-translate-y-1 text-left select-none">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-36 bg-gradient-to-b from-black/80 via-black/35 to-transparent" />
      <div className="relative z-40 p-2">
        <p
          className="max-w-xs text-left text-xl sm:text-2xl md:text-3xl font-semibold [text-wrap:balance] text-white"
          style={{ fontFamily: 'sans-serif' }}
        >
          {card.title}
        </p>
      </div>

      {card.thumbnailUrl ? (
        <BlurImage
          src={card.thumbnailUrl}
          alt={card.title}
          fill
          sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
          className="absolute inset-0 z-10 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : card.src ? (
        card.isLogo ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 sm:p-8 bg-neutral-950/95 overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
              style={{
                background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
              }}
            />
            <div className="relative z-10 flex h-[100px] max-h-[100px] w-full max-w-[200px] sm:max-w-[220px] items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Image
                src={card.src}
                alt={card.title}
                fill
                sizes="(max-width: 640px) 200px, 220px"
                className="max-h-[100px] object-contain drop-shadow-lg brightness-0 invert"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>
          </div>
        ) : (
          <BlurImage
            src={card.src}
            alt={card.title}
            fill
            sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
            className="absolute inset-0 z-10 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )
      ) : (
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-neutral-800 to-neutral-900" />
      )}
    </div>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  fill,
  sizes,
  ...rest
}: ImageProps) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <Image
      className={cn(
        'transition duration-300',
        isLoading ? 'blur-sm scale-102' : 'blur-0 scale-100',
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      fill={fill}
      sizes={sizes || (fill ? '(max-width: 640px) 256px, (max-width: 768px) 288px, 320px' : undefined)}
      loading="lazy"
      alt={alt ? alt : 'Card thumbnail'}
      {...rest}
    />
  );
};
