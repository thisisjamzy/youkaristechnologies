// Vitest stand-in for next/font, which is a Next.js compile-time transform.
type Options = { variable?: string };

const font = (name: string) => (options: Options = {}) => ({
  className: `font-${name}`,
  variable: options.variable ?? `--font-${name}`,
  style: { fontFamily: name },
});

export const Barlow = font("barlow");
export const Barlow_Condensed = font("barlow-condensed");
export default font("local");
