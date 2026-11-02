import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { Select } from "./Select";

const { hours } = strings.roles.application.form;
const options = hours.options.map((o) => ({ value: o, label: o }));

describe("Select", () => {
  it("is a labelled native select with the empty option first", () => {
    render(<Select label={hours.label} name="hours" placeholder={hours.empty} options={options} />);
    const select = screen.getByRole("combobox", { name: hours.label });
    expect(select.tagName).toBe("SELECT");
    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([hours.empty, ...hours.options]);
  });

  it("draws the lime chevron indicator, hidden from screen readers", () => {
    const { container } = render(<Select label={hours.label} name="hours" placeholder={hours.empty} options={options} />);
    const indicator = container.querySelector('span[aria-hidden="true"]');
    expect(indicator?.querySelector("svg")).not.toBeNull();
  });

  it("works from the keyboard", async () => {
    const user = userEvent.setup();
    render(<Select label={hours.label} name="hours" placeholder={hours.empty} options={options} />);
    await user.tab();
    const select = screen.getByRole("combobox", { name: hours.label });
    expect(select).toHaveFocus();
    await user.selectOptions(select, hours.options[1]);
    expect(select).toHaveValue(hours.options[1]);
  });

  it("links the error to the select", () => {
    const error = strings.common.errors.application.timeMissing;
    render(<Select label={hours.label} name="hours" placeholder={hours.empty} options={options} error={error} />);
    expect(screen.getByRole("combobox")).toHaveAccessibleDescription(error);
  });
});
