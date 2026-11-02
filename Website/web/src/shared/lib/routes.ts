/** Every page and in-page anchor the site links to. */
export const routes = {
  home: "/",
  ourStory: "/our-story",
  pray: "/pray",
  give: "/give",
  gather: "/gather",
  volunteer: "/volunteer",
  roles: "/volunteer/roles",
  /** The role cards on the Roles page. */
  rolesList: "/volunteer/roles#roles",
  /** The join form on Home. */
  join: "/#join",
} as const;

export type RouteName = keyof typeof routes;

/**
 * Outside links. The design marks Instagram, the WhatsApp channel and the privacy policy
 * "[link to add]": they stay "#" until the owner supplies them. Do not launch with "#".
 */
export const externalLinks = {
  instagram: "#", // TODO: Instagram profile URL
  whatsAppChannel: "#", // TODO: WhatsApp channel URL
  privacyPolicy: "#", // TODO: privacy policy page or document
  email: "mailto:admin@strangersformary.org",
} as const;
