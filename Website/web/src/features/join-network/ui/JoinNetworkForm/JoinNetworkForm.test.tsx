import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { JoinNetworkForm } from "./JoinNetworkForm";

const { form, errors } = strings.common;
const { join } = strings.home;

afterEach(() => {
  vi.unstubAllGlobals();
});

function reply(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

const emailField = () => screen.getByLabelText(new RegExp(`^${form.email.label}`));

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(form.baptismName.label), "Mary");
  await user.type(screen.getByLabelText(form.phone.label), "+237 6 70 00 00 00");
  await user.type(screen.getByLabelText(form.parish.label), "St Anthony");
  await user.type(screen.getByLabelText(form.city.label), "Buea, Cameroon");
}

const submitButton = () => screen.getByRole("button", { name: join.form.submit });

describe("JoinNetworkForm", () => {
  it("asks for the baptism name and phone, never a full name, WhatsApp or core team", () => {
    render(<JoinNetworkForm />);
    expect(screen.getByLabelText(form.phone.label)).toHaveAttribute("type", "tel");
    expect(screen.getByLabelText(form.phone.label)).toBeRequired();
    expect(emailField()).not.toBeRequired();
    expect(screen.queryByLabelText(form.fullName.label)).toBeNull();
    expect(screen.queryByText(/WhatsApp number/)).toBeNull();
    expect(screen.queryByRole("checkbox", { name: /core team/ })).toBeNull();
    expect(screen.getAllByRole("checkbox")).toHaveLength(1);
  });

  it("keeps Join as a stranger ticked", async () => {
    const user = userEvent.setup();
    render(<JoinNetworkForm />);
    const box = screen.getByRole("checkbox", { name: /Join as a stranger/ });
    expect(box).toBeChecked();
    await user.click(box);
    expect(box).toBeChecked();
  });

  it("points volunteers to the roles page", () => {
    render(<JoinNetworkForm />);
    expect(screen.getByText(join.form.volunteer.text, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: join.form.volunteer.link })).toHaveAttribute("href", "/volunteer/roles");
  });

  it("shows the messages from strings and focuses the first invalid field, without sending", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true });
    render(<JoinNetworkForm />);
    await user.type(emailField(), "nope");
    await user.click(submitButton());
    expect(screen.getByLabelText(form.baptismName.label)).toHaveAccessibleDescription(errors.baptismNameMissing);
    expect(screen.getByLabelText(form.phone.label)).toHaveAccessibleDescription(errors.phoneMissing);
    expect(emailField()).toHaveAccessibleDescription(errors.emailInvalid);
    expect(screen.getByLabelText(form.baptismName.label)).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("says when the phone number does not look right", async () => {
    const user = userEvent.setup();
    reply({ ok: true });
    render(<JoinNetworkForm />);
    await fillValid(user);
    await user.clear(screen.getByLabelText(form.phone.label));
    await user.type(screen.getByLabelText(form.phone.label), "call me");
    await user.click(submitButton());
    expect(screen.getByLabelText(form.phone.label)).toHaveAccessibleDescription(errors.phoneInvalid);
  });

  it("sends the sign-up without an email and shows the success state", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true });
    render(<JoinNetworkForm />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("heading", { name: join.success.title })).toHaveFocus();
    // Only the thank-you and sharing: no way to reset the form or sign up another person.
    expect(screen.getByRole("link", { name: form.shareOnWhatsApp })).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByRole("textbox")).toBeNull();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/signup");
    expect(JSON.parse(init.body)).toEqual({
      sourcePage: "home",
      baptismName: "Mary",
      phone: "+237 6 70 00 00 00",
      parish: "St Anthony",
      city: "Buea, Cameroon",
      email: "",
      joinAsStranger: true,
      website: "",
    });
  });

  it("says Sending and blocks a second submit while waiting", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<JoinNetworkForm />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("button", { name: form.sending })).toBeDisabled();
  });

  it("says when the server fails, and keeps the form", async () => {
    const user = userEvent.setup();
    reply({ ok: false, error: "server" });
    render(<JoinNetworkForm />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(errors.server);
    expect(submitButton()).toBeEnabled();
  });

  it("asks people to wait when they are rate limited", async () => {
    const user = userEvent.setup();
    reply({ ok: false, error: "rate_limited" });
    render(<JoinNetworkForm />);
    await fillValid(user);
    await user.click(submitButton());
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(errors.tooManyAttempts));
  });
});
