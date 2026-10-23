import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { PlacesBadge } from "./PlacesBadge";

describe("PlacesBadge", () => {
  it("shows the live number", () => {
    render(<PlacesBadge left={17} />);
    expect(screen.getByText("17")).toBeInTheDocument();
    expect(screen.getByText(strings.common.places.ofTotal, { exact: false })).toBeInTheDocument();
  });

  it("hides itself when the number is unknown", () => {
    const { container } = render(<PlacesBadge left={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("says the team is complete when no places are left", () => {
    render(<PlacesBadge left={0} />);
    expect(screen.getByText(strings.common.places.complete)).toBeInTheDocument();
  });
});
