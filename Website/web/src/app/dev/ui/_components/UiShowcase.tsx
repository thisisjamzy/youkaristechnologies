import { strings } from "@/content/strings";
import {
  Accordion,
  ArrowIcon,
  ArrowLink,
  Button,
  Chip,
  Counter,
  FolderCard,
  FrostedCard,
  Grid,
  Heading,
  Icon,
  IconBox,
  Label,
  Logo,
  Mark,
  NumberCard,
  NumberedList,
  Overlay,
  Photo,
  PhotoMosaic,
  PhotoStrip,
  PhotoWithOverlay,
  PullLine,
  Section,
  SplitHeader,
  Stack,
  StatementBlock,
  Tag,
  Text,
  type IconName,
  type MosaicTile,
} from "@/shared/ui";
import { routes } from "@/shared/lib";
import { JoinPanel, PathSwitcher, PlacesBadge } from "@/widgets";
import { FormDemo } from "./FormDemo";
import styles from "./UiShowcase.module.scss";

const { home, pray, give, gather, ourStory, common } = strings;
const icons: IconName[] = ["globe", "person", "leave", "pen", "clock", "heart", "instagram", "whatsApp", "mail", "check"];
const mosaicPhotos = ["gatherWorship", "gatherTable", "gatherChurch", "gatherHall"] as const;
const mosaic: MosaicTile[] = (() => {
  let photo = 0;
  return gather.whatHappens.tiles.map((tile, i, all): MosaicTile =>
    tile.kind === "photo"
      ? { kind: "photo", name: mosaicPhotos[photo++], alt: tile.alt, focus: i === all.length - 1 ? "40" : undefined }
      : { kind: "text", title: tile.title, text: tile.text, tone: tile.title === "We break bread." ? "lime" : "white" },
  );
})();

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.block}>
      <h2 className={styles.blockTitle}>{title}</h2>
      {children}
    </section>
  );
}

/** Every shared/ui component with real strings, in the order of section 6 of the brief. */
export function UiShowcase() {
  return (
    <Section top="opening" bottom="section" className={styles.page}>
      <h1 className={styles.pageTitle}>Shared UI</h1>
      <p className={styles.note}>
        Internal preview of src/shared/ui. Compare against Website/sfm-website-build-kit/design-reference/.
        <a href="#tokens"> Jump to tokens.</a>
      </p>

      <Block title="Heading, Text, Label, PullLine">
        <Heading as="p" text={home.opening.headline} size="displayXl" tracking="tightPlus" />
        <Heading as="p" text={home.difference.headline} size="fluid-40-76" tracking="tightPlus" secondTone="highlight" />
        <Text variant="lead">{home.opening.body}</Text>
        <Text variant="longform">{ourStory.whatWeSaw.body[1]}</Text>
        <Stack direction="row" gap={6} wrap>
          <Label>{home.challenge.label}</Label>
          <Label tone="blue">{common.teams.outreach.role}</Label>
          <Label size="13">{pray.opening.appCard.label}</Label>
        </Stack>
        <PullLine text={home.pray.photoCard} align="center" />
        <PullLine text={home.whoWeAre.closing} tone="primary" breakBefore size="fluid-24-34" align="center" />
      </Block>

      <Block title="Tag, Chip, Counter">
        <Stack direction="row" gap={3} wrap align="center">
          <Tag>{home.challenge.label}</Tag>
          <Tag bordered>{pray.model.label}</Tag>
          <Tag variant="lime">{pray.opening.label}</Tag>
          <Tag variant="ink">{gather.opening.label}</Tag>
          <Tag variant="blue">{give.opening.label}</Tag>
          <Tag variant="lime" size="lg">{gather.opening.photoLabel}</Tag>
        </Stack>
        <Stack direction="row" gap={3} wrap align="center">
          {home.challenge.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
          <Chip size="sm">{ourStory.whatWeSaw.sunday.caption}</Chip>
          <Chip size="sm" tone="ink">{ourStory.whatWeSaw.monday.caption}</Chip>
          <Chip icon={<Icon name="check" size="sm" stroke="heavy" />}>{give.opening.photoChip}</Chip>
        </Stack>
        <Stack direction="row" gap={3} wrap>
          <Counter value={17} caption={common.places.ofTotal} />
          <Counter value={17} caption={common.places.ofTotal} tone="white" />
        </Stack>
      </Block>

      <Block title="Button, ArrowLink">
        <Stack direction="row" gap={3} wrap align="center">
          <Button href="#" arrow="right">{home.opening.primaryCta}</Button>
          <Button href="#" variant="outline" arrow="right">{common.header.cta}</Button>
          <Button href="#" arrow="down">{strings.buildWithUs.opening.cta}</Button>
          <Button href="#">{common.form.shareOnWhatsApp}</Button>
          <Button variant="light">{common.form.signUpSomeoneElse}</Button>
          <Button variant="outline">{common.form.signUpSomeoneElse}</Button>
          <Button variant="dark" arrow="right">{home.opening.primaryCta}</Button>
        </Stack>
        <div className={styles.inkPanel}>
          <Button variant="ghost">{common.closingCard.copyLink}</Button>
        </div>
        <Button variant="dark" block type="submit">{home.join.form.submit}</Button>
        <Stack direction="row" gap={6} wrap>
          <ArrowLink href="/pray">{home.pray.link}</ArrowLink>
          <ArrowLink href="/build-with-us" arrow={false}>{home.opening.secondaryCta}</ArrowLink>
        </Stack>
      </Block>

      <Block title="ArrowIcon, Icon, IconBox">
        <Stack direction="row" gap={4} wrap align="center">
          <ArrowIcon direction="right" />
          <ArrowIcon direction="upRight" />
          <ArrowIcon direction="down" />
          <ArrowIcon direction="chevron" size="xs" stroke="heavy" />
          <ArrowIcon direction="upRight" size="xxl" stroke="regular" />
          {icons.map((name) => (
            <IconBox key={name}>
              <Icon name={name} />
            </IconBox>
          ))}
          <IconBox size="lg">
            <Icon name="mail" />
          </IconBox>
        </Stack>
      </Block>

      <Block title="Logo, Mark">
        <Stack direction="row" gap={8} wrap align="center">
          <Logo alt={common.header.logoAlt} />
          <Logo alt={common.footer.logoAlt} size="lg" />
          <Mark />
          <Mark size="md" />
        </Stack>
        <div className={styles.inkPanel}>
          <Logo variant="limeOnDark" alt={common.header.logoAlt} />
          <Mark variant="lime" size="md" />
        </div>
        <div className={styles.markBox}>
          <Mark size="fluid" alt={ourStory.nameAndMark.markAlt} />
        </div>
      </Block>

      <Block title="Photo, PhotoWithOverlay, FrostedCard, FolderCard">
        <PhotoWithOverlay name="prayHandsTogether" alt={home.opening.photoAlt} height="hero" wrapperClassName={styles.heroPhoto}>
          <Overlay position="bottomLeft">
            <FrostedCard>
              <Mark />
              <p className={styles.frostedText}>{home.opening.photoCard}</p>
            </FrostedCard>
          </Overlay>
          <Overlay position="topRight" stackOnMobile className={styles.limeCardSlot}>
            <FolderCard tone="lime" tab="wide" radius="lg" className={styles.limeCard} bodyClassName={styles.limeCardBody}>
              <Label tone="primary">{home.opening.limeCard.label}</Label>
              <Heading as="span" text={home.opening.limeCard.value} size="48" />
              <span className={styles.limeCaption}>{home.opening.limeCard.caption}</span>
            </FolderCard>
          </Overlay>
        </PhotoWithOverlay>
        <PhotoWithOverlay name="challengeAlone" alt={home.challenge.photoAlt} height={85} radius="lg" focus="30" sizes="half">
          <Overlay position="bottomEdge" inset={3.5}>
            {home.challenge.chips.map((chip) => (
              <Chip key={chip}>{chip}</Chip>
            ))}
          </Overlay>
        </PhotoWithOverlay>
        <Grid min={75} gap={4}>
          {Object.values(pray.switcher).map((card, i) => (
            <FolderCard key={card.title} href="#" bodyClassName={styles.switcherBody}>
              <Photo name={i === 0 ? "giveOutreach" : "gatherCrowd"} alt="" height={55} radius="md" sizes="half" />
              <span className={styles.switcherRow}>
                <span>
                  <Heading as="b" text={card.title} size="26" tracking="snug" className={styles.blockText} />
                  <Text as="span" size="15">{card.text}</Text>
                </span>
                <span className={styles.arrowCircle}>
                  <ArrowIcon direction="upRight" />
                </span>
              </span>
            </FolderCard>
          ))}
        </Grid>
      </Block>

      <Block title="NumberCard">
        <Grid min={75} gap={4}>
          <NumberCard {...home.pray.numberCard} tone="lime" size="lg" />
          <NumberCard {...ourStory.tenFriends.numbers[0]} />
          <NumberCard {...ourStory.tenFriends.numbers[1]} tone="lime" />
        </Grid>
      </Block>

      <Block title="StatementBlock">
        <StatementBlock {...home.ambition} headingMeasure="980" />
        <StatementBlock {...home.whoWeAre} closing={undefined} gap="md" bodyMeasure="620" />
      </Block>

      <Block title="SplitHeader">
        <SplitHeader aside={pray.model.intro}>
          <Tag bordered>{pray.model.label}</Tag>
          <Heading text={pray.model.headline} size="headingL" leading="1-02" />
        </SplitHeader>
      </Block>

      <Block title="NumberedList">
        <NumberedList items={home.difference.reasons} titleStyle="display" rule="mist" />
        <NumberedList items={pray.model.steps} emphasizeLast />
        <NumberedList items={give.giftTravels.steps} variant="joined" />
      </Block>

      <Block title="PhotoStrip, PhotoMosaic">
        <PhotoStrip
          photos={[
            { name: "womanPraying", alt: pray.model.photoStripAlts[0], focus: "25" },
            { name: "youngManPraying", alt: pray.model.photoStripAlts[1], focus: "30" },
            { name: "rosaryWalk", alt: pray.model.photoStripAlts[2] },
          ]}
        />
        <PhotoMosaic tiles={mosaic} />
      </Block>

      <Block title="Accordion">
        <Accordion items={pray.questions.items} />
      </Block>

      <Block title="Widgets: PathSwitcher, PlacesBadge, JoinPanel (SiteHeader, ClosingCard, SiteFooter frame this page)">
        <PathSwitcher
          items={[
            { href: routes.give, photo: "giveOutreach", ...pray.switcher.give },
            { href: routes.gather, photo: "gatherCrowd", ...pray.switcher.gather },
          ]}
        />
        <Stack direction="row" gap={3} wrap>
          <PlacesBadge left={17} />
          <PlacesBadge left={17} tone="white" />
          <PlacesBadge left={0} />
        </Stack>
        <JoinPanel
          variant="join"
          headline={home.join.headline}
          body={home.join.body}
          points={home.join.benefits.map((b, i) => ({ ...b, icon: (["globe", "person", "leave"] as const)[i] }))}
        >
          <FormDemo />
        </JoinPanel>
        <JoinPanel
          variant="apply"
          headline={strings.buildWithUs.form.headline}
          body={strings.buildWithUs.form.body}
          points={strings.buildWithUs.form.asks.map((title, i) => ({ title, icon: (["pen", "clock", "heart"] as const)[i] }))}
        >
          <Heading as="h3" text={strings.buildWithUs.form.title} size="fluid-28-38" leading="1-05" />
        </JoinPanel>
      </Block>
    </Section>
  );
}
