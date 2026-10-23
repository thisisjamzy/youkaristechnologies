import type { Metadata } from "next";
import { strings } from "@/content/strings";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(strings.site.url),
  title: strings.site.name,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
