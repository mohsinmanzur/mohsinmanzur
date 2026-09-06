'use client';

import { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const MINOR_TICKS_PER_GAP = 3;
const TICK_GLOW_RADIUS = 0.4;

const INACTIVE_TICK = { r: 229, g: 231, b: 235, a: 0.8 };
const ACTIVE_TICK = { r: 118, g: 118, b: 118, a: 1 };

function lerp(from: number, to: number, t: number) {
  return from + (to - from) * t;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function popAmount(distance: number) {
  if (distance <= 0) return 38;
  if (distance >= 2) return 0;
  if (distance <= 1) return lerp(38, 18, distance);
  return lerp(18, 0, distance - 1);
}

function tickColor(distance: number) {
  const t = clamp01(1 - distance / TICK_GLOW_RADIUS);
  const r = Math.round(lerp(INACTIVE_TICK.r, ACTIVE_TICK.r, t));
  const g = Math.round(lerp(INACTIVE_TICK.g, ACTIVE_TICK.g, t));
  const b = Math.round(lerp(INACTIVE_TICK.b, ACTIVE_TICK.b, t));
  const a = lerp(INACTIVE_TICK.a, ACTIVE_TICK.a, t);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function computeContinuousIndex(centers: number[], scrollCenter: number) {
  if (centers.length === 0) return 0;
  if (scrollCenter <= centers[0]) return 0;
  if (scrollCenter >= centers[centers.length - 1]) return centers.length - 1;

  for (let i = 0; i < centers.length - 1; i++) {
    if (scrollCenter >= centers[i] && scrollCenter <= centers[i + 1]) {
      const span = centers[i + 1] - centers[i];
      const t = span === 0 ? 0 : (scrollCenter - centers[i]) / span;
      return i + t;
    }
  }

  return centers.length - 1;
}

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const centers = sections.map(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY + rect.height / 2;
      });
      const scrollCenter = window.scrollY + window.innerHeight / 2;
      setProgress(computeContinuousIndex(centers, scrollCenter));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLElement>) => {
    const nav = navRef.current;
    if (!nav) return;

    const isButton = Boolean((event.target as HTMLElement).closest('button'));
    const rect = nav.getBoundingClientRect();
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const startY = event.clientY;
    const startScrollY = window.scrollY;
    let moved = false;

    const handleMove = (moveEvent: PointerEvent) => {
      const deltaY = moveEvent.clientY - startY;
      if (Math.abs(deltaY) > 3) moved = true;
      const scrollDelta = (deltaY / rect.height) * scrollRange;
      const nextScrollY = Math.max(0, Math.min(scrollRange, startScrollY + scrollDelta));
      window.scrollTo({ top: nextScrollY, behavior: 'instant' as ScrollBehavior });
    };

    const handleUp = (upEvent: PointerEvent) => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);

      if (!moved && !isButton) {
        const fraction = (upEvent.clientY - rect.top) / rect.height;
        const clamped = Math.max(0, Math.min(1, fraction));
        window.scrollTo({ top: clamped * scrollRange, behavior: 'instant' as ScrollBehavior });
      }

      if (moved && isButton) suppressClickRef.current = true;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  };

  const handleClickCapture = (event: React.MouseEvent) => {
    if (suppressClickRef.current) {
      event.stopPropagation();
      suppressClickRef.current = false;
    }
  };

  const handleSectionClick = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeIndex = Math.round(progress);

  return (
    <nav
      ref={navRef}
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      aria-label="Page sections"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 cursor-grab select-none flex-col items-end gap-5 pr-[26px] active:cursor-grabbing lg:flex"
      style={{ touchAction: 'none' }}
    >
      <span
        aria-hidden="true"
        className="absolute right-0 top-1 bottom-1 w-px bg-neutral-200/80"
      />
      {sections.map((section, index) => {
        const distance = Math.abs(progress - index);
        const isActive = index === activeIndex;

        return (
          <div key={section.id} className="contents">
            {index > 0 &&
              Array.from({ length: MINOR_TICKS_PER_GAP }).map((_, tickIndex) => {
                const tickPosition = index - 1 + (tickIndex + 1) / (MINOR_TICKS_PER_GAP + 1);
                const tickDistance = Math.abs(progress - tickPosition);

                return (
                  <span
                    key={`${section.id}-minor-${tickIndex}`}
                    aria-hidden="true"
                    className="relative h-0 w-0 self-end"
                  >
                    <span
                      className="absolute right-[-26px] top-1/2 h-px w-[6px] -translate-y-1/2"
                      style={{ backgroundColor: tickColor(tickDistance) }}
                    />
                  </span>
                );
              })}
            <button
              type="button"
              onClick={() => handleSectionClick(section.id)}
              aria-current={isActive ? 'true' : undefined}
              draggable={false}
              onDragStart={(event) => event.preventDefault()}
              className="relative cursor-pointer whitespace-nowrap text-sm text-text-grey"
              style={{ paddingRight: `${popAmount(distance)}px` }}
            >
              {section.label}
              <span
                aria-hidden="true"
                className="absolute right-[-26px] top-1/2 h-px w-[13px] -translate-y-1/2"
                style={{ backgroundColor: tickColor(distance) }}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
