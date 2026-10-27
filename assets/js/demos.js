// Démos animées de « Comment ça marche ».
// Chaque étape est un <li data-on="…" data-ms="…"> de la transcription : data-on liste les
// drapeaux posés sur la scène (le CSS fait le reste), data-ms la durée de l'étape.
// Lecture seulement quand la démo est visible ; pause au survol, au focus ou avec le bouton.
// Avec prefers-reduced-motion : pas de lecture automatique, étapes au bouton.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function initDemo(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".demo-steps li"));
    var stage = root.querySelector(".demo-stage");
    var caption = root.querySelector(".demo-caption");
    var toggle = root.querySelector('[data-act="toggle"]');
    var timer = root.querySelector("[data-timer]");
    if (!items.length || !stage) return;

    var index = 0;
    var userPaused = reduce;
    var hovered = false;
    var focused = false;
    var visible = false;
    var timeout = null;
    var tick = null;
    var seconds = 0;

    function playing() { return !userPaused && !hovered && !focused && visible; }

    function flags() { return " " + (items[index].getAttribute("data-on") || "") + " "; }

    function updateTimer() {
      if (!timer) return;
      var recording = flags().indexOf(" rec ") > -1;
      if (recording && playing()) {
        if (!tick) tick = setInterval(function () { seconds++; timer.textContent = "0:" + pad(seconds); }, 1000);
      } else {
        clearInterval(tick);
        tick = null;
        if (!recording) { seconds = 0; timer.textContent = "0:00"; }
      }
    }

    function render() {
      stage.setAttribute("data-on", items[index].getAttribute("data-on") || "");
      if (caption) caption.textContent = pad(index + 1) + "/" + pad(items.length) + " · " + items[index].textContent.trim();
      if (toggle) {
        toggle.textContent = toggle.getAttribute(userPaused ? "data-label-play" : "data-label-pause");
        toggle.setAttribute("aria-pressed", String(userPaused));
      }
      updateTimer();
    }

    function schedule() {
      clearTimeout(timeout);
      updateTimer();
      if (playing()) {
        timeout = setTimeout(function () { go(index + 1); }, parseInt(items[index].getAttribute("data-ms"), 10) || 1200);
      }
    }

    function go(n) {
      index = (n + items.length) % items.length;
      render();
      schedule();
    }

    function manual(n) {
      userPaused = true;
      if (caption) caption.setAttribute("aria-live", "polite");
      go(n);
    }

    root.addEventListener("click", function (event) {
      var button = event.target.closest("[data-act]");
      if (!button) return;
      var act = button.getAttribute("data-act");
      if (act === "prev") manual(index - 1);
      else if (act === "next") manual(index + 1);
      else if (act === "toggle") {
        userPaused = !userPaused;
        if (caption) caption.setAttribute("aria-live", userPaused ? "polite" : "off");
        render();
        schedule();
      }
    });

    stage.addEventListener("pointerenter", function () { hovered = true; schedule(); });
    stage.addEventListener("pointerleave", function () { hovered = false; schedule(); });
    root.addEventListener("focusin", function () { focused = true; schedule(); });
    root.addEventListener("focusout", function (event) {
      if (!root.contains(event.relatedTarget)) { focused = false; schedule(); }
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        schedule();
      }, { threshold: 0.35 }).observe(stage);
    } else {
      visible = true;
    }

    render();
    schedule();
  }

  document.querySelectorAll("[data-demo]").forEach(initDemo);
})();
