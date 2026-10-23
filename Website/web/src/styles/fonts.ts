import { Barlow, Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import { fontSizes } from "./tokens/tokens";

// The CSS variable names here are what tokens.ts `fonts` refers to.

/** Nohemi Bold: all headlines and big numbers. */
const nohemi = localFont({
  src: "../assets/fonts/Nohemi-Bold.ttf",
  weight: "700",
  display: "swap",
  variable: "--font-nohemi",
  fallback: ["Barlow Condensed", "sans-serif"],
});

/** Barlow: body, buttons, form text. */
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-barlow",
});

/** Barlow Condensed: uppercase labels, tags, small numbers, the slogan beside the logo. */
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-barlow-condensed",
});

export type FontRole = "display" | "body" | "label";

export type FontInfo = { className: string; variable: string; family: string };

const info = (font: typeof nohemi): FontInfo => ({
  className: font.className,
  variable: font.variable,
  family: font.style.fontFamily,
});

export const fonts = {
  display: info(nohemi),
  body: info(barlow),
  label: info(barlowCondensed),
  scale: fontSizes,
} as const;

export type Fonts = typeof fonts;

/** Class names that declare the three font CSS variables, for <html>. */
export const fontVariables = [nohemi.variable, barlow.variable, barlowCondensed.variable].join(" ");
