import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Heading } from "./Heading";

describe("Heading", () => {
  it("renders a two-tone headline as one heading with an Elite Blue second clause", () => {
    render(<Heading as="h1" text={{ main: "Sunday is easy.", muted: "Monday is where we lose." }} />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Sunday is easy. Monday is where we lose.");
    expect(screen.getByText("Monday is where we lose.")).toHaveClass("accent");
  });

  it("keeps the grey second clause when asked, for the dark closing card", () => {
    render(<Heading as="p" text={{ main: "Now pass it on.", muted: "We pray." }} secondTone="muted" />);
    expect(screen.getByText("We pray.")).toHaveClass("muted");
  });

  it("styles an emphasis part with the chosen tone", () => {
    render(<Heading as="p" text={{ main: "It starts with one Rosary.", emphasis: "Yours." }} secondTone="badge" />);
    expect(screen.getByText("Yours.")).toHaveClass("badge");
  });

  it("can break the line before the second part", () => {
    const { container } = render(
      <Heading text={{ main: "Whoever identifies with her,", emphasis: "identifies with us." }} breakBefore />,
    );
    expect(container.querySelector("br")).not.toBeNull();
  });

  it("renders a plain string without a second span", () => {
    const { container } = render(<Heading text="We pray." />);
    expect(container.querySelector("h2 span")).toBeNull();
  });
});
