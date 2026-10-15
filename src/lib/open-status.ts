/**
 * CampusHub — Open Status Engine
 * ============================================================
 * Pure TypeScript utility that computes whether a map marker
 * (canteen, ATM, library, etc.) is currently OPEN, CLOSING_SOON,
 * or CLOSED — accounting for:
 *   - Weekly recurring schedules (per-day open/close windows)
 *   - Multiple shifts in a single day (e.g. 08:00–13:00, 15:00–20:00)
 *   - Overnight ranges (e.g. 22:00–02:00) spanning across midnight
 *   - Always-open facilities (24/7)
 *   - Holiday / exam-season overrides (date-specific closures or custom hours)
 *   - Configurable "closing soon" threshold (default: 30 minutes)
 *   - Strict timezone computation in Asia/Kolkata (Rule 5)
 *
 * This module has ZERO external dependencies — safe to import in both
 * server components and client-side Zustand stores.
 * ============================================================
 */

export const DEFAULT_CAMPUS_TIMEZONE =
  process.env.DEFAULT_TIMEZONE || "Asia/Kolkata";

// -----------------------------------------------------------------------
// Schema Types (keep in sync with prisma/schema.prisma JSON columns)
// -----------------------------------------------------------------------

/** "HH:MM" 24-hour time string, e.g. "08:30", "20:00" */
export type TimeString = string;

/** A single open/close shift window within a day */
export interface TimeSlot {
  open: TimeString;
  close: TimeString;
}

/** Day key: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" */
export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/**
 * Weekly recurring schedule stored in `MapMarker.operatingHours` JSON column.
 */
export interface WeeklySchedule {
  alwaysOpen?: boolean;
  mon?: TimeSlot[];
  tue?: TimeSlot[];
  wed?: TimeSlot[];
  thu?: TimeSlot[];
  fri?: TimeSlot[];
  sat?: TimeSlot[];
  sun?: TimeSlot[];
}

/**
 * A date-specific override stored in `MapMarker.holidayOverrides` JSON column.
 */
export interface HolidayOverride {
  /** ISO date string: "YYYY-MM-DD" */
  date: string;
  label?: string;
  status: "CLOSED" | "OPEN_CUSTOM";
  /** Only relevant when status === "OPEN_CUSTOM" */
  hours?: TimeSlot[];
}

// -----------------------------------------------------------------------
// Result Types
// -----------------------------------------------------------------------

export type OpenStatusCode = "OPEN" | "CLOSING_SOON" | "CLOSED" | "ALWAYS_OPEN";

export interface OpenStatusResult {
  status: OpenStatusCode;
  /** Human-readable label e.g. "Open · Closes in 20m", "Closed · Opens at 08:00" */
  label: string;
  /** Minutes until close (only when OPEN or CLOSING_SOON) */
  minutesUntilClose?: number;
  /** Minutes until next opening (only when CLOSED) */
  minutesUntilOpen?: number;
  /** The active time slot that produced this result */
  activeSlot?: TimeSlot;
  /** Override that produced this result, if any */
  activeOverride?: HolidayOverride;
}

// -----------------------------------------------------------------------
// Internal Helpers
// -----------------------------------------------------------------------

export const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

/**
 * Parse "HH:MM" into total minutes since midnight (0–1439).
 * Returns -1 on invalid input.
 */
export function parseMinutes(time: TimeString): number {
  if (!time) return -1;
  const parts = time.split(":");
  if (parts.length !== 2) return -1;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return -1;
  return h * 60 + m;
}

/**
 * Format minutes-since-midnight back to "HH:MM" string for display.
 */
export function formatTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Format a minute duration into a human label: "5m", "1h 30m", "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export interface CampusDateTime {
  year: number;
  month: number;
  day: number;
  dayKey: DayKey;
  hours: number;
  minutes: number;
  currentMinutes: number;
  dateString: string;
}

/**
 * Extracts campus date and time components in the campus timezone (default Asia/Kolkata).
 */
export function getCampusDateTime(
  date: Date = new Date(),
  timeZone: string = DEFAULT_CAMPUS_TIMEZONE
): CampusDateTime {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  let year = 1970;
  let month = 1;
  let day = 1;
  let hours = 0;
  let minutes = 0;
  let weekdayStr = "Sun";

  for (const part of parts) {
    if (part.type === "year") year = parseInt(part.value, 10);
    else if (part.type === "month") month = parseInt(part.value, 10);
    else if (part.type === "day") day = parseInt(part.value, 10);
    else if (part.type === "hour") {
      const h = parseInt(part.value, 10);
      hours = h === 24 ? 0 : h;
    } else if (part.type === "minute") minutes = parseInt(part.value, 10);
    else if (part.type === "weekday") weekdayStr = part.value;
  }

  const dayKey = weekdayStr.toLowerCase().slice(0, 3) as DayKey;
  const currentMinutes = hours * 60 + minutes;
  const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    year,
    month,
    day,
    dayKey,
    hours,
    minutes,
    currentMinutes,
    dateString,
  };
}

/**
 * Get date string for an offset from the reference date in campus timezone.
 */
function getOffsetDateString(date: Date, dayOffset: number, timeZone: string): string {
  const target = new Date(date.getTime() + dayOffset * 86400000);
  return getCampusDateTime(target, timeZone).dateString;
}

/**
 * Find the next opening slot starting from today and across upcoming days.
 */
function findNextOpening(
  schedule: WeeklySchedule,
  currentDayKey: DayKey,
  currentMinutes: number,
  overrides: HolidayOverride[] = [],
  now: Date = new Date(),
  timeZone: string = DEFAULT_CAMPUS_TIMEZONE
): { dayOffset: number; slot: TimeSlot } | undefined {
  for (let offset = 0; offset <= 7; offset++) {
    const dayIndex = (DAY_KEYS.indexOf(currentDayKey) + offset) % 7;
    const dayKey = DAY_KEYS[dayIndex];
    const offsetDateStr = getOffsetDateString(now, offset, timeZone);

    // Check if this upcoming day has an override
    const override = overrides.find((o) => o.date === offsetDateStr);
    if (override && override.status === "CLOSED") {
      continue;
    }

    const slots =
      override?.status === "OPEN_CUSTOM" && override.hours?.length
        ? override.hours
        : schedule[dayKey] ?? [];

    for (const slot of slots) {
      const openMin = parseMinutes(slot.open);
      if (openMin === -1) continue;

      // On day 0 (today), only consider slots that haven't started yet
      if (offset === 0 && openMin <= currentMinutes) continue;

      return { dayOffset: offset, slot };
    }
  }
  return undefined;
}

// -----------------------------------------------------------------------
// Main Export: computeOpenStatus
// -----------------------------------------------------------------------

/**
 * Compute the current open/closed status of a map marker.
 *
 * @param schedule    - The marker's `operatingHours` JSON (WeeklySchedule)
 * @param overrides   - The marker's `holidayOverrides` JSON (HolidayOverride[])
 * @param examHours   - The marker's `examSeasonHours` JSON (WeeklySchedule | null)
 * @param now         - Reference time (defaults to `new Date()` — override for testing)
 * @param closingSoonThresholdMinutes - Minutes before closing to show "CLOSING_SOON" (default: 30)
 * @param timeZone    - Timezone for calculation (defaults to Asia/Kolkata)
 */
export function computeOpenStatus(
  schedule: WeeklySchedule | null | undefined,
  overrides: HolidayOverride[] | null | undefined = [],
  examHours: WeeklySchedule | null | undefined = null,
  now: Date = new Date(),
  closingSoonThresholdMinutes = 30,
  timeZone: string = DEFAULT_CAMPUS_TIMEZONE
): OpenStatusResult {
  // 1. Always-open facility
  if (schedule?.alwaysOpen) {
    return { status: "ALWAYS_OPEN", label: "Open 24/7" };
  }

  // 2. No schedule provided
  if (!schedule) {
    return { status: "CLOSED", label: "Hours not available" };
  }

  const safeOverrides = overrides ?? [];
  const campusTime = getCampusDateTime(now, timeZone);
  const { currentMinutes, dayKey: todayDayKey, dateString: todayStr } = campusTime;

  // Resolve effective schedule (exam hours override base schedule)
  const effectiveSchedule = examHours ?? schedule;

  // 3. Check for overnight slot that began YESTERDAY and extends into TODAY
  // Yesterday's day index in DAY_KEYS
  const yesterdayIndex = (DAY_KEYS.indexOf(todayDayKey) + 6) % 7;
  const yesterdayDayKey = DAY_KEYS[yesterdayIndex];
  const yesterdayStr = getOffsetDateString(now, -1, timeZone);
  const yesterdayOverride = safeOverrides.find((o) => o.date === yesterdayStr);

  let yesterdaySlots: TimeSlot[] = [];
  if (yesterdayOverride?.status === "OPEN_CUSTOM" && yesterdayOverride.hours?.length) {
    yesterdaySlots = yesterdayOverride.hours;
  } else if (!yesterdayOverride || yesterdayOverride.status !== "CLOSED") {
    yesterdaySlots = effectiveSchedule[yesterdayDayKey] ?? [];
  }

  for (const slot of yesterdaySlots) {
    const openMin = parseMinutes(slot.open);
    const closeMin = parseMinutes(slot.close);
    if (openMin === -1 || closeMin === -1) continue;

    // Overnight slot: closeMin <= openMin (e.g. 22:00 -> 02:00)
    if (closeMin <= openMin) {
      // It extends into today from minute 0 to minute closeMin
      if (currentMinutes < closeMin) {
        const minutesUntilClose = closeMin - currentMinutes;
        if (minutesUntilClose <= closingSoonThresholdMinutes) {
          return {
            status: "CLOSING_SOON",
            label: `Open · Closes in ${formatDuration(minutesUntilClose)}`,
            minutesUntilClose,
            activeSlot: slot,
          };
        }
        return {
          status: "OPEN",
          label: `Open · Closes at ${slot.close}`,
          minutesUntilClose,
          activeSlot: slot,
        };
      }
    }
  }

  // 4. Check today's holiday / date override (highest priority for today's shifts)
  const todayOverride = safeOverrides.find((o) => o.date === todayStr);

  if (todayOverride) {
    if (todayOverride.status === "CLOSED") {
      const next = findNextOpening(
        effectiveSchedule,
        todayDayKey,
        1440,
        safeOverrides,
        now,
        timeZone
      );
      const label = next
        ? `Closed today (${todayOverride.label ?? "Holiday"}) · Opens ${
            next.dayOffset === 1 ? "tomorrow" : `in ${next.dayOffset} days`
          } at ${next.slot.open}`
        : `Closed today (${todayOverride.label ?? "Holiday"})`;
      return {
        status: "CLOSED",
        label,
        activeOverride: todayOverride,
      };
    }

    if (todayOverride.status === "OPEN_CUSTOM" && todayOverride.hours?.length) {
      const result = evaluateSlots(
        todayOverride.hours,
        currentMinutes,
        closingSoonThresholdMinutes
      );
      if (result) {
        return {
          ...result,
          label: `${result.label} (${todayOverride.label ?? "Special hours"})`,
          activeOverride: todayOverride,
        };
      }
      return {
        status: "CLOSED",
        label: `Closed (${todayOverride.label ?? "Special hours ended"})`,
        activeOverride: todayOverride,
      };
    }
  }

  // 5. Evaluate today's normal slots
  const todaySlots = effectiveSchedule[todayDayKey] ?? [];
  const result = evaluateSlots(todaySlots, currentMinutes, closingSoonThresholdMinutes);

  if (result) return result;

  // 6. Facility is currently closed; determine next opening time
  const next = findNextOpening(
    effectiveSchedule,
    todayDayKey,
    currentMinutes,
    safeOverrides,
    now,
    timeZone
  );

  if (!next) {
    return { status: "CLOSED", label: "Closed — no upcoming hours" };
  }

  if (next.dayOffset === 0) {
    const minutesUntilOpen = parseMinutes(next.slot.open) - currentMinutes;
    return {
      status: "CLOSED",
      label: `Closed · Opens at ${next.slot.open} (in ${formatDuration(minutesUntilOpen)})`,
      minutesUntilOpen,
      activeSlot: next.slot,
    };
  }

  const dayLabel = next.dayOffset === 1 ? "tomorrow" : `in ${next.dayOffset} days`;
  return {
    status: "CLOSED",
    label: `Closed · Opens ${dayLabel} at ${next.slot.open}`,
    activeSlot: next.slot,
  };
}

// -----------------------------------------------------------------------
// Internal: Evaluate today's slots against current minute
// -----------------------------------------------------------------------

function evaluateSlots(
  slots: TimeSlot[],
  currentMinutes: number,
  closingSoonThreshold: number
): OpenStatusResult | null {
  for (const slot of slots) {
    const openMin = parseMinutes(slot.open);
    const closeMin = parseMinutes(slot.close);
    if (openMin === -1 || closeMin === -1) continue;

    // Normal intraday slot: e.g. 08:00 -> 20:00
    if (closeMin > openMin) {
      if (currentMinutes >= openMin && currentMinutes < closeMin) {
        const minutesUntilClose = closeMin - currentMinutes;
        if (minutesUntilClose <= closingSoonThreshold) {
          return {
            status: "CLOSING_SOON",
            label: `Open · Closes in ${formatDuration(minutesUntilClose)}`,
            minutesUntilClose,
            activeSlot: slot,
          };
        }
        return {
          status: "OPEN",
          label: `Open · Closes at ${slot.close}`,
          minutesUntilClose,
          activeSlot: slot,
        };
      }
    } else {
      // Overnight slot started today: e.g. 22:00 -> 02:00 tomorrow
      if (currentMinutes >= openMin) {
        const adjustedCloseMin = closeMin + 1440;
        const minutesUntilClose = adjustedCloseMin - currentMinutes;

        if (minutesUntilClose <= closingSoonThreshold) {
          return {
            status: "CLOSING_SOON",
            label: `Open · Closes in ${formatDuration(minutesUntilClose)}`,
            minutesUntilClose,
            activeSlot: slot,
          };
        }
        return {
          status: "OPEN",
          label: `Open · Closes at ${slot.close}`,
          minutesUntilClose,
          activeSlot: slot,
        };
      }
    }
  }
  return null;
}

// -----------------------------------------------------------------------
// Convenience Utilities
// -----------------------------------------------------------------------

/**
 * Get a Tailwind-compatible color token for an OpenStatusCode.
 */
export function getStatusColor(status: OpenStatusCode): {
  bg: string;
  text: string;
  dot: string;
} {
  switch (status) {
    case "ALWAYS_OPEN":
    case "OPEN":
      return { bg: "bg-emerald-500/10", text: "text-emerald-500 dark:text-emerald-400", dot: "bg-emerald-500" };
    case "CLOSING_SOON":
      return { bg: "bg-amber-500/10", text: "text-amber-500 dark:text-amber-400", dot: "bg-amber-500" };
    case "CLOSED":
      return { bg: "bg-rose-500/10", text: "text-rose-500 dark:text-rose-400", dot: "bg-rose-500" };
  }
}

/**
 * Check whether a facility is currently open.
 */
export function isOpenNow(
  schedule: WeeklySchedule | null | undefined,
  overrides?: HolidayOverride[] | null,
  examHours?: WeeklySchedule | null,
  now?: Date,
  timeZone?: string
): boolean {
  const { status } = computeOpenStatus(schedule, overrides, examHours, now, 30, timeZone);
  return status === "OPEN" || status === "ALWAYS_OPEN" || status === "CLOSING_SOON";
}
