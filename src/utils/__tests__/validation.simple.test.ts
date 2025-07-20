// Simple test for ValidationUtils without external dependencies
import { ValidationUtils } from "../validation";
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
    toBeNull: () => {
      if (actual !== null) {
        throw new Error(`Expected null, got ${actual}`);
      }
    },
    not: {
      toBeNull: () => {
        if (actual === null) {
          throw new Error(`Expected not null, got null`);
        }
      },
    },
  };
}

// Run tests
console.log("Running ValidationUtils Tests...");

describe("ValidationUtils", () => {
  describe("validateConfig", () => {
    it("should return no errors for valid configuration", () => {
      const validConfig: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-12-01"),
      };

      const errors = ValidationUtils.validateConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    it("should validate start date is required", () => {
      const config = {
        pattern: "daily" as const,
        interval: 1,
        startDate: null as any,
      };

      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("startDate");
      expect(errors[0].message).toBe("Start date is required");
      expect(errors[0].severity).toBe("error");
    });

    it("should validate end date is after start date", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-11-01"), // Before start date
      };

      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("endDate");
      expect(errors[0].message).toBe("End date must be after start date");
      expect(errors[0].severity).toBe("error");
    });

    it("should validate interval is positive", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 0,
        startDate: new Date("2024-12-01"),
      };

      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("interval");
      expect(errors[0].message).toBe("Interval must be a positive number");
      expect(errors[0].severity).toBe("error");
    });

    it("should validate weekly days are selected", () => {
      const config: RecurrenceConfig = {
        pattern: "weekly",
        interval: 1,
        startDate: new Date("2024-12-01"),
        weeklyDays: [],
      };

      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("weeklyDays");
      expect(errors[0].message).toBe(
        "At least one day must be selected for weekly recurrence"
      );
      expect(errors[0].severity).toBe("error");
    });
  });

  describe("validateField", () => {
    it("should validate individual start date field", () => {
      const error = ValidationUtils.validateField("startDate", null);

      expect(error).not.toBeNull();
      expect(error!.field).toBe("startDate");
      expect(error!.message).toBe("Start date is required");
    });

    it("should validate individual interval field", () => {
      const error = ValidationUtils.validateField("interval", -1);

      expect(error).not.toBeNull();
      expect(error!.field).toBe("interval");
      expect(error!.message).toBe("Interval must be a positive number");
    });

    it("should return null for valid field values", () => {
      const error = ValidationUtils.validateField("startDate", new Date());
      expect(error).toBeNull();
    });
  });

  describe("isConfigValid", () => {
    it("should return true for valid configuration", () => {
      const validConfig: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-12-01"),
      };

      const isValid = ValidationUtils.isConfigValid(validConfig);
      expect(isValid).toBe(true);
    });

    it("should return false for configuration with errors", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 0,
        startDate: new Date("2024-12-01"),
      };

      const isValid = ValidationUtils.isConfigValid(config);
      expect(isValid).toBe(false);
    });
  });
});

// Execute the tests
describe("ValidationUtils", () => {
  describe("validateConfig", () => {
    it("should return no errors for valid configuration", () => {
      const validConfig: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-12-01"),
      };

      const errors = ValidationUtils.validateConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    it("should validate interval is positive", () => {
      const config: RecurrenceConfig = {
        pattern: "daily",
        interval: 0,
        startDate: new Date("2024-12-01"),
      };

      const errors = ValidationUtils.validateConfig(config);
      expect(errors).toHaveLength(1);
    });
  });

  describe("isConfigValid", () => {
    it("should return true for valid configuration", () => {
      const validConfig: RecurrenceConfig = {
        pattern: "daily",
        interval: 1,
        startDate: new Date("2024-12-01"),
      };

      const isValid = ValidationUtils.isConfigValid(validConfig);
      expect(isValid).toBe(true);
    });
  });
});
