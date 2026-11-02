import Link from "next/link";
import { strings } from "@/content/strings";
import type { Role } from "@/entities/role";
import { Heading, Icon, Label } from "@/shared/ui";
import styles from "./RolesSection.module.scss";

const { card } = strings.roles.list;

export type RoleCardProps = {
  role: Role;
  /** Where "Apply for this role" goes: this page with `?role=…#apply`. */
  applyHref: string;
};

/** One role: team, title and summary, the full description behind a disclosure, and its two actions. */
export function RoleCard({ role, applyHref }: RoleCardProps) {
  return (
    <article className={styles.card} aria-labelledby={`role-${role.id}`}>
      <span className={styles.tab} aria-hidden="true" />
      <div className={styles.body}>
        <Label tone="blue">{role.team}</Label>
        <Heading as="h3" id={`role-${role.id}`} text={role.title} size="28" leading="1-05" tracking="snug" />
        <p className={styles.summary}>{role.summary}</p>

        {/* Native disclosure: keyboard, focus and the open state are announced for free. */}
        <details className={styles.details}>
          <summary className={styles.more}>
            <span className={styles.moreClosed}>{card.more}</span>
            <span className={styles.moreOpen}>{card.less}</span>
            <span className={styles.moreIcon} aria-hidden="true">
              <Icon name="plus" size="xs" stroke="heavy" />
            </span>
          </summary>
          <div className={styles.full}>
            <Label size="13" tone="primary">
              {card.team}
            </Label>
            <p className={styles.paragraph}>{role.teamDescription}</p>
            <Label size="13" tone="primary">
              {card.role}
            </Label>
            <p className={styles.paragraph}>{role.purpose}</p>
            <Label size="13" tone="primary">
              {card.responsibilities}
            </Label>
            <ChevronList items={role.responsibilities} />
            <Label size="13" tone="primary">
              {card.requirements}
            </Label>
            <ChevronList items={role.requirements} />
            <p className={styles.reports}>
              <b>{card.reportsTo}</b> {role.reportsTo}
            </p>
          </div>
        </details>

        <div className={styles.actions}>
          <a href={role.pdf} download className={styles.download}>
            {card.downloadPdf}
          </a>
          <Link href={applyHref} className={styles.apply}>
            {card.apply}
          </Link>
        </div>
      </div>
    </article>
  );
}

function ChevronList({ items }: { items: readonly string[] }) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li key={item} className={styles.listItem}>
          <span className={styles.chevron}>
            <Icon name="chevronRight" size="2xs" stroke="heaviest" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
