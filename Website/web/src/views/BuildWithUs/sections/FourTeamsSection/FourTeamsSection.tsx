import { strings } from "@/content/strings";
import { routes, type PhotoName } from "@/shared/lib";
import { ArrowIcon, FolderCard, Heading, Label, Photo, Section, SplitHeader } from "@/shared/ui";
import styles from "./FourTeamsSection.module.scss";

const { fourTeams } = strings.buildWithUs;
const { teams } = strings.common;

// The photo for each team, as in the reference.
const cards: { team: keyof typeof teams; photo: PhotoName }[] = [
  { team: "strangerRelations", photo: "heroSmile" },
  { team: "outreach", photo: "eventLaugh" },
  { team: "coreAndContent", photo: "candleRosary" },
  { team: "technology", photo: "teamTalk" },
];

export function FourTeamsSection() {
  return (
    <Section top="sectionLarge">
      <SplitHeader aside={fourTeams.body} className={styles.header}>
        <Heading text={fourTeams.headline} size="headingL" leading="1-02" />
      </SplitHeader>
      <div className={styles.grid}>
        {cards.map(({ team, photo }) => {
          const copy = teams[team];
          return (
            <FolderCard key={team} href={routes.apply} tab="mid" bodyClassName={styles.card}>
              <Photo name={photo} alt={copy.alt} height={50} radius="md" sizes="quarter" />
              <span className={styles.content}>
                <Label tone="blue">{copy.role}</Label>
                <Heading as="b" text={copy.name} size="28" leading="1-05" tracking="snug" />
                <span className={styles.text}>{copy.text}</span>
                <span className={styles.footer}>
                  {fourTeams.joinTeam}
                  <span className={styles.arrow}>
                    <ArrowIcon direction="upRight" size="sm" />
                  </span>
                </span>
              </span>
            </FolderCard>
          );
        })}
      </div>
    </Section>
  );
}
