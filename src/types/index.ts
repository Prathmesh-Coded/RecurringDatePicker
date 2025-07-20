// Core types for recurring date picker
export type RecurrencePattern = "daily" | "weekly" | "monthly" | "yearly";

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type MonthlyPattern = "same-date" | "day-of-week";
export type Ordinal = "first" | "second" | "third" | "fourth" | "last";

// Main configuration interface
export interface RecurrenceConfig {
  pattern: RecurrencePattern;
  interval: number;
  startDate: Date;
  endDate?: Date;
  weeklyDays?: WeekDay[];
  monthlyPattern?: MonthlyPattern;
  monthlyOrdinal?: Ordinal;
  monthlyWeekDay?: WeekDay;
}

// Component props
export interface RecurringDatePickerProps {
  initialConfig?: Partial<RecurrenceConfig>;
  onConfigChange: (config: RecurrenceConfig) => void;
  onDatesGenerated: (dates: Date[]) => void;
  maxPreviewDates?: number;
  className?: string;
  disabled?: boolean;
}

// Generated result
export interface RecurrenceResult {
  config: RecurrenceConfig;
  generatedDates: Date[];
  isValid: boolean;
  validationErrors: string[];
}

// Validation error interface
export interface ValidationError {
  field: string;
  message: string;
  severity: "error" | "warning";
}
  