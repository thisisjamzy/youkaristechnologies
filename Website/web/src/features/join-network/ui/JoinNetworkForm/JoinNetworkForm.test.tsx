import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { JoinNetworkForm } from "./JoinNetworkForm";

const { form, errors, places } = strings.common;
const { join } = strings.home;

afterEach(() => {
  vi.unstubAllGlobals();
});

function reply(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(form.fullName.label), "Mary Ndi");
  await user.type(screen.getByLabelText(form.baptismName.label), "Mary");
  await user.type(screen.getByLabelText(form.email.label), "mary@example.org");
  await user.type(screen.getByLabelText(form.parish.label), "St Anthony");
  await user.type(screen.getByLabelText(form.city.label), "Buea, Cameroon");
}

const submitButton = () => screen.getByRole("button", { name: join.form.submit });

describe("JoinNetworkForm", () => {
  it("reveals the core team questions when the box is ticked", async () => {
    const user = userEvent.setup();
    render(<JoinNetworkForm placesLeft={17} />);
    expect(screen.queryByRole("group", { name: join.form.teamsLegend })).toBeNull();
    await user.click(screen.getByRole("checkbox", { name: /Apply for the core team/ }));
    expect(screen.getByRole("group", { name: join.form.teamsLegend })).toBeInTheDocument();
    expect(screen.getByText(places.sentence(17))).toBeInTheDocument();
    expect(screen.getByLabelText(form.about.label)).toBeInTheDocument();
  });

  it("shows the messages from strings and focuses the first invalid field, without sending", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true });
    render(<JoinNetworkForm placesLeft={17} />);
    await user.type(screen.getByLabelText(form.email.label), "nope");
    await user.click(submitButton());
    expect(screen.getByLabelText(form.fullName.label)).toHaveAccessibleDescription(errors.fullNameMissing);
    expect(screen.getByLabelText(form.email.label)).toHaveAccessibleDescription(errors.emailInvalid);
    expect(screen.getByLabelText(form.fullName.label)).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("asks for a choice when both boxes are unticked", async () => {
    const user = userEvent.setup();
    reply({ ok: true });
    render(<JoinNetworkForm placesLeft={17} />);
    await fillValid(user);
    await user.click(screen.getByRole("checkbox", { name: /Join as a stranger/ }));
    await user.click(submitButton());
    expect(screen.getByText(errors.noChoice)).toBeInTheDocument();
  });

  it("sends the sign-up and shows the success state", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true, placesLeft: 17, coreTeamFull: false });
    render(<JoinNetworkForm placesLeft={17} />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("heading", { name: join.success.title })).toHaveFocus();
    // Only the thank-you and sharing: no way to reset the form or sign up another person.
    expect(screen.getByRole("link", { name: form.shareOnWhatsApp })).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByRole("textbox")).toBeNull();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/signup");
    expect(JSON.parse(init.body)).toMatchObject({ sourcePage: "home", email: "mary@example.org", joinAsStranger: true });
  });

  it("says Sending and blocks a second submit while waiting", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<JoinNetworkForm placesLeft={17} />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("button", { name: form.sending })).toBeDisabled();
  });

  it("says when the server fails, and keeps the form", async () => {
    const user = userEvent.setup();
    reply({ ok: false, error: "server" });
    render(<JoinNetworkForm placesLeft={17} />);
    await fillValid(user);
    await user.click(submitButton());
    expect(await screen.findByRole("alert")).toHaveTextContent(errors.server);
    expect(submitButton()).toBeEnabled();
  });

  it("asks people to wait when they are rate limited", async () => {
    const user = userEvent.setup();
    reply({ ok: false, error: "rate_limited" });
    render(<JoinNetworkForm placesLeft={17} />);
    await fillValid(user);
    await user.click(submitButton());
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent(errors.tooManyAttempts));
  });

  it("closes the core team option when no places are left", () => {
    render(<JoinNetworkForm placesLeft={0} />);
    expect(screen.getByRole("checkbox", { name: /Apply for the core team/ })).toBeDisabled();
    expect(screen.getByText(places.complete)).toBeInTheDocument();
  });
});
