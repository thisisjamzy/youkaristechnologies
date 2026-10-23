import type { MeasureName } from "@/styles/tokens/tokens";
import type { RichLine, TwoTone } from "@/shared/types";
import { cn } from "@/shared/lib";
import { Heading } from "../Heading";
import { Label } from "../Label";
import { PullLine } from "../PullLine";
import { Text } from "../Text";
import styles from "./StatementBlock.module.scss";

export type StatementBlockProps = {
  label?: string;
  headline: string | TwoTone;
  body?: string;
  /** Closing line, e.g. `{ main: "It starts with one Rosary.", emphasis: "Yours." }`. */
  closing?: RichLine;
  headingMeasure?: MeasureName;
  bodyMeasure?: MeasureName;
  /** 26px gap (Who we are, Why now) or 28px (Ambition). */
  gap?: "md" | "lg";
  className?: string;
};

/** Centred two-tone statement. `<StatementBlock {...strings.home.ambition} headingMeasure="980" />` */
export function StatementBlock({
  label,
  headline,
  body,
  closing,
  headingMeasure = "940",
  bodyMeasure = "660",
  gap = "lg",
  className,
}: StatementBlockProps) {
  return (
    <div className={cn(styles.block, styles[gap], className)}>
      {label && <Label>{label}</Label>}
      <Heading text={headline} size="displayL" leading="1-04" measure={headingMeasure} />
      {body && (
        <Text variant="lead" size="19" leading="1-65" measure={bodyMeasure}>
          {body}
        </Text>
      )}
      {closing && <PullLine text={closing} tone="primary" secondTone="badge" align="center" />}
    </div>
  );
}
