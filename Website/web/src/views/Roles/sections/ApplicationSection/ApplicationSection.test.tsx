import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { findRole } from "@/entities/role";
import { ApplicationPanelFromUrl } from "./ApplicationPanelFromUrl";

const nav = vi.hoisted(() => ({ search: "", replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(nav.search),
  usePathname: () => "/volunteer/roles",
  useRouter: () => ({ replace: nav.replace, push: vi.fn(), prefetch: vi.fn() }),
}));

const { application } = strings.roles;
const roleSelect = () => screen.getByRole("combobox", { name: application.form.role.label });

beforeEach(() => {
  nav.search = "";
  nav.replace.mockReset();
  window.location.hash = "";
});

describe("ApplicationPanelFromUrl", () => {
  it("asks for a role when none is chosen", () => {
    render(<ApplicationPanelFromUrl />);
    expect(roleSelect()).toHaveValue("");
    expect(screen.getByText(application.form.noRole)).toBeInTheDocument();
    expect(screen.queryByText(application.downloadDescription)).toBeNull();
  });

  it("preselects the role from ?role=, shows its questions and moves focus to the heading", () => {
    const role = findRole("backend-engineer")!;
    nav.search = `role=${role.id}`;
    window.location.hash = "#apply";
    render(<ApplicationPanelFromUrl />);
    expect(roleSelect()).toHaveValue(role.id);
    for (const q of role.application.questions) expect(screen.getByLabelText(q.text)).toBeRequired();
    expect(screen.getByRole("link", { name: application.downloadDescription })).toHaveAttribute("href", role.pdf);
    expect(screen.getByRole("heading", { level: 2 })).toHaveFocus();
  });

  it("does not move focus when the page is opened without #apply", () => {
    nav.search = "role=backend-engineer";
    render(<ApplicationPanelFromUrl />);
    expect(screen.getByRole("heading", { level: 2 })).not.toHaveFocus();
  });

  it("ignores an unknown role and the appointed Core and Content Lead", () => {
    nav.search = "role=core-and-content-lead-and-network-chaplain";
    render(<ApplicationPanelFromUrl />);
    expect(roleSelect()).toHaveValue("");
  });

  it("puts a role chosen in the dropdown in the URL", async () => {
    const user = userEvent.setup();
    nav.search = "team=technology";
    render(<ApplicationPanelFromUrl />);
    await user.selectOptions(roleSelect(), "logistics-officer");
    expect(nav.replace).toHaveBeenCalledWith("/volunteer/roles?team=technology&role=logistics-officer", { scroll: false });
  });
});
