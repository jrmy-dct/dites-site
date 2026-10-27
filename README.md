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
  js/demos.js           Séquenceur des démos animées de « Comment ça marche »
  img/logo.svg          Icône de l'app
  img/favicon.svg       Icône de barre des menus (favicon)
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

Remplacez les fichiers de `assets/img/screenshots/` en gardant les mêmes noms, ou changez les `src` dans `index.html` et `en/index.html` pour du PNG ou du WebP. Réglages Mac : 760 × 1100 pt, à fournir en @2x (1520 × 2200 px), une version claire (`reglages-clair`) et une sombre (`reglages-sombre`). Android : 600 × 1200 en attendant le ratio exact. La pilule d'enregistrement et la bulle d'options sont en HTML/CSS : pas de capture nécessaire.

## Identité visuelle

Calquée sur `Theme.swift` de l'app : papier vert sauge, encre presque noire, filets de 1 px, étiquettes mono en majuscules, aucune ombre sur les cartes, un seul accent (orange brûlé) réservé au point d'enregistrement. Les couleurs sont des variables CSS en tête de `assets/css/style.css`. Seul écart : la couleur `muted` du thème clair est légèrement foncée (#646C61 au lieu de #6B7368) pour un contraste AA sur le web.

## Démos animées

La section « Comment ça marche » contient deux démos (Mac et Android) dessinées en HTML/CSS. Les étapes sont les `<li data-on="…" data-ms="…">` de la transcription sous chaque démo : `data-on` liste les drapeaux posés sur la scène (le CSS affiche les éléments correspondants), `data-ms` la durée. Pour modifier un texte ou une étape, éditez ces `<li>` et les éléments de la scène, dans les deux langues. La lecture s'arrête hors écran, au survol, au focus ou avec le bouton Pause ; avec `prefers-reduced-motion`, elle ne démarre pas et les étapes se parcourent aux boutons.

## Langues

Le français est à la racine (`/`), l'anglais dans `/en/`. Chaque page déclare `canonical`, les `hreflang` fr, en et x-default, et ses balises og traduites. Le sélecteur FR | EN est dans l'en-tête. Toute modification de contenu doit être reportée dans les deux pages. Les styles et les scripts sont partagés.

Domaine : https://dites.app

## Tester en local

```
python3 -m http.server 8000
```
