const STORAGE_KEY = "dicionario-theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

export function resolveTheme(savedTheme, prefersDark) {
  if (savedTheme === DARK_THEME || savedTheme === LIGHT_THEME) {
    return savedTheme;
  }

  return prefersDark ? DARK_THEME : LIGHT_THEME;
}

export function getNextTheme(currentTheme) {
  return currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
}

function readSavedTheme(storage) {
  try {
    return storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveTheme(storage, theme) {
  try {
    storage.setItem(STORAGE_KEY, theme);
  } catch {
    // O tema ainda funciona quando o armazenamento do navegador está indisponível.
  }
}

function renderTheme(theme, root, button, themeColor) {
  const isDark = theme === DARK_THEME;
  const nextLabel = isDark ? "Ativar tema claro" : "Ativar tema escuro";

  root.dataset.theme = theme;
  button.setAttribute("aria-label", nextLabel);
  button.title = nextLabel;
  button.setAttribute("aria-pressed", String(isDark));
  themeColor.content = isDark ? "#111318" : "#fafbfc";
}

export function initializeTheme({
  root = document.documentElement,
  button = document.querySelector("#theme-toggle"),
  themeColor = document.querySelector('meta[name="theme-color"]'),
  storage = window.localStorage,
  prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches,
} = {}) {
  if (!button || !themeColor) {
    return;
  }

  let theme = resolveTheme(readSavedTheme(storage), prefersDark);
  renderTheme(theme, root, button, themeColor);

  button.addEventListener("click", () => {
    theme = getNextTheme(theme);
    renderTheme(theme, root, button, themeColor);
    saveTheme(storage, theme);
  });
}

if (typeof document !== "undefined") {
  initializeTheme();
}
