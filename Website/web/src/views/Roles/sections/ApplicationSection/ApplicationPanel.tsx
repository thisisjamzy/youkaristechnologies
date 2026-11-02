import { strings } from "@/content/strings";
import { findRole, type RoleId } from "@/entities/role";
import { ApplyForRoleForm } from "@/features/apply-for-role";
import { Heading, Label } from "@/shared/ui";
import styles from "./ApplicationSection.module.scss";

const { application } = strings.roles;

export const APPLY_HEADING_ID = "apply-heading";

export type ApplicationPanelProps = {
  roleId: RoleId | null;
  /** Without it (before the page is interactive), choosing a role in the form does nothing. */
  onRoleChange?: (roleId: RoleId | null) => void;
};

/** The white panel: why one role, the chosen role and the unpaid note on the left; the form on the right. */
export function ApplicationPanel({ roleId, onRoleChange }: ApplicationPanelProps) {
  const role = findRole(roleId);
  return (
    <div className={styles.panel}>
      <div className={styles.intro}>
        <Heading id={APPLY_HEADING_ID} focusable text={application.headline} size="headingM" leading="1-04" className={styles.heading} />
        <p className={styles.body}>{application.body}</p>
        {role && (
          <div className={styles.chosen}>
            <Label tone="blue">{role.team}</Label>
            <Heading as="b" text={role.title} size="24" leading="1-1" tracking="snug" />
            <span className={styles.chosenSummary}>{role.summary}</span>
            <a href={role.pdf} download className={styles.chosenLink}>
              {application.downloadDescription}
            </a>
          </div>
        )}
        <div className={styles.notPaid}>
          <b>{application.notPaid.title}</b>
          <span className={styles.notPaidText}>{application.notPaid.text}</span>
        </div>
      </div>
      <div className={styles.formPanel}>
        <ApplyForRoleForm roleId={role?.id ?? null} onRoleChange={onRoleChange} />
      </div>
    </div>
  );
}
