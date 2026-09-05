# Database Service Abstraction

All database access throughout the portfolio MUST use the dedicated database service.

## Purpose & Contract
Defined in `src/lib/db/service.ts`:
- `IDatabaseService` interface declares all queries and mutations
- `NeonPostgresDatabaseService` implements this interface
- `dbService` singleton is exported for application consumption

## Swappability
By routing all data operations through `IDatabaseService`, the underlying database can be replaced (e.g. self-hosted Postgres, Supabase, MongoDB) without changing application or route logic.

## Related Backend Notes
- [[Backend-Overview]]
- [[NeonDB-Postgres-Schema]]
- [[Drizzle-ORM-Config]]
