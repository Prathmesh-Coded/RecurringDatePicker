import { describe, it, expect, beforeEach } from "vitest";
import { ValidationUtils } from "../validation";
import type { RecurrenceConfig } from "../../types";

describe("ValidationUtils", () => {
  let validConfig: RecurrenceConfig;

  beforeEach(() => {
    validConfig = {
      pattern: "daily",
      interval: 1,
      startDate: new Date("2024-12-01"),
    };
  });

  describe("validateConfig", () => {
    it("should return no errors for valid configuration", () => {
      const errors = ValidationUtils.validateConfig(validConfig);
      expect(errors).toHaveLength(0);
    });

    it("should validate start date is required", () => {
      const config = { ...validConfig, startDate: null as any };
      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("startDate");
      expect(errors[0].message).toBe("Start date is required");
      expect(errors[0].severity).toBe("error");
    });

    it("should validate end date is after start date", () => {
      const config = {
        ...validConfig,
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
      const config = { ...validConfig, interval: 0 };
      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("interval");
      expect(errors[0].message).toBe("Interval must be a positive number");
      expect(errors[0].severity).toBe("error");
    });

    it("should warn when interval is too large", () => {
      const config = { ...validConfig, interval: 400 };
      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].field).toBe("interval");
      expect(errors[0].message).toBe("Interval cannot exceed 365");
      expect(errors[0].severity).toBe("warning");
    });

    it("should validate weekly days are selected", () => {
      const config: RecurrenceConfig = {
        ...validConfig,
        pattern: "weekly",
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

    it("should validate monthly day-of-week pattern completeness", () => {
      const config: RecurrenceConfig = {
        ...validConfig,
        pattern: "monthly",
        monthlyPattern: "day-of-week",
        // Missing monthlyOrdinal and monthlyWeekDay
      };
      const errors = ValidationUtils.validateConfig(config);

      expect(errors).toHaveLength(2);
      expect(errors.some((e) => e.field === "monthlyOrdinal")).toBe(true);
      expect(errors.some((e) => e.field === "monthlyWeekDay")).toBe(true);
    });
  });

  describe("validateField", () => {
    it("should validate individual start date field", () => {
      const error = ValidationUtils.validateField("startDate", null);

      expect(error).not.toBeNull();
      expect(error!.field).toBe("startDate");
      expect(error!.message).toBe("Start date is required");
    });

    it("should validate individual end date field", () => {
      const startDate = new Date("2024-12-01");
      const endDate = new Date("2024-11-01"); // Before start date

      const error = ValidationUtils.validateField("endDate", endDate, {
        startDate,
      });

      expect(error).not.toBeNull();
      expect(error!.field).toBe("endDate");
      expect(error!.message).toBe("End date must be after start date");
    });

    it("should validate individual interval field", () => {
      const error = ValidationUtils.validateField("interval", -1);

      expect(error).not.toBeNull();
      expect(error!.field).toBe("interval");
      expect(error!.message).toBe("Interval must be a positive number");
    });

    it("should validate individual weekly days field", () => {
      const error = ValidationUtils.validateField("weeklyDays", []);

      expect(error).not.toBeNull();
      expect(error!.field).toBe("weeklyDays");
      expect(error!.message).toBe(
        "At least one day must be selected for weekly recurrence"
      );
    });

    it("should return null for valid field values", () => {
      const error = ValidationUtils.validateField("startDate", new Date());
      expect(error).toBeNull();
    });

    it("should return null for unknown field", () => {
      const error = ValidationUtils.validateField("unknownField", "value");
      expect(error).toBeNull();
    });
  });

  describe("isConfigValid", () => {
    it("should return true for valid configuration", () => {
      const isValid = ValidationUtils.isConfigValid(validConfig);
      expect(isValid).toBe(true);
    });

    it("should return false for configuration with errors", () => {
      const config = { ...validConfig, interval: 0 };
      const isValid = ValidationUtils.isConfigValid(config);
      expect(isValid).toBe(false);
    });

    it("should return true for configuration with only warnings", () => {
      const config = { ...validConfig, interval: 400 }; // Warning, not error
      const isValid = ValidationUtils.isConfigValid(config);
      expect(isValid).toBe(true);
    });
  });

  describe("getErrorMessages", () => {
    it("should extract error messages from validation errors", () => {
      const config = {
        ...validConfig,
        interval: 0,
        startDate: null as any,
      };
      const errors = ValidationUtils.validateConfig(config);
      const messages = ValidationUtils.getErrorMessages(errors);

      expect(messages).toHaveProperty("interval");
      expect(messages).toHaveProperty("startDate");
      expect(messages.interval).toBe("Interval must be a positive number");
      expect(messages.startDate).toBe("Start date is required");
    });

    it("should only include error severity messages", () => {
      const config = { ...validConfig, interval: 400 }; // Warning only
      const errors = ValidationUtils.validateConfig(config);
      const messages = ValidationUtils.getErrorMessages(errors);

      expect(Object.keys(messages)).toHaveLength(0);
    });
  });

  describe("getWarningMessages", () => {
    it("should extract warning messages from validation errors", () => {
      const config = { ...validConfig, interval: 400 };
      const errors = ValidationUtils.validateConfig(config);
      const messages = ValidationUtils.getWarningMessages(errors);

      expect(messages).toHaveProperty("interval");
      expect(messages.interval).toBe("Interval cannot exceed 365");
    });

    it("should only include warning severity messages", () => {
      const config = { ...validConfig, interval: 0 }; // Error only
      const errors = ValidationUtils.validateConfig(config);
      const messages = ValidationUtils.getWarningMessages(errors);

      expect(Object.keys(messages)).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle past start date with warning", () => {
      const pastDate = new Date("2020-01-01");
      const error = ValidationUtils.validateField("startDate", pastDate);

      expect(error).not.toBeNull();
      expect(error!.severity).toBe("warning");
      expect(error!.message).toBe("Start date is in the past");
    });

    it("should handle valid end date without start date", () => {
      const error = ValidationUtils.validateField("endDate", new Date());
      expect(error).toBeNull();
    });

    it("should handle boundary interval values", () => {
      const error1 = ValidationUtils.validateField("interval", 1);
      const error365 = ValidationUtils.validateField("interval", 365);
      const error366 = ValidationUtils.validateField("interval", 366);

      expect(error1).toBeNull();
      expect(error365).toBeNull();
      expect(error366).not.toBeNull();
      expect(error366!.severity).toBe("warning");
    });
  });
});
