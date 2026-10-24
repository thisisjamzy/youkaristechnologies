import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fluidSizes } from "@/styles/tokens/tokens";
import { Photo } from "./Photo";

describe("Photo", () => {
  // Every fluid size must map to a real class, including camelCase names like chapterPair.
  it.each(Object.keys(fluidSizes))("has a height class for the %s size", (size) => {
    const { container } = render(<Photo name="massAltar" alt="" height={size as keyof typeof fluidSizes} />);
    const kebab = size.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    expect(container.firstElementChild).toHaveClass(`h-${kebab}`);
  });
});
