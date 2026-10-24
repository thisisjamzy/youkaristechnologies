import { strings } from "@/content/strings";
import { Heading, NumberCard, Photo, Text } from "@/shared/ui";
import media from "../_media/media.module.scss";
import { StoryChapter } from "../StoryChapter";

const { tenFriends } = strings.ourStory;

export function TenFriendsSection() {
  const [first, later] = tenFriends.numbers;
  return (
    <StoryChapter index={3} label={tenFriends.label}>
      <Heading text={tenFriends.headline} size="fluid-30-48" leading="1-06" measure="760" />
      <Text variant="longform" measure="680">
        {tenFriends.body}
      </Text>
      <div className={`${media.media} ${media.pair}`}>
        <Photo
          name="womanPhone"
          alt={tenFriends.photoAlt}
          height="chapterPhone"
          radius="lg"
          focus="30"
          sizes="half"
          className={media.wide}
        />
        <NumberCard {...first} size="fluid" />
        <NumberCard {...later} tone="lime" size="fluid" />
      </div>
    </StoryChapter>
  );
}
