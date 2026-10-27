// Démos animées de « Comment ça marche ».
// Chaque étape est un <li data-on="…" data-ms="…"> de la liste .demo-steps (masquée à l'écran,
// lue par les lecteurs d'écran) : data-on liste les drapeaux posés sur la scène (le CSS fait le
// reste), data-ms la durée de l'étape. Lecture seulement quand la démo est visible, pause au
// survol et au focus. Avec prefers-reduced-motion : état fixe, l'étape marquée data-static.
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  function initDemo(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll(".demo-steps li"));
    var stage = root.querySelector(".demo-stage");
    var timer = root.querySelector("[data-timer]");
    if (!items.length || !stage) return;

    function show(i) { stage.setAttribute("data-on", items[i].getAttribute("data-on") || ""); }

    if (reduce) {
      var fixed = items.findIndex(function (item) { return item.hasAttribute("data-static"); });
      show(fixed > -1 ? fixed : items.length - 1);
      return;
    }

    var index = 0;
    var hovered = false;
    var focused = false;
    var visible = false;
    var timeout = null;
    var tick = null;
    var seconds = 0;

    function playing() { return !hovered && !focused && visible; }

    function updateTimer() {
      if (!timer) return;
      var recording = (" " + items[index].getAttribute("data-on") + " ").indexOf(" rec ") > -1;
      if (recording && playing()) {
        if (!tick) tick = setInterval(function () { seconds++; timer.textContent = "0:" + pad(seconds); }, 1000);
      } else {
        clearInterval(tick);
        tick = null;
        if (!recording) { seconds = 0; timer.textContent = "0:00"; }
      }
    }

    function schedule() {
      clearTimeout(timeout);
      updateTimer();
      if (playing()) {
        timeout = setTimeout(function () {
          index = (index + 1) % items.length;
          show(index);
          schedule();
        }, parseInt(items[index].getAttribute("data-ms"), 10) || 1200);
      }
    }

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

    show(index);
    schedule();
  }

  document.querySelectorAll("[data-demo]").forEach(initDemo);
})();
