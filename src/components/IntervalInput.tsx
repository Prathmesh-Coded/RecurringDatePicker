import { cn } from "@/lib/utils";

interface IntervalInputProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unitLabel?: string;
  error?: string;
  min?: number;
  max?: number;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function IntervalInput({
  value,
  onChange,
  label = "Every",
  unitLabel = "times",
  error,
  min = 1,
  max = 365,
  className,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: IntervalInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    onChange(newValue);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor="interval-input"
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-2">
        <input
          id="interval-input"
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          className={cn(
            "w-20 px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-colors",
            error ? "border-red-500" : "border-gray-300"
          )}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
        />

        {unitLabel && (
          <span className="text-sm text-gray-600">{unitLabel}</span>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
