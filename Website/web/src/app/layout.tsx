import type { Metadata } from "next";
import { Providers } from "@/core/providers";
import { strings } from "@/content/strings";
import { fontVariables } from "@/styles/fonts";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

const { site, meta } = strings.common;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: meta.home.title,
  description: meta.home.description,
  applicationName: site.name,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
