/**
 * Time utility functions for CampusHub.
 *
 * CONVENTIONS:
 * - All times stored in DB/JSON as UTC ISO 8601 strings or UTC timestamps.
 * - All user-facing times displayed in Asia/Kolkata (IST: UTC+05:30).
 *
 * Rule 5: Times are stored in UTC and shown in Asia/Kolkata.
 */

export const DEFAULT_CAMPUS_TIMEZONE =
  process.env.DEFAULT_TIMEZONE || "Asia/Kolkata";

/**
 * Returns current timestamp in UTC ISO string format.
 */
export function getNowUTC(): string {
  return new Date().toISOString();
}

/**
 * Converts a UTC Date or ISO string to a formatted date/time string in Asia/Kolkata timezone.
 *
 * @param date UTC Date instance or ISO 8601 string
 * @param options Intl.DateTimeFormatOptions
 * @returns Formatted string in Asia/Kolkata
 */
export function formatInCampusTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  },
  timeZone: string = DEFAULT_CAMPUS_TIMEZONE
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    ...options,
    timeZone,
  }).format(d);
}

/**
 * Formats a UTC date specifically as HH:mm in Asia/Kolkata.
 */
export function formatTimeIST(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: DEFAULT_CAMPUS_TIMEZONE,
  }).format(d);
}

/**
 * Converts an IST date and time components to a UTC ISO string for storage.
 *
 * @param year e.g. 2026
 * @param month 1-indexed (1 = Jan, 12 = Dec)
 * @param day e.g. 15
 * @param hour 0-23
 * @param minute 0-59
 * @returns ISO string in UTC
 */
export function istToUtcIso(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): string {
  // IST is UTC+05:30
  // Pad single digits
  const pad = (n: number) => n.toString().padStart(2, "0");
  const isoLocalString = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00+05:30`;
  return new Date(isoLocalString).toISOString();
}

/**
 * Checks whether a given UTC date is today in the campus timezone (Asia/Kolkata).
 */
export function isTodayInCampus(date: Date | string): boolean {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    timeZone: DEFAULT_CAMPUS_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };

  const formatter = new Intl.DateTimeFormat("en-IN", options);
  return formatter.format(d) === formatter.format(now);
}
