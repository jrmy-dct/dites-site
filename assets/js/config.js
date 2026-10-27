// Configuration centrale du site Dites.
// Seul endroit à modifier pour changer les liens de téléchargement.
// Tout élément portant data-download="<clé>" reçoit l'URL correspondante (voir main.js).
// Ces URL sont des redirections 302 de vercel.json vers les releases GitHub à tag fixe
// (mac-latest, android-latest) : elles suivent toujours la dernière version publiée.
window.DITES_CONFIG = {
  downloads: {
    mac: "/download/mac",
    android: "/download/android",
    "android-zip": "/download/android.zip",
  },
  // Flux de mise à jour lus par les apps (relayés par api/feed.js, voir vercel.json).
  updates: {
    mac: "/updates/mac/appcast.xml",
    android: "/updates/android/latest.json",
  },
};
