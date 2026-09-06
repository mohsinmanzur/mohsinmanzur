'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Briefcase, Code2, Rocket } from 'lucide-react';
import type { Experience as ExperienceRow } from '@/lib/db/types';

type Direction = 'above' | 'below';
type ExperienceType = ExperienceRow['type'];

const TYPE_ICON: Record<ExperienceType, typeof Briefcase> = {
  job: Briefcase,
  project: Code2,
  founder: Rocket,
};

interface ExperienceEntry {
  id: string;
  x: number;
  anchorX: number;
  dir: Direction;
  color: string;
  date: string;
  role: string;
  company: string;
  type: ExperienceType;
  desc: string;
  tags: string[];
}

interface YearTick {
  x: number;
  label: string;
}

interface PopupState {
  entry: ExperienceEntry;
  left: number;
  placeAbove: boolean;
  vertical: { top: number } | { bottom: number };
}

const STAGE_HEIGHT = 520;
const SPINE_Y = 260;
const ABOVE_Y = 130;
const BELOW_Y = 390;
const POPUP_WIDTH = 260;
const POPUP_MARGIN = 16;
const POPUP_GAP = 10;

// Layout is generated from the rows fetched from the database: a node's
// x-coordinate is a direct linear function of its start date (months since
// January of the earliest entry's year), not an ordinal slot — so two roles
// a month apart sit close together, and two a year apart sit far apart.
const START_X = 100;
const PIXELS_PER_MONTH = 60;
const PRESENT_GAP_MONTHS = 1.5;
const ANCHOR_TO_NODE_OFFSET = 45;
const STAGE_RIGHT_PADDING = 140;

function monthIndex(iso: string): number {
  const d = new Date(`${iso}T00:00:00`);
  return d.getFullYear() * 12 + d.getMonth();
}

const RAMP_START = { r: 0x60, g: 0x3c, b: 0x34 };
const RAMP_END = { r: 0xbd, g: 0x0a, b: 0x0a };

function rampColor(t: number): string {
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  const channel = (n: number) => n.toString(16).padStart(2, '0');
  return `#${channel(lerp(RAMP_START.r, RAMP_END.r))}${channel(lerp(RAMP_START.g, RAMP_END.g))}${channel(lerp(RAMP_START.b, RAMP_END.b))}`.toUpperCase();
}

function monthYear(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// Rough mono-font width so the line gap under each year label is sized to
// it, rather than one fixed gap that's too tight for "Present".
function estimateHalfGap(label: string): number {
  return Math.max(16, label.length * 3.6 + 8);
}

// The spine is drawn only up to the last node — `spineEndX` — so nothing
// trails past it toward the standalone "Present" text.
function buildSpineSegments(years: YearTick[], spineEndX: number): { x1: number; x2: number }[] {
  const segments: { x1: number; x2: number }[] = [];
  let cursor = 0;
  years.forEach((year) => {
    const halfGap = estimateHalfGap(year.label);
    if (year.x - halfGap > cursor) {
      segments.push({ x1: cursor, x2: year.x - halfGap });
    }
    cursor = year.x + halfGap;
  });
  if (spineEndX > cursor) segments.push({ x1: cursor, x2: spineEndX });
  return segments;
}

interface Layout {
  years: YearTick[];
  presentLabel: YearTick;
  experiences: ExperienceEntry[];
  current: ExperienceEntry | null;
  lastNodeX: number;
  stageWidth: number;
}

// The most recently started ongoing role becomes the special "Present" node.
// Every other row is a regular node positioned on its real start date — see
// PIXELS_PER_MONTH above. The current node is different: since it's still
// ongoing, it always renders at the end of the graph (right before the
// "Present" label) regardless of its own start date, which may be earlier
// than another, already-ended role's start date.
function buildLayout(rows: ExperienceRow[]): Layout {
  const sorted = [...rows].sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (sorted.length === 0) {
    const presentLabel = { x: START_X, label: 'Present' };
    return { years: [], presentLabel, experiences: [], current: null, lastNodeX: START_X, stageWidth: START_X + STAGE_RIGHT_PADDING };
  }

  const ongoing = sorted.filter((row) => row.current);
  const currentRow = ongoing.length > 0 ? ongoing[ongoing.length - 1] : null;
  const regularRows = sorted.filter((row) => row !== currentRow);

  const originMonth = Math.floor(monthIndex(sorted[0].startDate) / 12) * 12;
  const dateToX = (iso: string) => START_X + (monthIndex(iso) - originMonth) * PIXELS_PER_MONTH;

  const minYear = Math.floor(originMonth / 12);
  const maxYear = new Date(`${sorted[sorted.length - 1].startDate}T00:00:00`).getFullYear();
  const years: YearTick[] = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push({ x: dateToX(`${year}-01-01`), label: String(year) });
  }

  const experiences: ExperienceEntry[] = regularRows.map((row, i) => {
    const anchorX = dateToX(row.startDate);
    return {
      id: String(row.id),
      x: anchorX + ANCHOR_TO_NODE_OFFSET,
      anchorX,
      dir: i % 2 === 0 ? 'below' : 'above',
      color: rampColor(i / Math.max(regularRows.length, 1)),
      date: `${monthYear(row.startDate)} – ${row.endDate ? monthYear(row.endDate) : 'Present'}`,
      role: row.role,
      company: row.company,
      type: row.type,
      desc: row.description,
      tags: row.tags,
    };
  });

  const lastRegularX = experiences.length > 0 ? Math.max(...experiences.map((entry) => entry.x)) : START_X;
  const currentX = lastRegularX + PRESENT_GAP_MONTHS * PIXELS_PER_MONTH;

  const current: ExperienceEntry | null = currentRow
    ? {
      id: String(currentRow.id),
      x: currentX,
      anchorX: currentX,
      dir: 'below',
      color: rampColor(1),
      date: `${monthYear(currentRow.startDate)} – Present`,
      role: currentRow.role,
      company: currentRow.company,
      type: currentRow.type,
      desc: currentRow.description,
      tags: currentRow.tags,
    }
    : null;

  const lastNodeX = current ? current.x : lastRegularX;
  const presentX = lastNodeX + PRESENT_GAP_MONTHS * PIXELS_PER_MONTH;
  const presentLabel: YearTick = { x: presentX, label: 'Present' };

  return { years, presentLabel, experiences, current, lastNodeX, stageWidth: presentX + STAGE_RIGHT_PADDING };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

interface NodeProps {
  entry: ExperienceEntry;
  isCurrent: boolean;
  isActive: boolean;
  onEnter: (entry: ExperienceEntry, circle: HTMLDivElement, placeAbove: boolean) => void;
  onLeave: () => void;
}

function ExperienceNode({ entry, isCurrent, isActive, onEnter, onLeave }: NodeProps) {
  const y = isCurrent ? SPINE_Y : entry.dir === 'above' ? ABOVE_Y : BELOW_Y;
  const radius = isCurrent ? 44 : 34;
  const diameter = radius * 2;
  const labelAbove = isCurrent ? true : entry.dir === 'above';
  const placeAbove = isCurrent ? false : entry.dir === 'below';
  const Icon = TYPE_ICON[entry.type];

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: entry.x, top: y }}
    >
      {isCurrent && <div aria-hidden="true" className="xp-pulse-ring" />}

      <div
        aria-hidden="true"
        className={`xp-ring ${isActive ? 'is-active' : ''}`}
        style={{ width: diameter, height: diameter, borderColor: isActive ? entry.color : 'transparent' }}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label={`${entry.role} at ${entry.company}, ${entry.date}`}
        onMouseEnter={(e) => onEnter(entry, e.currentTarget, placeAbove)}
        onMouseLeave={onLeave}
        onFocus={(e) => onEnter(entry, e.currentTarget, placeAbove)}
        onBlur={onLeave}
        className="relative z-[2] flex cursor-pointer items-center justify-center rounded-full text-white shadow-[0_10px_22px_-14px_rgba(24,26,23,0.55)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          width: diameter,
          height: diameter,
          background: entry.color,
          transform: isActive ? 'scale(1.3)' : 'scale(1)',
          outlineColor: 'var(--primary)',
        }}
      >
        <Icon className="h-[42%] w-[42%]" strokeWidth={2} />
      </div>

      <div
        className={`pointer-events-none absolute left-1/2 w-max -translate-x-1/2 whitespace-nowrap text-center text-[12.5px] font-semibold leading-snug transition-[margin,color] duration-300 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${labelAbove ? 'bottom-full' : 'top-full'
          } ${isActive ? 'text-text' : 'text-text-grey'}`}
        style={{
          [labelAbove ? 'marginBottom' : 'marginTop']: 14 + (isActive ? radius * 0.3 : 0),
        }}
      >
        <span className={`block whitespace-nowrap ${isActive ? 'text-primary' : 'text-text'}`}>{entry.role}</span>
        {entry.company}
      </div>
    </div>
  );
}

interface ExperienceTimelineProps {
  experiences: ExperienceRow[];
}

export default function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
  const layout = useMemo(() => buildLayout(experiences), [experiences]);
  const spineSegments = useMemo(
    () => buildSpineSegments(layout.years, layout.lastNodeX),
    [layout.years, layout.lastNodeX]
  );
  const uniqueAnchors = useMemo(
    () => Array.from(new Set(layout.experiences.map((entry) => entry.anchorX))),
    [layout.experiences]
  );

  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDown: false, startX: 0, startScrollLeft: 0 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState | null>(null);
  const [atEnd, setAtEnd] = useState(false);

  // Land on the current/"Present" node by default, since that's the most
  // relevant entry, then track whether there's still more timeline to the
  // right — the left edge is the true start of the timeline, so it never
  // gets a fade of its own.
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    scroller.scrollLeft = scroller.scrollWidth;

    const updateEdges = () => {
      setAtEnd(scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1);
    };

    updateEdges();
    scroller.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      scroller.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [layout.stageWidth]);

  const showPopup = (entry: ExperienceEntry, circle: HTMLDivElement, placeAbove: boolean) => {
    const rect = circle.getBoundingClientRect();
    const left = clamp(
      rect.left + rect.width / 2 - POPUP_WIDTH / 2,
      POPUP_MARGIN,
      window.innerWidth - POPUP_WIDTH - POPUP_MARGIN
    );
    const vertical = placeAbove
      ? { bottom: window.innerHeight - rect.top + POPUP_GAP }
      : { top: rect.bottom + POPUP_GAP };

    setActiveId(entry.id);
    setPopup({ entry, left, placeAbove, vertical });
  };

  const hidePopup = () => {
    setActiveId(null);
    setPopup(null);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragState.current = { isDown: true, startX: e.clientX, startScrollLeft: scroller.scrollLeft };
    scroller.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollLeft = dragState.current.startScrollLeft - (e.clientX - dragState.current.startX);
  };

  const endDrag = () => {
    dragState.current.isDown = false;
  };

  return (
    <section id="experience" className="flex flex-col justify-center gap-10">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-text sm:text-4xl">Experience</h2>
      </div>

      <div className="relative mx-[calc(50%-50vw)] w-screen">
        <div
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onPointerCancel={endDrag}
          className="no-scrollbar w-full select-none overflow-x-auto overflow-y-hidden pr-6 [cursor:grab] active:[cursor:grabbing]"
        >
          <div className="flex" style={{ height: STAGE_HEIGHT }}>
            <div className="relative flex-1">
              <div
                aria-hidden="true"
                className="absolute inset-x-0"
                style={{ top: SPINE_Y - 1, height: 2, background: 'rgba(24, 26, 23, 0.16)' }}
              />
            </div>

            <div className="relative shrink-0" style={{ width: layout.stageWidth, height: STAGE_HEIGHT }}>
              <svg
                aria-hidden="true"
                width={layout.stageWidth}
                height={STAGE_HEIGHT}
                viewBox={`0 0 ${layout.stageWidth} ${STAGE_HEIGHT}`}
                className="absolute inset-0 overflow-visible"
              >
                {spineSegments.map((seg, i) => (
                  <line
                    key={i}
                    x1={seg.x1}
                    y1={SPINE_Y}
                    x2={seg.x2}
                    y2={SPINE_Y}
                    stroke="rgba(24, 26, 23, 0.16)"
                    strokeWidth={2}
                  />
                ))}

                {uniqueAnchors.map((anchorX) => (
                  <circle key={anchorX} cx={anchorX} cy={SPINE_Y} r={4} fill="rgba(24, 26, 23, 0.16)" />
                ))}

                {layout.experiences.map((entry) => {
                  const y = entry.dir === 'above' ? ABOVE_Y : BELOW_Y;
                  return (
                    <line
                      key={entry.id}
                      x1={entry.anchorX}
                      y1={SPINE_Y}
                      x2={entry.x}
                      y2={y}
                      stroke="rgba(24, 26, 23, 0.28)"
                      strokeWidth={1.5}
                      strokeDasharray="2 6"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {layout.years.map((year) => (
                <div
                  key={year.label}
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: year.x, top: SPINE_Y }}
                >
                  <span className="whitespace-nowrap bg-background px-1.5 font-mono text-[11.5px] font-semibold text-text-grey">
                    {year.label}
                  </span>
                </div>
              ))}

              <div
                className="pointer-events-none absolute -translate-y-1/2"
                style={{ left: layout.presentLabel.x, top: SPINE_Y }}
              >
                <span className="whitespace-nowrap font-mono text-[11.5px] font-semibold text-text-grey">
                  {layout.presentLabel.label}
                </span>
              </div>

              {layout.experiences.map((entry) => (
                <ExperienceNode
                  key={entry.id}
                  entry={entry}
                  isCurrent={false}
                  isActive={activeId === entry.id}
                  onEnter={showPopup}
                  onLeave={hidePopup}
                />
              ))}

              {layout.current && (
                <ExperienceNode
                  entry={layout.current}
                  isCurrent
                  isActive={activeId === layout.current.id}
                  onEnter={showPopup}
                  onLeave={hidePopup}
                />
              )}
            </div>

            <div aria-hidden="true" className="flex-1" />
          </div>
        </div>

        {!atEnd && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-24 lg:block"
            style={{ background: 'linear-gradient(to left, var(--background), transparent)' }}
          />
        )}
      </div>

      {popup && (
        <div
          className="fixed z-50 w-[260px] rounded-xl border-2 border-white p-4 shadow-[0_20px_40px_-18px_rgba(24,26,23,0.5)]"
          style={{ left: popup.left, background: popup.entry.color, ...popup.vertical }}
        >
          <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-white/75">{popup.entry.date}</p>
          <h3 className="text-[15px] font-bold leading-tight text-white">{popup.entry.role}</h3>
          <p className="mb-2 mt-0.5 text-[12.5px] text-white/75">{popup.entry.company}</p>
          <p className="mb-2.5 text-[12.5px] leading-relaxed text-white/90">{popup.entry.desc}</p>
          <div className="flex flex-wrap gap-1.5">
            {popup.entry.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/25 bg-white/15 px-2 py-0.5 font-mono text-[10.5px] text-white"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Border-color triangle (larger) and fill-color triangle (smaller,
              same base line) stacked flush against the card's edge — a true
              triangle, not a rotated square, so its flat base never overlaps
              into the card's rectangle. Where the two bases coincide (right
              at the card's own edge) both are white, so the join disappears. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[9px] border-x-transparent"
            style={
              popup.placeAbove
                ? { bottom: -10, borderTop: '10px solid #fff' }
                : { top: -10, borderBottom: '10px solid #fff' }
            }
          />
          <div
            aria-hidden="true"
            className="absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[7px] border-x-transparent"
            style={
              popup.placeAbove
                ? { bottom: -8, borderTop: `8px solid ${popup.entry.color}` }
                : { top: -8, borderBottom: `8px solid ${popup.entry.color}` }
            }
          />
        </div>
      )}
    </section>
  );
}
