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
    if (e.pointerType === 'touch') return;
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
    if (e.pointerType === 'touch') return;
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
    if (e.pointerType === 'touch') return;
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
        'no-scrollbar relative w-full overflow-x-auto overflow-y-hidden py-4 select-none',
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
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
  const backgroundColor = card.color || '#BD0A0A';

  return (
    <div
      className="group relative z-10 flex aspect-[9/16] w-64 sm:w-72 md:w-80 flex-col items-start justify-start overflow-hidden rounded-3xl border border-border/80 p-6 transition-all duration-300 hover:-translate-y-1 text-left select-none"
      style={{ backgroundColor }}
    >
      <div className="relative z-40 p-2">
        <p
          className="max-w-xs text-left text-xl sm:text-2xl md:text-3xl font-semibold [text-wrap:balance] text-white"
          style={{ fontFamily: 'sans-serif' }}
        >
          {card.title}
        </p>
      </div>

      {card.thumbnailUrl ? (
        <div className="absolute inset-0 z-10 pt-[60px]">
          <div className="relative h-full w-full">
            <BlurImage
              src={card.thumbnailUrl}
              alt={card.title}
              fill
              sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      ) : null}
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
