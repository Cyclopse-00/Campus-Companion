---
name: testing-deployment-qa
description: Use before merging, releasing, or deploying the campus website. Covers test strategy, CI, environments, seed data, monitoring, and a launch checklist.
---

# Testing, Deployment, and QA

## Test layers
- Unit (Vitest/Jest): status logic, routing, import validation, permission helper, notification dedupe.
- API/integration: run against a test Postgres+PostGIS (Docker). Reset with migrations and seed before each suite.
- E2E (Playwright): student flows (search place, filter utilities, view timetable, report crowd) and admin flows (bulk import, edit hours, moderate). Run at mobile viewport.
- Accessibility and performance: axe and Lighthouse CI.

## CI pipeline
lint -> typecheck -> unit -> integration -> build -> e2e -> deploy preview. Block merge on failure. Run `prisma migrate diff` to detect un-migrated schema changes.

## Environments
- `dev` (local Docker compose), `staging` (real-like data), `prod`.
- Config via env vars; `.env.example` always up to date. No secrets in the repo or client bundle.
- Seed script creates a demo campus: 15 places, 60 utilities across categories, sample timetable, notices, and events, so every feature is demoable.

## Data and security
- Daily automated database backups and a tested restore.
- Security headers, CSRF protection for cookie auth, input validation with Zod, rate limiting on auth and report endpoints, dependency audit in CI.
- Structured logging and an error tracker (e.g. Sentry); uptime check on the status endpoint.

## Launch checklist
- [ ] Real campus GeoJSON and utility data imported and reviewed on site
- [ ] Opening hours verified with shop owners
- [ ] Admin accounts created; at least two trained admins
- [ ] Security/SOS drill completed
- [ ] Privacy policy and terms published
- [ ] Soft launch with one department, gather feedback for two weeks
- [ ] Feedback form and "report wrong info" visible on every page

## Reporting
At the end of each task, summarize what changed, which tests were added, and any assumptions made.
