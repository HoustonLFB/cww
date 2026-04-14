import type {
  Personne,
  Diocese,
  Doyenne,
  EnsembleParoissial,
  Paroisse,
  LieuSpecial,
} from "./types";
import {
  dioceses,
  personnes,
  paroisses,
  ensemblesParoissiaux,
  doyennes,
  lieuxSpeciaux,
} from "./data.generated";

export {
  dioceses,
  personnes,
  paroisses,
  ensemblesParoissiaux,
  doyennes,
  lieuxSpeciaux,
};

// ===== HELPERS DE RECHERCHE =====

export function getDiocese(idOrSlug: string): Diocese | undefined {
  return dioceses.find((d) => d.id === idOrSlug || d.slug === idOrSlug);
}

export function getPersonne(id: string): Personne | undefined {
  return personnes.find((p) => p.id === id);
}

export function getParoisse(id: string): Paroisse | undefined {
  return paroisses.find((p) => p.id === id);
}

export function getEnsembleParoissial(id: string): EnsembleParoissial | undefined {
  return ensemblesParoissiaux.find((e) => e.id === id);
}

export function getDoyenne(id: string): Doyenne | undefined {
  return doyennes.find((d) => d.id === id);
}

export function getLieuSpecial(id: string): LieuSpecial | undefined {
  return lieuxSpeciaux.find((l) => l.id === id);
}

export function getPersonnesByDiocese(dioceseId: string) {
  return personnes.filter((p) => p.dioceseId === dioceseId);
}
export function getParoissesByDiocese(dioceseId: string) {
  return paroisses.filter((p) => p.dioceseId === dioceseId);
}
export function getEnsemblesByDiocese(dioceseId: string) {
  return ensemblesParoissiaux.filter((e) => e.dioceseId === dioceseId);
}
export function getDoyennesByDiocese(dioceseId: string) {
  return doyennes.filter((d) => d.dioceseId === dioceseId);
}
export function getLieuxByDiocese(dioceseId: string) {
  return lieuxSpeciaux.filter((l) => l.dioceseId === dioceseId);
}

// ===== LABELS =====

export const roleLabels: Record<string, string> = {
  eveque: "Archevêque",
  "eveque-auxiliaire": "Évêque auxiliaire",
  "vicaire-general": "Vicaire général",
  doyen: "Doyen",
  cure: "Curé",
  vicaire: "Vicaire",
  diacre: "Diacre",
  seminariste: "Séminariste",
  aumonier: "Aumônier",
  superieur: "Supérieur",
};

export const typeParoisseLabels: Record<string, string> = {
  territoriale: "Paroisse territoriale",
  "personnelle-rite": "Paroisse personnelle (rite)",
  "personnelle-communaute": "Paroisse personnelle (communauté)",
  universitaire: "Paroisse universitaire",
};

export const typeLieuLabels: Record<string, string> = {
  seminaire: "Séminaire",
  hopital: "Aumônerie d'hôpital",
  prison: "Aumônerie de prison",
  ecole: "École catholique",
  "communaute-religieuse": "Communauté religieuse",
  "maison-diocesaine": "Maison diocésaine",
};

export const typeLieuIcons: Record<string, string> = {
  seminaire: "🎓",
  hopital: "🏥",
  prison: "⛓️",
  ecole: "📚",
  "communaute-religieuse": "🙏",
  "maison-diocesaine": "🏛️",
};
