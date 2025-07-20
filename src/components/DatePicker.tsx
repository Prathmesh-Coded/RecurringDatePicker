import * as React from "react";

import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  selectedDate?: Date | undefined;
  onDateChange?: (date: Date | undefined) => void;
}

function DatePicker({ selectedDate, onDateChange }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    selectedDate || new Date(Date.now())
  );
  const [month, setMonth] = React.useState<Date>(new Date(Date.now()));

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange?.(selectedDate);

    if (selectedDate) {
      setMonth(selectedDate);
    }
  };

  // Update internal state when prop changes
  React.useEffect(() => {
    if (selectedDate !== undefined) {
      setDate(selectedDate);
      if (selectedDate) {
        setMonth(selectedDate);
      }
    }
  }, [selectedDate]);

  return (
    <div className="flex items-center justify-center">
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-lg h-[330px] md:w-fit"
        role="application"
        aria-label="Date picker calendar"
      >
        <Calendar
          mode="single"
          month={month}
          selected={date}
          onSelect={handleDateSelect}
          onMonthChange={setMonth}
          className="rounded-lg h-full p-3"
          aria-label={`Calendar for selecting date. Currently selected: ${
            date?.toLocaleDateString() || "No date selected"
          }`}
        />
      </div>
    </div>
  );
}

export default DatePicker;
