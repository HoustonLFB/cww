// ===== Configuration globale du site =====
// Modifiez ce fichier pour adapter le site à n'importe quel diocèse.

export const siteConfig = {
  // Nom affiché dans le header et les pages
  nomDiocese: "Archidiocèse de Toulouse",
  // Nom court pour le header
  nomCourt: "Toulouse",
  // Département / Région
  region: "Haute-Garonne",
  // Centre de la carte (coordonnées par défaut)
  centreCarte: { lat: 43.6047, lng: 1.4442 } as const,
  // Zoom par défaut de la carte
  zoomCarte: 11,
  // Couleur primaire (violet liturgique par défaut)
  couleurPrimaire: "#6d2077",
  // Site web officiel du diocèse
  siteWeb: "https://toulouse.catholique.fr",
  // Contact
  adresse: "24, rue Perchepinte, B. P. 7208, 31073 Toulouse Cedex 7",
  telephone: "05 61 52 24 56",
  email: "archeveche@toulouse.catholique.fr",
  // Footer
  footerTexte: "Données fictives — POC",
};
