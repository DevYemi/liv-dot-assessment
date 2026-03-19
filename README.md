# Liv.dot Assessment

A full-stack event management dashboard built with TanStack Start. The app allows operators to view, manage, and monitor live events through a lifecycle-aware interface — covering everything from pre-event readiness checks to live stream previews and post-event state transitions.

## Tech Stack

| Category      | Technology                                                                      |
| ------------- | ------------------------------------------------------------------------------- |
| Framework     | [TanStack Start](https://tanstack.com/start) (React 19, SSR-capable)            |
| Routing       | [TanStack Router](https://tanstack.com/router) — file-based, type-safe          |
| Server State  | [TanStack Query](https://tanstack.com/query) — async data fetching and caching  |
| Styling       | [Tailwind CSS v4](https://tailwindcss.com/) — utility-first, OKLch color system |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) (Base Nova style, Lucide icons)             |
| Validation    | [Zod](https://zod.dev/)                                                         |
| Testing       | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

---

## Getting Started

### Prerequisites

- **Node.js** v22 or higher
- **npm** v10 or higher (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/DevYemi/liv-dot-assessment.git
cd liv-dot-assessment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

This project does not require any environment variables for local development. All data is currently served from in-memory dummy data defined in `src/constants/dummyData.ts`.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

### Available scripts

```bash
npm run dev       # Start the dev server on port 3000 (hot module replacement enabled)
npm run build     # Compile a production build
npm run preview   # Serve the production build locally for inspection
npm run test      # Run the test suite with Vitest (single run)
npm run lint      # Run ESLint across the codebase
```

---

## Project Folder Architecture

```
liv-dot-assessment/
├── src/
│   ├── constants/          # Static data and compile-time constants
│   ├── data/               # Data layer: queries, schemas, and services
│   │   ├── queries/        # TanStack Query hooks definitions
│   │   ├── schemas/        # Zod schemas for data validation
│   │   └── services/       # API services
│   ├── styles/             # Global CSS and Tailwind entry point
│   ├── utils/              # Shared pure utility functions
│   ├── views/              # All UI concerns
│   │   ├── globalComponents/   # App-wide shared components
│   │   ├── pages/              # Feature pages and their local components
│   │   └── routes/             # TanStack Router file-based route definitions
│   ├── router.tsx          # Router instance and configuration
│   └── routeTree.gen.ts    # Auto-generated route tree (never edit manually)
├── public/                 # Static assets served as-is
```

### Directory breakdown

#### `Constants Dir`

Holds static, compile-time values that don't change at runtime. E.g. `dummyData.ts`, which seeds the app with simulated event records. Moving static data here keeps it separate from business logic and makes it easy to swap in a real API later.

#### `Data Dir`

The entire data layer lives here, split into three clear sub-layers:

- **`Queries Dir`** — TanStack Query hooks (e.g., `useEventQuery`). These are the only place components should reach for async data. Keeping query hooks isolated means cache keys, stale times, and retry logic are defined once and reused everywhere.
- **`Schemas Dir`** — Zod schemas that describe the shape of domain objects (e.g., `Event`). Schemas are the single source of truth for data validation and serve as living documentation for API contracts.
- **`Services Dir`** — Raw async functions that talk to the network or connect to a backend. Services are called exclusively by queries, never directly from components — this enforces a clean separation between transport and rendering concerns.

#### `Styles Dir`

Contains `global.css`, the Tailwind v4 entry point. All `@import` statements, CSS custom properties (design tokens for color, radius, etc.), and any global base styles live here. There is no `tailwind.config.js` in v4 — configuration happens in CSS directly.

#### `Utils Dir`

Pure, stateless helper functions shared across the app. Each file should export functions with no side effects and no UI coupling.

#### `Views Dir`

All UI related code are kept here. Subdivided to keep scale manageable:

- **`GlobalComponents Dir`** — Components kept here are components with no page-specific knowledge E.g. `Header`, `Footer`, `Button`, etc. This are components that are used across multiple pages.
- **`Pages Dir`** — One directory per feature page. Each page directory owns its own state hook, its top-level component (`index.tsx`), and a `local-components/` folder for sub-components that are not shared outside that page. This co-location pattern prevents premature abstraction — a component only graduates to `globalComponents/` when a second page needs it.

  **MVVM-inspired page structure**

  Each page follows a pattern inspired by the **MVVM (Model-View-ViewModel)** architectural pattern. The roles map like this:

  | MVVM layer    | In this codebase                                     |
  | ------------- | ---------------------------------------------------- |
  | **Model**     | `data/` layer (services, queries, schemas)           |
  | **ViewModel** | `use<PageName>.ts` — the page's state hook           |
  | **View**      | `index.tsx` and everything under `local-components/` |

  The **ViewModel hook** (`use<PageName>.ts`) is the heart of this pattern. It is responsible for all UI logic that does not belong in JSX:
  - Fetching async data via TanStack Query hooks
  - Transforming and preparing raw data into view-ready shapes
  - Owning derived state and computed values
  - Handling form validation and input state
  - Exposing a clean, typed surface to the View — no raw query internals leak out

  The **View** (`index.tsx`) stays as thin as possible: it calls the ViewModel hook once, destructures what it needs, and focuses entirely on rendering and layout. This separation makes the page trivial to test (mock the hook, assert the UI) and easy to reason about (UI bugs live in the View, logic bugs live in the ViewModel).

  ```
  EventDashboard/
  ├── index.tsx              # View — renders JSX, consumes the ViewModel hook
  ├── useEventDashboard.ts   # ViewModel — all UI logic, data fetching, state
  └── local-components/      # Sub-views scoped to this page
  ```

  **Nested components and their own ViewModels**

  Components inside `local-components/` follow the same rule. If a sub-component has non-trivial logic — its own data requirements, derived state, or event handlers beyond a simple callback — it gets its own `use<ComponentName>.ts` hook sitting alongside it:

  ```
  local-components/
  ├── EventHero/
  │   ├── index.tsx              # View for this sub-component
  │   ├── useEventHero.ts        # ViewModel scoped to EventHero (if needed)
  │   └── local-components/      # Components only EventHero needs
  │       └── StreamPreview/
  │           ├── index.tsx
  │           └── useStreamPreview.ts
  ```

  **The component tree as a graph**

  This nesting convention naturally produces a **tree of ownership** — a graph where each node is a component and its edges point to its direct children. A few properties make this graph useful:
  - **Locality** — every file is next to the thing it belongs to. `StreamPreview` only appears under `EventHero` because only `EventHero` uses it.
  - **Visibility** — you can understand the full scope of a feature by reading one directory subtree. Nothing is hidden in a distant shared folder.
  - **Graduated abstraction** — a component starts deeply nested. It moves up the tree (eventually to `globalComponents/`) only once a second, unrelated subtree needs it. The graph makes this promotion decision obvious: if two branches reference the same node, it should live at their common ancestor.

- **`Routes Dir`** — TanStack Router route files. Each file in this directory maps to a URL segment. `__root.tsx` wraps every route with the app shell (Header + Footer). `index.tsx` maps to `/`. **Do not put rendering logic here** — routes import from `pages/` and delegate rendering immediately.

### Path aliases

One alias is configured in `tsconfig.json` and `vite.config.ts`, both pointing to `src/`:

```ts
import { something } from '@/data/queries/eventQueries'
```
