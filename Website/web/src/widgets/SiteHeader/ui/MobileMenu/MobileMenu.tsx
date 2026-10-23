"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, type MouseEvent, type RefObject } from "react";
import { createPortal } from "react-dom";
import { strings } from "@/content/strings";
import { breakpoints } from "@/styles/tokens/tokens";
import { cn, externalLinks, routes } from "@/shared/lib";
import { ArrowIcon, Button, Icon, IconBox, Mark, SmartLink } from "@/shared/ui";
import { MenuButton } from "../MenuButton";
import styles from "./MobileMenu.module.scss";

const { header, footer } = strings.common;

export type MenuLink = { href: string; label: string };

export type MobileMenuProps = {
  id: string;
  links: readonly MenuLink[];
  /** Plays the closing animation; the header unmounts it afterwards. */
  closing: boolean;
  onClose: () => void;
  /** Where focus returns when the menu closes. */
  returnFocusTo: RefObject<HTMLElement | null>;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The full-screen menu below 1024px: a modal dialog over the page, which is made inert,
 * with focus trapped inside and the page scroll locked.
 */
export function MobileMenu({ id, links, closing, onClose, returnFocusTo }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const pathname = usePathname();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const returnTarget = returnFocusTo.current;

    // Lock scroll without a layout shift: keep the scrollbar's width as padding.
    const body = document.body;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const previous = { overflow: body.style.overflow, paddingRight: body.style.paddingRight };
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    // Everything else on the page is unreachable while the menu is open.
    const inerted = Array.from(body.children).filter(
      (el) => el !== panel.parentElement && !el.hasAttribute("inert"),
    );
    inerted.forEach((el) => el.setAttribute("inert", ""));

    panel.querySelector<HTMLElement>("nav a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Close when the window grows to the desktop layout.
    const desktop = window.matchMedia(`(min-width: ${breakpoints.laptop}px)`);
    const onResize = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    desktop.addEventListener("change", onResize);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
      inerted.forEach((el) => el.removeAttribute("inert"));
      body.style.overflow = previous.overflow;
      body.style.paddingRight = previous.paddingRight;
      returnTarget?.focus();
    };
  }, [onClose, returnFocusTo]);

  // Choosing any link closes the menu, including links to a section of this page.
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) onClose();
  };

  return createPortal(
    <div className={styles.portal}>
      {/* Link clicks bubble here to close the menu; keyboard users activate the links themselves. */}
      <div
        ref={panelRef}
        id={id}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(styles.panel, closing && styles.closing)}
        onClick={onClick}
      >
        <h2 id={titleId} className={styles.title}>
          {header.menuTitle}
        </h2>

        <div className={styles.top}>
          <Link href={routes.home} aria-label={header.homeAria} className={styles.home}>
            <Mark size="header" />
          </Link>
          <div className={styles.actions}>
            <Button href={routes.join} size="compact">
              {header.joinShort}
            </Button>
            <MenuButton open label={header.closeMenu} controls={id} onClick={onClose} />
          </div>
        </div>

        <div className={styles.body}>
          <nav aria-label={header.navAria}>
            <ul className={styles.links}>
              {links.map((link) => {
                const current = pathname === link.href;
                return (
                  <li key={link.href} className={styles.item}>
                    <Link
                      href={link.href}
                      className={cn(styles.link, current && styles.current)}
                      aria-current={current ? "page" : undefined}
                    >
                      <span className={styles.label}>{link.label}</span>
                      <ArrowIcon direction="upRight" size="lg" className={styles.arrow} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Button href={routes.join} variant="outline" arrow="right" className={styles.cta}>
            {header.cta}
          </Button>

          <div className={styles.footer}>
            {/* Barlow Condensed 500 beside the brand, never the logo's Nohemi. */}
            <p className={styles.slogan}>{footer.slogan}</p>
            <SmartLink href={externalLinks.email} className={styles.email}>
              {footer.contact.email}
            </SmartLink>
            <div className={styles.social}>
              <SmartLink href={externalLinks.instagram} aria-label={footer.social.instagramAria}>
                <IconBox size="lg">
                  <Icon name="instagram" />
                </IconBox>
              </SmartLink>
              <SmartLink href={externalLinks.whatsAppChannel} aria-label={footer.social.whatsAppAria}>
                <IconBox size="lg">
                  <Icon name="whatsApp" />
                </IconBox>
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
