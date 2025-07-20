import type { RecurrenceConfig, WeekDay } from "@/types";

export class DateGenerator {
  /**
   * Generate recurring dates based on configuration
   */
  static generateRecurringDates(
    config: RecurrenceConfig,
    maxDates: number = 50
  ): Date[] {
    const dates: Date[] = [];
    let currentDate = new Date(config.startDate);

    // Check if start date should be included based on pattern
    const shouldIncludeStartDate = this.shouldIncludeStartDate(
      currentDate,
      config
    );

    if (shouldIncludeStartDate) {
      dates.push(new Date(currentDate));
    }

    let count = shouldIncludeStartDate ? 1 : 0;

    while (count < maxDates) {
      const nextDate = this.getNextDate(currentDate, config);

      if (!nextDate) break;

      // Check if we've exceeded the end date
      if (config.endDate && nextDate > config.endDate) {
        break;
      }

      dates.push(new Date(nextDate));
      currentDate = nextDate;
      count++;
    }

    return dates;
  }

  /**
   * Check if start date should be included based on recurrence pattern
   */
  private static shouldIncludeStartDate(
    startDate: Date,
    config: RecurrenceConfig
  ): boolean {
    switch (config.pattern) {
      case "weekly":
        if (config.weeklyDays && config.weeklyDays.length > 0) {
          const startDayOfWeek = this.getWeekDayFromDate(startDate);
          return config.weeklyDays.includes(startDayOfWeek);
        }
        return true;
      case "daily":
      case "monthly":
      case "yearly":
      default:
        return true;
    }
  }

  /**
   * Get weekday string from date
   */
  private static getWeekDayFromDate(date: Date): WeekDay {
    const dayNumber = date.getDay();
    const mapping: Record<number, WeekDay> = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };
    return mapping[dayNumber];
  }

  /**
   * Get the next date based on recurrence pattern
   */
  private static getNextDate(
    currentDate: Date,
    config: RecurrenceConfig
  ): Date | null {
    switch (config.pattern) {
      case "daily":
        return this.getNextDailyDate(currentDate, config.interval);
      case "weekly":
        return this.getNextWeeklyDate(
          currentDate,
          config.interval,
          config.weeklyDays
        );
      case "monthly":
        return this.getNextMonthlyDate(currentDate, config);
      case "yearly":
        return this.getNextYearlyDate(currentDate, config.interval);
      default:
        return null;
    }
  }

  /**
   * Generate next daily occurrence
   */
  private static getNextDailyDate(currentDate: Date, interval: number): Date {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + interval);
    return nextDate;
  }

  /**
   * Generate next weekly occurrence
   */
  private static getNextWeeklyDate(
    currentDate: Date,
    interval: number,
    weeklyDays?: WeekDay[]
  ): Date {
    if (!weeklyDays || weeklyDays.length === 0) {
      // Default to same day of week
      const nextDate = new Date(currentDate);
      nextDate.setDate(nextDate.getDate() + 7 * interval);
      return nextDate;
    }

    const targetDays = weeklyDays.map((day) => this.weekDayToNumber(day));

    // Start looking from the next day
    const searchDate = new Date(currentDate);
    searchDate.setDate(searchDate.getDate() + 1);

    // Look for the next occurrence within the current week first
    const currentWeekEnd = new Date(currentDate);
    currentWeekEnd.setDate(currentDate.getDate() + (6 - currentDate.getDay()));

    while (searchDate <= currentWeekEnd) {
      if (targetDays.includes(searchDate.getDay())) {
        return new Date(searchDate);
      }
      searchDate.setDate(searchDate.getDate() + 1);
    }

    // If no occurrence in current week, jump to the next interval week
    // and find the first matching day
    const nextIntervalWeekStart = new Date(currentDate);
    const daysToNextInterval =
      7 * interval -
      (currentDate.getDay() === 0 ? 0 : 7 - currentDate.getDay());
    nextIntervalWeekStart.setDate(currentDate.getDate() + daysToNextInterval);

    // Find the first occurrence in the target week
    const targetWeekStart = new Date(nextIntervalWeekStart);
    targetWeekStart.setDate(
      targetWeekStart.getDate() - targetWeekStart.getDay()
    ); // Go to Sunday of target week

    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(targetWeekStart);
      checkDate.setDate(targetWeekStart.getDate() + i);

      if (targetDays.includes(checkDate.getDay())) {
        return checkDate;
      }
    }

    // Fallback
    return new Date(currentDate.getTime() + 7 * interval * 24 * 60 * 60 * 1000);
  }

  /**
   * Generate next monthly occurrence
   */
  private static getNextMonthlyDate(
    currentDate: Date,
    config: RecurrenceConfig
  ): Date {
    const nextDate = new Date(currentDate);

    if (
      config.monthlyPattern === "day-of-week" &&
      config.monthlyOrdinal &&
      config.monthlyWeekDay
    ) {
      // Handle "second Tuesday" type patterns
      return this.getNextMonthlyDayOfWeek(
        nextDate,
        config.interval,
        config.monthlyOrdinal,
        config.monthlyWeekDay
      );
    } else {
      // Default to same date each month
      nextDate.setMonth(nextDate.getMonth() + config.interval);

      // Handle month overflow (e.g., Jan 31 -> Feb 28)
      const originalDay = currentDate.getDate();
      const lastDayOfMonth = new Date(
        nextDate.getFullYear(),
        nextDate.getMonth() + 1,
        0
      ).getDate();

      if (originalDay > lastDayOfMonth) {
        nextDate.setDate(lastDayOfMonth);
      }

      return nextDate;
    }
  }

  /**
   * Generate next yearly occurrence
   */
  private static getNextYearlyDate(currentDate: Date, interval: number): Date {
    const nextDate = new Date(currentDate);
    nextDate.setFullYear(nextDate.getFullYear() + interval);

    // Handle leap year edge case (Feb 29)
    if (currentDate.getMonth() === 1 && currentDate.getDate() === 29) {
      // If next year is not a leap year, use Feb 28
      if (!this.isLeapYear(nextDate.getFullYear())) {
        nextDate.setDate(28);
      }
    }

    return nextDate;
  }

  /**
   * Get next monthly day-of-week occurrence (e.g., "second Tuesday")
   */
  private static getNextMonthlyDayOfWeek(
    currentDate: Date,
    interval: number,
    ordinal: string,
    weekDay: WeekDay
  ): Date {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + interval);
    nextDate.setDate(1); // Start from first day of month

    const targetDayOfWeek = this.weekDayToNumber(weekDay);
    const ordinalNumber = this.ordinalToNumber(ordinal);

    // Find the nth occurrence of the target weekday
    let occurrenceCount = 0;

    for (let day = 1; day <= 31; day++) {
      nextDate.setDate(day);

      // Check if we've moved to next month
      if (nextDate.getMonth() !== (currentDate.getMonth() + interval) % 12) {
        break;
      }

      if (nextDate.getDay() === targetDayOfWeek) {
        occurrenceCount++;

        if (ordinal === "last") {
          // For "last", we need to check if this is the final occurrence
          const nextWeek = new Date(nextDate);
          nextWeek.setDate(nextWeek.getDate() + 7);

          if (nextWeek.getMonth() !== nextDate.getMonth()) {
            return new Date(nextDate);
          }
        } else if (occurrenceCount === ordinalNumber) {
          return new Date(nextDate);
        }
      }
    }

    // If pattern doesn't exist in this month, skip to next month
    return this.getNextMonthlyDayOfWeek(nextDate, 1, ordinal, weekDay);
  }

  /**
   * Convert weekday string to number (0 = Sunday, 1 = Monday, etc.)
   */
  private static weekDayToNumber(weekDay: WeekDay): number {
    const mapping: Record<WeekDay, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };
    return mapping[weekDay];
  }

  /**
   * Convert ordinal string to number
   */
  private static ordinalToNumber(ordinal: string): number {
    const mapping: Record<string, number> = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
      last: -1, // Special case handled separately
    };
    return mapping[ordinal] || 1;
  }

  /**
   * Check if year is a leap year
   */
  private static isLeapYear(year: number): boolean {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }
}
