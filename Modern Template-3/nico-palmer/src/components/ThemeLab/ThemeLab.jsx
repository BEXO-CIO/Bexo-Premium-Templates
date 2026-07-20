import { useEffect, useMemo, useState } from "react";

import {
  THEME_BG_OPTIONS,
  THEME_COLORS,
  applyTheme,
  clearThemeOverride,
  getThemeOverride,
  getThemePalette,
  isThemeLabEnabled,
  setThemeOverride,
  subscribeThemeLab,
} from "../../utils/theme";
import { useDisplayProfile } from "../../utils/profileHelper";

import "./ThemeLab.css";

/**
 * Local/dev theme playground. Hidden on production mybexo.cyou —
 * live sites only receive theme from the web portal.
 */
const ThemeLab = () => {
  const enabled = useMemo(() => isThemeLabEnabled(), []);
  const { user } = useDisplayProfile();
  const [open, setOpen] = useState(false);
  const [override, setOverride] = useState(() => (enabled ? getThemeOverride() : null));

  const portalColor = user?.themeColor || "gold";
  const portalBg = user?.themeBg || "grid";
  const activeColor = override?.themeColor || portalColor;
  const activeBg = override?.themeBg || portalBg;
  const isOverridden = !!(override?.themeColor || override?.themeBg);

  useEffect(() => {
    if (!enabled) return undefined;
    return subscribeThemeLab((next) => {
      setOverride(next);
      applyTheme(user);
    });
  }, [enabled, user]);

  if (!enabled) return null;

  const pickColor = (id) => {
    setThemeOverride({ themeColor: id });
    applyTheme({ ...user, themeColor: id, themeBg: activeBg });
  };

  const pickBg = (id) => {
    setThemeOverride({ themeBg: id });
    applyTheme({ ...user, themeColor: activeColor, themeBg: id });
  };

  const reset = () => {
    clearThemeOverride();
    applyTheme(user);
  };

  return (
    <div className={`theme-lab${open ? " is-open" : ""}`} aria-live="polite">
      <button
        type="button"
        className="theme-lab-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="theme-lab-panel"
        title="Theme lab (local testing only)"
      >
        <span
          className="theme-lab-swatch"
          style={{ background: `rgb(${getThemePalette(activeColor).accent})` }}
          aria-hidden="true"
        />
        <span className="theme-lab-toggle-label">{open ? "Close" : "Theme"}</span>
      </button>

      {open && (
        <aside id="theme-lab-panel" className="theme-lab-panel" role="dialog" aria-label="Theme lab">
          <header className="theme-lab-header">
            <div>
              <p className="theme-lab-kicker">Theme lab</p>
              <h2>Preview accents</h2>
            </div>
            <p className="theme-lab-note">Local only · production uses the portal</p>
          </header>

          <section className="theme-lab-section">
            <p className="theme-lab-label">Accent color</p>
            <div className="theme-lab-swatches" role="list">
              {THEME_COLORS.map((theme) => {
                const palette = getThemePalette(theme.id);
                const selected = activeColor === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="listitem"
                    className={`theme-lab-color${selected ? " is-selected" : ""}`}
                    style={{ "--swatch": `rgb(${palette.accent})` }}
                    onClick={() => pickColor(theme.id)}
                    title={theme.label}
                    aria-pressed={selected}
                  >
                    <i aria-hidden="true" />
                    <span>{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="theme-lab-section">
            <p className="theme-lab-label">Background style</p>
            <div className="theme-lab-bgs" role="list">
              {THEME_BG_OPTIONS.map((bg) => {
                const selected = activeBg === bg.id;
                return (
                  <button
                    key={bg.id}
                    type="button"
                    role="listitem"
                    className={`theme-lab-bg${selected ? " is-selected" : ""}`}
                    onClick={() => pickBg(bg.id)}
                    aria-pressed={selected}
                  >
                    <strong>{bg.label}</strong>
                    <span>{bg.desc}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <footer className="theme-lab-footer">
            <p>
              Portal: <em>{portalColor}</em> · <em>{portalBg}</em>
              {isOverridden ? " · preview override on" : ""}
            </p>
            <button type="button" className="theme-lab-reset" onClick={reset} disabled={!isOverridden}>
              Reset to portal
            </button>
          </footer>
        </aside>
      )}
    </div>
  );
};

export default ThemeLab;
