import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { FileInput } from "./FileInput";

const { cv } = strings.roles.application.form;

const renderInput = (error?: string) =>
  render(
    <FileInput
      label={cv.label}
      name="cv"
      buttonLabel={cv.upload}
      changeLabel={cv.change}
      emptyLabel={cv.empty}
      hint={cv.hint}
      accept=".pdf,.doc,.docx"
      error={error}
    />,
  );

describe("FileInput", () => {
  it("keeps a real file input in the page, named by the label and the file state", () => {
    const { container } = renderInput();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAccessibleName(`${cv.label} ${cv.empty}`);
    expect(input).toHaveAccessibleDescription(cv.hint);
    expect(screen.getByText(cv.upload)).toBeInTheDocument();
  });

  it("is reachable with the keyboard", async () => {
    const user = userEvent.setup();
    const { container } = renderInput();
    await user.tab();
    expect(container.querySelector('input[type="file"]')).toHaveFocus();
  });

  it("shows the chosen file name and offers to change it", async () => {
    const user = userEvent.setup();
    const { container } = renderInput();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    await user.upload(input, new File(["%PDF-1.7"], "mary-cv.pdf", { type: "application/pdf" }));
    expect(screen.getByText("mary-cv.pdf")).toBeInTheDocument();
    expect(screen.getByText(cv.change)).toBeInTheDocument();
    expect(input).toHaveAccessibleName(`${cv.label} mary-cv.pdf`);
  });

  it("links the error to the input", () => {
    const error = strings.common.errors.application.cvMissing;
    const { container } = renderInput(error);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(`${cv.hint} ${error}`);
  });
});
