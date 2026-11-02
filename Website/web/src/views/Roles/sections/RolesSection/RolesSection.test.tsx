import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { findRole } from "@/entities/role";
import { RoleBrowserFromUrl } from "./RoleBrowserFromUrl";
import { RoleCard } from "./RoleCard";

const nav = vi.hoisted(() => ({ search: "", replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => "/volunteer/roles",
  useRouter: () => ({ replace: nav.replace, push: vi.fn(), prefetch: vi.fn() }),
}));

const { list } = strings.roles;
const backend = findRole("backend-engineer")!;

beforeEach(() => {
  nav.search = "";
  nav.replace.mockReset();
});

describe("RoleCard", () => {
  it("shows team, title and summary, with no tags", () => {
    render(<RoleCard role={backend} applyHref="/x" />);
    const card = screen.getByRole("article", { name: backend.title });
    expect(within(card).getByText(backend.team)).toBeInTheDocument();
    expect(within(card).getByText(backend.summary)).toBeInTheDocument();
    expect(card).not.toHaveTextContent(/Team lead|Pivotal role|Training provided|Experience required/);
  });

  // Browsers open a native <summary> with Enter and Space and announce it as expanded or
  // collapsed; jsdom does not run that keyboard behaviour, so this checks focus and activation.
  it("is a focusable native disclosure that opens and closes", async () => {
    const user = userEvent.setup();
    const { container } = render(<RoleCard role={backend} applyHref="/x" />);
    const details = container.querySelector("details")!;
    const summary = container.querySelector("summary")!;
    expect(details.open).toBe(false);
    await user.tab();
    expect(summary).toHaveFocus();
    await user.click(summary);
    expect(details.open).toBe(true);
    expect(screen.getByText(backend.purpose)).toBeInTheDocument();
    await user.click(summary);
    expect(details.open).toBe(false);
  });

  it("downloads the role's own PDF and links to its application", () => {
    render(<RoleCard role={backend} applyHref="/volunteer/roles?role=backend-engineer#apply" />);
    expect(screen.getByRole("link", { name: list.card.downloadPdf })).toHaveAttribute("href", "/roles/backend-engineer.pdf");
    expect(screen.getByRole("link", { name: list.card.downloadPdf })).toHaveAttribute("download");
    expect(screen.getByRole("link", { name: list.card.apply })).toHaveAttribute(
      "href",
      "/volunteer/roles?role=backend-engineer#apply",
    );
  });
});

describe("RoleBrowserFromUrl", () => {
  it("shows every role with All roles pressed by default", () => {
    render(<RoleBrowserFromUrl />);
    expect(screen.getAllByRole("article")).toHaveLength(19);
    expect(screen.getByRole("button", { name: list.filters.all })).toHaveAttribute("aria-pressed", "true");
  });

  it("puts the chosen team in the URL", async () => {
    const user = userEvent.setup();
    render(<RoleBrowserFromUrl />);
    await user.click(screen.getByRole("button", { name: list.filters.technology }));
    expect(nav.replace).toHaveBeenCalledWith("/volunteer/roles?team=technology", { scroll: false });
  });

  it("filters from the URL and keeps the filter in each Apply link", () => {
    nav.search = "team=outreach";
    render(<RoleBrowserFromUrl />);
    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(5);
    expect(screen.getByRole("button", { name: list.filters.outreach })).toHaveAttribute("aria-pressed", "true");
    expect(within(cards[0]).getByRole("link", { name: list.card.apply })).toHaveAttribute(
      "href",
      "/volunteer/roles?team=outreach&role=marketing-and-partnerships-lead#apply",
    );
  });

  it("clears the team for All roles", async () => {
    const user = userEvent.setup();
    nav.search = "team=outreach&role=logistics-officer";
    render(<RoleBrowserFromUrl />);
    await user.click(screen.getByRole("button", { name: list.filters.all }));
    expect(nav.replace).toHaveBeenCalledWith("/volunteer/roles?role=logistics-officer", { scroll: false });
  });
});
