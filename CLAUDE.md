# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on port 3000
npm run build      # Production build
npm run test       # Run tests (Vitest)
npm run lint       # ESLint
npm run check      # Auto-fix formatting (Prettier) and linting issues
```

## Architecture

This is a **TanStack Start** full-stack React app with file-based routing.

**Key conventions:**

- Routes live in `src/views/routes/` — TanStack Router auto-generates `src/routeTree.gen.ts` (never edit this file manually)
- Path aliases: `#/*` and `@/*` both resolve to `src/`
- No semicolons, single quotes, trailing commas (Prettier config)

**Data layer** (`src/data/`):

- `queries/` — TanStack Query hooks
- `schemas/` — validation schemas
- `services/` — API service functions

**App shell:** `__root.tsx` wraps all pages with `Header` and `Footer` from `src/views/globalComponents/`.

**Styling:** Tailwind CSS v4 via `src/styles/global.css`.
