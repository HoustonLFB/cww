// ===== Types du Répertoire Diocésain =====

export interface Coordonnees {
  lat: number;
  lng: number;
}

// Polygone GeoJSON simplifié : tableau de [lat, lng]
export type ZonePolygon = [number, number][];

export type TypeParoisse =
  | "territoriale"
  | "personnelle-rite"
  | "personnelle-communaute"
  | "universitaire";

export type TypeLieuSpecial =
  | "seminaire"
  | "hopital"
  | "prison"
  | "ecole"
  | "communaute-religieuse"
  | "maison-diocesaine";

export type RolePersonne =
  | "eveque"
  | "eveque-auxiliaire"
  | "vicaire-general"
  | "doyen"
  | "cure"
  | "vicaire"
  | "diacre"
  | "seminariste"
  | "aumonier"
  | "superieur";

export interface Personne {
  id: string;
  dioceseId: string;
  nom: string;
  prenom: string;
  role: RolePersonne;
  photo?: string;
  telephone?: string;
  email?: string;
  notes?: string;
}

export interface Eglise {
  id: string;
  nom: string;
  coordonnees: Coordonnees;
  adresse?: string;
  type: "eglise" | "chapelle" | "cathedrale" | "basilique";
  horaires?: string;
}

export interface Paroisse {
  id: string;
  dioceseId: string;
  nom: string;
  type: TypeParoisse;
  coordonnees: Coordonnees;
  adresse?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  eglises: Eglise[];
  pretres: string[]; // IDs des personnes
  ensembleParoissialId?: string;
  zone?: ZonePolygon; // Polygone optionnel pour la carte
}

export interface EnsembleParoissial {
  id: string;
  dioceseId: string;
  nom: string;
  cureModerateur: string; // ID personne
  paroisses: string[]; // IDs
  doyenneId: string;
  zone?: ZonePolygon; // Polygone optionnel pour la carte
  couleur?: string; // Couleur de la zone
}

export interface Doyenne {
  id: string;
  dioceseId: string;
  nom: string;
  doyen: string; // ID personne
  ensemblesParoissiaux: string[]; // IDs
  zone?: ZonePolygon; // Polygone optionnel pour la carte
  couleur?: string; // Couleur de la zone
}

export interface LieuSpecial {
  id: string;
  dioceseId: string;
  nom: string;
  type: TypeLieuSpecial;
  coordonnees: Coordonnees;
  adresse?: string;
  telephone?: string;
  email?: string;
  siteWeb?: string;
  personnes: string[]; // IDs des personnes
  description?: string;
}

export interface Diocese {
  id: string;
  slug: string;
  nom: string;
  eveque: string; // ID personne
  evequesAuxiliaires?: string[]; // IDs personnes
  vicairesGeneraux: string[]; // IDs personnes
  siteWeb?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  logo?: string;
  coordonnees: Coordonnees; // Centre du diocèse
  doyennes: string[]; // IDs
  lieuxSpeciaux: string[]; // IDs
}
