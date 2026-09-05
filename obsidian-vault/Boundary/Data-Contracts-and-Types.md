# Data Contracts and Types

TypeScript domain contracts and schemas shared across the frontend and server logic.

## Types Defined
Located in `src/lib/db/types.ts`:
- `Profile` and `NewProfile`
- `Project` and `NewProject`
- `Skill` and `NewSkill`
- `Experience` and `NewExperience`
- `ContactMessage` and `NewContactMessage`

## Boundary Relationship
- [[NeonDB-Postgres-Schema]] defines the database mapping
- [[Reusable-UI-Components]] and pages consume these contracts
