import type { RecurrenceConfig, ValidationError } from "@/types";

export class ValidationUtils {
  /**
   * Validate complete recurrence configuration
   */
  static validateConfig(config: RecurrenceConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate start date
    if (!config.startDate) {
      errors.push({
        field: "startDate",
        message: "Start date is required",
        severity: "error",
      });
    }

    // Validate end date
    if (config.endDate && config.startDate) {
      if (config.endDate <= config.startDate) {
        errors.push({
          field: "endDate",
          message: "End date must be after start date",
          severity: "error",
        });
      }
    }

    // Validate interval
    if (!config.interval || config.interval < 1) {
      errors.push({
        field: "interval",
        message: "Interval must be a positive number",
        severity: "error",
      });
    }

    if (config.interval > 365) {
      errors.push({
        field: "interval",
        message: "Interval cannot exceed 365",
        severity: "warning",
      });
    }

    // Validate weekly pattern
    if (config.pattern === "weekly" && config.weeklyDays) {
      if (config.weeklyDays.length === 0) {
        errors.push({
          field: "weeklyDays",
          message: "At least one day must be selected for weekly recurrence",
          severity: "error",
        });
      }
    }

    // Validate monthly pattern
    if (
      config.pattern === "monthly" &&
      config.monthlyPattern === "day-of-week"
    ) {
      if (!config.monthlyOrdinal) {
        errors.push({
          field: "monthlyOrdinal",
          message:
            "Ordinal position is required for monthly day-of-week pattern",
          severity: "error",
        });
      }

      if (!config.monthlyWeekDay) {
        errors.push({
          field: "monthlyWeekDay",
          message: "Weekday is required for monthly day-of-week pattern",
          severity: "error",
        });
      }
    }

    return errors;
  }

  /**
   * Validate individual field
   */
  static validateField(
    field: string,
    value: any,
    config?: Partial<RecurrenceConfig>
  ): ValidationError | null {
    switch (field) {
      case "startDate":
        return this.validateStartDate(value);
      case "endDate":
        return this.validateEndDate(value, config?.startDate);
      case "interval":
        return this.validateInterval(value);
      case "weeklyDays":
        return this.validateWeeklyDays(value);
      default:
        return null;
    }
  }

  /**
   * Validate start date
   */
  private static validateStartDate(date: Date): ValidationError | null {
    if (!date) {
      return {
        field: "startDate",
        message: "Start date is required",
        severity: "error",
      };
    }

    // Optional: Warn if start date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return {
        field: "startDate",
        message: "Start date is in the past",
        severity: "warning",
      };
    }

    return null;
  }

  /**
   * Validate end date
   */
  private static validateEndDate(
    endDate: Date,
    startDate?: Date
  ): ValidationError | null {
    if (!endDate) return null; // End date is optional

    if (startDate && endDate <= startDate) {
      return {
        field: "endDate",
        message: "End date must be after start date",
        severity: "error",
      };
    }

    return null;
  }

  /**
   * Validate interval
   */
  private static validateInterval(interval: number): ValidationError | null {
    if (!interval || interval < 1) {
      return {
        field: "interval",
        message: "Interval must be a positive number",
        severity: "error",
      };
    }

    if (interval > 365) {
      return {
        field: "interval",
        message: "Interval cannot exceed 365",
        severity: "warning",
      };
    }

    return null;
  }

  /**
   * Validate weekly days selection
   */
  private static validateWeeklyDays(
    weeklyDays: string[]
  ): ValidationError | null {
    if (!weeklyDays || weeklyDays.length === 0) {
      return {
        field: "weeklyDays",
        message: "At least one day must be selected for weekly recurrence",
        severity: "error",
      };
    }

    return null;
  }

  /**
   * Check if configuration is valid (no errors)
   */
  static isConfigValid(config: RecurrenceConfig): boolean {
    const errors = this.validateConfig(config);
    return errors.filter((error) => error.severity === "error").length === 0;
  }

  /**
   * Get error messages for display
   */
  static getErrorMessages(errors: ValidationError[]): Record<string, string> {
    const messages: Record<string, string> = {};

    errors.forEach((error) => {
      if (error.severity === "error") {
        messages[error.field] = error.message;
      }
    });

    return messages;
  }

  /**
   * Get warning messages for display
   */
  static getWarningMessages(errors: ValidationError[]): Record<string, string> {
    const messages: Record<string, string> = {};

    errors.forEach((error) => {
      if (error.severity === "warning") {
        messages[error.field] = error.message;
      }
    });

    return messages;
  }
}
