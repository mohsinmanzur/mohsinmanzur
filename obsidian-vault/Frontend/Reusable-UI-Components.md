# Reusable UI Components

Policy and catalog for UI component reuse in `src/components/ui/`.

## Reuse Rule
Before creating ANY new component, check `src/components/ui/` for existing equivalents. New primitives must be added here and exported via `src/components/ui/index.ts`.

## Core Primitives
- `Button` - Customizable button with variants (`primary`, `secondary`, `outline`, `ghost`, `danger`)
- `Card` - Standard card with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Badge` - Status indicator badge

## Related Frontend Notes
- [[Frontend-Overview]]
- [[Responsive-Design-Tokens]]
