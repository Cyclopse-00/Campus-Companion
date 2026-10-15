---
name: campus-auth-roles
description: Use when implementing login, sessions, user roles, permissions, profile, or any route that must be restricted to students, faculty, moderators, or admins.
---

# Auth and Roles

## Roles
student, faculty, moderator, admin, security (for SOS dashboard). Role lives on the server-side user record only.

## Login options (in priority order)
1. College SSO (Google Workspace or Microsoft) if the campus provides it
2. Email OTP restricted to the allowed domain (`ALLOWED_EMAIL_DOMAIN` env var)
3. Roll number plus OTP sent to the registered email (lookup in a `StudentRoster` table)

## Rules
- Sessions via httpOnly, secure, sameSite=lax cookies. Short-lived access plus refresh rotation.
- Rate-limit OTP requests (e.g. 5 per hour per email and per IP). OTPs expire in 10 minutes and are single-use.
- Authorize on the server for every mutation: check `session.user.role` and ownership. Never trust a role or user id from the request body.
- Guests can view the map and public notices. Anything personal (timetable, saved places, reports) needs login.
- Store minimum personal data: name, email, roll number, department, year. Provide "delete my account" that removes or anonymizes content.

## Permissions matrix (implement as a single `can(user, action, resource)` helper)
| Action | student | moderator | admin |
|---|---|---|---|
| View map, notices | yes | yes | yes |
| Report crowd / wrong info | yes | yes | yes |
| Post marketplace / lost-found | yes | yes | yes |
| Approve reports, remove content | no | yes | yes |
| Edit places, utilities, hours | no | no | yes |
| Manage users and roles | no | no | yes |

## Checks
- Tests for each denied case in the matrix.
- Audit log table for admin actions (who, what, when).
