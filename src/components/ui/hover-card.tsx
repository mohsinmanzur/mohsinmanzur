import React from 'react';

export interface HoverCardEntry {
  date: string;
  role: string;
  company: string;
  desc: string;
  tags: string[];
  color: string;
}

export interface HoverCardProps {
  entry?: HoverCardEntry;
  color?: string;
  left?: number | string;
  arrowLeft?: number | string;
  placeAbove?: boolean;
  vertical?: { top?: number | string; bottom?: number | string };
  position?: 'fixed' | 'absolute';
  className?: string;
  children?: React.ReactNode;
}

export default function HoverCard({
  entry,
  color,
  left,
  arrowLeft,
  placeAbove = true,
  vertical,
  position = 'fixed',
  className = '',
  children,
}: HoverCardProps) {
  const cardColor = color || entry?.color || 'var(--primary)';
  const widthClass = className.includes('w-') ? '' : 'w-[260px] max-w-[260px]';

  return (
    <div
      className={`${position} z-50 rounded-xl border-2 border-white p-4 shadow-[0_20px_40px_-18px_rgba(24,26,23,0.5)] ${widthClass} ${className}`}
      style={{ left, background: cardColor, ...vertical }}
    >
      {children ? (
        children
      ) : entry ? (
        <>
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/75">{entry.date}</p>
          <h3 className="text-[15px] font-bold leading-tight text-white">{entry.role}</h3>
          <p className="mb-2 mt-0.5 text-[12.5px] text-white/75">{entry.company}</p>
          <p className="mb-2.5 text-[12.5px] leading-relaxed text-white/90">{entry.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 font-mono text-[10.5px] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {/* Border-color triangle (larger) and fill-color triangle (smaller,
          same base line) stacked flush against the card's edge — a true
          triangle, not a rotated square, so its flat base never overlaps
          into the card's rectangle. Where the two bases coincide (right
          at the card's own edge) both are white, so the join disappears. */}
      <div
        aria-hidden="true"
        className="absolute h-0 w-0 -translate-x-1/2 border-x-[9px] border-x-transparent pointer-events-none"
        style={{
          left: arrowLeft,
          ...(placeAbove
            ? { bottom: -10, borderTop: '10px solid #fff' }
            : { top: -10, borderBottom: '10px solid #fff' }),
        }}
      />
      <div
        aria-hidden="true"
        className="absolute h-0 w-0 -translate-x-1/2 border-x-[7px] border-x-transparent pointer-events-none"
        style={{
          left: arrowLeft,
          ...(placeAbove
            ? { bottom: -8, borderTop: `8px solid ${cardColor}` }
            : { top: -8, borderBottom: `8px solid ${cardColor}` }),
        }}
      />
    </div>
  );
}

export { HoverCard };
