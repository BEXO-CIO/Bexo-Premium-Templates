/**
 * Maps the platform's theme customization (users.themeColor / users.themeBg,
 * chosen in onboarding step 7 and the dashboard design tab) onto the Cura
 * Futuri dark editorial palette.
 *
 * Platform promises: accent colors blue (Navy) | emerald | rose | violet,
 * backgrounds grid | dots | waves | solid (accent gradient).
 *
 * Each accent is re-tuned for a near-black canvas: bright enough to read as
 * a text accent, muted enough not to fight the typography.
 *
 * Theme Lab (local/dev only): session overrides for visual QA. Production
 * sites on atbexo.com never expose the lab — themes come from the portal.
 */

export const THEME_COLORS = [
  { id: "blue", label: "Navy" },
  { id: "emerald", label: "Emerald" },
  { id: "rose", label: "Rose" },
  { id: "violet", label: "Violet" },
  { id: "gold", label: "Gold" },
];

export const THEME_BG_OPTIONS = [
  { id: "grid", label: "Clean Grid", desc: "Subtle blueprint canvas" },
  { id: "dots", label: "Minimalist Dots", desc: "Clean dot matrix overlay" },
  { id: "waves", label: "Abstract Waves", desc: "Soft vector wave curves" },
  { id: "solid", label: "Accent Gradient", desc: "Vibrant color blend" },
];

const THEME_PALETTES = {
  blue: { accent: "122, 162, 247", solidText: "#0e1220" },
  emerald: { accent: "111, 209, 167", solidText: "#0c1a14" },
  rose: { accent: "242, 158, 174", solidText: "#200f13" },
  violet: { accent: "183, 157, 245", solidText: "#171024" },
  gold: { accent: "212, 175, 120", solidText: "#141210" },
};

export const THEME_BGS = THEME_BG_OPTIONS.map((item) => item.id);

const LAB_STORAGE_KEY = "bexo-theme-lab";
const LAB_EVENT = "bexo-theme-lab";

/**
 * Theme Lab is disabled by default (kept for later QA).
 * Opt-in only via ?themeLab=1 — never auto-shown, never on atbexo.com.
 */
export function isThemeLabEnabled() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  if (host === "atbexo.com" || host.endsWith(".atbexo.com")) return false;
  return new URLSearchParams(window.location.search).has("themeLab");
}

export function getThemePalette(themeColor) {
  return THEME_PALETTES[themeColor] || THEME_PALETTES.gold;
}

export function getThemeOverride() {
  if (!isThemeLabEnabled()) return null;
  try {
    const raw = sessionStorage.getItem(LAB_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return {
      themeColor: THEME_PALETTES[parsed.themeColor] ? parsed.themeColor : undefined,
      themeBg: THEME_BGS.includes(parsed.themeBg) ? parsed.themeBg : undefined,
    };
  } catch {
    return null;
  }
}

export function setThemeOverride(next) {
  if (!isThemeLabEnabled() || typeof window === "undefined") return;
  const current = getThemeOverride() || {};
  const merged = {
    themeColor: next.themeColor ?? current.themeColor,
    themeBg: next.themeBg ?? current.themeBg,
  };
  sessionStorage.setItem(LAB_STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent(LAB_EVENT, { detail: merged }));
}

export function clearThemeOverride() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(LAB_STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(LAB_EVENT, { detail: null }));
}

export function subscribeThemeLab(listener) {
  if (typeof window === "undefined") return () => undefined;
  const handler = () => listener(getThemeOverride());
  window.addEventListener(LAB_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(LAB_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

/**
 * Applies theme as CSS custom properties on <html>.
 * Lab override (local only) wins over the portal profile values.
 */
export function applyTheme(user) {
  if (typeof document === "undefined") return;
  const override = getThemeOverride();
  const themeColor = override?.themeColor || user?.themeColor;
  const themeBg = override?.themeBg || user?.themeBg;
  const palette = getThemePalette(themeColor);
  const root = document.documentElement;
  root.style.setProperty("--accent-rgb", palette.accent);
  root.style.setProperty("--accent", `rgb(${palette.accent})`);
  root.style.setProperty("--accent-solid-text", palette.solidText);
  const bg = THEME_BGS.includes(themeBg) ? themeBg : "grid";
  root.dataset.themeBg = bg;
}
