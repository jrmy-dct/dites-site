(function () {
  var config = window.DITES_CONFIG || {};
  var downloads = config.downloads || {};

  // Android : affiche les étapes d'extraction du .zip, masque le QR code.
  // Le bouton Android passe devant celui du Mac, dans le DOM pour garder l'ordre de tabulation.
  if (/Android/i.test(navigator.userAgent)) {
    document.documentElement.classList.add("is-android");
    var row = document.querySelector(".cta-row");
    var androidButton = row && row.querySelector('[data-download="android"]');
    if (androidButton) row.insertBefore(androidButton, row.firstElementChild);
  }

  // Liens de téléchargement, alimentés depuis config.js.
  document.querySelectorAll("[data-download]").forEach(function (link) {
    var url = downloads[link.getAttribute("data-download")];
    if (url) link.setAttribute("href", url);
  });

  // Thème clair / sombre : suit le système, sauf choix explicite mémorisé.
  var root = document.documentElement;
  var toggle = document.querySelector("[data-theme-toggle]");

  function currentTheme() {
    var forced = root.getAttribute("data-theme");
    if (forced) return forced;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function syncToggle() {
    if (!toggle) return;
    var dark = currentTheme() === "dark";
    toggle.setAttribute("aria-pressed", String(dark));
    var label = toggle.getAttribute(dark ? "data-label-to-light" : "data-label-to-dark");
    if (label) toggle.setAttribute("aria-label", label);
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("dites-theme", next); } catch (e) {}
      syncToggle();
    });
  }
  syncToggle();

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
