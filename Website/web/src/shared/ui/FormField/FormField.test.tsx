import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { FormField } from "./FormField";

const { email } = strings.common.form;

describe("FormField", () => {
  it("labels the input", () => {
    render(<FormField label={email.label} name="email" type="email" placeholder={email.placeholder} />);
    const input = screen.getByLabelText(email.label);
    expect(input).toHaveAttribute("name", "email");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("shows the error under the field and links it to the input", () => {
    const error = strings.common.errors.emailInvalid;
    render(<FormField label={email.label} name="email" error={error} />);
    const input = screen.getByLabelText(email.label);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(error);
  });
});
