# App Router Architecture

Next.js 16.3.4 App Router structure located in `src/app/`.

## Key Concepts
- Server Components by default for optimal performance and SEO
- Client components only where interactivity is required (`"use client"`)
- Nested layouts with global providers in `RootLayout` (`src/app/layout.tsx`)

## Related Frontend Notes
- [[Frontend-Overview]]
- [[SEO-Strategy]]
- [[Redux-State-Management]]
