/**
 * THE single source of every design value.
 *
 * `npm run tokens` (also run on predev, prebuild and pretest) turns this file into:
 * - `_tokens.generated.scss`: CSS custom properties on :root plus SCSS maps for mixins
 * - `tailwind-theme.generated.css`: the Tailwind v4 @theme block
 *
 * Values come from the design reference in Website/sfm-website-build-kit/design-reference/.
 * Never hard-code a colour, size, radius, shadow or breakpoint elsewhere; add it here.
 */

/** A fluid value: clamp(min, vw, max). Sizes in px. */
export type Fluid = { min: number; vw: number; max: number };

const fluid = (min: number, vw: number, max: number): Fluid => ({ min, vw, max });

export const colors = {
  // Brand
  lime: "#D1FF42", // one large lime element per screen, primary buttons, tags. Never text on light grounds
  limeDeep: "#C2F032", // decorative circle on lime cards
  ink: "#0A0F1A", // text, dark buttons, the one dark closing card
  inkRaised: "#141B2B", // raised surfaces on ink
  blue: "#0251B0", // links, small pills, numbers, second line of the slogan
  mist: "#C7D1DD", // borders and hairlines on light grounds
  // Neutral
  paper: "#F7F8F5", // page background
  white: "#FFFFFF", // cards
  mistTint: "#EEF1F4", // soft panels, closing band, form panel
  hairline: "#DDE2E8", // card borders, dividers
  inkBorder: "#2A3346", // borders on ink
  glass: "rgba(255, 255, 255, 0.8)", // frosted card on photos
  // Text
  textPrimary: "#0A0F1A",
  textBody: "#4A5468", // body copy on light grounds
  textLongform: "#2E3748", // Our Story reading column
  textMuted: "#8A94A6", // second clause of two-tone headlines only (large text)
  textPlaceholder: "#6B7488", // input placeholders and underlines
  textOnDarkMuted: "#A3AEC0",
} as const;

export const fonts = {
  // The next/font CSS variables are declared in src/styles/fonts.ts.
  display: "var(--font-nohemi), 'Barlow Condensed', sans-serif",
  body: "var(--font-barlow), 'Helvetica Neue', sans-serif",
  label: "var(--font-barlow-condensed), 'Arial Narrow', sans-serif",
} as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;

/** Font sizes. Named roles from the brief, then every other size the reference uses. */
export const fontSizes = {
  // Fluid roles
  displayXl: fluid(44, 6, 84), // page headlines
  displayL: fluid(36, 4.8, 68), // statements (ambition, who we are)
  headingL: fluid(36, 4.4, 60), // section headings
  headingM: fluid(32, 3.6, 48), // sub-section headings
  titleM: fluid(22, 2.4, 30), // card headings
  // Other fluid sizes in the reference (min-max, vw)
  "fluid-120-200": fluid(120, 16, 200),
  "fluid-48-100": fluid(48, 7, 100),
  "fluid-44-88": fluid(44, 6, 88),
  "fluid-40-88": fluid(40, 6, 88),
  "fluid-48-84": fluid(48, 6, 84),
  "fluid-40-76": fluid(40, 5.4, 76),
  "fluid-36-64": fluid(36, 4.6, 64),
  "fluid-34-60": fluid(34, 4.4, 60),
  "fluid-34-56": fluid(34, 4.2, 56),
  "fluid-34-52": fluid(34, 3.8, 52),
  "fluid-32-52": fluid(32, 3.8, 52),
  "fluid-30-44": fluid(30, 3.4, 44),
  "fluid-28-40": fluid(28, 3, 40),
  "fluid-26-40": fluid(26, 3, 40),
  "fluid-28-38": fluid(28, 3, 38),
  "fluid-24-34": fluid(24, 2.6, 34),
  "fluid-24-32": fluid(24, 2.4, 32),
  // Fixed sizes
  "104": 104,
  "88": 88,
  "56": 56,
  "48": 48,
  "44": 44,
  "28": 28,
  "26": 26,
  "24": 24,
  "22": 22,
  "20": 20,
  "19": 19,
  "18": 18, // lead
  "17": 17, // body, buttons
  "16": 16, // body
  "15": 15,
  "14": 14, // small, labels
  "13": 13,
} as const;

export const lineHeights = {
  "0-85": 0.85,
  "0-9": 0.9,
  "0-95": 0.95,
  "0-98": 0.98,
  "1": 1,
  "1-02": 1.02,
  "1-04": 1.04,
  "1-05": 1.05,
  "1-08": 1.08,
  "1-1": 1.1,
  "1-2": 1.2,
  "1-3": 1.3,
  "1-35": 1.35,
  "1-4": 1.4,
  "1-5": 1.5,
  "1-55": 1.55,
  "1-6": 1.6,
  "1-65": 1.65,
  "1-7": 1.7,
  "1-75": 1.75,
} as const;

export const letterSpacings = {
  tightest: "-0.05em",
  tighter: "-0.04em",
  tightPlus: "-0.035em",
  tight: "-0.03em",
  snugPlus: "-0.025em",
  snug: "-0.02em",
  label: "1.5px", // uppercase labels and tags
  labelNarrow: "1px",
  slogan: "5px", // "PASS IT ON." beside the logo
  sloganWide: "6px",
} as const;

/**
 * Spacing on a 4px unit, matching Tailwind v4's `--spacing` so `gap-6` and
 * `var(--space-6)` are both 24px. Keys are units (decimals become `_`, e.g. `--space-2_5` = 10px).
 */
export const spaceUnit = 4;
export const spaceSteps = [
  // Gaps and padding
  0, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 9.5, 10, 10.5,
  11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 16, 18, 20, 24, 26, 28, 30,
  // Box sizes: card minimums, grid column minimums, photo heights, overlay widths
  29.5, 37.5, 40, 47.5, 50, 52.5, 55, 60, 65, 70, 75, 80, 82.5, 85, 90, 95, 100, 105, 110, 115, 120, 125,
  130, 140,
] as const;

/** Fluid spacing used for section rhythm and panel padding. */
export const fluidSpace = {
  section: fluid(96, 12, 160), // gap between sections
  sectionLarge: fluid(112, 14, 184), // before statements and closes
  opening: fluid(32, 5, 64), // top of the opening section
  "fluid-96-152": fluid(96, 12, 152),
  "fluid-96-140": fluid(96, 12, 140),
  "fluid-80-128": fluid(80, 10, 128),
  "fluid-48-96": fluid(48, 7, 96),
  "fluid-48-88": fluid(48, 7, 88),
  "fluid-48-80": fluid(48, 6, 80),
  "fluid-40-72": fluid(40, 6, 72),
  "fluid-40-64": fluid(40, 5, 64),
  "fluid-20-36": fluid(20, 3, 36),
  // Panel padding
  "fluid-24-36": fluid(24, 3, 36),
  "fluid-24-40": fluid(24, 3.5, 40),
  "fluid-24-44": fluid(24, 3.5, 44),
  "fluid-28-48": fluid(28, 4, 48),
  "fluid-28-56": fluid(28, 4, 56),
  "fluid-28-56-5": fluid(28, 5, 56),
  "fluid-28-64": fluid(28, 5, 64),
  "fluid-32-56": fluid(32, 5, 56),
} as const;

/** Fluid photo heights. Fixed heights use the space scale (e.g. space(105) = 420px). */
export const fluidSizes = {
  hero: fluid(360, 44, 600), // Home opening photo
  feature: fluid(340, 40, 560), // Pray and Give opening photos
  wide: fluid(400, 48, 640), // Home gather photo
  team: fluid(340, 42, 560), // Build With Us team photo
  story: fluid(320, 40, 540), // Our Story campus photo
} as const;

export const radii = {
  "2xs": 2,
  xs: 4,
  s: 8,
  sm: 12,
  "sm-plus": 14,
  md: 16,
  "md-plus": 18,
  lg: 20,
  "lg-plus": 22,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
  "4xl": 44,
  pill: 999,
} as const;

export const borderWidths = {
  hairline: 1, // card borders, dividers
  input: 1.5, // input underlines, outline buttons
  strong: 2, // link underline, emphasised rules
} as const;

/** Width of the tab on folder-tab cards, as a share of the card. */
export const folderTabs = {
  narrow: "40%", // path switcher
  mid: "44%", // team cards
  wide: "46%", // lime places cards
} as const;

/** Icon sizes (px) and stroke widths, for SVG attributes. */
export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 30,
  xxl: 48,
} as const;

export const iconStrokes = {
  thin: 1.8, // line icons in boxes
  regular: 2,
  bold: 2.4, // arrows
  heavy: 2.6, // checks and chevrons
} as const;

export const shadows = {
  float: "0 24px 48px rgba(10, 15, 26, 0.08)", // cards overlapping photos
} as const;

export const blurs = {
  glass: 14,
} as const;

export const opacities = {
  pattern: 0.1, // the lime pattern on the dark closing card
  faint: 0.25,
} as const;

export const layout = {
  container: 1200,
  gutter: 24,
  minTouch: 44,
} as const;

/** Reading widths (max-width) used in the reference. */
export const measures = {
  "340": 340,
  "360": 360,
  "380": 380,
  "560": 560,
  "600": 600,
  "620": 620,
  "640": 640,
  "660": 660,
  "688": 688,
  "900": 900,
  "940": 940,
  "960": 960,
  "980": 980,
} as const;

/** Mobile-first breakpoints (min-width, px). */
export const breakpoints = {
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

export const focusRing = {
  width: 2,
  offset: 3,
} as const;

export const tokens = {
  colors,
  fonts,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacings,
  spaceUnit,
  spaceSteps,
  fluidSpace,
  fluidSizes,
  radii,
  borderWidths,
  folderTabs,
  iconSizes,
  iconStrokes,
  shadows,
  blurs,
  opacities,
  layout,
  measures,
  breakpoints,
  focusRing,
} as const;

export type Tokens = typeof tokens;
export type ColorName = keyof typeof colors;
export type BreakpointName = keyof typeof breakpoints;
export type SpaceStep = (typeof spaceSteps)[number];
export type FluidSpaceName = keyof typeof fluidSpace;
export type FluidSizeName = keyof typeof fluidSizes;
export type FontSizeName = keyof typeof fontSizes;
export type LineHeightName = keyof typeof lineHeights;
export type LetterSpacingName = keyof typeof letterSpacings;
export type RadiusName = keyof typeof radii;
export type MeasureName = keyof typeof measures;
export type IconSize = keyof typeof iconSizes;
