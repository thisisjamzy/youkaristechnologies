import type { Metadata } from "next";
import { strings } from "@/content/strings";
import { routes } from "@/shared/lib";
import { Button, Heading, Section } from "@/shared/ui";
import styles from "./not-found.module.scss";

const { notFound } = strings.common.meta;

export const metadata: Metadata = { title: notFound.title, robots: { index: false } };

export default function NotFound() {
  return (
    <Section top="sectionLarge" bottom="sectionLarge" className={styles.section}>
      <Heading as="h1" text={notFound.title} size="headingL" leading="1-02" />
      <Button href={routes.home} arrow="right">
        {notFound.link}
      </Button>
    </Section>
  );
}
