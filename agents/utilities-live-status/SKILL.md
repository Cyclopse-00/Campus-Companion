---
name: utilities-live-status
description: Use when adding or changing student utility markers (food, stationery, ATM, medical, printing, water, etc.), opening hours, holiday rules, live open/closed status, or crowd levels.
---

# Utilities and Live Status

## Data model
- `Utility`: id, placeId (or own geom), category, name, description, phone, photoUrl, tags[], active
- `OpeningRule`: utilityId, weekday (0-6), opensAt, closesAt (supports multiple ranges per day, e.g. lunch break)
- `SpecialHours`: utilityId, dateFrom, dateTo, reason (holiday|exam|vacation), closed (bool) or custom ranges
- `CrowdReport`: utilityId, level (1-4), source (student|auto), createdAt

## Categories (seed these)
food, stationery, print, atm, bank, medical, pharmacy, water, restroom, transport, library, study, service, recreation, charging, wifi, safety. Each has an icon, color, and sort order in one config file.

## Status logic (single function in `lib/time.ts`)
`getStatus(utility, now)` returns `{state: open|closing_soon|closed|opens_soon, label, nextChangeAt}`.
Order of precedence: SpecialHours > OpeningRule > default closed.
- closing_soon: within 30 minutes of closing
- Always compute in the campus timezone (default Asia/Kolkata); never in the browser's timezone.
- Cover overnight ranges (e.g. 22:00-02:00) and a unit test for them.

## Crowd level
- Baseline: average of past reports by weekday and hour bucket (30 min).
- Blend with live student reports from the last 20 minutes; weight recent ones higher.
- Show as Low / Medium / High with "based on N reports" text. If no data, show nothing instead of guessing.
- Rate-limit reports to one per user per utility per 10 minutes.

## Filters and UI
- Layer toggles per category, persisted in localStorage.
- "Open now" filter, "Near me" sort (uses geolocation with permission), and a list view that mirrors the map.

## Checks
- Tests: overnight hours, holiday override, timezone boundary, missing rules.
- Admin can edit hours with a weekly grid and a copy-to-all-days shortcut.
