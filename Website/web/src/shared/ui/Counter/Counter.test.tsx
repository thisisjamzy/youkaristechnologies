import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { Counter } from "./Counter";

describe("Counter", () => {
  it("reads as one phrase: number then caption", () => {
    const { container } = render(<Counter value={17} caption={strings.common.places.ofTotal} />);
    expect(container.firstChild).toHaveTextContent("17 of 20 places still open");
    expect(screen.getByText("17")).toHaveClass("value");
  });
});
