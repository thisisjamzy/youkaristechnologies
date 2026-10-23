import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TokenPreview } from "./_components/TokenPreview";

// Internal preview of tokens and (from phase 4) shared UI. Not linked, not in the sitemap.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <TokenPreview />;
}
