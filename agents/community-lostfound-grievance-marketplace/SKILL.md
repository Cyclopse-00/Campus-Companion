---
name: community-lostfound-grievance-marketplace
description: Use when building lost and found, grievance/complaint tracking, marketplace, ride sharing, mess menu, or other student-contributed content that needs moderation.
---

# Community Features

## Shared pattern
Every user-generated item has: author, status, location (optional map pin), photos (max 3, compressed, EXIF stripped), createdAt, and a moderation state (pending|approved|rejected|removed). Everything has a "Report" button.

## Lost and found
- Post type: lost or found, category, description, photo, last-seen place on map, date.
- Auto-match: compare category, keywords, and proximity/time; notify both parties of likely matches.
- Contact via in-app relay so phone numbers stay private until both agree.
- Mark as resolved; auto-archive after 60 days.

## Grievance tracker
- Student files: category (electrical, plumbing, Wi-Fi, cleanliness, safety, other), description, photo, map pin, optional anonymity.
- Ticket lifecycle: submitted -> assigned -> in progress -> resolved -> confirmed by student. Show a timeline.
- Auto-route to the right department by category. Escalate if no update in 72 hours.
- Anonymous reports hide identity from staff but keep an internal id for abuse prevention. Sensitive categories (harassment, ragging) go only to the designated committee and are never shown publicly.

## Marketplace
- Verified students only. Listing: title, price, category, condition, photos, pickup place.
- Prohibited items list enforced by keyword check plus moderator review. No payments in the app in v1; meet-up at suggested safe public campus spots.

## Ride sharing and mess menu
- Rides: origin, destination, time, seats, cost split note. Expire after departure time.
- Mess menu: admin or mess staff uploads weekly menu; students rate meals once per day per meal.

## Checks
- Spam limits (posts per day), profanity filter, image size limits.
- Tests: match logic, escalation timer, anonymity (no identity leaks in API responses for staff views).
