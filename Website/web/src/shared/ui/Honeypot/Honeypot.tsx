import styles from "./Honeypot.module.scss";

/**
 * A field people never see or reach, which bots tend to fill. The API accepts the
 * submission as if it worked and stores nothing when it is filled.
 */
export function Honeypot({ name = "website" }: { name?: string }) {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <input type="text" name={name} tabIndex={-1} autoComplete="off" defaultValue="" />
    </div>
  );
}
