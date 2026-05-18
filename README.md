# Project Tracker — Web App

A React-based project and task management application that allows users to create, edit, delete, and track projects and their associated tasks.

## Features

- **Projects CRUD** — Create, view, edit, and delete projects with confirmation dialogs
- **Tasks CRUD** — Add, edit, mark complete, and delete tasks within each project
- **Paginated Tables** — Sortable, paginated data tables powered by TanStack Table
- **Form Validation** — Client-side validation with inline error feedback
- **Error Handling** — Per-route error boundaries, API error display, and global fallback

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Data Fetching | TanStack React Query |
| Tables | TanStack React Table |
| UI Library | Material UI (MUI) v7 |
| Build Tool | Vite |
| Testing | Vitest + React Testing Library |
| Language | TypeScript (strict mode) |
| Code Quality | ESLint + Prettier |

## Architecture Decisions

- **Service layer** (`services/`) separates API concerns from components via a generic `fetchApi` helper
- **Custom hooks** (`hooks/`) wrap React Query for each entity, providing clean data-fetching abstractions
- **Reusable `DataTable`** component eliminates table duplication across Projects and Tasks views
- **Modal context** with explicit `openModal`/`closeModal` actions (not toggles) for predictable state management
- **Query key helpers** centralize cache key management for easy invalidation

## Getting Started

### Prerequisites

- Node.js 18+
- A running backend API (see backend repo)

### Setup

```bash
# Install dependencies
pnpm install

# Copy environment config
cp .env.example .env

# Start dev server
pnpm start
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8080` |

### Scripts

| Command | Description |
|---|---|
| `pnpm start` | Start dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm test` | Run unit tests with Vitest |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── DataTable/    # Generic paginated table
│   ├── ConfirmDialog/# Reusable confirmation dialog
│   └── ...
├── contexts/         # React context providers (modal state)
├── hooks/            # Custom React Query hooks per entity
├── pages/            # Route-level page components
├── services/         # API service layer
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
└── constants/        # Shared constants
```

## Roadmap

- Form library integration (React Hook Form / TanStack Form) for complex forms
- Infinite scrolling / server-side pagination for large datasets
- Warn users about incomplete tasks before project deletion
- End-to-end tests with Playwright for critical user flows
- Optimistic updates for mutations
