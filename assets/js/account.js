// Pages du compte Dites (Supabase Auth) : /compte/confirme et /compte/mot-de-passe (et /en/account/…).
// Supabase redirige ici avec un fragment #access_token=…&type=… ou #error=…&error_description=….
// Le fragment est lu une fois puis effacé de l'URL ; le jeton reste en mémoire seulement :
// jamais dans localStorage, jamais dans les logs. Seule requête externe du site, vers Supabase.
// Les textes affichés viennent des attributs data-msg-* de la page (FR ou EN).
(function () {
  var SUPABASE_URL = "https://dbgpxmvhgisghbicdfpz.supabase.co";
  var SUPABASE_KEY = "sb_publishable_OwSzesYALZ9_Drpkqra8Ww_g6A-zzJb";

  var root = document.querySelector("[data-account]");
  if (!root) return;

  function readParams() {
    var params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    // Certaines erreurs arrivent en paramètres de requête plutôt qu'en fragment.
    new URLSearchParams(window.location.search).forEach(function (value, key) {
      if (!params.has(key)) params.set(key, value);
    });
    return params;
  }

  var params = readParams();
  if (window.location.hash || window.location.search) {
    history.replaceState(null, "", window.location.pathname);
  }

  var status = root.querySelector("[data-status]");
  function say(key, kind) {
    status.textContent = root.getAttribute("data-msg-" + key) || "";
    status.setAttribute("data-kind", kind || "info");
  }

  var token = params.get("access_token");
  var failed = params.has("error") || params.has("error_code");

  if (root.getAttribute("data-account") === "confirm") {
    if (failed) say("expired", "error");
    else if (token) say("confirmed", "success");
    else say("idle", "info");
    token = null;
    return;
  }

  // Nouveau mot de passe
  var form = root.querySelector("form");
  var password = form.querySelector('[name="password"]');
  var confirmation = form.querySelector('[name="confirm"]');
  var submit = form.querySelector('[type="submit"]');

  if (failed || !token || params.get("type") !== "recovery") {
    form.hidden = true;
    say("expired", "error");
    return;
  }

  function validate() {
    var value = password.value;
    if (value.length < 8 || !/[A-Za-zÀ-ÿ]/.test(value) || !/[0-9]/.test(value)) return "weak";
    if (value !== confirmation.value) return "mismatch";
    return null;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var problem = validate();
    if (problem) { say(problem, "error"); return; }

    submit.disabled = true;
    say("sending", "info");

    fetch(SUPABASE_URL + "/auth/v1/user", {
      method: "PUT",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: password.value }),
    }).then(function (response) {
      if (response.ok) {
        token = null;
        form.hidden = true;
        say("success", "success");
        return;
      }
      return response.json().catch(function () { return {}; }).then(function (body) {
        var code = body.error_code || body.code || "";
        if (response.status === 401 || response.status === 403 || code === "bad_jwt" || code === "session_not_found") {
          token = null;
          form.hidden = true;
          say("expired", "error");
        } else if (code === "weak_password") {
          say("weak", "error");
        } else if (code === "same_password") {
          say("same", "error");
        } else {
          say("failed", "error");
        }
        submit.disabled = false;
      });
    }).catch(function () {
      say("network", "error");
      submit.disabled = false;
    });
  });
})();
