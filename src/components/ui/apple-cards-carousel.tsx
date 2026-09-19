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

export const Carousel = ({ items }: CarouselProps) => {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScrollLeft = useRef(0);
  const lastPointerX = useRef(0);
  const lastPointerTime = useRef(0);
  const velocity = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    setIsGrabbing(true);
    startX.current = e.clientX;
    startScrollLeft.current = containerRef.current ? containerRef.current.scrollLeft : 0;
    lastPointerX.current = e.clientX;
    lastPointerTime.current = performance.now();
    velocity.current = 0;
    if (rafId.current) cancelAnimationFrame(rafId.current);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const dx = e.clientX - startX.current;
    containerRef.current.scrollLeft = startScrollLeft.current - dx;

    const now = performance.now();
    const dt = now - lastPointerTime.current;
    if (dt > 0) {
      const v = (e.clientX - lastPointerX.current) / dt;
      velocity.current = 0.7 * v + 0.3 * velocity.current;
    }
    lastPointerX.current = e.clientX;
    lastPointerTime.current = now;
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

    if (Math.abs(velocity.current) > 0.05 && containerRef.current) {
      let lastTime = performance.now();
      const step = (now: number) => {
        const dt = Math.min(now - lastTime, 64);
        lastTime = now;
        if (!containerRef.current) return;

        containerRef.current.scrollLeft -= velocity.current * dt;
        velocity.current *= 0.92;

        if (Math.abs(velocity.current) > 0.02) {
          rafId.current = requestAnimationFrame(step);
        } else {
          velocity.current = 0;
        }
      };
      rafId.current = requestAnimationFrame(step);
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-x-auto py-4 select-none touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden',
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDragStart={(e) => e.preventDefault()}
    >
      <div className="flex w-max gap-4 sm:gap-6 px-10">
        {items.map((item, itemIdx) => (
          <div key={`carousel-item-${itemIdx}`} className="shrink-0">
            {item}
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
