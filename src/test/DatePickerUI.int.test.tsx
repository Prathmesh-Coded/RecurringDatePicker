import { render, screen, waitFor } from "@testing-library/react";
import DatePickerUI from "@/components/DatePickerUI";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";

// Integration test for DatePickerUI

describe("DatePickerUI Integration", () => {
  it("should allow user to configure a weekly recurring event and preview generated dates", async () => {
    render(<DatePickerUI />);

    // Select a start date (assume today is 2024-01-01 for test stability)
    // You may need to mock Date.now or the calendar component for full control
    // For now, we assume the default date is used

    // Open the repeat dropdown and select 'Weekly'
    const repeatDropdown = screen.getByLabelText(/repeat/i);
    userEvent.click(repeatDropdown);
    const weeklyOption = await screen.findByText(/Weekly/i);
    userEvent.click(weeklyOption);

    // Select two weekdays (e.g., Monday and Wednesday)
    const mondayButton = screen.getByRole("button", { name: /monday/i });
    const wednesdayButton = screen.getByRole("button", { name: /wednesday/i });
    userEvent.click(mondayButton);
    userEvent.click(wednesdayButton);

    // Set interval to 2
    const intervalInput = screen.getByLabelText(/interval/i);
    userEvent.clear(intervalInput);
    userEvent.type(intervalInput, "2");

    // Wait for the preview to update
    await waitFor(() => {
      // The preview should show the generated dates
      const preview = screen.getByTestId("occurrence-preview");
      console.log("Preview text:", preview.textContent); // <-- Print the preview text
      expect(preview).toBeInTheDocument();
      // Check that at least two dates are shown
      expect(preview.textContent).toMatch(/Monday/i);
      expect(preview.textContent).toMatch(/Wednesday/i);
    });
  });
});
