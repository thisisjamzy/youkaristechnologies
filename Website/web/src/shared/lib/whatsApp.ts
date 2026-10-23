/** A wa.me link that opens WhatsApp with `message` ready to send to any chat. */
export function whatsAppShareUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
