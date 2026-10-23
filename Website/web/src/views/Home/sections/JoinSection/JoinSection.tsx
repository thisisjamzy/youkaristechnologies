import { strings } from "@/content/strings";
import { JoinNetworkForm } from "@/features/join-network";
import type { IconName } from "@/shared/ui";
import { Section } from "@/shared/ui";
import { JoinPanel } from "@/widgets";

const { join } = strings.home;
const icons: readonly IconName[] = ["globe", "person", "leave"];

export type JoinSectionProps = { placesLeft: number | null };

export function JoinSection({ placesLeft }: JoinSectionProps) {
  return (
    <Section top="section" bottom="section" id="join">
      <JoinPanel
        variant="join"
        headline={join.headline}
        body={join.body}
        points={join.benefits.map((benefit, i) => ({ ...benefit, icon: icons[i] }))}
      >
        <JoinNetworkForm placesLeft={placesLeft} />
      </JoinPanel>
    </Section>
  );
}
