document.addEventListener("DOMContentLoaded", () => {
  setupLanguageMenu();
  setupMobileMenu();
  applyLang(localStorage.getItem("site_lang") || "en");
  setupTheme();
  setupReveal();
  setupTilt();
  setupHeroImageMotion();
  loadRemoteContent();
  bindCvButtons();
});
