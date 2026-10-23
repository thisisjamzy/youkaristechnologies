import { cn } from "@/shared/lib";
import styles from "./FormAlert.module.scss";

/** A message for the whole form, announced as soon as it appears. */
export function FormAlert({ message, className }: { message: string | null; className?: string }) {
  return (
    <p role="alert" className={cn(styles.alert, !message && styles.empty, className)}>
      {message}
    </p>
  );
}
