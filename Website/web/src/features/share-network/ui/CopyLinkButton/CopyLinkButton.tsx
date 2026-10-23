"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/shared/ui";

export type CopyLinkButtonProps = {
  /** The address to copy, normally strings.common.site.url. */
  url: string;
  label: string;
  copiedLabel: string;
  variant?: ButtonProps["variant"];
  className?: string;
};

/** Copies the site link; the label changes to "Link copied" and is announced. */
export function CopyLinkButton({ url, label, copiedLabel, variant = "ghost", className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard can be blocked (permissions, insecure context). Leave the label as it is.
    }
  };

  return (
    <span aria-live="polite">
      <Button variant={variant} onClick={copy} className={className}>
        {copied ? copiedLabel : label}
      </Button>
    </span>
  );
}
