---
name: pwa-offline-accessibility
description: Use when making the site installable, offline-capable, fast on weak networks, multilingual, or accessible (screen readers, dark mode, large text, wheelchair routes).
---

# PWA, Offline, and Accessibility

## PWA
- `manifest.json` with name, icons (192, 512, maskable), theme color, `display: standalone`.
- Service worker (Workbox): precache app shell; runtime cache for map tiles of the campus area (cap storage), campus GeoJSON, helpline directory, timetable, and saved places. Network-first for notices and statuses with a stale fallback and a "last updated" label.
- Offline banner and queued actions (crowd reports, grievances) that sync when back online.

## Performance budget
- Target Lighthouse mobile: Performance 85+, Accessibility 95+, PWA pass.
- Lazy-load the map and admin code; compress images (WebP/AVIF); keep first load JS under ~200 KB gzipped excluding map library.
- Test on throttled "Slow 4G" and a low-end Android profile.

## Accessibility
- WCAG 2.2 AA: contrast, focus order, visible focus, 44px touch targets.
- Every map feature has a text/list equivalent; markers have accessible names; routes are also given as step-by-step text.
- Dark mode via `prefers-color-scheme` with a manual toggle; text size control; respect `prefers-reduced-motion`.
- Screen-reader testing with TalkBack (Android) and VoiceOver (iOS).
- Accessible-route filter (ramps, lifts, step-free) and accessible restroom marking, driven by data on `Path` and `Utility`.

## Internationalization
- Use an i18n library (e.g. next-intl). Keep all strings in locale files; ship English plus the local language (e.g. Odia or Hindi, based on campus need).
- Dates, times, and numbers formatted per locale. Allow admin content in multiple languages with fallback to English.

## Checks
- Run axe and Lighthouse in CI; fail the build on accessibility regressions.
- Manual test: install the app, go offline, open the map, search a building, view the timetable.
