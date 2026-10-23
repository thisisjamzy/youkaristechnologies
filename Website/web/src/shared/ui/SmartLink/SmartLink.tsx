import Link from "next/link";
import type { ReactNode } from "react";

export type SmartLinkProps = {
  href: string;
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

/** Routes inside the site ("/pray") go through next/link; anchors, mailto and external URLs do not. */
export const isInternal = (href: string) => href.startsWith("/");

const isExternal = (href: string) => /^https?:\/\//.test(href);

/** One link element for the whole site, so every component links the same way. */
export function SmartLink({ href, children, ...rest }: SmartLinkProps) {
  if (isInternal(href)) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })} {...rest}>
      {children}
    </a>
  );
}
