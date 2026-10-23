import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TokenPreview } from "./_components/TokenPreview";
import { UiShowcase } from "./_components/UiShowcase";

// Internal preview of tokens and shared UI. Not linked, not in the sitemap, 404 in production.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <UiShowcase />
      <TokenPreview />
    </>
  );
}
