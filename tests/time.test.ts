import { describe, it, expect } from "vitest";
import {
  getNowUTC,
  formatInCampusTime,
  formatTimeIST,
  istToUtcIso,
  isTodayInCampus,
} from "@/lib/time";

describe("Time utility - UTC storage and Asia/Kolkata display", () => {
  it("generates a valid UTC ISO 8601 string", () => {
    const utc = getNowUTC();
    expect(utc).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it("converts IST date and time components to UTC ISO", () => {
    // 2026-10-15 12:00:00 IST (+05:30) is 2026-10-15 06:30:00 UTC
    const utcIso = istToUtcIso(2026, 10, 15, 12, 0);
    const parsed = new Date(utcIso);

    expect(parsed.getUTCHours()).toBe(6);
    expect(parsed.getUTCMinutes()).toBe(30);
  });

  it("formats a UTC date in Asia/Kolkata timezone with proper offset", () => {
    // 06:30 UTC -> 12:00 PM IST
    const utcDate = new Date("2026-10-15T06:30:00.000Z");
    const formatted = formatInCampusTime(utcDate, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    expect(formatted).toContain("12:00");
  });

  it("formats time specifically in IST with 12-hour format", () => {
    const utcDate = new Date("2026-10-15T06:30:00.000Z");
    const formatted = formatTimeIST(utcDate);

    expect(formatted).toMatch(/12:00/);
    expect(formatted.toLowerCase()).toMatch(/pm/);
  });

  it("correctly identifies if UTC date corresponds to today in campus", () => {
    const now = new Date();
    expect(isTodayInCampus(now.toISOString())).toBe(true);

    const past = new Date("2020-01-01T00:00:00.000Z");
    expect(isTodayInCampus(past.toISOString())).toBe(false);
  });
});
