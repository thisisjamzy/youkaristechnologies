import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { CheckboxGroup } from "./CheckboxGroup";

const { teams } = strings.common;
const options = Object.entries(teams).map(([value, team]) => ({ value, label: team.name }));
const legend = strings.home.join.form.teamsLegend;

describe("CheckboxGroup", () => {
  it("is a fieldset named by its legend", () => {
    render(<CheckboxGroup legend={legend} name="team" options={options} value={[]} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: legend })).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(4);
  });

  it("adds and removes values", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <CheckboxGroup legend={legend} name="team" options={options} value={[]} onChange={onChange} />,
    );
    await userEvent.click(screen.getByLabelText(teams.outreach.name));
    expect(onChange).toHaveBeenLastCalledWith(["outreach"]);

    rerender(<CheckboxGroup legend={legend} name="team" options={options} value={["outreach", "technology"]} onChange={onChange} />);
    expect(screen.getByLabelText(teams.technology.name)).toBeChecked();
    await userEvent.click(screen.getByLabelText(teams.outreach.name));
    expect(onChange).toHaveBeenLastCalledWith(["technology"]);
  });

  it("describes the group with its error", () => {
    const error = strings.common.errors.noChoice;
    render(<CheckboxGroup legend={legend} name="team" options={options} value={[]} onChange={() => {}} error={error} />);
    expect(screen.getByRole("group")).toHaveAccessibleDescription(error);
  });
});
