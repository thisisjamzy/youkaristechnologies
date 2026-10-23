/** A two-tone headline from strings.ts: main clause in ink, second clause muted. */
export type TwoTone = { readonly main: string; readonly muted: string };

/** A two-part line from strings.ts whose second part is styled by the component. */
export type Emphasis = { readonly main: string; readonly emphasis: string };

/** Anything a Heading or PullLine can render. */
export type RichLine = string | TwoTone | Emphasis;
