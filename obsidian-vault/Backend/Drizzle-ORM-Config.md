# Drizzle ORM Configuration

Setup and migration configuration for Drizzle Kit.

## Configuration
- Root config: `drizzle.config.ts`
- Schema path: `src/lib/db/schema.ts`
- Dialect: `postgresql`
- Connection: `DATABASE_URL` via `@neondatabase/serverless`

## CLI Commands
- `npx drizzle-kit generate` - Generate SQL migrations
- `npx drizzle-kit push` - Push schema changes directly to NeonDB

## Related Backend Notes
- [[Backend-Overview]]
- [[NeonDB-Postgres-Schema]]
- [[Database-Service-Abstraction]]
