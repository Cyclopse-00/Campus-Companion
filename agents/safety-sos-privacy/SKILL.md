---
name: safety-sos-privacy
description: Use when building SOS button, safe-walk mode, helpline directory, emergency contacts, location sharing, or anything handling sensitive personal data and student safety.
---

# Safety, SOS, and Privacy

## SOS
- One-tap button, reachable from every screen. Require a 3-second hold or a confirm step to avoid accidental triggers, with a visible cancel.
- On trigger: send live location (updates every 10 seconds) to the security dashboard and the user's chosen emergency contacts via SMS/WhatsApp link or push.
- Provide a one-tap call to campus security next to the button. SOS must never be the only way to get help; always show the phone number.
- Security dashboard: live list of active SOS events on a map, acknowledge, resolve, notes. Audit every action.
- If the network is lost, queue the event and show the call-security fallback.

## Safe walk
- User picks destination and a trusted contact; the contact gets a live-tracking link that expires on arrival or after 2 hours.
- Alert the contact if the user deviates from the route or stops for over 5 minutes, with a "I'm OK" prompt first.

## Helpline directory
- Medical, security, hostel warden, counseling, anti-ragging, women's helpline. Each with tap-to-call, hours, and location on map. Works offline (cache it).

## Privacy and security rules
- Location is collected only while SOS or safe walk is active, or when the user opts in for "near me". State this plainly in the UI.
- Delete live-location data after the event is resolved plus a short retention window (e.g. 30 days for the audit trail, configurable).
- Encrypt in transit (HTTPS) and restrict security dashboard access to the `security` and `admin` roles.
- Never send exact location in push notification text. Never log phone numbers in plain analytics.

## Checks
- Test accidental trigger prevention, contact notification, offline queueing, and access control on the dashboard.
- Do a dry-run drill with campus security before launch and document the escalation procedure.
