import { strings } from "@/content/strings";
import { externalLinks, routes } from "@/shared/lib";
import { Icon, IconBox, Logo, SmartLink, type IconName } from "@/shared/ui";
import styles from "./SiteFooter.module.scss";

const { footer } = strings.common;

const social: { href: string; label: string; icon: IconName }[] = [
  { href: externalLinks.instagram, label: footer.social.instagramAria, icon: "instagram" },
  { href: externalLinks.whatsAppChannel, label: footer.social.whatsAppAria, icon: "whatsApp" },
  { href: externalLinks.email, label: footer.social.emailAria, icon: "mail" },
];

const columns = [
  {
    title: footer.explore.title,
    links: [
      { href: routes.ourStory, label: footer.explore.ourStory },
      { href: routes.pray, label: footer.explore.pray },
      { href: routes.give, label: footer.explore.give },
      { href: routes.gather, label: footer.explore.gather },
    ],
  },
  {
    title: footer.getInvolved.title,
    links: [
      { href: routes.join, label: footer.getInvolved.join },
      { href: routes.buildWithUs, label: footer.getInvolved.buildWithUs },
    ],
  },
  {
    title: footer.contact.title,
    links: [
      { href: externalLinks.email, label: footer.contact.email },
      { href: externalLinks.instagram, label: footer.contact.instagram },
      { href: externalLinks.whatsAppChannel, label: footer.contact.whatsApp },
    ],
  },
];

/** Logo, slogan, social links, the site map and the small print, on every page. */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <Logo alt={footer.logoAlt} size="lg" />
          <p className={styles.slogan}>{footer.slogan}</p>
          <div className={styles.social}>
            {social.map((item) => (
              <SmartLink key={item.label} href={item.href} aria-label={item.label} className={styles.socialLink}>
                <IconBox size="lg">
                  <Icon name={item.icon} />
                </IconBox>
              </SmartLink>
            ))}
          </div>
        </div>
        <nav aria-label={footer.navAria} className={styles.nav}>
          {columns.map((column) => (
            <div key={column.title} className={styles.column}>
              <p className={styles.columnTitle}>{column.title}</p>
              {column.links.map((link) => (
                <SmartLink key={link.label} href={link.href} className={styles.link}>
                  {link.label}
                </SmartLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>{footer.copyright}</p>
        <SmartLink href={externalLinks.privacyPolicy} className={styles.privacy}>
          {footer.privacyPolicy}
        </SmartLink>
      </div>
    </footer>
  );
}
