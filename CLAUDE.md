# Portfolio Project Architecture & Rules

> Rules are also maintained in `.claude/rules/project-rules.md`.

## Mandatory Architecture & Guidelines

1. **Frontend & Unified Backend**:
   - Next.js 16.3.4 (App Router).
   - Tailwind CSS for styling.
   - Redux Toolkit (`src/store/`) for client state management where needed.
   - Frontend acts as the backend (Route Handlers & Server Actions). No separate backend.
   - Strict SEO best practices (semantic HTML, proper metadata, responsive layouts).

2. **Database & Data Access**:
   - PostgreSQL with NeonDB (`@neondatabase/serverless`) and Drizzle ORM.
   - Dedicated database service layer (`src/lib/db/service.ts`) used throughout the entire application.
   - Swappable interface (`IDatabaseService`) so the database can be replaced (e.g. MongoDB or another Postgres) without modifying call sites.

3. **TypeScript**:
   - TypeScript 7.0.2 used across all frontend and backend code.

4. **Media & Storage (Cloudinary)**:
   - Cloudinary is used for all images and documents.
   - All assets MUST reside within the parent directory `event-vendors/`.
   - Each model has its own dedicated directory (e.g., `event-vendors/users/`, `event-vendors/projects/`, etc.).

5. **Authentication**:
   - No auth is needed (no users).

6. **Component Reuse**:
   - Check if a component already exists in `src/components/` before creating a new one.
   - Use and extend `src/components/ui/` primitives.

7. **Styling Placeholders**:
   - Colors and font family are placeholders for now. Do not hardcode specific non-neutral brand colors or non-default fonts until provided by the user.

8. **Responsiveness**:
   - All pages and components must be fully responsive across mobile, tablet, and desktop viewports.

9. **Obsidian Vault**:
   - Vault structure maintains isolated Frontend and Backend note clusters, connecting only across explicit API/Data boundaries.

10. **Rule Deviations**:
    - Ask the user for explicit approval before deviating from any of these rules.
