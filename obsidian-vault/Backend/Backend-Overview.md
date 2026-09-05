# Backend Architecture Overview

The backend is colocated with Next.js inside `src/` (Route Handlers and Server Actions), operating without an external backend server.

## Core Modules
- [[Database-Service-Abstraction]] - Centralized database repository service
- [[NeonDB-Postgres-Schema]] - Drizzle schema and PostgreSQL entities
- [[Drizzle-ORM-Config]] - Migrations and schema configuration
- [[Cloudinary-Storage-Architecture]] - Media assets in `event-vendors/`
- [[API-Route-Handlers]] - Server-side route handlers

## Boundary Connections
- Exposes data contracts via [[Data-Contracts-and-Types]]
- Handlers mapped to frontend actions in [[Frontend-Overview]]
