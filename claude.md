# Futsal App — Project Context

## Overview

Application for the **DUMP futsal tournament**. A full-stack monorepo for managing futsal tournaments — teams, players, matches, and match events (goals, cards, penalties, etc.). Built by [DUMP](https://github.com/dump-hr). UI text is in **Croatian**.

## Monorepo Structure

```
futsal-app/
├── apps/api/        # NestJS backend (REST API)
├── apps/web/        # React frontend (Vite + SCSS)
├── packages/types/  # Shared DTOs & enums (@futsal-app/types)
├── infrastructure/  # Terraform (AWS), Ansible, deployment scripts
├── compose.yml      # Local PostgreSQL (Docker)
└── turbo.json       # Turborepo config
```

- **Package manager:** Yarn 3.6.4 (workspaces)
- **Build system:** Turborepo
- **Node version:** 20

## Running the Project

```bash
docker compose up -d          # Start PostgreSQL on port 3001
yarn install                  # Install all dependencies
yarn db:generate              # Generate Prisma client
yarn db:migrate               # Apply migrations
yarn db:seed                  # Seed database (optional)
yarn dev                      # Start API (port 3000) + Web (port 5173)
```

Individual apps: `yarn workspace api run dev` / `yarn workspace web run dev`

## Apps

### API (`apps/api/`)

- **Framework:** NestJS 11 (CommonJS, SWC compiler)
- **ORM:** Prisma 6 with PostgreSQL
- **Global prefix:** `/api` (set in `main.ts`)
- **Validation:** `class-validator` + `ValidationPipe` with `whitelist: true`
- **Env vars:** loaded via `dotenv-cli` (`dotenv -c --`)
- **Database URL:** `DATABASE_URL` env var (e.g., `postgresql://dumpovac:dump1234@localhost:3001/futsal-db?schema=public`)

#### API Architecture Pattern

Each domain entity follows this NestJS module pattern:

```
src/<entity>/
├── <entity>.module.ts      # Module declaration (controllers + providers)
├── <entity>.controller.ts  # REST endpoints
└── <entity>.service.ts     # Business logic using PrismaService
```

- Services inject `PrismaService` (extends `PrismaClient`) directly.
- DTOs come from `@futsal-app/types` (shared package), not local files.
- `PrismaModule` is a global provider; individual feature modules also list `PrismaService` in their own providers.

#### API Modules & Endpoints

| Module | Endpoints |
| --- | --- |
| `tournament` | `POST /tournament`, `GET /tournament/:id`, `PATCH /tournament/:id`, `DELETE /tournament/:id` |
| `player` | `GET /player/search/:teamId?q=` — searches by teamId, filters firstName/lastName case-insensitively, returns max 10 |
| `match-event` | `POST /match-event`, `GET /match-event/match/:matchId` (ordered by minute asc), `PATCH /match-event/:id`, `DELETE /match-event/:id` |

`AppModule` imports: `PrismaModule`, `TournamentModule`, `PlayerModule`, `MatchEventModule`.

#### Database Seed

Seed file at `apps/api/prisma/seed.ts` creates:
- 1 tournament ("DUMP Futsal 2026")
- 8 teams (2 per group A–D) with Croatian university-themed names
- 40 players (5 per team) with Croatian names and random birth dates (1998–2003)
- 6 matches (4 group stage + 1 semi-final + 1 final) with goal and yellow card events

### Web (`apps/web/`)

- **Framework:** React 19 with Vite 7
- **Routing:** `wouter` (lightweight router)
- **State/Data fetching:** TanStack React Query v5
- **HTTP client:** Axios (base instance at `/api`, response interceptor returns `response.data`)
- **Forms:** `react-hook-form`
- **Styling:** SCSS Modules (`.module.scss` per component)
- **Notifications:** `react-hot-toast`
- **Error handling:** `react-error-boundary`
- **CSS preprocessor config:** `_colors.scss` and `_mixins.scss` are auto-imported in every SCSS file via Vite's `additionalData`

#### Path Aliases (Vite + TSConfig)

| Alias           | Resolves to        |
| --------------- | ------------------ |
| `@/`            | `src/`             |
| `@api/*`        | `src/api/*`        |
| `@assets/*`     | `src/assets/*`     |
| `@components/*` | `src/components/*` |
| `@hooks/*`      | `src/hooks/*`      |
| `@layouts/*`    | `src/layouts/*`    |
| `@pages/*`      | `src/pages/*`      |
| `@routes/*`     | `src/routes/*`     |

#### Frontend Architecture Patterns

**API hooks pattern** (in `src/api/<entity>/`):

- One file per mutation/query hook using TanStack React Query.
- Hooks wrap Axios calls that use shared DTOs from `@futsal-app/types`.
- Success/error toast notifications in `onSuccess`/`onError`.
- Barrel exports via `index.ts`.

Current API hook modules:
- `tournament/` — `useTournamentCreate`
- `player/` — `usePlayerSearch(teamId, query)` (enabled when query.length > 0)
- `matchEvent/` — `useMatchEvents(matchId)`, `useMatchEventCreate(matchId)`, `useMatchEventUpdate(matchId)`, `useMatchEventDelete(matchId)` (all invalidate `['matchEvents', matchId]`)

**Component pattern** (in `src/components/<Name>/`):

- Each component has its own folder: `<Name>.tsx` + `<Name>.module.scss`
- Components use default exports, re-exported as named exports from `components/index.ts`.
- Styling with `clsx` for conditional classnames.

**Existing components:** `Button`, `ButtonSmall`, `EventDropdown`, `MatchEventCard`, `ModalConfirmation`, `Navbar`

**Layouts** (in `src/layouts/`):
- `BackgroundLayout` — wrapper div with background SCSS class
- `NavbarLayout` — wraps children with `<Navbar />` above

**Hooks** (in `src/hooks/`):
- `useCloseComponent({ onClose, containerRef? })` — Escape key listener + optional outside-click detection + auto-focus `[role="dialog"]`. Used by `ModalConfirmation` and `EventDropdown`.

**Frontend-local types** (in `src/types/`):
- `BackgroundColor` — const object + type: `Transparent`, `Lime`, `White`, `Red`
- `EVENT_LABELS` — `Record<EventType, string>` with Croatian labels (e.g., `goal → 'Gol'`, `yellowCard → 'Žuti karton'`)
- `ErrorResponseType` — typed `AxiosError` with `{ statusCode, message, error }` response

**Routes** defined in `src/routes/routes.ts`:

- `HOME: '/'`
- `ADMIN: '/admin'`
- `TEAMS: '/admin/teams'`
- `GROUPS: '/admin/groups'`
- `MATCHES: '/admin/matches'`

**Pages** (in `src/pages/`):
- `HomePage` — currently a visual sandbox rendering components in various configurations

#### Dev Server Proxy

Vite proxies `/api` requests to `http://localhost:3000` in development.

## Shared Types (`packages/types/`)

Published as `@futsal-app/types`. Built with `tsup` (outputs CJS + ESM + `.d.ts`).

Uses `class-validator` decorators so DTOs work for both API validation and frontend type-safety.

### Current DTOs

- **`TournamentModifyDto`** — `{ name: string }` (create/update payload)
- **`TournamentDto`** — `{ id: number, name: string }` (response)
- **`PlayerDto`** — `{ id: number, firstName: string, lastName: string }`
- **`MatchEventCreateDto`** — `{ minute: number, matchId: number, playerId?: number, eventType: EventType, isForHomeTeam: boolean }`
- **`MatchEventUpdateDto`** — `{ minute?: number, playerId?: number, eventType?: EventType }`
- **`MatchEventDto`** — `{ id: number, minute: number, matchId: number, playerId?: number, eventType: EventType, isForHomeTeam: boolean }`

### Current Enums

- **`Group`** — `A`, `B`, `C`, `D`
- **`EventType`** — `goal`, `ownGoal`, `penaltyGoal`, `penaltyMiss`, `yellowCard`, `redCard`, `injury`, `shootoutGoal`, `shootoutMiss`

### Adding New Shared Types

1. Create/edit files in `packages/types/src/`
2. Export from `packages/types/src/index.ts`
3. Build: `yarn workspace @futsal-app/types run build`
4. Import anywhere: `import { MyDto } from '@futsal-app/types'`

## Database Schema (Prisma)

PostgreSQL with these models:

| Model        | Key Fields                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| `Tournament` | `id`, `name` (unique), `teams[]`                                                                                   |
| `Team`       | `id`, `name` (unique), `logoUrl?`, `group?` (enum), `tournamentId?`, `players[]`, `homeMatches[]`, `awayMatches[]` |
| `Player`     | `id`, `firstName`, `lastName`, `dateOfBirth?`, `teamId?`, `events[]`                                               |
| `Match`      | `id`, `timeOfMatch`, `homeTeamId?`, `awayTeamId?`, `homeGoals`, `awayGoals`, `matchType` (enum), `events[]`        |
| `MatchEvent` | `id`, `minute`, `matchId`, `playerId?`, `eventType` (enum), `isForHomeTeam`                                        |

### Enums (DB-level)

- `Group`: A, B, C, D
- `EventType`: goal, ownGoal, penaltyGoal, penaltyMiss, yellowCard, redCard, injury, shootoutGoal, shootoutMiss
- `MatchType`: group, quarterFinal, semiFinal, final, thirdPlace

### Key Relationships

- Tournament → Team (1:N)
- Team → Player (1:N)
- Team → Match (via homeMatches/awayMatches, 1:N each)
- Match → MatchEvent (1:N)
- Player → MatchEvent (1:N, optional)

## Design System

- **Font:** Roboto (Regular 400, Medium 500, SemiBold 600, Bold 700) — loaded from local `.ttf` files
- **Colors:** `$lime: #b3ff3b`, `$white: #ffffff`, `$gray-light: #e5e5e5`, `$gray-medium: #5c5c5c`, `$gray-dark: #2c2c2c`, `$blue: #254166`, `$red: #f14531`, `$yellow: #ffe53b`, `$black: #151515`
- **Typography mixins:** `title-1` (72px), `title-2` (48px), `title-3` (24px), `title-3-bold`, `body-large` (20px), `body-normal` (16px), `body-normal-bold`, `body-small` (14px), `legal-text` (10px)
- Colors and mixins are globally available in all SCSS modules (auto-imported by Vite)

## Icons

SVG icons stored in `apps/web/src/assets/icons/` and exported from `icons/index.ts`:

`ArrowDownWhite`, `ArrowLeftGray`, `ArrowRightBlack`, `ArrowRightWhite`, `CheckBlack`, `CrossGray`, `XBlack`, `XWhite`, `PlusBlack`, `PlusGray`, `PlusWhite`, `ExitBlack`, `HistoryGray`, `LinkBlack`, `LockBlack`, `LockGray`, `PencilGray`, `PlayBlack`, `SettingsGray`, `TrashCanBlack`, `TrashCanGray`, `UploadGray`, `Logo`

## Key Commands

| Command            | Description                |
| ------------------ | -------------------------- |
| `yarn dev`         | Start all apps in dev mode |
| `yarn build`       | Build all apps             |
| `yarn lint`        | Lint all apps              |
| `yarn db:generate` | Generate Prisma client     |
| `yarn db:migrate`  | Run Prisma migrations      |
| `yarn db:studio`   | Open Prisma Studio GUI     |
| `yarn db:seed`     | Seed database              |

## Conventions

- API route handlers use `ParseIntPipe` for ID params.
- API services throw `NotFoundException` for missing records.
- Frontend uses Croatian language for UI strings (e.g., "Odustani", "Potvrdi", "Jeste li sigurni?").
- Components use CSS Modules with `clsx` for class composition.
- API mutations use TanStack Query's `useMutation` with toast feedback.
- All barrel exports via `index.ts` files.
