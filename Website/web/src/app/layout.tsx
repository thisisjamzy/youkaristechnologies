import type { Metadata } from "next";
import { Providers } from "@/core/providers";
import { strings } from "@/content/strings";
import { fontVariables } from "@/styles/fonts";
import { ClosingCard, SiteFooter, SiteHeader } from "@/widgets";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

const { site, meta } = strings.common;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || site.url),
  title: meta.home.title,
  description: meta.home.description,
  applicationName: site.name,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <Providers>
          <SiteHeader />
          <main id="main">{children}</main>
          <ClosingCard />
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
