# Site de Dites

Landing page statique de Dites (dictée vocale pour Mac et Android). HTML, CSS et un peu de JavaScript, sans dépendance ni étape de build. Vercel la sert telle quelle (preset « Other », aucune commande de build).

## Arborescence

```
index.html              Page d'accueil en français (langue par défaut, x-default)
en/index.html           Page d'accueil en anglais
404.html                Page d'erreur bilingue
vercel.json             Redirections /download/* et rewrites /updates/* (voir plus bas)
api/feed.js             Fonction edge qui relaie les flux de mise à jour depuis les releases GitHub
compte/                 Pages du compte (FR) : confirme.html, mot-de-passe.html
en/account/             Pages du compte (EN) : confirmed.html, password.html
assets/
  css/style.css         Styles (thèmes clair et sombre via variables CSS)
  js/config.js          ← liens de téléchargement et flux de mise à jour (seul fichier à modifier)
  js/main.js            Injection des liens, bascule de thème
  js/demos.js           Séquenceur des démos animées de « Comment ça marche »
  img/logo.svg          Icône de l'app
  img/favicon.svg       Icône de barre des menus (favicon)
```

## Liens de téléchargement

Ils sont centralisés dans `assets/js/config.js`. Tout lien portant `data-download="mac"` ou `data-download="android"` reçoit l'URL correspondante au chargement de la page.

## Téléchargements et mises à jour

Les binaires ne sont **jamais** dans ce dépôt. Les CI des apps les publient dans les GitHub Releases de `jrmy-dct/dites-site`, sans jamais committer :

- Mac : release à tag fixe `mac-latest` (`Dites.dmg`, `appcast.xml`) et releases versionnées `mac-v<version>` ;
- Android : release à tag fixe `android-latest` (`Dites.apk`, `Dites.zip`, `latest.json`) et releases versionnées `android-v<version>`.

Le site expose des URL stables sur son domaine (`vercel.json`) :

| URL | Mécanisme | Cible |
| --- | --- | --- |
| `/download/mac` | redirection 302 | `releases/download/mac-latest/Dites.dmg` |
| `/download/android` | redirection 302 | `releases/download/android-latest/Dites.apk` |
| `/download/android.zip` | redirection 302 | `releases/download/android-latest/Dites.zip` |
| `/updates/mac/appcast.xml` | rewrite vers `api/feed.js` | `releases/download/mac-latest/appcast.xml` |
| `/updates/android/latest.json` | rewrite vers `api/feed.js` | `releases/download/android-latest/latest.json` |

Sur le site, les boutons Android pointent vers `/download/android.zip` : Chrome reste parfois bloqué à la fin du téléchargement d'un .apk hors Play Store, alors que le .zip passe. L'APK direct reste proposé en lien secondaire. Sur Android (détection par User-Agent dans `main.js`, classe `is-android`), les étapes d'extraction s'affichent sous le bouton ; ailleurs, un QR code (SVG inline, généré une fois) mène à `https://dites.app/download/android.zip`.

Les redirections sont en 302 (et non 308) car leur cible change à chaque version. Les flux passent par une petite fonction edge, plutôt que par un rewrite externe, parce que GitHub répond par une redirection vers son stockage : la fonction la suit côté serveur, puis renvoie le fichier depuis notre domaine avec le bon `Content-Type`, `Cache-Control: max-age=300` et CORS. Tant qu'aucune version n'est publiée, ces URL renvoient 404.

**Ne remettez JAMAIS de fichiers dans `/updates/`** : un fichier statique y masquerait le rewrite, et les apps liraient un flux figé au lieu de la dernière release.

## Identité visuelle

Calquée sur `Theme.swift` de l'app : papier vert sauge, encre presque noire, filets de 1 px, étiquettes mono en majuscules, aucune ombre sur les cartes, un seul accent (orange brûlé) réservé au point d'enregistrement. Les couleurs sont des variables CSS en tête de `assets/css/style.css`. Seul écart : la couleur `muted` du thème clair est légèrement foncée (#646C61 au lieu de #6B7368) pour un contraste AA sur le web.

## Démos animées

La section « Comment ça marche » contient deux démos (sur ordinateur et sur téléphone) dessinées en HTML/CSS. Les étapes sont les `<li data-on="…" data-ms="…">` de la liste `.demo-steps` (masquée à l'écran, lue par les lecteurs d'écran) : `data-on` liste les drapeaux posés sur la scène (le CSS affiche les éléments correspondants), `data-ms` la durée. Pour modifier un texte ou une étape, éditez ces `<li>` et les éléments de la scène, dans les deux langues. La lecture s'arrête hors écran, au survol et au focus ; avec `prefers-reduced-motion`, la démo affiche l'étape marquée `data-static` (état final fixe).

## Pages du compte

`/compte/confirme` et `/compte/mot-de-passe` (en anglais : `/en/account/confirmed` et `/en/account/password`) sont les pages d'arrivée des liens envoyés par Supabase Auth : confirmation d'inscription et nouveau mot de passe. Elles ne sont ni indexées (`noindex`) ni liées depuis la navigation. Les URL de redirection sont à déclarer dans Supabase (Authentication > URL Configuration).

`assets/js/account.js` lit le fragment `#access_token=…&type=…` (ou `#error=…`), l'efface aussitôt de l'URL, et garde le jeton en mémoire seulement : jamais dans `localStorage`, jamais dans les logs. Le nouveau mot de passe part par un simple `fetch` : `PUT https://dbgpxmvhgisghbicdfpz.supabase.co/auth/v1/user`, avec la clé publishable (publique par conception) et le jeton du fragment. Ce sont les seules pages du site qui font une requête externe : `vercel.json` leur pose une Content-Security-Policy stricte, dont `connect-src` limité à ce domaine Supabase, ainsi que `Referrer-Policy: no-referrer` et `Cache-Control: no-store`. Les textes affichés sont dans les attributs `data-msg-*` de chaque page.

## Langues

Le français est à la racine (`/`), l'anglais dans `/en/`. Chaque page déclare `canonical`, les `hreflang` fr, en et x-default, et ses balises og traduites. Le sélecteur FR | EN est dans l'en-tête. Toute modification de contenu doit être reportée dans les deux pages. Les styles et les scripts sont partagés.

Domaine : https://dites.app

## Tester en local

```
python3 -m http.server 8000
```
