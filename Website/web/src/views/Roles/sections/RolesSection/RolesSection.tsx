import { Suspense } from "react";
import { strings } from "@/content/strings";
import { Heading, Section, SplitHeader } from "@/shared/ui";
import { RoleBrowser } from "./RoleBrowser";
import { RoleBrowserFromUrl } from "./RoleBrowserFromUrl";
import styles from "./RolesSection.module.scss";

const { list } = strings.roles;

export function RolesSection() {
  return (
    <Section top="section" id="roles">
      <SplitHeader aside={list.body} className={styles.header}>
        <Heading text={list.headline} size="headingL" leading="1-02" />
      </SplitHeader>
      {/* Before the URL is read: every role, each linking to the application with that role chosen. */}
      <Suspense fallback={<RoleBrowser search="" />}>
        <RoleBrowserFromUrl />
      </Suspense>
    </Section>
  );
}
