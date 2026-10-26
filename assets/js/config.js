// Configuration centrale du site Dites.
// Seul endroit à modifier pour changer les liens de téléchargement.
// Tout élément portant data-download="mac" ou data-download="android"
// reçoit automatiquement l'URL correspondante (voir main.js).
window.DITES_CONFIG = {
  downloads: {
    mac: "https://github.com/jrmy-dct/dites-site/releases/latest/download/Dites.dmg",
    android: "https://github.com/jrmy-dct/dites-site/releases/latest/download/Dites.apk",
  },
  // Flux de mise à jour lus par les apps (servis par ce site).
  updates: {
    mac: "/updates/mac/appcast.xml",
    android: "/updates/android/latest.json",
  },
};
