import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { SiteHeader } from "./SiteHeader";

vi.mock("next/navigation", () => ({ usePathname: () => "/pray" }));

const { header } = strings.common;

beforeEach(() => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
});

function setup() {
  const user = userEvent.setup();
  // Something else on the page, to check it becomes inert.
  const main = document.createElement("main");
  document.body.appendChild(main);
  render(<SiteHeader />);
  return { user, main, menuButton: () => screen.getByRole("button", { name: header.openMenu }) };
}

const dialog = () => screen.queryByRole("dialog", { name: header.menuTitle });

describe("SiteHeader menu", () => {
  it("opens from the menu button, focuses the first link and locks the page", async () => {
    const { user, main, menuButton } = setup();
    expect(menuButton()).toHaveAttribute("aria-expanded", "false");
    await user.click(menuButton());

    expect(dialog()).toBeInTheDocument();
    expect(dialog()).toHaveAttribute("aria-modal", "true");
    expect(within(dialog()!).getByRole("navigation", { name: header.navAria })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: header.nav.ourStory }).at(-1)).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");
    expect(main).toHaveAttribute("inert");
  });

  it("marks the current page", async () => {
    const { user, menuButton } = setup();
    await user.click(menuButton());
    const pray = screen.getAllByRole("link", { name: header.nav.pray }).at(-1);
    expect(pray).toHaveAttribute("aria-current", "page");
  });

  it("closes on Escape and returns focus to the menu button", async () => {
    const { user, main, menuButton } = setup();
    await user.click(menuButton());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(dialog()).toBeNull());
    expect(menuButton()).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(main).not.toHaveAttribute("inert");
  });

  it("closes when a link is chosen", async () => {
    const { user, menuButton } = setup();
    await user.click(menuButton());
    await user.click(screen.getAllByRole("link", { name: header.nav.give }).at(-1)!);
    await waitFor(() => expect(dialog()).toBeNull());
  });

  it("closes from the X", async () => {
    const { user, menuButton } = setup();
    await user.click(menuButton());
    await user.click(screen.getByRole("button", { name: header.closeMenu }));
    await waitFor(() => expect(dialog()).toBeNull());
  });

  it("keeps focus inside the menu", async () => {
    const { user, menuButton } = setup();
    await user.click(menuButton());
    const panel = dialog()!;
    for (let i = 0; i < 20; i++) {
      await user.tab();
      expect(panel.contains(document.activeElement)).toBe(true);
    }
  });
});
