---
name: campus-project-conventions
description: Use at the start of any task on the campus student website, and whenever choosing a stack, folder layout, naming, or build order. Defines the shared architecture, tech stack, coding conventions, and phase plan every other campus skill depends on.
---

# Campus Website: Project Conventions

## Product summary
A mobile-first PWA for students of one campus: interactive map with utility markers (food, stationery, ATM, medical, etc.), live open/closed status, timetable-aware routing, notices, events, lost and found, grievances, and safety tools. Admins manage all data through a panel, not code.

## Fixed stack (do not substitute without asking)
- Frontend: Next.js (App Router) + TypeScript + Tailwind, PWA via service worker
- Map: Leaflet + OpenStreetMap tiles, campus data as GeoJSON
- Backend: Next.js route handlers (or Node/Express if split), Prisma ORM
- Database: PostgreSQL + PostGIS
- Auth: college email OTP or SSO (see campus-auth-roles skill)
- Notifications: Firebase Cloud Messaging
- Hosting: Vercel/Render or college server; env vars via `.env` only

## Folder layout
```
/app            routes (student) and /app/admin (admin)
/components     UI, map/, forms/, admin/
/lib            db.ts, auth.ts, geo.ts, time.ts, notify.ts
/prisma         schema.prisma, migrations, seed.ts
/data           campus.geojson, sample-utilities.csv
/public         manifest.json, icons, sw.js
/tests          unit + e2e
```

## Conventions
- TypeScript strict mode. No `any` without a comment explaining why.
- All times stored in UTC, displayed in `Asia/Kolkata` (make timezone a config value).
- Coordinates are WGS84 `[lng, lat]` in GeoJSON; Leaflet needs `[lat, lng]`. Convert in one helper only (`lib/geo.ts`).
- Every table has `id`, `createdAt`, `updatedAt`. Soft-delete with `deletedAt` for user-visible content.
- Validate every API input with Zod. Never trust client-sent role or user id.
- Secrets never in the repo. Provide `.env.example`.
- Accessibility baseline: semantic HTML, labels on all inputs, focus states, contrast AA.

## Build order (follow strictly)
1. MVP: map, utility markers + filters, opening hours, search, admin panel
2. Login, timetable, notices, events, lost and found
3. Automation: live status, crowd levels, smart suggestions, notifications, grievances
4. Marketplace, ride sharing, gamification, SOS, ERP integration

## Definition of done for any feature
- Works at 360px wide viewport and on slow 3G
- Has seed data so it can be demoed immediately
- Has at least one test for the core logic
- Admin can manage its data without code changes
- README section updated

## When unsure
Ask one concise question, or choose the simplest option that keeps the next phase possible and state the assumption in the PR/commit message.
