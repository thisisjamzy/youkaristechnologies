"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Team } from "@/entities/role";
import { RoleBrowser } from "./RoleBrowser";

/**
 * The role list with its filter in the URL (`?team=technology`), so a filtered view can be
 * shared. Rendered inside Suspense: the fallback is the same list showing every role.
 */
export function RoleBrowserFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onPickTeam = (picked: Team | undefined) => {
    const next = new URLSearchParams(params.toString());
    if (picked) next.set("team", picked.slug);
    else next.delete("team");
    const query = next.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  return <RoleBrowser search={params.toString()} onPickTeam={onPickTeam} />;
}
