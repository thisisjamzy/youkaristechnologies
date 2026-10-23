import {
  breakpoints,
  colors,
  fluidSpace,
  fontSizes,
  radii,
  shadows,
  spaceSteps,
  spaceUnit,
  type Fluid,
} from "@/styles/tokens/tokens";
import { CurrentBreakpoint } from "./CurrentBreakpoint";
import styles from "./TokenPreview.module.scss";

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const stepKey = (n: number) => String(n).replace(".", "_");
const describe = (v: number | Fluid) =>
  typeof v === "number" ? `${v}px` : `clamp(${v.min}px, ${v.vw}vw, ${v.max}px)`;

export function TokenPreview() {
  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Design tokens</h1>
      <p className={styles.note}>
        Everything here is read from src/styles/tokens/tokens.ts. Edit that file, then run npm run tokens.
      </p>
      <CurrentBreakpoint />

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Colours</h2>
        <ul className={styles.swatches}>
          {Object.entries(colors).map(([name, value]) => (
            <li key={name} className={styles.swatch}>
              <span className={`${styles.chip} ${styles[`color-${kebab(name)}`]}`} />
              <code>--color-{kebab(name)}</code>
              <span className={styles.value}>{value}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Fonts</h2>
        <p className={styles.fontDisplay}>Nohemi Bold. If you love Mary, you are already one of us.</p>
        <p className={styles.fontBody}>Barlow. Strangers for Mary is a network of Catholics around the world.</p>
        <p className={styles.fontLabel}>Barlow Condensed · Mon to Sat</p>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Font sizes</h2>
        <ul className={styles.list}>
          {Object.entries(fontSizes).map(([name, value]) => (
            <li key={name} className={styles.typeRow}>
              <code className={styles.typeName}>--text-{kebab(name)}</code>
              <span className={styles.value}>{describe(value)}</span>
              <span className={`${styles.typeSample} ${styles[`text-${kebab(name)}`]}`}>Aa</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Space ({spaceUnit}px unit)</h2>
        <ul className={styles.list}>
          {spaceSteps.map((step) => (
            <li key={step} className={styles.spaceRow}>
              <code className={styles.typeName}>--space-{stepKey(step)}</code>
              <span className={styles.value}>{step * spaceUnit}px</span>
              <span className={`${styles.bar} ${styles[`space-${stepKey(step)}`]}`} />
            </li>
          ))}
          {Object.entries(fluidSpace).map(([name, value]) => (
            <li key={name} className={styles.spaceRow}>
              <code className={styles.typeName}>--space-{kebab(name)}</code>
              <span className={styles.value}>{describe(value)}</span>
              <span className={`${styles.bar} ${styles[`space-${kebab(name)}`]}`} />
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Radii and shadows</h2>
        <ul className={styles.swatches}>
          {Object.entries(radii).map(([name, value]) => (
            <li key={name} className={styles.swatch}>
              <span className={`${styles.radiusBox} ${styles[`radius-${name}`]}`} />
              <code>--radius-{name}</code>
              <span className={styles.value}>{value}px</span>
            </li>
          ))}
          {Object.keys(shadows).map((name) => (
            <li key={name} className={styles.swatch}>
              <span className={styles.shadowBox} />
              <code>--shadow-{name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.group}>
        <h2 className={styles.groupTitle}>Breakpoints (min-width)</h2>
        <ul className={styles.list}>
          {Object.entries(breakpoints).map(([name, value]) => (
            <li key={name}>
              <code>{name}</code> <span className={styles.value}>{value}px</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
