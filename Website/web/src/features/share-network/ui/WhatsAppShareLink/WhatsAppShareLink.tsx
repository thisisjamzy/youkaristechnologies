import { whatsAppShareUrl } from "@/shared/lib";
import { Button } from "@/shared/ui";

export type WhatsAppShareLinkProps = {
  /** The share message from strings.common.share. */
  message: string;
  label: string;
  className?: string;
};

/** Lime pill that opens WhatsApp with the share message. */
export function WhatsAppShareLink({ message, label, className }: WhatsAppShareLinkProps) {
  return (
    <Button href={whatsAppShareUrl(message)} className={className}>
      {label}
    </Button>
  );
}
