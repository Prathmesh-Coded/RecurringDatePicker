import { describe, it, expect } from "vitest";
import { DateGenerator } from "../dateGenerator";
import type { RecurrenceConfig } from "../../types";

describe("DateGenerator", () => {
  describe("Daily Recurrence", () => {
    it("should generate daily dates with interval 1", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-01-01"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 5);

      expect(dates).toHaveLength(5);
      expect(dates[0]).toEqual(new Date("2024-01-01"));
      expect(dates[1]).toEqual(new Date("2024-01-02"));
      expect(dates[2]).toEqual(new Date("2024-01-03"));
      expect(dates[3]).toEqual(new Date("2024-01-04"));
      expect(dates[4]).toEqual(new Date("2024-01-05"));
    });

    it("should generate daily dates with custom interval", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 3,
        startDate: new Date("2024-01-01"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 4);

      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(new Date("2024-01-01"));
      expect(dates[1]).toEqual(new Date("2024-01-04"));
      expect(dates[2]).toEqual(new Date("2024-01-07"));
      expect(dates[3]).toEqual(new Date("2024-01-10"));
    });

    it("should respect end date for daily recurrence", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-01-03"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 10);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-01"));
      expect(dates[1]).toEqual(new Date("2024-01-02"));
      expect(dates[2]).toEqual(new Date("2024-01-03"));
    });
  });

  describe("Weekly Recurrence", () => {
    it("should generate weekly dates with same day of week", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-01-01"), // Monday
      };

      const dates = DateGenerator.generateRecurringDates(config, 4);

      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(new Date("2024-01-01")); // Monday
      expect(dates[1]).toEqual(new Date("2024-01-08")); // Next Monday
      expect(dates[2]).toEqual(new Date("2024-01-15")); // Next Monday
      expect(dates[3]).toEqual(new Date("2024-01-22")); // Next Monday
    });

    it("should generate weekly dates with specific weekdays", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-01-01"), // Monday
        weeklyDays: ["monday", "wednesday", "friday"],
      };

      const dates = DateGenerator.generateRecurringDates(config, 6);

      expect(dates).toHaveLength(6);
      expect(dates[0]).toEqual(new Date("2024-01-01")); // Monday (start date)
      expect(dates[1]).toEqual(new Date("2024-01-03")); // Wednesday
      expect(dates[2]).toEqual(new Date("2024-01-05")); // Friday
      expect(dates[3]).toEqual(new Date("2024-01-08")); // Next Monday
      expect(dates[4]).toEqual(new Date("2024-01-10")); // Next Wednesday
      expect(dates[5]).toEqual(new Date("2024-01-12")); // Next Friday
    });

    it("should not include start date if it does not match selected weekdays", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-01-01"), // Monday
        weeklyDays: ["tuesday", "thursday"],
      };

      const dates = DateGenerator.generateRecurringDates(config, 4);

      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(new Date("2024-01-02")); // Tuesday
      expect(dates[1]).toEqual(new Date("2024-01-04")); // Thursday
      expect(dates[2]).toEqual(new Date("2024-01-09")); // Next Tuesday
      expect(dates[3]).toEqual(new Date("2024-01-11")); // Next Thursday
    });

    it("should handle bi-weekly recurrence with specific days", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 2,
        startDate: new Date("2024-01-01"), // Monday
        weeklyDays: ["monday", "wednesday"],
      };

      const dates = DateGenerator.generateRecurringDates(config, 6);

      expect(dates).toHaveLength(6);
      expect(dates[0]).toEqual(new Date("2024-01-01")); // Monday (start)
      expect(dates[1]).toEqual(new Date("2024-01-03")); // Wednesday (same week)
      expect(dates[2]).toEqual(new Date("2024-01-15")); // Monday (2 weeks later)
      expect(dates[3]).toEqual(new Date("2024-01-17")); // Wednesday (2 weeks later)
    });
  });

  describe("Monthly Recurrence", () => {
    it("should generate monthly dates with same date", () => {
      const config: RecurrenceConfig = {
        pattern: "monthly",
        interval: 1,
        startDate: new Date("2024-01-15"),
        monthlyPattern: "same-date",
      };

      const dates = DateGenerator.generateRecurringDates(config, 4);

      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(new Date("2024-01-15"));
      expect(dates[1]).toEqual(new Date("2024-02-15"));
      expect(dates[2]).toEqual(new Date("2024-03-15"));
      expect(dates[3]).toEqual(new Date("2024-04-15"));
    });

    it("should handle month overflow (e.g., Jan 31 -> Feb 28)", () => {
      const config: RecurrenceConfig = {
        pattern: "monthly",
        interval: 1,
        startDate: new Date("2024-01-31"),
        monthlyPattern: "same-date",
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-31"));
      expect(dates[1]).toEqual(new Date("2024-02-29")); // 2024 is leap year
      expect(dates[2]).toEqual(new Date("2024-03-31"));
    });

    it("should generate monthly day-of-week patterns", () => {
      const config: RecurrenceConfig = {
        pattern: "monthly",
        interval: 1,
        startDate: new Date("2024-01-01"),
        monthlyPattern: "day-of-week",
        monthlyOrdinal: "second",
        monthlyWeekDay: "tuesday",
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-09")); // Second Tuesday of Jan
      expect(dates[1]).toEqual(new Date("2024-02-13")); // Second Tuesday of Feb
      expect(dates[2]).toEqual(new Date("2024-03-12")); // Second Tuesday of Mar
    });

    it('should handle "last" ordinal for monthly patterns', () => {
      const config: RecurrenceConfig = {
        pattern: "monthly",
        interval: 1,
        startDate: new Date("2025-01-01"),
        monthlyPattern: "day-of-week",
        monthlyOrdinal: "last",
        monthlyWeekDay: "friday",
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2026-01-30")); // Last Friday of Jan
      expect(dates[1]).toEqual(new Date("2026-02-27")); // Last Friday of Feb
      expect(dates[2]).toEqual(new Date("2026-03-27")); // Last Friday of Mar
    });
  });

  describe("Yearly Recurrence", () => {
    it("should generate yearly dates", () => {
      const config: RecurrenceConfig = {
        pattern: "yearly",
        interval: 1,
        startDate: new Date("2024-02-29"), // Leap year
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-02-29"));
      expect(dates[1]).toEqual(new Date("2025-02-28")); // Non-leap year
      expect(dates[2]).toEqual(new Date("2026-02-28"));
    });

    it("should handle custom yearly intervals", () => {
      const config: RecurrenceConfig = {
        pattern: "yearly",
        interval: 2,
        startDate: new Date("2024-01-01"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-01"));
      expect(dates[1]).toEqual(new Date("2026-01-01"));
      expect(dates[2]).toEqual(new Date("2028-01-01"));
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty weeklyDays array", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-01-01"),
        weeklyDays: [],
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-01"));
      expect(dates[1]).toEqual(new Date("2024-01-08"));
      expect(dates[2]).toEqual(new Date("2024-01-15"));
    });

    it("should return empty array for invalid pattern", () => {
      const config: RecurrenceConfig = {
        pattern: "invalid" as any,
        interval: 1,
        startDate: new Date("2024-01-01"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 5);

      expect(dates).toHaveLength(0); // Should be empty for invalid pattern
    });

    it("should handle maxDates limit", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-01-01"),
      };

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);

      console.log(dates);
    });
  });
});
