import type { Metadata } from "next";
import { Providers } from "@/core/providers";
import { strings } from "@/content/strings";
import { fontVariables } from "@/styles/fonts";
import "@/styles/tailwind.css";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(strings.site.url),
  title: strings.site.name,
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
