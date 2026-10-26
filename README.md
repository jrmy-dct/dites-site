# Site de Dites

Landing page statique de Dites (dictée vocale pour Mac et Android). HTML, CSS et un peu de JavaScript, sans dépendance ni étape de build. Vercel la sert telle quelle (preset « Other », aucune commande de build).

## Arborescence

```
index.html              Page d'accueil en français (langue par défaut, x-default)
en/index.html           Page d'accueil en anglais
404.html                Page d'erreur bilingue
vercel.json             Facultatif : URLs propres, en-têtes de cache pour /updates
assets/
  css/style.css         Styles (thèmes clair et sombre via variables CSS)
  js/config.js          ← liens de téléchargement et flux de mise à jour (seul fichier à modifier)
  js/main.js            Injection des liens, bascule de thème
  img/logo.svg          Logo provisoire
  img/favicon.svg       Favicon provisoire
  img/screenshots/      Emplacements de captures (SVG à remplacer)
updates/
  mac/appcast.xml       Flux Sparkle (exemple)
  android/latest.json   Flux de mise à jour Android (exemple)
```

## Liens de téléchargement

Ils sont centralisés dans `assets/js/config.js`. Tout lien portant `data-download="mac"` ou `data-download="android"` reçoit l'URL correspondante au chargement de la page.

## Flux de mise à jour

- `/updates/mac/appcast.xml` : flux Sparkle. À chaque version : nouvel `<item>`, `sparkle:version` croissant, URL du DMG, `length` et `sparkle:edSignature` (outil `sign_update` de Sparkle).
- `/updates/android/latest.json` : `version`, `versionCode` (entier croissant), `url` de l'APK, `sha256` du fichier, `notes`.

Les valeurs actuelles sont fictives.

## Captures d'écran

Remplacez les fichiers de `assets/img/screenshots/` en gardant les mêmes noms, ou changez les `src` dans `index.html` pour du PNG ou du WebP. Formats prévus : 1200 × 750 pour le Mac, 600 × 1200 pour Android.

## Langues

Le français est à la racine (`/`), l'anglais dans `/en/`. Chaque page déclare `canonical`, les `hreflang` fr, en et x-default, et ses balises og traduites. Le sélecteur FR | EN est dans l'en-tête. Toute modification de contenu doit être reportée dans les deux pages. Les styles et les scripts sont partagés.

Domaine : https://dites.app

## Tester en local

```
python3 -m http.server 8000
```
