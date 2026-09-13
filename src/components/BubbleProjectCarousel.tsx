'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Code2,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  ShieldCheck,
  QrCode,
  FileText,
  Scale,
  Landmark,
  Coins,
  ShieldAlert,
  Building2,
  CircleDollarSign,
  PhoneCall,
  Home,
  Briefcase,
  Sparkles,
  CheckCircle2,
  LucideIcon,
} from 'lucide-react';
import type { Project } from '@/lib/db/types';

interface ThematicBubble {
  id: string;
  icon: LucideIcon;
  label: string;
  positionClass: string;
  floatAnimationClass: string;
  exitDelayMs: number;
  enterDelayMs: number;
  isTop: boolean;
}

interface ProjectTheme {
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  glowGradient: string;
  bubbles: ThematicBubble[];
}

const THEMES: Record<string, ProjectTheme> = {
  sehat: {
    accentColor: '#0D9488',
    accentBg: 'rgba(13, 148, 136, 0.12)',
    accentBorder: 'rgba(13, 148, 136, 0.35)',
    glowGradient:
      'radial-gradient(ellipse at 50% 50%, rgba(13, 148, 136, 0.22) 0%, rgba(20, 184, 166, 0.08) 45%, transparent 75%)',
    bubbles: [
      {
        id: 'vital-ocr',
        icon: HeartPulse,
        label: 'Medical OCR',
        positionClass: '-top-5 left-4 sm:-top-6 sm:left-10 md:left-6',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 20,
        enterDelayMs: 60,
        isTop: true,
      },
      {
        id: 'zero-sync',
        icon: ShieldCheck,
        label: 'Zero-Knowledge Sync',
        positionClass: '-top-5 right-4 sm:-top-6 sm:right-10 md:right-6',
        floatAnimationClass: 'animate-bubble-float-2',
        exitDelayMs: 60,
        enterDelayMs: 120,
        isTop: true,
      },
      {
        id: 'qr-access',
        icon: QrCode,
        label: '6-Digit QR Access',
        positionClass: '-bottom-5 left-4 sm:-bottom-6 sm:left-10 md:left-8',
        floatAnimationClass: 'animate-bubble-float-3',
        exitDelayMs: 100,
        enterDelayMs: 180,
        isTop: false,
      },
      {
        id: 'records',
        icon: FileText,
        label: 'Offline Records',
        positionClass: '-bottom-5 right-4 sm:-bottom-6 sm:right-10 md:right-8',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 140,
        enterDelayMs: 240,
        isTop: false,
      },
    ],
  },
  'justis impact': {
    accentColor: '#4F46E5',
    accentBg: 'rgba(79, 70, 229, 0.12)',
    accentBorder: 'rgba(79, 70, 229, 0.35)',
    glowGradient:
      'radial-gradient(ellipse at 50% 50%, rgba(79, 70, 229, 0.22) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 75%)',
    bubbles: [
      {
        id: 'litigation',
        icon: Scale,
        label: 'Impact Litigation',
        positionClass: '-top-5 left-4 sm:-top-6 sm:left-10 md:left-6',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 20,
        enterDelayMs: 60,
        isTop: true,
      },
      {
        id: 'milestones',
        icon: Landmark,
        label: 'Milestone Escrow',
        positionClass: '-top-5 right-4 sm:-top-6 sm:right-10 md:right-6',
        floatAnimationClass: 'animate-bubble-float-2',
        exitDelayMs: 60,
        enterDelayMs: 120,
        isTop: true,
      },
      {
        id: 'crowdfunding',
        icon: Coins,
        label: 'Civic Crowdfunding',
        positionClass: '-bottom-5 left-4 sm:-bottom-6 sm:left-10 md:left-8',
        floatAnimationClass: 'animate-bubble-float-3',
        exitDelayMs: 100,
        enterDelayMs: 180,
        isTop: false,
      },
      {
        id: 'verified-bar',
        icon: ShieldAlert,
        label: 'Verified US Attorneys',
        positionClass: '-bottom-5 right-4 sm:-bottom-6 sm:right-10 md:right-8',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 140,
        enterDelayMs: 240,
        isTop: false,
      },
    ],
  },
  'leads and loans': {
    accentColor: '#0284C7',
    accentBg: 'rgba(2, 132, 199, 0.12)',
    accentBorder: 'rgba(2, 132, 199, 0.35)',
    glowGradient:
      'radial-gradient(ellipse at 50% 50%, rgba(2, 132, 199, 0.22) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 75%)',
    bubbles: [
      {
        id: 'valuation',
        icon: Building2,
        label: 'Live ATTOM Valuation',
        positionClass: '-top-5 left-4 sm:-top-6 sm:left-10 md:left-6',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 20,
        enterDelayMs: 60,
        isTop: true,
      },
      {
        id: 'pipeline',
        icon: CircleDollarSign,
        label: 'Loan Pipeline',
        positionClass: '-top-5 right-4 sm:-top-6 sm:right-10 md:right-6',
        floatAnimationClass: 'animate-bubble-float-2',
        exitDelayMs: 60,
        enterDelayMs: 120,
        isTop: true,
      },
      {
        id: 'comms',
        icon: PhoneCall,
        label: 'Twilio & Webhooks',
        positionClass: '-bottom-5 left-4 sm:-bottom-6 sm:left-10 md:left-8',
        floatAnimationClass: 'animate-bubble-float-3',
        exitDelayMs: 100,
        enterDelayMs: 180,
        isTop: false,
      },
      {
        id: 'contracts',
        icon: Home,
        label: 'SignWell e-Contracts',
        positionClass: '-bottom-5 right-4 sm:-bottom-6 sm:right-10 md:right-8',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 140,
        enterDelayMs: 240,
        isTop: false,
      },
    ],
  },
  jts: {
    accentColor: '#9333EA',
    accentBg: 'rgba(147, 51, 234, 0.12)',
    accentBorder: 'rgba(147, 51, 234, 0.35)',
    glowGradient:
      'radial-gradient(ellipse at 50% 50%, rgba(147, 51, 234, 0.22) 0%, rgba(168, 85, 247, 0.08) 45%, transparent 75%)',
    bubbles: [
      {
        id: 'job-pipeline',
        icon: Briefcase,
        label: 'Application Pipeline',
        positionClass: '-top-5 left-4 sm:-top-6 sm:left-10 md:left-6',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 20,
        enterDelayMs: 60,
        isTop: true,
      },
      {
        id: 'cv-sync',
        icon: Sparkles,
        label: 'Docs CV Auto-Sync',
        positionClass: '-top-5 right-4 sm:-top-6 sm:right-10 md:right-6',
        floatAnimationClass: 'animate-bubble-float-2',
        exitDelayMs: 60,
        enterDelayMs: 120,
        isTop: true,
      },
      {
        id: 'realtime-tracking',
        icon: CheckCircle2,
        label: 'Interview Tracking',
        positionClass: '-bottom-5 left-4 sm:-bottom-6 sm:left-10 md:left-8',
        floatAnimationClass: 'animate-bubble-float-3',
        exitDelayMs: 100,
        enterDelayMs: 180,
        isTop: false,
      },
      {
        id: 'pdf-previews',
        icon: FileText,
        label: 'In-App PDF Rendering',
        positionClass: '-bottom-5 right-4 sm:-bottom-6 sm:right-10 md:right-8',
        floatAnimationClass: 'animate-bubble-float-1',
        exitDelayMs: 140,
        enterDelayMs: 240,
        isTop: false,
      },
    ],
  },
};

const DEFAULT_THEME: ProjectTheme = {
  accentColor: '#BD0A0A',
  accentBg: 'rgba(189, 10, 10, 0.12)',
  accentBorder: 'rgba(189, 10, 10, 0.35)',
  glowGradient:
    'radial-gradient(ellipse at 50% 50%, rgba(189, 10, 10, 0.18) 0%, rgba(189, 10, 10, 0.05) 45%, transparent 75%)',
  bubbles: [
    {
      id: 'default-1',
      icon: Code2,
      label: 'Production Architecture',
      positionClass: '-top-5 left-4 sm:-top-6 sm:left-10 md:left-6',
      floatAnimationClass: 'animate-bubble-float-1',
      exitDelayMs: 20,
      enterDelayMs: 60,
      isTop: true,
    },
    {
      id: 'default-2',
      icon: Sparkles,
      label: 'High Performance',
      positionClass: '-top-5 right-4 sm:-top-6 sm:right-10 md:right-6',
      floatAnimationClass: 'animate-bubble-float-2',
      exitDelayMs: 60,
      enterDelayMs: 120,
      isTop: true,
    },
    {
      id: 'default-3',
      icon: CheckCircle2,
      label: 'End-to-End Delivery',
      positionClass: '-bottom-5 left-4 sm:-bottom-6 sm:left-10 md:left-8',
      floatAnimationClass: 'animate-bubble-float-3',
      exitDelayMs: 100,
      enterDelayMs: 180,
      isTop: false,
    },
    {
      id: 'default-4',
      icon: ArrowUpRight,
      label: 'Scalable Systems',
      positionClass: '-bottom-5 right-4 sm:-bottom-6 sm:right-10 md:right-8',
      floatAnimationClass: 'animate-bubble-float-1',
      exitDelayMs: 140,
      enterDelayMs: 240,
      isTop: false,
    },
  ],
};

function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return hex;
  }
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getProjectTheme(projectName: string, projectColor?: string | null): ProjectTheme {
  const normalized = projectName.toLowerCase();
  let baseTheme = DEFAULT_THEME;
  for (const [key, theme] of Object.entries(THEMES)) {
    if (normalized.includes(key)) {
      baseTheme = theme;
      break;
    }
  }

  if (projectColor && projectColor.trim()) {
    const raw = projectColor.trim();
    const isHex = raw.startsWith('#') && (raw.length === 7 || raw.length === 4);
    const hex = isHex
      ? raw.length === 4
        ? `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`
        : raw
      : raw;

    return {
      ...baseTheme,
      accentColor: hex,
      accentBg: isHex ? hexToRgba(hex, 0.12) : 'rgba(189, 10, 10, 0.12)',
      accentBorder: isHex ? hexToRgba(hex, 0.35) : 'rgba(189, 10, 10, 0.35)',
      glowGradient: isHex
        ? `radial-gradient(ellipse at 50% 50%, ${hexToRgba(hex, 0.22)} 0%, ${hexToRgba(hex, 0.08)} 45%, transparent 75%)`
        : baseTheme.glowGradient,
    };
  }

  return baseTheme;
}

export default function BubbleProjectCarousel({ projects }: { projects: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [isHovered, setIsHovered] = useState(false);

  // Touch gesture support
  const touchStartX = useRef<number | null>(null);

  const total = projects.length;
  const currentProject = projects[currentIndex] || projects[0];
  const theme = getProjectTheme(currentProject?.name || '', currentProject?.color);

  const goToSlide = useCallback(
    (targetIndex: number, dir: 'next' | 'prev') => {
      if (transitionPhase !== 'idle' || targetIndex === currentIndex || total === 0) return;

      setDirection(dir);
      setTransitionPhase('exiting');

      // Exit phase: bubbles pop & card deflates
      const exitTimer = setTimeout(() => {
        setCurrentIndex(targetIndex);
        setTransitionPhase('entering');

        // Immediate switch to idle to trigger spring enter animation
        const enterTimer = setTimeout(() => {
          setTransitionPhase('idle');
        }, 30);

        return () => clearTimeout(enterTimer);
      }, 320);

      return () => clearTimeout(exitTimer);
    },
    [currentIndex, transitionPhase, total]
  );

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % total;
    goToSlide(nextIndex, 'next');
  }, [currentIndex, total, goToSlide]);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + total) % total;
    goToSlide(prevIndex, 'prev');
  }, [currentIndex, total, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (!currentProject) return null;

  return (
    <div
      className="relative mx-auto flex w-full max-w-5xl flex-col items-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects Showcase"
    >
      {/* Dynamic Atmospheric Glow behind the entire scene */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 sm:-inset-16 rounded-full opacity-70 blur-3xl transition-all duration-700"
        style={{
          background: theme.glowGradient,
          transform: transitionPhase === 'exiting' ? 'scale(0.85)' : 'scale(1)',
          opacity: transitionPhase === 'exiting' ? 0.3 : 0.75,
        }}
      />

      {/* Floating Organic Vector Clouds in Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 sm:-top-20 -left-10 sm:-left-20 w-64 sm:w-96 h-40 opacity-25 dark:opacity-15 animate-cloud-drift transition-all duration-700"
        style={{
          transform:
            transitionPhase === 'exiting'
              ? 'scale(0.2) translate(-60px, -40px)'
              : 'scale(1) translate(0, 0)',
          opacity: transitionPhase === 'exiting' ? 0 : undefined,
        }}
      >
        <svg viewBox="0 0 200 120" fill={theme.accentColor} className="w-full h-full filter blur-[1px]">
          <path d="M45,80 a25,25 0 0,1 -15,-45 a35,35 0 0,1 60,-15 a40,40 0 0,1 70,10 a30,30 0 0,1 20,40 a25,25 0 0,1 -20,20 z" />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-14 sm:-bottom-24 -right-8 sm:-right-20 w-72 sm:w-[28rem] h-44 opacity-25 dark:opacity-15 animate-cloud-drift transition-all duration-700"
        style={{
          animationDelay: '-6s',
          transform:
            transitionPhase === 'exiting'
              ? 'scale(0.2) translate(60px, 40px)'
              : 'scale(1) translate(0, 0)',
          opacity: transitionPhase === 'exiting' ? 0 : undefined,
        }}
      >
        <svg viewBox="0 0 200 120" fill={theme.accentColor} className="w-full h-full filter blur-[1px]">
          <path d="M50,75 a20,20 0 0,1 -10,-35 a30,30 0 0,1 55,-10 a35,35 0 0,1 60,15 a25,25 0 0,1 15,30 a20,20 0 0,1 -15,15 z" />
        </svg>
      </div>

      {/* Main Carousel Stage */}
      <div className="relative w-full px-2 sm:px-12 py-10 sm:py-14">
        {/* Floating Thematic Elements & SVGs (Bubbles) */}
        {theme.bubbles.map((bubble) => {
          const Icon = bubble.icon;
          const isExiting = transitionPhase === 'exiting';
          const isEntering = transitionPhase === 'entering';

          // Inline style for precise bubble deflation/scaling transition
          const bubbleTransform = isExiting
            ? `scale(0) translateY(${bubble.isTop ? '-28px' : '28px'})`
            : isEntering
            ? 'scale(0)'
            : 'scale(1) translateY(0px)';

          const bubbleOpacity = isExiting || isEntering ? 0 : 1;
          const bubbleFilter = isExiting || isEntering ? 'blur(10px)' : 'blur(0px)';

          const transitionStyle = isExiting
            ? `transform 0.3s cubic-bezier(0.4, 0, 1, 1) ${bubble.exitDelayMs}ms, opacity 0.25s ease ${bubble.exitDelayMs}ms, filter 0.25s ease ${bubble.exitDelayMs}ms`
            : `transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${bubble.enterDelayMs}ms, opacity 0.4s ease ${bubble.enterDelayMs}ms, filter 0.4s ease ${bubble.enterDelayMs}ms`;

          return (
            <div
              key={`${currentIndex}-${bubble.id}`}
              className={`absolute z-20 ${bubble.positionClass} hidden sm:flex items-center gap-2 rounded-full border border-border/80 dark:border-white/10 bg-card/85 dark:bg-card/75 px-3 py-1.5 backdrop-blur-md shadow-[0_8px_24px_rgba(24,26,23,0.08),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-transform duration-300 hover:scale-105 cursor-default ${
                transitionPhase === 'idle' ? bubble.floatAnimationClass : ''
              }`}
              style={{
                transform: bubbleTransform,
                opacity: bubbleOpacity,
                filter: bubbleFilter,
                transition: transitionStyle,
              }}
            >
              {/* Bubble Icon badge */}
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full transition-colors"
                style={{
                  backgroundColor: theme.accentBg,
                  color: theme.accentColor,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Bubble Label */}
              <span className="font-mono text-[11px] font-semibold tracking-tight text-text dark:text-neutral-200">
                {bubble.label}
              </span>
            </div>
          );
        })}

        {/* Flanking Navigation Arrows: Left & Right */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={transitionPhase !== 'idle'}
          className="group absolute left-1 sm:left-2 md:-left-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-border/90 bg-card/90 shadow-[0_4px_20px_rgba(24,26,23,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          style={{ borderColor: isHovered ? theme.accentBorder : undefined }}
          aria-label="Previous Project"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-text transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={transitionPhase !== 'idle'}
          className="group absolute right-1 sm:right-2 md:-right-4 top-1/2 -translate-y-1/2 z-30 flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full border border-border/90 bg-card/90 shadow-[0_4px_20px_rgba(24,26,23,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-md transition-all hover:scale-110 active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
          style={{ borderColor: isHovered ? theme.accentBorder : undefined }}
          aria-label="Next Project"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-text transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* Central Project Showcase Card */}
        <article
          className="relative z-10 mx-auto flex w-full max-w-3xl flex-col justify-between rounded-3xl border border-border/90 dark:border-white/10 bg-card/90 dark:bg-card/80 p-6 sm:p-9 md:p-10 backdrop-blur-md shadow-[0_16px_40px_-12px_rgba(24,26,23,0.08)] dark:shadow-[0_16px_40px_-12px_rgba(0,0,0,0.4)]"
          style={{
            transform:
              transitionPhase === 'exiting'
                ? `scale(0.92) translateX(${direction === 'next' ? '-60px' : '60px'})`
                : transitionPhase === 'entering'
                ? `scale(0.94) translateX(${direction === 'next' ? '60px' : '-60px'})`
                : 'scale(1) translateX(0)',
            opacity: transitionPhase === 'exiting' || transitionPhase === 'entering' ? 0 : 1,
            filter:
              transitionPhase === 'exiting' || transitionPhase === 'entering'
                ? 'blur(6px)'
                : 'blur(0px)',
            transition:
              transitionPhase === 'exiting'
                ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Top glowing accent line */}
          <div
            aria-hidden="true"
            className="absolute left-8 right-8 top-0 h-1 rounded-full transition-colors duration-500"
            style={{
              background: `linear-gradient(90deg, transparent 0%, ${theme.accentColor} 50%, transparent 100%)`,
              opacity: 0.8,
            }}
          />

          <div>
            {/* Header: Logo, Project Counter, Time Taken */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div
                  className="relative flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-background/80 p-2.5 shadow-xs transition-colors"
                  style={{
                    borderColor: isHovered ? theme.accentBorder : undefined,
                  }}
                >
                  {currentProject.logoUrl ? (
                    <Image
                      src={currentProject.logoUrl}
                      alt={`${currentProject.name} logo`}
                      width={48}
                      height={48}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <Code2 className="h-7 w-7 text-text-grey" />
                  )}
                </div>

                <div>
                  <span
                    className="inline-block font-mono text-[11px] font-bold uppercase tracking-wider transition-colors"
                    style={{ color: theme.accentColor }}
                  >
                    Project {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
                    {currentProject.name}
                  </h3>
                </div>
              </div>

              {currentProject.timeTaken && (
                <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-border/80 bg-muted/80 px-3 py-1 font-mono text-xs text-text-grey">
                  <Calendar className="h-3.5 w-3.5 text-text-grey/80" />
                  <span>{currentProject.timeTaken}</span>
                </div>
              )}
            </div>

            {/* Tagline */}
            <p
              className="mt-4 text-base sm:text-lg font-medium leading-relaxed transition-colors"
              style={{ color: theme.accentColor }}
            >
              {currentProject.tagline}
            </p>

            {/* Summary */}
            <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-text-grey">
              {currentProject.summary}
            </p>
          </div>

          {/* Bottom Area: Tech Stack & Action Button */}
          <div className="mt-7 sm:mt-8 border-t border-border/80 pt-5 sm:pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-muted/80 px-3 py-1 font-mono text-xs font-medium text-text transition-colors hover:border-text-grey/40"
                >
                  {tech}
                </span>
              ))}
            </div>

            {currentProject.primaryLink && (
              <a
                href={currentProject.primaryLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: theme.accentColor,
                }}
              >
                <span>Explore Project</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </article>
      </div>

      {/* Pagination Controls & Keyboard Hint */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {/* Bubble Pagination Dots */}
        <div className="flex items-center gap-2.5">
          {projects.map((p, idx) => {
            const isActive = idx === currentIndex;
            const itemTheme = getProjectTheme(p.name, p.color);

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => goToSlide(idx, idx > currentIndex ? 'next' : 'prev')}
                disabled={transitionPhase !== 'idle'}
                className={`relative rounded-full transition-all duration-500 cursor-pointer ${
                  isActive
                    ? 'h-3.5 w-10 shadow-[0_2px_8px_rgba(0,0,0,0.15)]'
                    : 'h-3.5 w-3.5 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
                style={{
                  backgroundColor: isActive ? itemTheme.accentColor : undefined,
                }}
                aria-label={`Go to slide ${idx + 1}: ${p.name}`}
                aria-current={isActive ? 'true' : 'false'}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />
                )}
              </button>
            );
          })}
        </div>

        {/* Keyboard hint */}
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-text-grey/70">
          <span>Use</span>
          <kbd className="rounded border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[10px]">
            ←
          </kbd>
          <kbd className="rounded border border-border bg-muted/70 px-1.5 py-0.5 font-mono text-[10px]">
            →
          </kbd>
          <span>or click arrows to navigate</span>
        </div>
      </div>
    </div>
  );
}
