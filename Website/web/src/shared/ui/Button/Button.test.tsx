import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button that calls onClick, type button by default", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Count me in</Button>);
    const button = screen.getByRole("button", { name: "Count me in" });
    expect(button).toHaveAttribute("type", "button");
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("can be a submit button", () => {
    render(<Button type="submit">Apply for a place</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders a link when given href", () => {
    render(<Button href="#join">Join the strangers</Button>);
    expect(screen.getByRole("link", { name: "Join the strangers" })).toHaveAttribute("href", "#join");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("adds a decorative arrow circle only when asked", () => {
    const { container, rerender } = render(<Button href="/pray">See</Button>);
    expect(container.querySelector("svg")).toBeNull();
    rerender(
      <Button href="/pray" arrow="right">
        See
      </Button>,
    );
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("link")).toHaveAccessibleName("See");
  });

  it("applies the variant and block classes", () => {
    render(
      <Button variant="dark" block type="submit">
        Send
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("dark", "block");
  });
});
