/**
 * Maps platform themeColor / themeBg onto Nico Palmer's warm cream
 * cinematic canvas (#e3e3db). Accents are deeper/inkier than Cura's
 * neon-on-black so they read as editorial highlights on paper.
 *
 * Theme Lab: auto on localhost; never on mybexo.cyou.
 */

export const THEME_COLORS = [
  { id: "blue", label: "Navy" },
  { id: "emerald", label: "Emerald" },
  { id: "rose", label: "Rose" },
  { id: "violet", label: "Violet" },
  { id: "gold", label: "Gold" },
];

export const THEME_BG_OPTIONS = [
  { id: "grid", label: "Film Grid", desc: "Cinematic blueprint lines" },
  { id: "dots", label: "Grain Dots", desc: "Accent film-grain field" },
  { id: "waves", label: "Light Waves", desc: "Soft drifting wave lines" },
  { id: "solid", label: "Spotlight", desc: "Corner accent glow" },
];

const THEME_PALETTES = {
  blue: { accent: "55, 90, 150", solidText: "#e3e3db" },
  emerald: { accent: "45, 110, 85", solidText: "#e3e3db" },
  rose: { accent: "160, 70, 85", solidText: "#e3e3db" },
  violet: { accent: "100, 75, 145", solidText: "#e3e3db" },
  gold: { accent: "170, 120, 55", solidText: "#0f0f0f" },
};

export const THEME_BGS = THEME_BG_OPTIONS.map((item) => item.id);

const LAB_STORAGE_KEY = "bexo-theme-lab-nico";
const LAB_EVENT = "bexo-theme-lab-nico";

export function isThemeLabEnabled() {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname || "";
  if (host === "mybexo.cyou" || host.endsWith(".mybexo.cyou")) return false;
  if (new URLSearchParams(window.location.search).has("themeLab")) return true;
  const devHosts = ["localhost", "127.0.0.1", "0.0.0.0", ""];
  return devHosts.includes(host) || host.endsWith(".local");
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

export function applyTheme(user) {
  if (typeof document === "undefined") return;
  const override = getThemeOverride();
  const themeColor = override?.themeColor || user?.themeColor || "gold";
  const themeBg = override?.themeBg || user?.themeBg || "grid";
  const palette = getThemePalette(themeColor);
  const root = document.documentElement;
  root.style.setProperty("--accent-rgb", palette.accent);
  root.style.setProperty("--accent", `rgb(${palette.accent})`);
  root.style.setProperty("--accent-solid-text", palette.solidText);
  root.dataset.themeBg = THEME_BGS.includes(themeBg) ? themeBg : "grid";
  root.dataset.themeColor = themeColor;
}
