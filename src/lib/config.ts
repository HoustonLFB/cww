// ===== Configuration globale de la plateforme =====

export const siteConfig = {
  // Nom de la plateforme
  nomPlateforme: "Répertoire des Diocèses de France",
  nomCourt: "Répertoire Diocésain",
  // Centre de la carte France
  centreCarte: { lat: 46.6, lng: 2.5 } as const,
  // Zoom par défaut (France entière)
  zoomCarte: 6,
  // Couleur primaire (violet liturgique)
  couleurPrimaire: "#6d2077",
  // Footer
  footerTexte: "Données fictives — POC",
};
