import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SmartLink } from "./SmartLink";

describe("SmartLink", () => {
  it("opens external links in a new tab safely", () => {
    render(<SmartLink href="https://wa.me/?text=hi">Share</SmartLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it.each(["/pray", "#join", "mailto:admin@strangersformary.org"])("keeps %s in the same tab", (href) => {
    render(<SmartLink href={href}>Go</SmartLink>);
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });
});
