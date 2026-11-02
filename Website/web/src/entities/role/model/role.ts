import { rolesData } from "@/content/roles";

export type Role = (typeof rolesData.roles)[number];
export type RoleId = Role["id"];
export type RoleQuestion = Role["application"]["questions"][number];
export type NatureItem = (typeof rolesData.nature)[number];

export const roles: readonly Role[] = rolesData.roles;
export const natureOfTheWork: readonly NatureItem[] = rolesData.nature;

/** Every role id, for schemas (a non-empty tuple, as z.enum needs). */
export const roleIds = rolesData.roles.map((role) => role.id) as [RoleId, ...RoleId[]];

/**
 * The four teams, in the order of the filter on the Roles page. `slug` goes in the URL
 * (`?team=technology`), `key` names its label in strings.roles.list.filters, `name` matches
 * `role.team` in the data.
 */
export const teams = [
  { slug: "core-and-content", key: "coreAndContent", name: "Core and Content" },
  { slug: "technology", key: "technology", name: "Technology" },
  { slug: "stranger-relations", key: "strangerRelations", name: "Stranger Relations" },
  { slug: "outreach", key: "outreach", name: "Outreach" },
] as const satisfies readonly { slug: string; key: string; name: Role["team"] }[];

export type Team = (typeof teams)[number];
export type TeamSlug = Team["slug"];

/** The role with this id, or undefined (unknown ids, and the appointed Core and Content Lead). */
export function findRole(id: string | null | undefined): Role | undefined {
  return roles.find((role) => role.id === id);
}

/** The team for a `?team=` value, or undefined for "All roles" and unknown values. */
export function findTeam(slug: string | null | undefined): Team | undefined {
  return teams.find((team) => team.slug === slug);
}

/** Roles in one team, or all of them. */
export function rolesInTeam(team: Team | undefined): readonly Role[] {
  return team ? roles.filter((role) => role.team === team.name) : roles;
}
