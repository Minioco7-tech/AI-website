// theme.js
(function () {
  const STORAGE_KEY = "aiviary-theme";
  const THEMES = ["dark", "natural"];

  function applyTheme(theme) {
    document.body.classList.remove("theme-natural");

    if (theme === "natural") {
      document.body.classList.add("theme-natural");
    }

    localStorage.setItem(STORAGE_KEY, theme);

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "natural" ? "true" : "false");
      btn.textContent = theme === "natural" ? "Dark Theme" : "Natural Theme";
    });
  }

  function getInitialTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : "dark";
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getInitialTheme());

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = localStorage.getItem(STORAGE_KEY) || "dark";
        applyTheme(current === "natural" ? "dark" : "natural");
      });
    });
  });
})();
