import { strings } from "@/content/strings";

/** The public site address: NEXT_PUBLIC_SITE_URL, or the address in strings. No trailing slash. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || strings.common.site.url).replace(/\/$/, "");
