import type { ReactNode } from "react";
import { cn } from "@/shared/lib";
import { ArrowIcon } from "../ArrowIcon";
import { SmartLink } from "../SmartLink";
import styles from "./ArrowLink.module.scss";

export type ArrowLinkProps = {
  href: string;
  /** Text-only secondary links ("Help us build it") have no arrow. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

/** Secondary link: bold ink text with a lime underline. `<ArrowLink href="/pray">{link}</ArrowLink>` */
export function ArrowLink({ href, arrow = true, className, children }: ArrowLinkProps) {
  return (
    <SmartLink href={href} className={cn(styles.link, className)}>
      {children}
      {arrow && <ArrowIcon size="sm" />}
    </SmartLink>
  );
}
