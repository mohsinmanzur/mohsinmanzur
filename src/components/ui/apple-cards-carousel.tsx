'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import Image, { ImageProps } from 'next/image';

interface CarouselProps {
  items: React.ReactNode[];
  speed?: number;
}

export type AppleCardType = {
  src: string;
  title: string;
  category: string;
  isLogo?: boolean;
  color?: string;
};

export const Carousel = ({ items, speed = 35 }: CarouselProps) => {
  const [isPaused, setIsPaused] = useState(false);

  // 4 repeated sets guarantee a continuous seamless loop without gaps across all screen sizes
  const SET_COUNT = 4;

  return (
    <div className="relative w-full overflow-hidden py-2">
      <div
        className={cn(
          'flex w-max animate-carousel-marquee',
          isPaused && 'is-paused'
        )}
        style={{
          ['--marquee-duration' as string]: `${speed}s`,
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
        onPointerEnter={() => setIsPaused(true)}
        onPointerLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {Array.from({ length: SET_COUNT }).map((_, setIdx) => (
          <div key={setIdx} className="flex shrink-0 gap-4 sm:gap-6 pr-4 sm:pr-6">
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
        <p className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80 drop-shadow-sm">
          {card.category}
        </p>
        <p className="mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-white [text-wrap:balance] drop-shadow-md">
          {card.title}
        </p>
      </div>

      {card.src ? (
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
      loading="lazy"
      alt={alt ? alt : 'Card thumbnail'}
      {...rest}
    />
  );
};
