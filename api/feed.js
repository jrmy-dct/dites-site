// Relais des flux de mise à jour : /updates/mac/appcast.xml et /updates/android/latest.json
// (voir les rewrites de vercel.json) lisent le fichier publié dans la release GitHub à tag fixe
// et le renvoient depuis notre domaine, avec le bon Content-Type, un cache court et CORS.
// Une fonction plutôt qu'un rewrite externe : GitHub répond par une redirection 302 vers son
// stockage (objects.githubusercontent.com), qu'il faut suivre côté serveur.
export const config = { runtime: "edge" };

const RELEASES = "https://github.com/jrmy-dct/dites-site/releases/download";

const FEEDS = {
  mac: { url: `${RELEASES}/mac-latest/appcast.xml`, type: "application/xml; charset=utf-8" },
  android: { url: `${RELEASES}/android-latest/latest.json`, type: "application/json; charset=utf-8" },
};

const BASE_HEADERS = { "access-control-allow-origin": "*" };

export default async function handler(request) {
  const feed = FEEDS[new URL(request.url).searchParams.get("p")];
  if (!feed) return new Response("Not found", { status: 404, headers: BASE_HEADERS });

  let upstream;
  try {
    upstream = await fetch(feed.url, { redirect: "follow" });
  } catch (error) {
    return new Response("Upstream unreachable", { status: 502, headers: { ...BASE_HEADERS, "cache-control": "no-store" } });
  }

  if (!upstream.ok) {
    // 404 tant qu'aucune version n'est publiée : on le dit, avec un cache très court.
    const status = upstream.status === 404 ? 404 : 502;
    return new Response(status === 404 ? "No release published yet" : "Upstream error", {
      status,
      headers: { ...BASE_HEADERS, "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=60" },
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: { ...BASE_HEADERS, "content-type": feed.type, "cache-control": "public, max-age=300, s-maxage=300" },
  });
}
