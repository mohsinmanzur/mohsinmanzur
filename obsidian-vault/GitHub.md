# GitHub Repository & Workflow Integration

Documentation regarding the GitHub repository configuration and coexistence with the user's special profile repository.

## Repository Details
- **Repository**: [mohsinmanzur/mohsinmanzur](https://github.com/mohsinmanzur/mohsinmanzur)
- **Nature**: GitHub Special Profile Repository (serves both profile overview and portfolio project)
- **Default Branch**: `main`
- **Output Branch**: `output` (used by automated contribution workflows)

## Preserved Assets & Workflows
1. **Profile `README.md`**:
   - Location: Repository root (`README.md`)
   - Purpose: Renders the public GitHub profile page (`github.com/mohsinmanzur`) with bio, tech stack badges, and contact links.
   - Status: Kept completely intact and unmodified so profile rendering is undisturbed.

2. **Snake Animation Action (`.github/workflows/snake.yml`)**:
   - Location: `.github/workflows/snake.yml`
   - Purpose: Generates the GitHub contribution grid snake animation SVG and pushes it to the `output` branch.
   - Status: Kept completely intact and functional without any interference from the portfolio build or source files.

## Portfolio Codebase Isolation
- Portfolio source code lives under `src/`, `public/`, and project configuration files.
- Build artifacts (`.next/`, `node_modules/`) and local secrets (`.env.local`) are strictly excluded via `.gitignore`.
- No collision occurs between portfolio build tooling and GitHub profile workflows.
