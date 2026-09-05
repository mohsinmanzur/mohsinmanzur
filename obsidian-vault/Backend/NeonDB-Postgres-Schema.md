# NeonDB PostgreSQL Schema

Database tables defined in `src/lib/db/schema.ts` using Drizzle ORM.

## Entities
1. `profiles`: Author metadata (name, title, bio, email, socialLinks)
2. `projects`: Portfolio projects (title, slug, description, coverImage, tags, urls)
3. `skills`: Technical competencies and categories
4. `experiences`: Work history and accomplishments
5. `contactMessages`: Incoming messages from portfolio contact forms

## Related Backend Notes
- [[Backend-Overview]]
- [[Database-Service-Abstraction]]
- [[Drizzle-ORM-Config]]
