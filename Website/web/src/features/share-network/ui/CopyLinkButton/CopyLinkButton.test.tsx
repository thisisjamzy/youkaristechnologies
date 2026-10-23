import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { CopyLinkButton } from "./CopyLinkButton";

const { closingCard, site } = strings.common;

const renderButton = () =>
  render(<CopyLinkButton url={site.url} label={closingCard.copyLink} copiedLabel={closingCard.linkCopied} />);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CopyLinkButton", () => {
  it("copies the site link and says so", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    renderButton();
    await user.click(screen.getByRole("button", { name: closingCard.copyLink }));
    expect(writeText).toHaveBeenCalledWith(site.url);
    expect(await screen.findByRole("button", { name: closingCard.linkCopied })).toBeInTheDocument();
  });

  it("keeps its label when the clipboard is blocked", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    renderButton();
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAccessibleName(closingCard.copyLink);
  });
});
