import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { strings } from "@/content/strings";
import { ApplyCoreTeamForm } from "./ApplyCoreTeamForm";

const { form, errors, teams, places } = strings.common;
const copy = strings.buildWithUs.form;

afterEach(() => {
  vi.unstubAllGlobals();
});

function reply(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(Response.json(body));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(form.fullName.label), "Paul Ebai");
  await user.type(screen.getByLabelText(form.baptismName.label), "Paul");
  await user.type(screen.getByLabelText(form.email.label), "paul@example.org");
  await user.type(screen.getByLabelText(form.parish.label), "St Anthony");
  await user.type(screen.getByLabelText(form.city.label), "Buea, Cameroon");
}

describe("ApplyCoreTeamForm", () => {
  it("always applies, with the chosen teams", async () => {
    const user = userEvent.setup();
    const fetchMock = reply({ ok: true, placesLeft: 16, coreTeamFull: false });
    render(<ApplyCoreTeamForm placesLeft={17} />);
    await fillValid(user);
    await user.click(screen.getByLabelText(teams.outreach.name));
    await user.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByRole("heading", { name: copy.success.title })).toBeInTheDocument();
    // Only the thank-you: no button to reset the form or sign up another person.
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
      sourcePage: "build-with-us",
      applyCoreTeam: true,
      joinAsStranger: true,
      teams: ["outreach"],
    });
  });

  it("does not show the thank-you when the team turned out to be full", async () => {
    const user = userEvent.setup();
    reply({ ok: true, placesLeft: 0, coreTeamFull: true });
    render(<ApplyCoreTeamForm placesLeft={1} />);
    await fillValid(user);
    await user.click(screen.getByRole("button", { name: copy.submit }));
    expect(await screen.findByRole("alert")).toHaveTextContent(errors.applicationsClosed);
    expect(screen.queryByRole("heading", { name: copy.success.title })).toBeNull();
    expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();
  });

  it("is closed when no places are left", () => {
    render(<ApplyCoreTeamForm placesLeft={0} />);
    expect(screen.getByRole("button", { name: copy.submit })).toBeDisabled();
    expect(screen.getByText(places.complete)).toBeInTheDocument();
  });

  it("shows the interview note without a number when places are unknown", () => {
    render(<ApplyCoreTeamForm placesLeft={null} />);
    expect(screen.getByText(form.interviewNote)).toBeInTheDocument();
  });
});
