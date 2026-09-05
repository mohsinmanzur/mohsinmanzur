# Portfolio Project Architecture & Rules

This document outlines the mandatory architectural decisions, technology stack, and engineering rules for the **Portfolio** project. These rules must be strictly adhered to. If deviation is ever needed, explicit user approval must be requested before making any changes.

## 1. Frontend & Unified Backend Architecture
- **Framework**: Next.js 16.3.4 using the App Router (`src/app/`).
- **Fullstack Single-Tier**: The frontend also acts as the backend (via Route Handlers `src/app/api/` and Server Actions). There is no separate backend service.
- **SEO & Performance**: Follow Next.js best practices for SEO (semantic HTML, proper metadata, OpenGraph, dynamic sitemaps, server-rendered components where applicable).
- **Styling**: Tailwind CSS. Ensure standard Next.js architecture and clean CSS variable tokens.
- **State Management**: Redux Toolkit is used for client-side state management where needed (`src/store/`).

## 2. Database & Data Access Layer
- **Provider & Engine**: PostgreSQL with NeonDB (`@neondatabase/serverless`).
- **ORM**: Drizzle ORM (`drizzle-orm`, `drizzle-kit`).
- **Dedicated Database Service Layer**: All database interactions throughout the entire app MUST go through a dedicated database service abstraction (`src/lib/db/service.ts`). Direct queries in UI components or route handlers are prohibited.
- **Database Swappability**: The service abstraction must allow swapping the database implementation (e.g. to another Postgres instance or MongoDB) without changing how the rest of the application interacts with data.

## 3. TypeScript
- **Version**: TypeScript 7.0.2 is strictly used across both frontend and backend code.
- Strict type-checking, explicit return types for services and API handlers, and no implicit `any`.

## 4. Media & Storage
- **Provider**: Cloudinary.
- **Directory Hierarchy**: All uploads must be stored under the parent folder `event-vendors/`.
- **Per-Model Subdirectories**: Each data model must have its own isolated subdirectory inside `event-vendors/` (e.g., `event-vendors/users/`, `event-vendors/events/`, `event-vendors/projects/`, `event-vendors/profiles/`).
- Use the central helper functions in `src/lib/cloudinary/index.ts`.

## 5. Authentication
- **No Auth**: There are no users and no authentication system is needed for this project.

## 6. Component Reuse & Design Patterns
- **Check Before Building**: Before creating any new component, ALWAYS check `src/components/` and `src/components/ui/` to see if a similar component already exists.
- Reusable primitive components live in `src/components/ui/`.
- Keep components focused, modular, and reusable.

## 7. Responsiveness
- All pages and components must be completely responsive across all screen sizes (mobile, tablet, desktop, large displays) using Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`).

## 8. Styling Placeholders
- Colors and typography are currently placeholders (`var(--color-primary)`, `var(--font-sans)`, etc.). The user will provide the final color palette and font family later.

## 9. Obsidian Vault Architecture
- The central Obsidian vault documents the system.
- Frontend and backend nodes MUST remain separate in the knowledge graph. They should not be interconnected into a single unified web, though specific interface/boundary connections (such as API endpoints and data models) may link across when necessary.

## 10. Rule Deviations
- Never deviate from any of these rules without prior explicit permission from the user.
