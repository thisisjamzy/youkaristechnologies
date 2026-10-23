/** The four core teams. Display text lives in strings.common.teams under these ids. */
export const teamIds = ["strangerRelations", "outreach", "coreAndContent", "technology"] as const;

export type TeamId = (typeof teamIds)[number];

/**
 * The names the backend accepts (ALLOWED_TEAMS in Website/apps-script/Code.gs). Kept apart from
 * the display strings so a copy edit can never break the API.
 */
export const teamApiNames: Record<TeamId, string> = {
  strangerRelations: "Stranger Relations",
  outreach: "Outreach",
  coreAndContent: "Core and Content",
  technology: "Technology",
};
