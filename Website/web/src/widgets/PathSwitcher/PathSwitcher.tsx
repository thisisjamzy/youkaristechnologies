import { cn, type PhotoName } from "@/shared/lib";
import { ArrowIcon, FolderCard, Heading, Photo, Text } from "@/shared/ui";
import styles from "./PathSwitcher.module.scss";

export type PathSwitcherItem = {
  href: string;
  photo: PhotoName;
  /** e.g. "Next: We give." from strings.<page>.switcher */
  title: string;
  text: string;
};

export type PathSwitcherProps = {
  items: readonly PathSwitcherItem[];
  className?: string;
};

/** Folder-tab cards linking to the other two paths (Pray, Give, Gather). */
export function PathSwitcher({ items, className }: PathSwitcherProps) {
  return (
    <div className={cn(styles.switcher, className)}>
      {items.map((item) => (
        <FolderCard key={item.href} href={item.href} bodyClassName={styles.body}>
          {/* Decorative: the title names the link. */}
          <Photo name={item.photo} alt="" height={55} radius="md" sizes="half" />
          <span className={styles.row}>
            <span>
              <Heading as="b" text={item.title} size="26" leading="1-2" tracking="snug" className={styles.title} />
              <Text as="span" size="15">
                {item.text}
              </Text>
            </span>
            <span className={styles.arrow}>
              <ArrowIcon direction="upRight" />
            </span>
          </span>
        </FolderCard>
      ))}
    </div>
  );
}
