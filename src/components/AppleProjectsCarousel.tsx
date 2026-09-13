'use client';

import React from 'react';
import type { Project } from '@/lib/db/types';
import { Carousel, Card, type AppleCardType } from './ui/apple-cards-carousel';

interface AppleProjectsCarouselProps {
  projects: Project[];
}

export default function AppleProjectsCarousel({ projects }: AppleProjectsCarouselProps) {
  const cards: AppleCardType[] = projects.map((project) => {
    const brandColor = project.color || '#181A17';

    return {
      src: project.logoUrl || '',
      title: project.name,
      category: project.timeTaken ? `${project.timeTaken} • Production` : 'Production System',
      isLogo: Boolean(project.logoUrl),
      color: brandColor,
    };
  });

  return (
    <div className="w-full">
      <Carousel
        items={cards.map((card, index) => (
          <Card key={`${card.title}-${index}`} card={card} index={index} />
        ))}
      />
    </div>
  );
}
