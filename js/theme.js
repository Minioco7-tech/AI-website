const STORAGE_KEY = "aiviary-theme";

function applyTheme(theme) {
  document.documentElement.classList.toggle("theme-natural", theme === "natural");
document.body.classList.toggle("theme-natural", theme === "natural");
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("aiviary-theme-change"));
  
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", theme === "natural" ? "true" : "false");
  });

  console.log("Theme applied:", theme);
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(localStorage.getItem(STORAGE_KEY) || "dark");
});

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-theme-toggle]");

  if (!button) {
    return;
  }

  console.log("Theme toggle clicked");

  const currentTheme = document.body.classList.contains("theme-natural")
    ? "natural"
    : "dark";

  applyTheme(currentTheme === "natural" ? "dark" : "natural");
});
