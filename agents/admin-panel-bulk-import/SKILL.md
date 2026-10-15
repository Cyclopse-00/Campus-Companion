---
name: admin-panel-bulk-import
description: Use when building the admin panel, CRUD screens, CSV/Excel bulk import, moderation queue, or any automation that lets non-developers manage campus data.
---

# Admin Panel and Bulk Import

## Goal
Authorities manage everything (places, utilities, hours, notices, events, users) without touching code.

## Screens
- Dashboard: counts, pending moderation items, recent changes
- Places and Utilities: table with search, filters, inline edit, and a map picker (click map to set coordinates)
- Hours editor: weekly grid, special hours calendar
- Notices and Events: rich text, targeting (department, year, hostel), start and end dates
- Moderation queue: wrong-info reports, marketplace flags, complaints
- Users and roles; audit log viewer

## Bulk import
- Accept CSV and XLSX. Provide a downloadable template with example rows.
- Pipeline: upload -> parse -> validate -> preview (valid rows, errors per row) -> confirm -> commit in one transaction.
- Required columns for utilities: name, category, latitude, longitude, opens, closes, days. Allow `place_slug` instead of coordinates.
- Validation: category must exist, coordinates inside campus bbox, time format HH:MM, no duplicate (name + location).
- Support upsert by `external_id` so re-importing updates instead of duplicating.
- Never run the import without the preview step. Keep the original file and a result report for rollback.

## Automation hooks
- Cron jobs: expire notices and events past their end date; archive resolved grievances after 30 days; send daily digest.
- Student "Report wrong info" creates a moderation item with a one-click "apply suggested fix" for the admin.

## Checks
- Every admin route enforces the role check on the server.
- Destructive actions use soft delete and a confirmation dialog.
- Import tests: bad coordinates, empty file, duplicate rows, 5,000-row file within time limits.
