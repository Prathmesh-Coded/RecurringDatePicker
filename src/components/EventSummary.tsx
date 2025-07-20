import { cn } from "@/lib/utils";

interface EventSummaryProps {
  date?: Date;
  time?: string;
  reminder?: string;
  repeat?: string;
  className?: string;
  title?: string;
}

interface SummaryItem {
  label: string;
  value: string;
  ariaLabel: string;
}

export default function EventSummary({
  date,
  time,
  reminder,
  repeat,
  className,
  title = "Summary:",
}: EventSummaryProps) {
  const summaryItems: SummaryItem[] = [
    {
      label: "Date",
      value: date?.toLocaleDateString() || "Not selected",
      ariaLabel: `Selected date: ${
        date?.toLocaleDateString() || "Not selected"
      }`,
    },
    {
      label: "Time",
      value: time || "Not selected",
      ariaLabel: `Selected time: ${time || "Not selected"}`,
    },
    {
      label: "Reminder",
      value: reminder || "Not selected",
      ariaLabel: `Reminder setting: ${reminder || "Not selected"}`,
    },
    {
      label: "Repeat",
      value: repeat || "Not selected",
      ariaLabel: `Repeat setting: ${repeat || "Not selected"}`,
    },
  ];

  return (
    <aside
      className={cn(
        "min-w-[250px] p-4 bg-black/85 rounded-lg w-full max-w-xs",
        className
      )}
      role="region"
      aria-labelledby="summary-heading"
      aria-live="polite"
    >
      <h4
        id="summary-heading"
        className="text-sm tracking-wide font-semibold text-white mb-2"
      >
        {title}
      </h4>

      <div className="text-sm text-white space-y-1">
        {summaryItems.map((item, index) => (
          <div key={index} aria-label={item.ariaLabel}>
            <span className="font-medium">{item.label}:</span>{" "}
            <span className="text-gray-200">{item.value}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
