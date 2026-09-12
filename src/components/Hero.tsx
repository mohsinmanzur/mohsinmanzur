'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Mail, FileText } from 'lucide-react';
import mohsinImg from '@/assets/Mohsin.jpg';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

import HoverCard from '@/components/ui/hover-card';

const roles = [
  'AI Software Developer',
  'Full-Stack Engineer',
  'Problem Solver',
  'Product Builder',
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    navigator.clipboard.writeText('mohsinmanzoor32@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isMobile =
      typeof window !== 'undefined' &&
      (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);

    if (isMobile) {
      window.location.href = 'mailto:mohsinmanzoor32@gmail.com';
      return;
    }

    handleCopyEmail();
  };

  useEffect(() => {
    const currentFullText = roles[roleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText === currentFullText) {
      // Pause before deleting
      timer = setTimeout(() => setIsDeleting(true), 1600);
    } else if (isDeleting && displayText === '') {
      // Move to next role
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    } else {
      // Typing or deleting characters
      const speed = isDeleting ? 30 : 55;
      timer = setTimeout(() => {
        setDisplayText((prev) =>
          isDeleting
            ? prev.substring(0, prev.length - 1)
            : currentFullText.substring(0, prev.length + 1)
        );
      }, speed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section id="home" className="flex items-center justify-center px-6 sm:px-8 lg:pl-16 lg:pr-44">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Bio & Calls to Action */}
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-text leading-[1.15]">
            Hello, I&apos;m{' '}
            <span className="relative inline-block text-primary">
              Mohsin Manzoor
              <span
                className="absolute bottom-1.5 left-0 w-full h-2.5 -z-10 rounded-sm opacity-20"
                style={{ backgroundColor: 'var(--primary)' }}
              />
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-text-grey font-normal max-w-lg min-h-[calc(2*1.625em)] leading-relaxed">
            <span className="font-semibold text-text font-mono">
              {displayText}
              <span
                className="inline-block w-0.5 h-5 align-middle animate-pulse"
                style={{ backgroundColor: 'var(--primary)' }}
              />
            </span>{' '}
            passionate about building innovative solutions and products.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div
              className="relative inline-flex"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Button
                variant={"default"}
                size={"lg"}
                onClick={handleContactClick}
                className="cursor-pointer"
              >
                <span>Contact Me</span>
                <Mail className="w-4 h-4" />
              </Button>

              {isHovered && (
                <HoverCard
                  position="absolute"
                  placeAbove={true}
                  left="50%"
                  arrowLeft="50%"
                  vertical={{ bottom: 'calc(100% + 14px)' }}
                  className="-translate-x-1/2 w-auto whitespace-nowrap px-4 py-2 text-center"
                >
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-white cursor-pointer select-all outline-none transition-opacity hover:opacity-90"
                    title="Click to copy email"
                  >
                    {copied ? 'Copied to clipboard!' : 'mohsinmanzoor32@gmail.com'}
                  </button>
                </HoverCard>
              )}
            </div>

            <Button
              variant={"outline"}
              size={"lg"}
              render={
                <a
                  href="https://docs.google.com/document/d/1L-79IDiN0WmxvK9mUevO-3x7iNYYjU0kq4Fq3eMaC34/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <span>View CV</span>
              <FileText className="w-4 h-4" />
            </Button>
          </div>

          {/* Social Icons */}
          <div>
            <ButtonGroup>
              <Button
                variant="outline"
                size="icon"
                className="rounded-l-lg!"
                render={
                  <a
                    href="https://www.linkedin.com/in/mohsinmanzur/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  />
                }
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
              </Button>

              <Button
                variant="outline"
                size="icon"
                render={
                  <a
                    href="https://github.com/mohsinmanzur"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  />
                }
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* Right Column: Hero Image with Decorative Offset Border */}
        <div
          className="relative isolate w-full max-w-sm sm:max-w-md mx-auto
            before:content-[''] before:absolute before:bottom-[10px] before:left-[5px] before:z-[-1] before:h-[10px] before:w-[40%]
            before:shadow-[0_5px_14px_rgba(0,0,0,0.4)] before:[transform:skew(-5deg)_rotate(-5deg)] before:transition-all before:duration-300 before:ease-in-out
            after:content-[''] after:absolute after:bottom-[10px] after:right-[5px] after:z-[-1] after:h-[10px] after:w-[40%]
            after:shadow-[0_5px_14px_rgba(0,0,0,0.4)] after:[transform:skew(5deg)_rotate(5deg)] after:transition-all after:duration-300 after:ease-in-out
            hover:before:left-[15px] hover:before:shadow-[0_5px_14px_rgba(0,0,0,0.7)]
            hover:after:right-[15px] hover:after:shadow-[0_5px_14px_rgba(0,0,0,0.7)]"
        >
          {/* Offset Accent Border Frame (protruding bottom-right like reference) */}
          <div
            className="absolute top-4 left-4 w-full h-full rounded-2xl border-2 z-0"
            style={{ borderColor: 'var(--primary)' }}
          />

          {/* Profile Image Card */}
          <div className="relative z-10 w-full aspect-[3/4] rounded-2xl bg-card shadow-md overflow-hidden">
            <Image
              src={mohsinImg}
              alt="Mohsin Manzoor"
              priority
              fill
              className="object-cover object-[center_83%] contrast-100 grayscale scale-110 origin-bottom"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
