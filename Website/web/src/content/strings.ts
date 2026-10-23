// The single source of every user-facing string. Filled in phase 3.
export const strings = {
  site: {
    name: "Strangers for Mary",
    slogan: "PASS IT ON.",
    url: "https://www.strangersformary.org",
    email: "admin@strangersformary.org",
  },
} as const;

export type Strings = typeof strings;
