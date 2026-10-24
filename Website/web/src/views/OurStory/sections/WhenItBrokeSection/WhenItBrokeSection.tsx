import { strings } from "@/content/strings";
import { Heading, Mark, Text } from "@/shared/ui";
import media from "../_media/media.module.scss";
import { StoryChapter } from "../StoryChapter";
import styles from "./WhenItBrokeSection.module.scss";

const { whenItBroke } = strings.ourStory;

export function WhenItBrokeSection() {
  const [story, inPerson] = whenItBroke.body;
  return (
    <StoryChapter index={4} label={whenItBroke.label}>
      <Heading text={whenItBroke.headline} size="fluid-30-48" leading="1-06" measure="760" />
      <Text variant="longform" measure="680">
        {story}
      </Text>
      <div className={`${media.media} ${styles.card}`}>
        <Mark size="xs" />
        <p className={styles.cardText}>{inPerson}</p>
      </div>
    </StoryChapter>
  );
}
