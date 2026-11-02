import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { rolesData } from "@/content/roles";
import { findRole, findTeam, roles, rolesInTeam, teams } from "./role";

const KIT = resolve(__dirname, "../../../../../sfm-website-build-kit");
const json = JSON.parse(readFileSync(resolve(KIT, "content/roles.json"), "utf8"));

describe("roles data", () => {
  it("is the kit's roles.json, unchanged", () => {
    expect(rolesData).toEqual({ nature: json.nature, roles: json.roles });
  });

  it("has 19 roles in four teams, each with three questions and a PDF in public/roles", () => {
    expect(roles).toHaveLength(19);
    for (const role of roles) {
      expect(teams.map((t) => t.name)).toContain(role.team);
      expect(role.application.questions).toHaveLength(3);
      expect(existsSync(resolve(__dirname, "../../../../public", `.${role.pdf}`))).toBe(true);
    }
  });

  it("never offers a combined PDF of all roles", () => {
    expect(new Set(roles.map((r) => r.pdf)).size).toBe(roles.length);
  });
});

describe("role lookup", () => {
  it("finds a role by id", () => {
    expect(findRole("logistics-officer")?.title).toBe("Logistics Officer");
  });

  it("rejects unknown ids and the appointed Core and Content Lead", () => {
    expect(findRole("catering-manager")).toBeUndefined();
    expect(findRole("core-and-content-lead-and-network-chaplain")).toBeUndefined();
    expect(findRole(null)).toBeUndefined();
  });

  it("filters by team slug, and shows all roles for no or an unknown team", () => {
    expect(rolesInTeam(findTeam("technology")).every((r) => r.team === "Technology")).toBe(true);
    expect(rolesInTeam(findTeam("technology"))).toHaveLength(5);
    expect(rolesInTeam(findTeam("nope"))).toHaveLength(19);
  });
});
