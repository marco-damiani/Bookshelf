export type ThemeMode = "light" | "dark" | "auto";
const KEY = "ui.theme";

export function getTheme(): ThemeMode {
  const v = localStorage.getItem(KEY) as ThemeMode | null;
  return v ?? "auto";
}

function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function applyTheme(mode: ThemeMode): boolean {
  const dark = mode === "dark" || (mode === "auto" && systemPrefersDark());
  const root = document.documentElement;
  root.dataset.theme = dark ? "dark" : "light";
  localStorage.setItem(KEY, mode);
  window.dispatchEvent(new CustomEvent("themechange", { detail: { mode, dark } }));
  return dark;
}

/** Gira o modo na ordem: light -> dark -> auto -> light */
export function toggleTheme(mode: ThemeMode): ThemeMode {
  return mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
}
