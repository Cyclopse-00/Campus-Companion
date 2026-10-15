import { describe, it, expect } from "vitest";
import {
  computeOpenStatus,
  isOpenNow,
  parseMinutes,
  formatTime,
  getCampusDateTime,
  type WeeklySchedule,
  type HolidayOverride,
} from "@/lib/open-status";

describe("Open Status Engine (src/lib/open-status.ts)", () => {
  // 10:00 AM IST on Thursday, 15 Oct 2026
  // (IST is UTC+5:30 -> 10:00 - 5:30 = 04:30 UTC)
  const thuMorningIST = new Date("2026-10-15T04:30:00.000Z");

  // 19:40 IST on Thursday, 15 Oct 2026 -> 20 min before 20:00 close
  // 19:40 - 5:30 = 14:10 UTC
  const thuClosingSoonIST = new Date("2026-10-15T14:10:00.000Z");

  // 21:00 IST on Thursday, 15 Oct 2026 -> after 20:00 close
  // 21:00 - 5:30 = 15:30 UTC
  const thuNightClosedIST = new Date("2026-10-15T15:30:00.000Z");

  describe("Timezone conversions (Asia/Kolkata)", () => {
    it("correctly extracts IST day, date, and minutes from UTC timestamp", () => {
      const dt = getCampusDateTime(thuMorningIST, "Asia/Kolkata");
      expect(dt.year).toBe(2026);
      expect(dt.month).toBe(10);
      expect(dt.day).toBe(15);
      expect(dt.dayKey).toBe("thu");
      expect(dt.hours).toBe(10);
      expect(dt.minutes).toBe(0);
      expect(dt.currentMinutes).toBe(600); // 10 * 60
      expect(dt.dateString).toBe("2026-10-15");
    });

    it("handles midnight crossover correctly in IST", () => {
      // 00:30 AM IST on Friday, 16 Oct 2026 -> 19:00 UTC on Thursday, 15 Oct 2026
      const friMidnightIST = new Date("2026-10-15T19:00:00.000Z");
      const dt = getCampusDateTime(friMidnightIST, "Asia/Kolkata");
      expect(dt.dayKey).toBe("fri");
      expect(dt.hours).toBe(0);
      expect(dt.minutes).toBe(30);
      expect(dt.dateString).toBe("2026-10-16");
    });
  });

  describe("Standard Weekly Operating Hours", () => {
    const standardSchedule: WeeklySchedule = {
      thu: [{ open: "08:00", close: "20:00" }],
      fri: [{ open: "08:00", close: "20:00" }],
      sun: [], // closed on Sunday
    };

    it("returns OPEN when within operating hours", () => {
      const result = computeOpenStatus(standardSchedule, [], null, thuMorningIST);
      expect(result.status).toBe("OPEN");
      expect(result.minutesUntilClose).toBe(600); // 10:00 to 20:00 = 10h = 600m
      expect(result.label).toContain("Open · Closes at 20:00");
    });

    it("returns CLOSING_SOON when within 30 minutes of close", () => {
      const result = computeOpenStatus(standardSchedule, [], null, thuClosingSoonIST);
      expect(result.status).toBe("CLOSING_SOON");
      expect(result.minutesUntilClose).toBe(20);
      expect(result.label).toBe("Open · Closes in 20m");
    });

    it("returns CLOSED when outside operating hours and shows next open", () => {
      const result = computeOpenStatus(standardSchedule, [], null, thuNightClosedIST);
      expect(result.status).toBe("CLOSED");
      expect(result.label).toContain("Opens tomorrow at 08:00");
    });

    it("handles multiple shifts in a day (e.g. canteen lunch & dinner)", () => {
      const splitSchedule: WeeklySchedule = {
        thu: [
          { open: "12:00", close: "15:00" },
          { open: "19:00", close: "22:00" },
        ],
      };

      // 16:00 IST (between shifts) -> 10:30 UTC
      const afternoonBreak = new Date("2026-10-15T10:30:00.000Z");
      const result = computeOpenStatus(splitSchedule, [], null, afternoonBreak);
      expect(result.status).toBe("CLOSED");
      expect(result.minutesUntilOpen).toBe(180); // 16:00 to 19:00 = 3h = 180m
      expect(result.label).toContain("Opens at 19:00 (in 3h)");
    });
  });

  describe("Overnight Operating Ranges (e.g. 22:00 to 02:00)", () => {
    const overnightSchedule: WeeklySchedule = {
      thu: [{ open: "22:00", close: "02:00" }],
      fri: [{ open: "22:00", close: "02:00" }],
    };

    it("is OPEN before midnight on the day the shift starts", () => {
      // 23:30 IST on Thursday, 15 Oct -> 18:00 UTC
      const thuNight = new Date("2026-10-15T18:00:00.000Z");
      const result = computeOpenStatus(overnightSchedule, [], null, thuNight);
      expect(result.status).toBe("OPEN");
      expect(result.minutesUntilClose).toBe(150); // 23:30 to 02:00 = 2h 30m = 150m
      expect(result.label).toContain("Open · Closes at 02:00");
    });

    it("is OPEN after midnight on the following day (shift opened yesterday)", () => {
      // 01:15 IST on Friday, 16 Oct -> 19:45 UTC on 15 Oct
      const friEarlyMorning = new Date("2026-10-15T19:45:00.000Z");
      const result = computeOpenStatus(overnightSchedule, [], null, friEarlyMorning);
      expect(result.status).toBe("OPEN");
      expect(result.minutesUntilClose).toBe(45); // 01:15 to 02:00 = 45m
      expect(result.label).toContain("Open · Closes at 02:00");
    });

    it("is CLOSING_SOON when within 30 min of the post-midnight close", () => {
      // 01:45 IST on Friday, 16 Oct -> 20:15 UTC on 15 Oct
      const friClosingSoon = new Date("2026-10-15T20:15:00.000Z");
      const result = computeOpenStatus(overnightSchedule, [], null, friClosingSoon);
      expect(result.status).toBe("CLOSING_SOON");
      expect(result.minutesUntilClose).toBe(15);
      expect(result.label).toBe("Open · Closes in 15m");
    });

    it("is CLOSED after the overnight shift ends", () => {
      // 02:15 IST on Friday, 16 Oct -> 20:45 UTC on 15 Oct
      const friPastClose = new Date("2026-10-15T20:45:00.000Z");
      const result = computeOpenStatus(overnightSchedule, [], null, friPastClose);
      expect(result.status).toBe("CLOSED");
      expect(result.label).toContain("Opens");
    });
  });

  describe("Holiday and Special Overrides", () => {
    const baseSchedule: WeeklySchedule = {
      thu: [{ open: "08:00", close: "20:00" }],
      fri: [{ open: "08:00", close: "20:00" }],
    };

    it("returns CLOSED with custom holiday label when date override is CLOSED", () => {
      const overrides: HolidayOverride[] = [
        { date: "2026-10-15", label: "Diwali Holiday", status: "CLOSED" },
      ];
      const result = computeOpenStatus(baseSchedule, overrides, null, thuMorningIST);
      expect(result.status).toBe("CLOSED");
      expect(result.label).toContain("Closed today (Diwali Holiday)");
      expect(result.activeOverride?.date).toBe("2026-10-15");
    });

    it("respects OPEN_CUSTOM hours on an override date", () => {
      const overrides: HolidayOverride[] = [
        {
          date: "2026-10-15",
          label: "Festival Special Hours",
          status: "OPEN_CUSTOM",
          hours: [{ open: "14:00", close: "18:00" }],
        },
      ];

      // At 10:00 IST (before custom hours start at 14:00)
      const morningRes = computeOpenStatus(baseSchedule, overrides, null, thuMorningIST);
      expect(morningRes.status).toBe("CLOSED");

      // At 15:00 IST (during custom hours) -> 09:30 UTC
      const afternoonRes = computeOpenStatus(
        baseSchedule,
        overrides,
        null,
        new Date("2026-10-15T09:30:00.000Z")
      );
      expect(afternoonRes.status).toBe("OPEN");
      expect(afternoonRes.label).toContain("Festival Special Hours");
    });

    it("prioritizes examSeasonHours over regular weekly schedule", () => {
      const examSchedule: WeeklySchedule = {
        thu: [{ open: "06:00", close: "23:00" }], // extended study hours
      };

      // 07:00 IST -> 01:30 UTC (base schedule opens at 08:00, exam schedule opens at 06:00)
      const earlyMorning = new Date("2026-10-15T01:30:00.000Z");
      const baseResult = computeOpenStatus(baseSchedule, [], null, earlyMorning);
      expect(baseResult.status).toBe("CLOSED");

      const examResult = computeOpenStatus(baseSchedule, [], examSchedule, earlyMorning);
      expect(examResult.status).toBe("OPEN");
      expect(examResult.label).toContain("Closes at 23:00");
    });
  });

  describe("Edge cases & Convenience functions", () => {
    it("handles alwaysOpen 24/7 facilities", () => {
      const alwaysSchedule: WeeklySchedule = { alwaysOpen: true };
      const res = computeOpenStatus(alwaysSchedule, [], null, thuMorningIST);
      expect(res.status).toBe("ALWAYS_OPEN");
      expect(res.label).toBe("Open 24/7");
      expect(isOpenNow(alwaysSchedule, [], null, thuMorningIST)).toBe(true);
    });

    it("handles null or missing schedule safely", () => {
      const res = computeOpenStatus(null);
      expect(res.status).toBe("CLOSED");
      expect(res.label).toBe("Hours not available");
      expect(isOpenNow(null)).toBe(false);
    });

    it("parses and formats time strings reliably", () => {
      expect(parseMinutes("00:00")).toBe(0);
      expect(parseMinutes("12:30")).toBe(750);
      expect(parseMinutes("23:59")).toBe(1439);
      expect(parseMinutes("invalid")).toBe(-1);

      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(750)).toBe("12:30");
      expect(formatTime(1439)).toBe("23:59");
    });
  });
});
