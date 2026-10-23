import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { strings } from "@/content/strings";
import { Accordion } from "./Accordion";

const items = strings.pray.questions.items;

describe("Accordion", () => {
  it("renders every question closed", () => {
    const { container } = render(<Accordion items={items} />);
    const details = container.querySelectorAll("details");
    expect(details).toHaveLength(items.length);
    details.forEach((d) => expect(d).not.toHaveAttribute("open"));
  });

  it("opens an answer when its question is clicked", async () => {
    const { container } = render(<Accordion items={items} />);
    await userEvent.click(screen.getByText(items[0].question));
    expect(container.querySelector("details")).toHaveAttribute("open");
  });

  it("keeps the + icon out of the accessible text", () => {
    render(<Accordion items={items} />);
    expect(screen.getByText(items[0].question).querySelector('[aria-hidden="true"]')).not.toBeNull();
  });
});
