"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useId, useRef, useState, type FocusEvent } from "react";
import { strings } from "@/content/strings";
import { layout, motion } from "@/styles/tokens/tokens";
import { useHideOnScroll } from "@/shared/hooks";
import { cn, routes } from "@/shared/lib";
import { Button, Logo, Mark } from "@/shared/ui";
import { NavLinks } from "./NavLinks";
import { MenuButton } from "./ui/MenuButton";
import { MobileMenu } from "./ui/MobileMenu";
import styles from "./SiteHeader.module.scss";

const { header } = strings.common;

const nav = [
  { href: routes.ourStory, label: header.nav.ourStory },
  { href: routes.pray, label: header.nav.pray },
  { href: routes.give, label: header.nav.give },
  { href: routes.gather, label: header.nav.gather },
  { href: routes.buildWithUs, label: header.nav.buildWithUs },
] as const;

type MenuPhase = "closed" | "open" | "closing";

/**
 * The site header. From 1024px: the design reference (logo, links, join button).
 * Below: the mark, "Join us" and a menu button that opens a full-screen menu.
 * It hides while scrolling down and returns on scrolling up.
 */
export function SiteHeader() {
  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [focusInside, setFocusInside] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const menuId = useId();
  const pathname = usePathname();
  const [shownPath, setShownPath] = useState(pathname);

  const menuOpen = phase !== "closed";
  const { hidden, atTop } = useHideOnScroll({ offset: layout.headerHeight, forceShow: menuOpen || focusInside });

  const openMenu = () => {
    clearTimeout(closeTimer.current);
    setPhase("open");
  };

  // Stable, so the menu's setup (scroll lock, focus) does not re-run on every render.
  const closeMenu = useCallback(() => {
    setPhase((p) => (p === "open" ? "closing" : p));
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPhase("closed"), motion.menuClose);
  }, []);

  // A route change closes the menu (adjusting state during render, not in an effect).
  if (pathname !== shownPath) {
    setShownPath(pathname);
    if (phase !== "closed") setPhase("closed");
  }

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocusInside(false);
  };

  return (
    <>
      <header
        className={cn(styles.header, hidden && styles.hidden, !atTop && styles.scrolled)}
        onFocus={() => setFocusInside(true)}
        onBlur={onBlur}
      >
        <div className={styles.inner}>
          <Link href={routes.home} aria-label={header.homeAria} className={cn(styles.home, styles.desktopOnly)}>
            <Logo alt={header.logoAlt} priority />
          </Link>
          <Link href={routes.home} aria-label={header.homeAria} className={cn(styles.home, styles.mobileOnly)}>
            <Mark size="header" />
          </Link>

          <nav aria-label={header.navAria} className={cn(styles.nav, styles.desktopOnly)}>
            <NavLinks items={nav} />
          </nav>
          <Button href={routes.join} variant="outline" arrow="right" className={styles.desktopOnly}>
            {header.cta}
          </Button>

          <div className={cn(styles.actions, styles.mobileOnly)}>
            <Button href={routes.join} size="compact">
              {header.joinShort}
            </Button>
            <MenuButton
              ref={menuButtonRef}
              open={false}
              label={header.openMenu}
              controls={menuId}
              onClick={openMenu}
            />
          </div>
        </div>
      </header>
      {menuOpen && (
        <MobileMenu
          id={menuId}
          links={nav}
          closing={phase === "closing"}
          onClose={closeMenu}
          returnFocusTo={menuButtonRef}
        />
      )}
    </>
  );
}
