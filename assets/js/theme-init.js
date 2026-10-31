// Thème mémorisé, appliqué avant l'affichage (version externe du script inline des autres pages,
// pour les pages du compte servies avec une Content-Security-Policy stricte).
try { var t = localStorage.getItem("dites-theme"); if (t) document.documentElement.setAttribute("data-theme", t); } catch (e) {}
