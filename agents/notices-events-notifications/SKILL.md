---
name: notices-events-notifications
description: Use when building the notice board, events hub, club pages, RSVP, calendar sync, or push/email notifications.
---

# Notices, Events, Notifications

## Notices
- Fields: title, body, category (exam|academic|holiday|general|placement), audience filters (department, year, hostel), pinned, startsAt, expiresAt, attachments.
- Students see only what targets them, plus "All". Auto-hide after `expiresAt`; keep an archive tab.
- Official notices can be posted only by admin or an authorized department account.

## Events and clubs
- `Club`: name, description, logo, contact, members
- `Event`: clubId, title, description, venue (place or room), startsAt, endsAt, capacity, registrationUrl
- `Rsvp`: eventId, userId, status. Respect capacity with a waitlist.
- Event pages show a map pin and a "Get directions" button. Provide an `.ics` download or add-to-calendar link.
- QR check-in: each RSVP gets a signed token; organizers scan to mark attendance.

## Notifications
- Channels: web push (Firebase Cloud Messaging), email, in-app inbox.
- Triggers: class cancelled or moved, new notice for my audience, event reminder (24h and 1h), grievance status change, due-date reminder.
- User settings: per-topic opt in/out and quiet hours. Default to important-only.
- Use a queue (BullMQ or a cron-driven outbox table) so sends are retried and never block requests.
- Deduplicate: the same trigger must not notify twice. Store a `NotificationLog` with a unique key.

## Checks
- Test audience targeting (department + year), expiry, capacity and waitlist, and notification dedupe.
- Never include sensitive details in push payloads; link to the app instead.
