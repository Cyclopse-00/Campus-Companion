---
name: timetable-smart-suggestions
description: Use when building the student timetable, next-class routing, "leave now" prompts, free-time suggestions, exam schedules, or ERP/attendance integration.
---

# Timetable and Smart Suggestions

## Data model
- `Course`: id, code, name, department, faculty
- `Section`: courseId, batch, year
- `Session`: sectionId, weekday, startsAt, endsAt, roomId, type (lecture|lab|tutorial)
- `Enrollment`: userId, sectionId
- `SessionOverride`: sessionId, date, status (cancelled|moved), newRoomId, newTime, note
- `Exam`: courseId, date, time, hallRoomId, seatingUrl

## Features
- Weekly and daily timetable view; overrides shown with a visible badge.
- **Next class card**: "Next: DBMS, Block B Room 12 at 10:00. Leave by 9:52 (8 min walk)." Uses the routing endpoint from the map skill and the student's current location if allowed, else the previous class location.
- **Free-slot suggestions**: when the gap is at least 30 minutes, suggest the nearest open canteen, a quiet study zone, or the library, ranked by distance, open status, and crowd level.
- **Exam helper**: hall and seat lookup, countdown, route to hall.

## Rules
- All times in campus timezone. Handle academic term start and end dates.
- If a class is cancelled or moved, push a notification (see notices-events-notifications skill) and update the next-class card immediately.
- Timetable import via CSV from admin; support per-section templates.
- ERP integration (attendance, results): read-only adapter behind an interface `ErpClient`. Use a mock implementation by default; real credentials only via env vars. Never store student ERP passwords.

## Checks
- Tests: overlapping sessions, override precedence, a gap shorter than the walk time, day rollover.
- Suggestions never recommend a closed or too-far place; explain why each was chosen.
