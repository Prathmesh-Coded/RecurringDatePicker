import { useState, useEffect } from "react";
import DatePicker from "@/components/DatePicker";
import DropDown from "@/components/DropDown";
import Button from "@/components/Button";
import DaySelectionButtons from "@/components/DaySelectionButtons";
import DateInput from "@/components/DateInput";
import EventSummary from "@/components/EventSummary";
import OccurrencePreview from "@/components/OccurrencePreview";
import IntervalInput from "@/components/IntervalInput";
import type { RecurrenceConfig } from "@/types";
import { DateGenerator } from "@/utils/dateGenerator";
import { ValidationUtils } from "@/utils/validation";

const timeOptions = [
  { label: "12:00 AM", value: "12:00 AM" },
  { label: "12:30 AM", value: "12:30 AM" },
  { label: "1:00 AM", value: "1:00 AM" },
  { label: "1:30 AM", value: "1:30 AM" },
  { label: "2:00 AM", value: "2:00 AM" },
  { label: "2:30 AM", value: "2:30 AM" },
  { label: "3:00 AM", value: "3:00 AM" },
  { label: "3:30 AM", value: "3:30 AM" },
  { label: "4:00 AM", value: "4:00 AM" },
  { label: "4:30 AM", value: "4:30 AM" },
  { label: "5:00 AM", value: "5:00 AM" },
  { label: "5:30 AM", value: "5:30 AM" },
  { label: "6:00 AM", value: "6:00 AM" },
  { label: "6:30 AM", value: "6:30 AM" },
  { label: "7:00 AM", value: "7:00 AM" },
  { label: "7:30 AM", value: "7:30 AM" },
  { label: "8:00 AM", value: "8:00 AM" },
  { label: "8:30 AM", value: "8:30 AM" },
  { label: "9:00 AM", value: "9:00 AM" },
  { label: "9:30 AM", value: "9:30 AM" },
  { label: "10:00 AM", value: "10:00 AM" },
  { label: "10:30 AM", value: "10:30 AM" },
  { label: "11:00 AM", value: "11:00 AM" },
  { label: "11:30 AM", value: "11:30 AM" },
  { label: "12:00 PM", value: "12:00 PM" },
  { label: "12:30 PM", value: "12:30 PM" },
  { label: "1:00 PM", value: "1:00 PM" },
  { label: "1:30 PM", value: "1:30 PM" },
  { label: "2:00 PM", value: "2:00 PM" },
  { label: "2:30 PM", value: "2:30 PM" },
  { label: "3:00 PM", value: "3:00 PM" },
  { label: "3:30 PM", value: "3:30 PM" },
  { label: "4:00 PM", value: "4:00 PM" },
  { label: "4:30 PM", value: "4:30 PM" },
  { label: "5:00 PM", value: "5:00 PM" },
  { label: "5:30 PM", value: "5:30 PM" },
  { label: "6:00 PM", value: "6:00 PM" },
  { label: "6:30 PM", value: "6:30 PM" },
  { label: "7:00 PM", value: "7:00 PM" },
  { label: "7:30 PM", value: "7:30 PM" },
  { label: "8:00 PM", value: "8:00 PM" },
  { label: "8:30 PM", value: "8:30 PM" },
  { label: "9:00 PM", value: "9:00 PM" },
  { label: "9:30 PM", value: "9:30 PM" },
  { label: "10:00 PM", value: "10:00 PM" },
  { label: "10:30 PM", value: "10:30 PM" },
  { label: "11:00 PM", value: "11:00 PM" },
  { label: "11:30 PM", value: "11:30 PM" },
];

const reminderOptions = [
  { label: "On Time", value: "onTime" },
  { label: "5 minutes before", value: "5minBefore" },
  { label: "10 minutes before", value: "10minBefore" },
  { label: "15 minutes before", value: "15minBefore" },
  { label: "30 minutes before", value: "30minBefore" },
  { label: "1 hour before", value: "1hourBefore" },
  { label: "1 day before", value: "1dayBefore" },
  { label: "5 minutes after", value: "5minAfter" },
  { label: "10 minutes after", value: "10minAfter" },
  { label: "15 minutes after", value: "15minAfter" },
  { label: "30 minutes after", value: "30minAfter" },
  { label: "1 hour after", value: "1hourAfter" },
  { label: "1 day after", value: "1dayAfter" },
];

const repeatOptions = [
  { label: "No Repeat", value: "noRepeat" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
  { label: "Yearly", value: "yearly" },
];

// Helper function to get interval label
const getIntervalLabel = (pattern: string, interval: number): string => {
  const labels: Record<string, string> = {
    daily: interval === 1 ? "day" : "days",
    weekly: interval === 1 ? "week" : "weeks",
    monthly: interval === 1 ? "month" : "months",
    yearly: interval === 1 ? "year" : "years",
    weekdays: "weekdays",
    weekends: "weekends",
  };

  return labels[pattern] || "times";
};

const DatePickerUI = () => {
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedReminder, setSelectedReminder] = useState("onTime");
  const [selectedRepeat, setSelectedRepeat] = useState("noRepeat");

  // New state for recurring date functionality
  const [interval, setInterval] = useState(1);
  const [generatedDates, setGeneratedDates] = useState<Date[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>([]);
  const [hasInteracted, setHasInteracted] = useState<Record<string, boolean>>(
    {}
  );
  const [monthlyPattern, setMonthlyPattern] = useState<
    "same-date" | "day-of-week"
  >("same-date");
  const [monthlyOrdinal, setMonthlyOrdinal] = useState<string>("first");
  const [monthlyWeekDay, setMonthlyWeekDay] = useState<string>("monday");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Generate recurring dates when configuration changes
  const generateRecurringDates = () => {
    if (selectedRepeat === "noRepeat" || !selectedDate) {
      setGeneratedDates([]);
      return;
    }

    try {
      const config: RecurrenceConfig = {
        pattern: selectedRepeat as any,
        interval: interval,
        startDate: selectedDate,
        endDate: endDate,
        weeklyDays:
          selectedRepeat === "weekly" ? (selectedWeekdays as any) : undefined,
        monthlyPattern:
          selectedRepeat === "monthly" ? monthlyPattern : undefined,
        monthlyOrdinal:
          selectedRepeat === "monthly" && monthlyPattern === "day-of-week"
            ? (monthlyOrdinal as any)
            : undefined,
        monthlyWeekDay:
          selectedRepeat === "monthly" && monthlyPattern === "day-of-week"
            ? (monthlyWeekDay as any)
            : undefined,
      };

      // Validate configuration
      const errors = ValidationUtils.validateConfig(config);
      const errorMessages = ValidationUtils.getErrorMessages(errors);
      setValidationErrors(errorMessages);

      // Only generate dates if configuration is valid
      if (ValidationUtils.isConfigValid(config)) {
        // Generate more dates to get accurate count, then limit display
        const maxDates = endDate ? 100 : 50; // Generate more if there's an end date
        const dates = DateGenerator.generateRecurringDates(config, maxDates);
        setGeneratedDates(dates);
      } else {
        setGeneratedDates([]);
      }
    } catch (error) {
      console.error("Error generating recurring dates:", error);
      setGeneratedDates([]);
    }
  };

  // Trigger date generation when relevant state changes
  useEffect(() => {
    generateRecurringDates();
  }, [
    selectedDate,
    selectedRepeat,
    interval,
    selectedWeekdays,
    monthlyPattern,
    monthlyOrdinal,
    monthlyWeekDay,
    endDate,
  ]);

  const handleSchedule = () => {
    console.log("Scheduling event:", {
      date: selectedDate,
      time: selectedTime,
      reminder: selectedReminder,
      repeat: selectedRepeat,
      interval: interval,
      generatedDates: generatedDates,
    });
  };

  const handleClear = () => {
    setSelectedTime("");
    setSelectedDate(new Date());
    setSelectedReminder("onTime");
    setSelectedRepeat("noRepeat");
    setInterval(1);
    setGeneratedDates([]);
    setValidationErrors({});
    setSelectedWeekdays([]);
    setHasInteracted({});
    setMonthlyPattern("same-date");
    setMonthlyOrdinal("first");
    setMonthlyWeekDay("monday");
    setEndDate(undefined);
  };

  if (process.env.NODE_ENV === "test") {
    console.log("Generated dates:", generatedDates);
  }
  return (
    <main
      className="flex items-center justify-center min-h-screen min-w-screen bg-white overflow-y-auto"
      role="main"
      aria-label="Event scheduling application"
    >
      <div
        className="flex flex-col item-center justify-center md:flex-row w-full max-w-fit mx-2 md:mx-auto"
        role="form"
        aria-labelledby="schedule-heading"
      >
        {/* Left Container */}
        <section
          className="flex flex-col items-center justify-center p-4 md:p-8 w-full md:w-auto"
          aria-label="Date selection and summary"
        >
          <div aria-label="Date picker">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Summary Display */}
          <EventSummary
            date={selectedDate}
            time={selectedTime}
            reminder={
              reminderOptions.find((opt) => opt.value === selectedReminder)
                ?.label
            }
            repeat={
              repeatOptions.find((opt) => opt.value === selectedRepeat)?.label
            }
            className="mt-6 md:mt-8"
          />

          {/* Button Section - Desktop Only */}
          <div
            className="hidden md:flex gap-6 md:gap-12 mt-6 md:mt-[60%] w-full"
            role="group"
            aria-label="Action buttons"
          >
            <Button
              label="Schedule"
              onClick={handleSchedule}
              variant="primary"
              aria-label="Schedule"
              aria-describedby="schedule-help"
            />
            <Button
              label="Clear"
              onClick={handleClear}
              variant="outline"
              aria-label="Clear"
              aria-describedby="clear-help"
            />
          </div>
        </section>

        {/* Divider Line */}
        <div
          className="hidden md:block w-px bg-gray-200"
          role="separator"
          aria-hidden="true"
        ></div>
        <div
          className="block md:hidden h-px bg-gray-200 mx-4"
          role="separator"
          aria-hidden="true"
        ></div>

        {/* Right Section */}
        <section
          className="p-4 md:p-8 md:pl-12 md:pr-12 w-80 md:w-80 min-h-[600px] flex flex-col"
          aria-label="Event configuration options"
        >
          <h3
            id="schedule-heading"
            className="text-xl font-bold mb-6 text-gray-800"
          >
            Schedule Your Event
          </h3>
          {/* Time Selection */}
          <div className="mb-4 md:mb-6">
            <label
              htmlFor="time-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time
            </label>
            <DropDown
              id="time-select"
              options={timeOptions}
              selectedValue={selectedTime}
              onSelect={setSelectedTime}
              placeholder="Select time"
              aria-label="Select event time"
              aria-describedby="time-help"
            />
            <div id="time-help" className="sr-only">
              Choose the time when your event should occur
            </div>
          </div>
          {/* Reminder Timing */}
          <div className="mb-4 md:mb-6">
            <label
              htmlFor="reminder-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Reminder
            </label>
            <DropDown
              id="reminder-select"
              options={reminderOptions}
              selectedValue={selectedReminder}
              onSelect={setSelectedReminder}
              placeholder="When to remind"
              aria-label="Select reminder timing"
              aria-describedby="reminder-help"
            />
            <div id="reminder-help" className="sr-only">
              Choose when you want to be reminded about this event
            </div>
          </div>
          {/* Repeat Options */}
          <div className="mb-4 md:mb-6">
            <label
              htmlFor="repeat-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Repeat
            </label>
            <DropDown
              id="repeat-select"
              options={repeatOptions}
              selectedValue={selectedRepeat}
              onSelect={setSelectedRepeat}
              placeholder="Repeat frequency"
              aria-label="Select repeat pattern"
              aria-describedby="repeat-help"
            />
            <div id="repeat-help" className="sr-only">
              Choose how often this event should repeat
            </div>
          </div>
          {/* Dynamic Content Area - Fixed height to prevent shifting */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Custom Interval Selection - Show when recurring pattern is selected */}
            {selectedRepeat !== "noRepeat" && selectedRepeat !== "" && (
              <IntervalInput
                value={interval}
                onChange={setInterval}
                label="After every"
                unitLabel={getIntervalLabel(selectedRepeat, interval)}
                error={validationErrors.interval}
                aria-label="Interval number"
                aria-describedby="interval-help"
              />
            )}

            {/* Weekday Selection - Show when weekly pattern is selected */}
            {selectedRepeat === "weekly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  On these days
                </label>
                <DaySelectionButtons
                  selectedDays={selectedWeekdays}
                  onDayToggle={(day) => {
                    const isSelected = selectedWeekdays.includes(day);
                    if (isSelected) {
                      setSelectedWeekdays(
                        selectedWeekdays.filter((d) => d !== day)
                      );
                    } else {
                      setSelectedWeekdays([...selectedWeekdays, day]);
                    }
                    // Mark that user has interacted with weekday selection
                    setHasInteracted((prev) => ({ ...prev, weeklyDays: true }));
                  }}
                  validationError={validationErrors.weeklyDays}
                  showError={hasInteracted.weeklyDays}
                  aria-describedby="weekday-help"
                />
                <div id="weekday-help" className="sr-only">
                  Select one or more days of the week for your recurring event
                </div>
              </div>
            )}

            {/* Monthly Pattern Selection - Show when monthly pattern is selected */}
            {selectedRepeat === "monthly" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Pattern
                </label>

                {/* Pattern Type Selection */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="monthlyPattern"
                      value="same-date"
                      checked={monthlyPattern === "same-date"}
                      onChange={(e) =>
                        setMonthlyPattern(
                          e.target.value as "same-date" | "day-of-week"
                        )
                      }
                      className="mr-2"
                      aria-describedby="same-date-help"
                    />
                    <span className="text-sm">Same date each month</span>
                  </label>
                  <div id="same-date-help" className="sr-only">
                    Repeat on the same calendar date each month (e.g., 15th of
                    every month)
                  </div>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="monthlyPattern"
                      value="day-of-week"
                      checked={monthlyPattern === "day-of-week"}
                      onChange={(e) =>
                        setMonthlyPattern(
                          e.target.value as "same-date" | "day-of-week"
                        )
                      }
                      className="mr-2"
                      aria-describedby="day-of-week-help"
                    />
                    <span className="text-sm">Specific day pattern</span>
                  </label>
                  <div id="day-of-week-help" className="sr-only">
                    Repeat on a specific day pattern (e.g., second Tuesday of
                    every month)
                  </div>
                </div>

                {/* Day-of-Week Pattern Configuration */}
                {monthlyPattern === "day-of-week" && (
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2 items-center">
                      <DropDown
                        options={[
                          { label: "First", value: "first" },
                          { label: "Second", value: "second" },
                          { label: "Third", value: "third" },
                          { label: "Fourth", value: "fourth" },
                          { label: "Last", value: "last" },
                        ]}
                        selectedValue={monthlyOrdinal}
                        onSelect={setMonthlyOrdinal}
                        placeholder="Select position"
                        className="flex-1"
                        aria-label="Select ordinal position"
                      />
                      <DropDown
                        options={[
                          { label: "Monday", value: "monday" },
                          { label: "Tuesday", value: "tuesday" },
                          { label: "Wednesday", value: "wednesday" },
                          { label: "Thursday", value: "thursday" },
                          { label: "Friday", value: "friday" },
                          { label: "Saturday", value: "saturday" },
                          { label: "Sunday", value: "sunday" },
                        ]}
                        selectedValue={monthlyWeekDay}
                        onSelect={setMonthlyWeekDay}
                        placeholder="Select day"
                        className="flex-1"
                        aria-label="Select day of week"
                      />
                    </div>
                    <div className="text-xs text-gray-600">
                      Example: "{monthlyOrdinal} {monthlyWeekDay}" of every{" "}
                      {interval === 1 ? "month" : `${interval} months`}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* End Date Selection - Show when recurring pattern is selected */}
            {selectedRepeat !== "noRepeat" && selectedRepeat !== "" && (
              <DateInput
                value={endDate}
                onChange={setEndDate}
                label="End Date (Optional)"
                error={validationErrors.endDate}
                aria-label="End date for recurring pattern"
                aria-describedby="end-date-help"
              />
            )}

            {/* Recurring Dates Preview */}
            <OccurrencePreview
              dates={generatedDates}
              endDate={endDate}
              maxDisplay={8}
            />
          </div>
          {/* Button Section - Mobile Only */}
          <div
            className="flex md:hidden gap-4 w-full"
            role="group"
            aria-label="Action buttons"
          >
            <Button
              label="Schedule"
              onClick={handleSchedule}
              variant="primary"
              aria-label="Schedule"
              aria-describedby="schedule-help"
            />
            <Button
              label="Clear"
              onClick={handleClear}
              variant="outline"
              aria-label="Clear"
              aria-describedby="clear-help"
            />
          </div>
          {/* ARIA Help Text */}
          <div id="schedule-help" className="sr-only">
            Create the event with your selected settings
          </div>
          <div id="clear-help" className="sr-only">
            Reset all form fields to their default values
          </div>
        </section>
      </div>
    </main>
  );
};

export default DatePickerUI;
