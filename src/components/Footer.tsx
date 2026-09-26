import React from 'react';
import { footerLinks } from '@/lib/links';

export default function Footer() {
  return (
    <footer className="w-full border-t border-border mt-16 sm:mt-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-16 py-3">
        <p className="font-serif text-base sm:text-lg text-text">
          {footerLinks.map((link, index) => (
            <React.Fragment key={link.name}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-[3px] hover:text-primary transition-colors"
              >
                {link.name}
              </a>
              {index < footerLinks.length - 1 && ' · '}
            </React.Fragment>
          ))}
        </p>
      </div>
    </footer>
  );
}
