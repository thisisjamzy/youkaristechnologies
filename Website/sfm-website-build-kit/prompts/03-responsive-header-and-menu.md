# Prompt 3: Responsive site header, full-screen menu and hide-on-scroll

Paste everything below the line into Claude Code or Cursor, opened at the repository root `youkaristechnologies/`. It extends the `SiteHeader` widget from prompt 2. If the header is not built yet, build it with these rules from the start. If it is, refactor it.

---

The site header in `Website/sfm-website-build-kit/design-reference/_shared-site-header.html` shows only the desktop layout. Add the smaller-screen layout, a full-screen menu, and a header that hides while the reader scrolls down and returns when they scroll up. Follow `Website/web/CLAUDE.md`: every string comes from `strings.ts`, every value from `tokens.ts`, SCSS modules for styling, no new runtime dependencies.

## 1. Two layouts, one breakpoint

The switch is at the `laptop` token (1024px). Use the breakpoint mixin and tokens; never hard-code the number.

### Desktop, 1024px and wider (unchanged from the design reference)

Full logo (`Logo`, ink) on the left, the five links in the middle (Our Story, Pray, Give, Gather, Build With Us), the "Join the strangers" pill button with the lime arrow circle on the right.

### Tablet and phone, below 1024px

One row, about 64px tall, on the paper background:

| Left | Right |
| --- | --- |
| The **mark only** (`Mark`, ink, `public/brand/sfm-mark-ink.svg`), about 32px tall, linking home, with the accessible name "Strangers for Mary home". Never the full logo at this size, and never a redrawn or cropped logo. | A **small "Join us" button**, then the **menu button** (hamburger). |

- **"Join us" button:** pill, lime background, ink text, Barlow 700 at about 15px, height 40px, horizontal padding 16px. It links to the sign-up section (`/#join`) like the desktop button. It stays visible next to the menu button on every page.
- **Menu button:** 44 by 44px touch target, transparent background, three ink lines 22px wide (2px stroke, 6px apart). It is a real `<button>` with `aria-label` "Open menu", `aria-expanded`, and `aria-controls` pointing at the menu panel. When the menu is open, the lines animate into an X and the label becomes "Close menu".
- The five text links are hidden below 1024px. They live in the menu panel.

## 2. Full-screen menu (below 1024px)

A client component, `widgets/SiteHeader/ui/MobileMenu/`, opened by the menu button.

**Layout, top to bottom, on the paper background, filling the whole viewport (`100dvh`):**

1. **Top row**, identical to the closed header: the mark on the left, then "Join us" and the close button (the X) on the right, in exactly the same positions, so nothing jumps when the menu opens.
2. **The five links**, large and stacked: Nohemi Bold, about 40px on phones and 52px on tablets, ink, line height 1.1, 8px between items. Each link has a thin hairline (`#DDE2E8`) underneath and a small arrow on the right that turns lime on hover and focus. The current page's link gets a lime dot before it.
3. **The main button**, "Join the strangers", full width on phones, with the same pill and lime arrow circle as the desktop header button.
4. **Bottom area**: "PASS IT ON." in Barlow Condensed 500 with wide letter spacing (never Nohemi), the email `admin@strangersformary.org`, and the Instagram and WhatsApp icon links from the footer.

**Colour:** the menu stays on neutrals. Lime appears only on the "Join us" button, the main button's arrow circle, the current-page dot and the hover arrows. No brand pattern in the menu.

**Behaviour:**

- Opening: the panel fades in and slides down about 16px over 250ms (ease-out), and the links rise in with a 30ms stagger. Closing reverses it in 200ms. With `prefers-reduced-motion`, show and hide without movement.
- While open: lock page scroll (no layout shift: compensate for scrollbar width), make the rest of the page `inert`, and trap focus inside the panel. Focus moves to the first link on open and returns to the menu button on close.
- It closes on: the close button, Escape, choosing any link (including links to sections on the same page), route change, and the viewport growing to 1024px or wider.
- The panel is a `<nav>` with `aria-label` "Main" inside a dialog: `role="dialog"`, `aria-modal="true"`, labelled by the visually hidden heading "Menu".
- The header never hides while the menu is open.

## 3. Hide on scroll down, show on scroll up (all screen sizes)

The header is `position: sticky; top: 0` with `z-index` from tokens, on the paper background.

- **At the top of the page** (scroll position under the header's own height): always shown, with no border and no shadow, exactly like the design reference.
- **Scrolling down** (towards the footer) by more than 8px since the last direction change, and past the header height: the header slides up out of view (`transform: translateY(-100%)`, 250ms ease).
- **Scrolling up** (away from the footer) by more than 8px: it slides back in. Once scrolled away from the top, it shows a 1px hairline bottom border (`#DDE2E8`) so it separates from the content.
- **Always shown** when: the menu is open, keyboard focus is inside the header, or the page is not tall enough to scroll.
- Jumping to an in-page anchor (for example "Join us" to `#join`) should not leave the header covering the section: set `scroll-margin-top` on sections to the header height from tokens.
- With `prefers-reduced-motion`, show and hide instantly.
- Implement it as a hook in `shared/lib/hooks/useScrollDirection.ts` (or `useHideOnScroll`). It returns `{ hidden, atTop }`, reads `window.scrollY` inside `requestAnimationFrame` from one passive scroll listener, and never re-renders on every pixel: update state only when `hidden` or `atTop` actually changes. Use `transform` only (no `top` changes), so the browser does not re-layout.

## 4. Strings and tokens

Add these to `src/content/strings.ts` (they are also listed in `content/strings-master.md` under "Added for the build"):

```ts
common: {
  header: {
    homeLabel: "Strangers for Mary home",
    joinShort: "Join us",
    join: "Join the strangers",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menuTitle: "Menu",
  },
}
```

Add to `tokens.ts` (and regenerate): `layout.headerHeight` (desktop 88px, mobile 64px), `zIndex.header`, `zIndex.menu`, `motion.headerHide` (250ms), `motion.menuOpen` (250ms), `motion.menuClose` (200ms), `motion.stagger` (30ms), `easing.out`.

## 5. Tests

- Menu: opens and closes from the button, closes on Escape and on link click, sets `aria-expanded`, returns focus to the button, locks body scroll.
- `useScrollDirection`: hides after scrolling down past the threshold, shows after scrolling up, stays shown at the top and while the menu is open (simulate `scrollY` changes).
- Visual check at 390px, 768px, 1023px, 1024px and 1440px: mark plus "Join us" plus menu button below 1024px, the full design-reference header at 1024px and above, nothing overlapping or wrapping at 320px.

## 6. When you finish

Report what you built, anything that differs from this spec and why, and screenshots of the closed header and open menu at 390px and 768px.
