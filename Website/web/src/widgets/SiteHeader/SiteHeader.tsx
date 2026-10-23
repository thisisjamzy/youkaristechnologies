import Link from "next/link";
import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, Logo } from "@/shared/ui";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.scss";

const { header } = strings.common;

const nav = [
  { href: routes.ourStory, label: header.nav.ourStory },
  { href: routes.pray, label: header.nav.pray },
  { href: routes.give, label: header.nav.give },
  { href: routes.gather, label: header.nav.gather },
  { href: routes.buildWithUs, label: header.nav.buildWithUs },
] as const;

const SPACE = " ";

/**
 * The coming soon banner, then the logo, main navigation and the join button, on every page.
 * Wraps onto lines on phones.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.banner}>
        <p className={styles.bannerInner}>
          <span className={styles.bannerLabel}>{header.banner.label}</span>
          {SPACE}
          <span>{header.banner.text}</span>
          {SPACE}
          <Link href={routes.join} className={styles.bannerLink}>
            {header.banner.link}
          </Link>
        </p>
      </div>
      <div className={styles.inner}>
        <Link href={routes.home} aria-label={header.homeAria} className={styles.home}>
          <Logo alt={header.logoAlt} priority />
        </Link>
        <nav aria-label={header.navAria} className={styles.nav}>
          <NavLinks items={nav} />
        </nav>
        <Button href={routes.join} variant="outline" arrow="right">
          {header.cta}
        </Button>
      </div>
    </header>
  );
}
