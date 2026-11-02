"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { findRole, type RoleId } from "@/entities/role";
import { APPLY_HEADING_ID, ApplicationPanel } from "./ApplicationPanel";

/**
 * The application with the chosen role in the URL (`?role=…`), so "Apply for this role" and a
 * shared link both arrive with the role already chosen. Rendered inside Suspense: the
 * fallback is the same panel with no role.
 */
export function ApplicationPanelFromUrl() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const roleId = findRole(params.get("role"))?.id ?? null;

  // Arriving from "Apply for this role" (…#apply): move focus to the form's heading.
  useEffect(() => {
    if (roleId && window.location.hash === "#apply") {
      document.getElementById(APPLY_HEADING_ID)?.focus();
    }
  }, [roleId]);

  const onRoleChange = (next: RoleId | null) => {
    const query = new URLSearchParams(params.toString());
    if (next) query.set("role", next);
    else query.delete("role");
    const search = query.toString();
    router.replace(`${pathname}${search ? `?${search}` : ""}`, { scroll: false });
  };

  return <ApplicationPanel roleId={roleId} onRoleChange={onRoleChange} />;
}
