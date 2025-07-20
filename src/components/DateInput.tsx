import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  label?: string;
  error?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  "aria-label"?: string;
  "aria-describedby"?: string;
}

export default function DateInput({
  value,
  onChange,
  label,
  error,
  className,
  placeholder,
  required = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: DateInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(new Date(e.target.value));
    } else {
      onChange(undefined);
    }
  };

  const handleClear = () => {
    onChange(undefined);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={value ? value.toISOString().split("T")[0] : ""}
          onChange={handleChange}
          className={cn(
            "px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black focus:border-black transition-colors",
            error ? "border-red-500" : "border-gray-300",
            "flex-1"
          )}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded transition-colors"
            aria-label="Clear date"
          >
            Clear
          </button>
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
