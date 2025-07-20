import { cn } from "@/lib/utils";

interface OccurrencePreviewProps {
  dates: Date[];
  endDate?: Date;
  maxDisplay?: number;
  className?: string;
  title?: string;
}

export default function OccurrencePreview({
  dates,
  maxDisplay = 8,
  className,
  title = "Next Occurrences",
}: OccurrencePreviewProps) {
  if (dates.length === 0) {
    return null;
  }

  const displayDates = dates.slice(0, maxDisplay);
  const remainingCount = dates.length - maxDisplay;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <label className="block text-sm font-medium text-gray-700">{title}</label>

      <div
        className="max-h-40 overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-3"
        role="region"
        aria-label="Preview of recurring dates"
        aria-live="polite"
      >
        <div className="space-y-1">
          {displayDates.map((date, index) => (
            <div
              key={index}
              className={cn(
                "text-sm px-2 py-1 rounded transition-colors",
                index === 0
                  ? "bg-blue-100 text-blue-800 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
              aria-label={`${
                index === 0
                  ? "Start date: "
                  : "Occurrence " + (index + 1) + ": "
              }${formatDate(date)}`}
            >
              {index === 0 && (
                <span className="text-xs font-semibold">START: </span>
              )}
              {formatDate(date)}
            </div>
          ))}

          {remainingCount > 0 && (
            <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-200">
              ... and more occurrences
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
