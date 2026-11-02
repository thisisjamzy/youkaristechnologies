import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { findRole, type RoleId } from "@/entities/role";
import { ApplyForRoleForm } from "./ApplyForRoleForm";

const { form: common, errors } = strings.common;
const { form, success } = strings.roles.application;

afterEach(() => {
  vi.unstubAllGlobals();
});

function reply(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>, roleId: RoleId) {
  await user.type(screen.getByLabelText(common.fullName.label), "Mary Ndi");
  await user.type(screen.getByLabelText(common.baptismName.label), "Mary");
  await user.type(screen.getByLabelText(common.phone.label), "+237 6 70 00 00 00");
  await user.type(screen.getByLabelText(common.email.label), "mary@example.org");
  await user.type(screen.getByLabelText(common.parish.label), "St Anthony");
  await user.type(screen.getByLabelText(common.city.label), "Buea, Cameroon");
  for (const q of findRole(roleId)!.application.questions) await user.type(screen.getByLabelText(q.text), "My answer");
  const cv = document.querySelector<HTMLInputElement>('input[name="cv"]')!;
  await user.upload(cv, new File(["%PDF-1.7"], "mary-cv.pdf", { type: "application/pdf" }));
  await user.selectOptions(screen.getByRole("combobox", { name: form.hours.label }), "4 to 6 hours");
  await user.click(screen.getByRole("checkbox", { name: /I understand this is an unpaid volunteer role/ }));
  await user.click(screen.getByRole("checkbox", { name: form.confirmSunday }));
  await user.click(screen.getByRole("checkbox", { name: form.confirmRosary }));
}

const submit = () => screen.getByRole("button", { name: form.submit });

describe("ApplyForRoleForm", () => {
  it("lists all 19 roles as Title (Team) and reports a change", async () => {
    const user = userEvent.setup();
    const onRoleChange = vi.fn();
    render(<ApplyForRoleForm roleId={null} onRoleChange={onRoleChange} />);
    const select = screen.getByRole("combobox", { name: form.role.label });
    expect(screen.getAllByRole("option", { name: /\(.+\)$/ })).toHaveLength(19);
    expect(screen.getByRole("option", { name: "Logistics Officer (Outreach)" })).toBeInTheDocument();
    await user.selectOptions(select, "logistics-officer");
    expect(onRoleChange).toHaveBeenCalledWith("logistics-officer");
  });

  it("swaps the questions and the link field when the role changes", () => {
    const { rerender } = render(<ApplyForRoleForm roleId="logistics-officer" />);
    const logistics = findRole("logistics-officer")!;
    const designer = findRole("brand-and-graphic-designer")!;
    expect(screen.getByLabelText(logistics.application.questions[1].text)).toBeInTheDocument();
    expect(screen.getByLabelText(logistics.application.linkLabel)).not.toBeRequired();
    rerender(<ApplyForRoleForm roleId="brand-and-graphic-designer" />);
    expect(screen.queryByLabelText(logistics.application.questions[1].text)).toBeNull();
    expect(screen.getByLabelText(designer.application.questions[1].text)).toBeInTheDocument();
    expect(screen.getByLabelText(designer.application.linkLabel)).toBeRequired();
  });

  it("shows every message and focuses the first invalid field, without sending", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true });
    render(<ApplyForRoleForm roleId="brand-and-graphic-designer" />);
    await user.click(submit());
    expect(screen.getByLabelText(common.fullName.label)).toHaveFocus();
    expect(screen.getByLabelText(common.fullName.label)).toHaveAccessibleDescription(errors.fullNameMissing);
    expect(screen.getByText(errors.application.linkMissing)).toBeInTheDocument();
    expect(screen.getByText(errors.application.cvMissing)).toBeInTheDocument();
    expect(screen.getByText(errors.application.timeMissing)).toBeInTheDocument();
    expect(screen.getByText(errors.application.unpaidNotConfirmed)).toBeInTheDocument();
    expect(screen.getByText(errors.application.sundayNotConfirmed)).toBeInTheDocument();
    expect(screen.getByText(errors.application.rosaryNotConfirmed)).toBeInTheDocument();
    expect(screen.getAllByText(errors.application.answerMissing)).toHaveLength(3);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks for a role first when none is chosen", async () => {
    const user = userEvent.setup();
    reply({ ok: true });
    render(<ApplyForRoleForm roleId={null} />);
    expect(screen.getByText(form.noRole)).toBeInTheDocument();
    await user.click(submit());
    expect(screen.getByRole("combobox", { name: form.role.label })).toHaveFocus();
    expect(screen.getByText(errors.application.roleMissing)).toBeInTheDocument();
  });

  it("shows the character count only past 2500 characters", async () => {
    const user = userEvent.setup();
    render(<ApplyForRoleForm roleId="logistics-officer" />);
    const answer = screen.getByLabelText(findRole("logistics-officer")!.application.questions[0].text);
    await user.click(answer);
    await user.paste("a".repeat(2499));
    expect(screen.queryByText(/\/ 3000$/)).toBeNull();
    await user.type(answer, "b");
    expect(answer).toHaveAccessibleDescription("2500 / 3000");
  });

  it("sends multipart form data with the CV, then shows only the thank-you", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true });
    render(<ApplyForRoleForm roleId="logistics-officer" />);
    await fillValid(user, "logistics-officer");
    await user.click(submit());
    expect(await screen.findByRole("heading", { name: success.title })).toHaveFocus();
    expect(screen.getByText(success.body)).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/apply");
    const body = init.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("roleId")).toBe("logistics-officer");
    expect((body.get("cv") as File).name).toBe("mary-cv.pdf");
    expect(body.get("confirmUnpaid")).toBe("on");
    expect(body.get("joinAsStranger")).toBe("on");
  });

  it("says Sending and blocks a second submit while waiting", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<ApplyForRoleForm roleId="logistics-officer" />);
    await fillValid(user, "logistics-officer");
    await user.click(submit());
    expect(await screen.findByRole("button", { name: common.sending })).toBeDisabled();
  });

  it.each([
    ["applications_closed", errors.application.applicationsClosed],
    ["role_closed", errors.application.roleClosed],
    ["server", errors.application.server],
    ["rate_limited", errors.tooManyAttempts],
  ])("explains a %s answer and keeps the form", async (error, message) => {
    const user = userEvent.setup();
    reply({ ok: false, error });
    render(<ApplyForRoleForm roleId="logistics-officer" />);
    await fillValid(user, "logistics-officer");
    await user.click(submit());
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(message));
    expect(submit()).toBeEnabled();
  });

  it("shows the server's field errors", async () => {
    const user = userEvent.setup();
    reply({ ok: false, error: "validation", fields: { cv: "too_large" } });
    render(<ApplyForRoleForm roleId="logistics-officer" />);
    await fillValid(user, "logistics-officer");
    await user.click(submit());
    expect(await screen.findByText(errors.application.cvTooLarge)).toBeInTheDocument();
  });
});
