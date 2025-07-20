import { cn } from "@/lib/utils";

interface DaySelectionButtonsProps {
  selectedDays: string[];
  onDayToggle: (day: string) => void;
  validationError?: string;
  showError?: boolean;
  className?: string;
  "aria-describedby"?: string;
}

const WEEKDAYS = [
  { short: "S", full: "sunday", label: "Sunday" },
  { short: "M", full: "monday", label: "Monday" },
  { short: "T", full: "tuesday", label: "Tuesday" },
  { short: "W", full: "wednesday", label: "Wednesday" },
  { short: "T", full: "thursday", label: "Thursday" },
  { short: "F", full: "friday", label: "Friday" },
  { short: "S", full: "saturday", label: "Saturday" },
];

export default function DaySelectionButtons({
  selectedDays,
  onDayToggle,
  validationError,
  showError = false,
  className,
  "aria-describedby": ariaDescribedBy,
}: DaySelectionButtonsProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div
        className="grid grid-cols-7 gap-2"
        role="group"
        aria-label="Select days of the week"
        aria-describedby={ariaDescribedBy}
      >
        {WEEKDAYS.map((day) => (
          <button
            key={day.full}
            type="button"
            onClick={() => onDayToggle(day.full)}
            className={cn(
              "w-8 h-8 text-xs font-medium rounded-full border-2 transition-colors",
              selectedDays.includes(day.full)
                ? "bg-black text-white border-black"
                : "bg-white text-gray-700 border-gray-300 hover:border-black/50",
              validationError && showError ? "border-red-500" : ""
            )}
            aria-label={`${day.label} ${
              selectedDays.includes(day.full) ? "selected" : "not selected"
            }`}
            aria-pressed={selectedDays.includes(day.full)}
          >
            {day.short}
          </button>
        ))}
      </div>

      {validationError && showError && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {validationError}
        </p>
      )}

      {selectedDays.length > 0 && (
        <div className="mt-2 text-xs text-gray-600">
          Selected:{" "}
          {selectedDays
            .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
            .join(", ")}
        </div>
      )}
    </div>
  );
}
