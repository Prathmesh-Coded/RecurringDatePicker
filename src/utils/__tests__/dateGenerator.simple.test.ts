// Simple test for DateGenerator without external dependencies
import { DateGenerator } from "../dateGenerator";
import type { RecurrenceConfig } from "../../types";

// Simple test runner
function describe(name: string, fn: () => void) {
  console.log(`\n=== ${name} ===`);
  fn();
}

function it(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}`);
    console.error(error);
  }
}

function expect(actual: any) {
  return {
    toEqual: (expected: any) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
        );
      }
    },
    toHaveLength: (length: number) => {
      if (actual.length !== length) {
        throw new Error(`Expected length ${length}, got ${actual.length}`);
      }
    },
    toBe: (expected: any) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, got ${actual}`);
      }
    },
  };
}

// Tests
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
    });
  });

  describe("Weekly Recurrence", () => {
    it("should generate weekly dates with specific weekdays", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-01-01"), // Monday
        weeklyDays: ["monday", "wednesday"],
      };

      const dates = DateGenerator.generateRecurringDates(config, 4);

      expect(dates).toHaveLength(4);
      expect(dates[0]).toEqual(new Date("2024-01-01")); // Monday (start date)
      expect(dates[1]).toEqual(new Date("2024-01-03")); // Wednesday
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

      const dates = DateGenerator.generateRecurringDates(config, 3);

      expect(dates).toHaveLength(3);
      expect(dates[0]).toEqual(new Date("2024-01-15"));
      expect(dates[1]).toEqual(new Date("2024-02-15"));
    });
  });
});

// Run tests
console.log("Running DateGenerator Tests...");
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
    });
  });
});
