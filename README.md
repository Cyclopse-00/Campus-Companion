# CampusHub

CampusHub is a mobile-first Progressive Web App (PWA) built for campus students, faculty, and administrators. It provides interactive campus navigation with live utility markers, timetable-aware routing, notices, events, lost and found, grievances, and emergency safety features.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript (Strict mode)
- **Styling & UI:** Tailwind CSS, shadcn/ui primitives, Lucide Icons
- **Map Engine:** Leaflet + OpenStreetMap tiles (client-only dynamic import)
- **Database & ORM:** PostgreSQL + PostGIS with Prisma ORM
- **State Management:** Zustand
- **Authentication:** NextAuth.js v5 (Auth.js) with college domain gating and role-based access control
- **Push Notifications:** Firebase Cloud Messaging (FCM)
- **PWA:** `@ducanh2912/next-pwa` with custom service worker caching
- **Testing & Quality:** Vitest (unit/integration), Playwright (E2E), ESLint, Prettier

## Conventions

- **Timezone:** All timestamps are stored in UTC and displayed in `Asia/Kolkata` (IST: UTC+05:30).
- **Coordinates:** WGS84 standard `[longitude, latitude]` for GeoJSON, converted to `[latitude, longitude]` for Leaflet strictly via `src/lib/geo.ts`.
- **Data Access:** Components never import mock data or call database queries directly. They access data through `src/lib/` abstraction functions (`getMarkers()`, `getBuildings()`, etc.).
- **Mobile First:** Optimized for 360px viewport baseline with responsive adaptions for tablets and desktop. 44px minimum touch targets throughout.

## Phase 1: Frontend Core (Completed)

1. **Student Shell (`src/app/(app)/layout.tsx`):**
   - Responsive bottom navigation bar (`BottomNav`) with 44px touch targets.
   - Persistent `SOSFloatingButton` in reserved emergency red (`#e11d48` / `bg-rose-600`), routing to `/safety`.
   - `OfflineBanner` detecting network status transitions with cached offline guarantees.
   - `ThemeToggle` supporting smooth light/dark mode transitions.
   - `TopBar` displaying brand identity and live Asia/Kolkata campus time.

2. **Login Page UI (`src/app/(auth)/login/page.tsx`):**
   - Distinctive high-contrast mobile-first card design.
   - Switcher between College Email OTP and College Credentials.
   - One-tap quick demo login roles (Student, Faculty, Admin).
   - "Continue as Guest" link to explore map without authentication.

3. **Map Home (`src/app/(app)/map/page.tsx`):**
   - Interactive client-only Leaflet map with Carto Voyager tiles.
   - `UtilityFilterBar` featuring all 11 category layers with counts, colors, and quick filters ("Open Now", "Wheelchair Accessible").
   - Marker clustering when zoomed out with smooth cluster zoom-in on click.
   - Custom SVG marker pins for all 11 utility categories.
   - Interactive `MarkerDetailsSheet` bottom sheet displaying weekly operating hours in `Asia/Kolkata`, wheelchair tags, crowd badge, and contact action buttons.
   - Search box searching name, keywords, amenities, and building names.
   - "Locate Me" GPS geolocation with accuracy circle and error fallback.
   - Accessible List View Alternative toggleable with a single tap (WCAG AA compliant).

4. **Open Status Engine (`src/lib/open-status.ts`):**
   - Strict `Asia/Kolkata` timezone computation.
   - Full support for overnight shifts across midnight boundaries (e.g., 22:00 to 02:00).
   - Holiday / date-specific `CLOSED` and `OPEN_CUSTOM` overrides.
   - Exam season schedule overrides.
   - Configurable `CLOSING_SOON` threshold (default: 30 minutes).
   - Comprehensive unit test suite in `tests/open-status.test.ts` (16 passing tests).

5. **Mock Spatial & Utility Data Layer:**
   - Realistic sample GeoJSON in `public/geojson/`: `campus-boundary.geojson`, `buildings.geojson`, `pathways.geojson` (with wheelchair flag on every segment).
   - 11 SVG pin icons in `public/icons/` matching category colors and silhouettes.
   - Data functions `getMarkers()`, `getMarkerById()`, `getBuildings()`, `getPathways()`, and `getCampusBoundary()` in `src/lib/`.
   - Comprehensive data layer tests in `tests/data-layers.test.ts` (12 passing tests).

## Structure additions

The following new files were added inside existing project directories:
- `src/app/(app)/safety/page.tsx`: Added to provide the landing emergency contact page for the student shell's `SOSFloatingButton` (`/safety`).
- `src/lib/mock/geojson-data.ts`: Static GeoJSON object exports avoiding client-side Node `fs` imports during Webpack production builds.
- `src/types/geojson.d.ts`: TypeScript module declaration for importing `.geojson` files.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL with PostGIS extension (for full backend mode)

### Running Tests, Lint, and Build

```bash
# Run unit and integration tests (Vitest)
npm test

# Run type check
npm run type-check

# Run ESLint
npm run lint

# Run Next.js production build
npm run build
```