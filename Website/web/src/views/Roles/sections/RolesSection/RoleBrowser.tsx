"use client";

import { strings } from "@/content/strings";
import { findTeam, rolesInTeam, teams, type RoleId, type Team } from "@/entities/role";
import { cn, routes } from "@/shared/lib";
import { RoleCard } from "./RoleCard";
import styles from "./RolesSection.module.scss";

const { list } = strings.roles;

export type RoleBrowserProps = {
  /** The current query string (without "?"), so links keep the filter. */
  search: string;
  /** Without it (before the page is interactive), the filter buttons do nothing. */
  onPickTeam?: (team: Team | undefined) => void;
};

/** "Apply for this role": this page with the role chosen, landing on the form. */
export function applyHref(search: string, roleId: RoleId): string {
  const query = new URLSearchParams(search);
  query.set("role", roleId);
  return `${routes.roles}?${query.toString()}#apply`;
}

/** The team filter and the grid of role cards. */
export function RoleBrowser({ search, onPickTeam }: RoleBrowserProps) {
  const team = findTeam(new URLSearchParams(search).get("team"));
  const filters = [{ key: "all" as const, team: undefined }, ...teams.map((t) => ({ key: t.key, team: t }))];
  return (
    <>
      <div role="group" aria-label={list.filterAria} className={styles.filters}>
        {filters.map((filter) => {
          const pressed = filter.team?.slug === team?.slug;
          return (
            <button
              key={filter.key}
              type="button"
              aria-pressed={pressed}
              className={cn(styles.filter, pressed && styles.filterOn)}
              onClick={() => onPickTeam?.(filter.team)}
            >
              {list.filters[filter.key]}
            </button>
          );
        })}
      </div>
      <div className={styles.grid}>
        {rolesInTeam(team).map((role) => (
          <RoleCard key={role.id} role={role} applyHref={applyHref(search, role.id)} />
        ))}
      </div>
    </>
  );
}
